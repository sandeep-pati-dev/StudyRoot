import mammoth from "mammoth";
import textract from "textract";
import fs from "fs";
import Quiz from "../models/Quiz.js";
import { generateContentFromGemini } from "../lib/gemini.js";

export const generateMcqs = async (req, res) => {
  try {
    const userId = req.user._id;
    const file = req.file;
    const userPrompt = req.body.prompt?.trim() || "";

    let extractedText = "";
    let fileName = "";

    // 📄 File Handling
    if (file) {
      const { originalname, mimetype, buffer } = file;
      fileName = originalname;

      if (
        mimetype ===
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
      ) {
        const result = await mammoth.extractRawText({ buffer });
        extractedText = result.value;
      } else if (
        mimetype ===
          "application/vnd.openxmlformats-officedocument.presentationml.presentation" ||
        mimetype === "text/plain"
      ) {
        const tempDir = "./tmp";
        if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir, { recursive: true });

        const tempPath = `${tempDir}/${originalname}`;
        fs.writeFileSync(tempPath, buffer);

        extractedText = await new Promise((resolve, reject) => {
          textract.fromFileWithPath(tempPath, (err, text) => {
            fs.unlinkSync(tempPath);
            if (err) reject(err);
            else resolve(text);
          });
        });
      } else {
        return res.status(400).json({ error: "Unsupported file type" });
      }
    }

    // ❌ No input at all
    if (!file && !userPrompt) {
      return res
        .status(400)
        .json({ error: "Please provide either a prompt or a file." });
    }

    const hasText = extractedText.trim().length > 0;
    const mcqCountMatch = userPrompt
      .toLowerCase()
      .match(/generate\s+(\d+)\s+mcq/);
    const mcqCount = mcqCountMatch
      ? Math.min(Math.max(parseInt(mcqCountMatch[1]), 1), 20)
      : 10;

    // 🧠 Construct Final Prompt
    const finalPrompt = `
You are an expert teacher.

Generate ${mcqCount} multiple choice questions (MCQs) from the content below.

Each MCQ must include:
- "question": The question string
- "options": An array of exactly 4 options
- "answer": One of the options (the correct one)
- "explanation": Short explanation of why it's the answer

Respond ONLY with a **valid JSON array** of MCQs.
Do not include any introduction, comments, or markdown like \`\`\`.

### Content:
${hasText ? extractedText : userPrompt}
`.trim();

    // 🤖 Call Gemini
    const mcqsRaw = await generateContentFromGemini(finalPrompt);

    // ✂️ Extract JSON array safely
    const match = mcqsRaw.match(/\[\s*{[\s\S]*?}\s*\]/);
    if (!match) {
      return res.status(500).json({
        error: "AI response did not contain a valid JSON array.",
        raw: mcqsRaw, // for debugging; remove in production
      });
    }

    let mcqs;
    try {
      mcqs = JSON.parse(match[0]);
    } catch (parseError) {
      return res.status(500).json({
        error: "Failed to parse AI response into JSON.",
        raw: mcqsRaw, // for debugging
      });
    }

    // 💾 Save to DB
    const newQuiz = new Quiz({
      originalFileName: fileName || "PromptOnly",
      userId,
      questions: mcqs,
    });

    await newQuiz.save();

    return res.status(201).json({
      message: "MCQs generated successfully",
      quizId: newQuiz._id,
      mcqs,
    });
  } catch (err) {
    console.error("Error in MCQ generation:", err);
    return res
      .status(500)
      .json({ error: "Failed to generate MCQs. Please try again." });
  }
};
