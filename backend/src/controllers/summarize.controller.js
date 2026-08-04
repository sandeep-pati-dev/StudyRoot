import mammoth from "mammoth";
import textract from "textract";
import fs from "fs";
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const { PDFParse } = require("pdf-parse");
import { generateContentFromGemini } from "../lib/gemini.js";

export const generateSummary = async (req, res) => {
  try {
    const file = req.file;
    const userPrompt = req.body.prompt?.trim() || "";

    let extractedText = "";
    let fileName = "";

    // 📄 Extract text from file if uploaded
    if (file) {
      const { originalname, mimetype, buffer } = file;
      fileName = originalname;

      if (mimetype === "application/pdf") {
        let parser;
        try {
          parser = new PDFParse({ data: buffer });
          const textResult = await parser.getText();
          extractedText = textResult.text || "";
        } catch (pdfErr) {
          console.error("PDF Parsing Error:", pdfErr);
          return res.status(400).json({ error: "Failed to parse PDF file." });
        } finally {
          if (parser) {
            try {
              await parser.destroy();
            } catch (destroyErr) {
              console.error("Failed to destroy PDF parser:", destroyErr);
            }
          }
        }
      } else if (
        mimetype ===
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
      ) {
        try {
          const result = await mammoth.extractRawText({ buffer });
          extractedText = result.value || "";
        } catch (docxErr) {
          console.error("Docx Parsing Error:", docxErr);
          return res.status(400).json({ error: "Failed to parse Word document." });
        }
      } else if (
        mimetype ===
          "application/vnd.openxmlformats-officedocument.presentationml.presentation" ||
        mimetype === "text/plain"
      ) {
        const tempDir = "./tmp";
        if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir, { recursive: true });

        const tempPath = `${tempDir}/${originalname}`;
        fs.writeFileSync(tempPath, buffer);

        try {
          extractedText = await new Promise((resolve, reject) => {
            textract.fromFileWithPath(tempPath, (err, text) => {
              // Always clean up temp file
              try {
                if (fs.existsSync(tempPath)) fs.unlinkSync(tempPath);
              } catch (unlinkErr) {
                console.error("Failed to delete temp file:", unlinkErr);
              }

              if (err) reject(err);
              else resolve(text || "");
            });
          });
        } catch (textractErr) {
          console.error("Textract Parsing Error:", textractErr);
          return res.status(400).json({ error: "Failed to parse presentation or text file." });
        }
      } else {
        return res.status(400).json({ error: "Unsupported file type. Please upload a PDF, DOCX, PPTX, or TXT file." });
      }
    }

    // ❌ No inputs provided
    if (!file && !userPrompt) {
      return res.status(400).json({ error: "Please provide either a prompt or upload a file." });
    }

    const textToSummarize = extractedText.trim() || userPrompt;
    if (!textToSummarize) {
      return res.status(400).json({ error: "No text found to summarize." });
    }

    // 🧠 Construct Prompt for Gemini
    const finalPrompt = `
You are an expert academic summarizer.

Create a comprehensive, structured summary of the content provided below.
The summary should be structured into three main sections:
1. **Summary Overview**: A high-level description of what the content is about.
2. **Key Points**: A detailed bulleted list of the core concepts, theories, or facts.
3. **Important Definitions & Terminology**: Key terms and their definitions found in the text.

Respond ONLY with a **valid JSON object** containing the following structure:
{
  "overview": "The high-level summary overview...",
  "keyPoints": [
    "Key point 1...",
    "Key point 2..."
  ],
  "definitions": [
    { "term": "Term 1", "definition": "Definition 1" },
    { "term": "Term 2", "definition": "Definition 2" }
  ]
}

Do not include any introduction, comments, or markdown formatting like \`\`\`.

### Content:
${textToSummarize}
`.trim();

    // 🤖 Get response from Gemini
    const rawResult = await generateContentFromGemini(finalPrompt);

    // ✂️ Extract JSON safely from response
    const match = rawResult.match(/\{\s*[\s\S]*\}\s*/);
    if (!match) {
      return res.status(500).json({
        error: "AI response did not contain a valid JSON object.",
        raw: rawResult,
      });
    }

    let summaryData;
    try {
      summaryData = JSON.parse(match[0]);
    } catch (parseError) {
      return res.status(500).json({
        error: "Failed to parse AI response into JSON.",
        raw: rawResult,
      });
    }

    return res.status(200).json({
      message: "Summary generated successfully",
      fileName: fileName || "Custom Input",
      summary: summaryData,
    });
  } catch (error) {
    console.error("Error in AI summarizer:", error);
    return res.status(500).json({ error: "Failed to generate summary. Please try again." });
  }
};
