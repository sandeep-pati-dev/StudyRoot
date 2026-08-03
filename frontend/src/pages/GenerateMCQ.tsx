import React, { useState } from "react";
import axios from "@/lib/axiosInstance";
import { Upload, Send, Paperclip, X, FileText, MessageSquare, Brain } from "lucide-react";
import Navbar from "@/components/Navbar";

interface MCQ {
  question: string;
  options: string[];
  answer: string;
  explanation: string;
}

interface ChatMessage {
  id: string;
  type: "user" | "bot";
  content: string;
  mcqs?: MCQ[];
}

const GenerateMCQ: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [prompt, setPrompt] = useState<string>("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedAnswers, setSelectedAnswers] = useState<{ [key: number]: string }>({});
  const [feedback, setFeedback] = useState<{ [key: number]: string }>({});

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) setFile(e.target.files[0]);
  };

  const removeFile = () => setFile(null);

  const addMessage = (message: ChatMessage) => {
    setMessages((prev) => [...prev, message]);
  };

  const handleGenerateQuiz = async () => {
    if (!file && !prompt.trim()) {
      setError("Please upload a file or enter a prompt.");
      return;
    }

    setError(null);
    setLoading(true);
    setSelectedAnswers({});
    setFeedback({});

    try {
      const formData = new FormData();
      if (file) formData.append("file", file);
      formData.append("prompt", prompt || "");

      const res = await axios.post("/mcq/generate", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const mcqs = res.data.mcqs;
      const displayPrompt = prompt || file?.name || "Uploaded file";

      addMessage({ id: Date.now().toString(), type: "user", content: displayPrompt });
      addMessage({ id: (Date.now() + 1).toString(), type: "bot", content: "", mcqs });

      setPrompt("");
      setFile(null);
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to generate MCQs");
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerClick = (questionIndex: number, option: string, correctAnswer: string) => {
    if (selectedAnswers[questionIndex]) return;

    setSelectedAnswers((prev) => ({ ...prev, [questionIndex]: option }));
    
    const isCorrect = option === correctAnswer;
    setFeedback((prev) => ({ ...prev, [questionIndex]: isCorrect ? "correct" : "incorrect" }));
  };

  const getOptionStyle = (option: string, mcq: MCQ, questionIndex: number) => {
    const selected = selectedAnswers[questionIndex];
    const isSelected = selected === option;
    
    if (!selected) return "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 text-gray-700 dark:text-gray-300";
    
    if (option === mcq.answer) return "bg-green-50 dark:bg-green-900 border-green-300 dark:border-green-700 text-green-800 dark:text-green-400";
    if (isSelected) return "bg-red-50 dark:bg-red-900 border-red-300 dark:border-red-700 text-red-800 dark:text-red-400";
    
    return "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300";
  };

  const EmptyState = () => (
    <div className="text-center py-12">
      <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
        <Brain className="h-8 w-8 text-white" />
      </div>
      <h2 className="text-2xl font-semibold text-gray-900 mb-2">Ready to Generate MCQs?</h2>
      <p className="text-gray-600 max-w-md mx-auto">
        Upload a document or enter a topic to generate multiple choice questions with explanations
      </p>
    </div>
  );

const UserMessage = ({ content }: { content: string }) => (
  <div className="bg-blue-600 dark:bg-blue-700 text-white rounded-2xl px-4 py-3">
    <div className="flex items-center space-x-2">
      <MessageSquare className="h-4 w-4 text-white" />
      <span className="font-medium">You</span>
    </div>
    <p className="mt-1 text-white">{content}</p>
  </div>
);

  const MCQOption = ({ option, mcq, questionIndex, optionIndex }: { 
    option: string; 
    mcq: MCQ; 
    questionIndex: number; 
    optionIndex: number; 
  }) => {
    const selected = selectedAnswers[questionIndex];
    const isSelected = selected === option;
    const optionStyle = getOptionStyle(option, mcq, questionIndex);

    return (
      <button
        onClick={() => handleAnswerClick(questionIndex, option, mcq.answer)}
        className={`w-full text-left px-4 py-3 rounded-lg border-2 transition-all duration-200 ${optionStyle} ${
          !selected ? "hover:shadow-sm" : ""
        } ${isSelected ? "font-medium" : ""}`}
        disabled={!!selected}
      >
        <div className="flex items-center space-x-3">
          <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
            selected && option === mcq.answer ? "border-green-500 bg-green-500" :
            selected && isSelected ? "border-red-500 bg-red-500" :
            "border-gray-300 dark:border-gray-600"
          }`}>
            {selected && (option === mcq.answer || isSelected) && (
              <div className="w-2 h-2 bg-white rounded-full"></div>
            )}
          </div>
          <span className="dark:text-gray-300">{option}</span>
        </div>
      </button>
    );
  };

  const MCQQuestion = ({ mcq, index }: { mcq: MCQ; index: number }) => {
    const selected = selectedAnswers[index];
    const isCorrect = selected === mcq.answer;

    return (
      <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-4">
        <div className="flex items-start space-x-3 mb-4">
          <div className="w-6 h-6 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
            <span className="text-sm font-medium text-blue-600 dark:text-blue-400">{index + 1}</span>
          </div>
          <p className="font-medium text-gray-900 dark:text-gray-100 leading-relaxed">{mcq.question}</p>
        </div>
        
        <div className="ml-9 space-y-2">
          {mcq.options.map((option, i) => (
            <MCQOption 
              key={i} 
              option={option} 
              mcq={mcq} 
              questionIndex={index} 
              optionIndex={i} 
            />
          ))}
        </div>

        {feedback[index] && (
          <div className="ml-9 mt-4 p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-2 mb-2">
              <div className={`w-2 h-2 rounded-full ${isCorrect ? "bg-green-500" : "bg-red-500"}`}></div>
              <span className={`font-semibold text-sm ${isCorrect ? "text-green-700" : "text-red-700"} dark:${isCorrect ? "text-green-400" : "text-red-400"}`}>
                {isCorrect ? "Correct!" : "Incorrect"}
              </span>
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-900 rounded-lg p-3">
              <strong className="text-gray-900 dark:text-gray-100">Explanation:</strong> {mcq.explanation}
            </div>
          </div>
        )}
      </div>
    );
  };

const BotMessage = ({ mcqs }: { mcqs?: MCQ[] }) => (
  <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm">
    <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700">
      <div className="flex items-center space-x-2">
        <Brain className="h-4 w-4 text-blue-600 dark:text-blue-400" />
        <span className="font-medium text-gray-900 dark:text-gray-100">MCQ Generator</span>
      </div>
    </div>
    
    {mcqs ? (
      <div className="p-4">
        <div className="space-y-6">
          {mcqs.map((mcq, index) => (
            <MCQQuestion key={index} mcq={mcq} index={index} />
          ))}
        </div>
      </div>
    ) : (
      <div className="p-4">
        <div className="flex items-center space-x-3">
          <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-600 dark:border-blue-400 border-t-transparent"></div>
          <span className="text-gray-600 dark:text-gray-300">Generating MCQs...</span>
        </div>
      </div>
    )}
  </div>
);

  const FileAttachment = () => file && (
    <div className="mb-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <FileText className="h-4 w-4 text-blue-600" />
          <div>
            <p className="text-sm font-medium text-blue-900">{file.name}</p>
            <p className="text-xs text-blue-600">{(file.size / 1024).toFixed(1)} KB</p>
          </div>
        </div>
        <button
          onClick={removeFile}
          className="p-1 hover:bg-blue-200 rounded-full transition-colors"
        >
          <X className="h-4 w-4 text-blue-600" />
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />

      {/* Chat Messages Area */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6">
          {messages.length === 0 ? (
            <EmptyState />
          ) : (
            <div className="space-y-6">
              {messages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.type === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-3xl ${msg.type === "user" ? "ml-12" : "mr-12"}`}>
                    {msg.type === "user" ? (
                      <UserMessage content={msg.content} />
                    ) : (
                      <BotMessage mcqs={msg.mcqs} />
                    )}
                  </div>
                </div>
              ))}
              
              {loading && (
                <div className="flex justify-start">
                  <div className="max-w-3xl mr-12">
                    <BotMessage />
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Input Area */}
      <div className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4">
          {error && (
            <div className="mb-4 p-3 bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-700 rounded-lg text-red-700 dark:text-red-400 text-sm">
              {error}
            </div>
          )}
          
          <FileAttachment />

          <div className="flex items-end space-x-3">
            {/* File Upload Button */}
            <div className="relative">
              <input
                type="file"
                accept=".doc,.docx,.pdf,.ppt,.pptx,.txt"
                onChange={handleFileChange}
                className="hidden"
                id="file-upload"
              />
              <label
                htmlFor="file-upload"
                className="p-3 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg cursor-pointer transition-colors flex items-center justify-center"
                title="Upload file"
              >
                <Paperclip className="h-5 w-5 text-gray-500 dark:text-gray-400" />
              </label>
            </div>

            {/* Text Input */}
            <div className="flex-1 relative">
              <textarea
                placeholder="Enter a topic or question prompt here..."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleGenerateQuiz();
                  }
                }}
                className="w-full px-4 py-3 pr-12 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
                rows={1}
                style={{ minHeight: '48px', maxHeight: '120px' }}
              />
            </div>

            {/* Send Button */}
            <button
              onClick={handleGenerateQuiz}
              disabled={loading || (!file && !prompt.trim())}
              className="p-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed rounded-xl transition-colors flex items-center justify-center"
              title="Generate MCQs"
            >
              <Send className="h-5 w-5 text-white" />
            </button>
          </div>

          <div className="mt-2 text-xs text-gray-500 dark:text-gray-400 text-center">
            Upload a document or enter a prompt to generate MCQs • Press Enter to send
          </div>
        </div>
      </div>
    </div>
  );
};

export default GenerateMCQ;