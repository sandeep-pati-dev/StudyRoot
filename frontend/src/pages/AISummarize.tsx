import React, { useState } from "react";
import axios from "@/lib/axiosInstance";
import { Upload, X, FileText, Download, Sparkles, HelpCircle, FileDown, ArrowLeft } from "lucide-react";
import Navbar from "@/components/Navbar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";

interface SummaryData {
  overview: string;
  keyPoints: string[];
  definitions: { term: string; definition: string }[];
}

const AISummarize: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [prompt, setPrompt] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ fileName: string; summary: SummaryData } | null>(null);
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const selectedFile = e.target.files[0];
      const validExtensions = [".pdf", ".docx", ".pptx", ".txt"];
      const hasValidExt = validExtensions.some(ext => selectedFile.name.toLowerCase().endsWith(ext));

      if (hasValidExt) {
        setFile(selectedFile);
      } else {
        toast({
          title: "Unsupported File",
          description: "Please upload only PDF, DOCX, PPTX, or TXT files.",
          variant: "destructive",
        });
      }
    }
  };

  const removeFile = () => setFile(null);

  const handleSummarize = async () => {
    if (!file && !prompt.trim()) {
      toast({
        title: "Input Required",
        description: "Please write some text or upload a file to summarize.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const formData = new FormData();
      if (file) formData.append("file", file);
      formData.append("prompt", prompt || "");

      const res = await axios.post("/summarize/generate", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setResult(res.data);
      toast({
        title: "Success",
        description: "AI Summary generated successfully!",
      });
    } catch (err: any) {
      console.error(err);
      toast({
        title: "Summarization Failed",
        description: err.response?.data?.error || "Something went wrong while generating the summary.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadSummary = () => {
    if (!result) return;
    const { fileName, summary } = result;

    let content = `=== AI STUDY SUMMARY ===\n`;
    content += `Source: ${fileName}\n\n`;
    
    content += `--- SUMMARY OVERVIEW ---\n`;
    content += `${summary.overview}\n\n`;

    content += `--- KEY POINTS ---\n`;
    summary.keyPoints.forEach((point, i) => {
      content += `${i + 1}. ${point}\n`;
    });
    content += `\n`;

    content += `--- IMPORTANT DEFINITIONS & TERMINOLOGY ---\n`;
    summary.definitions.forEach((def) => {
      content += `• ${def.term}: ${def.definition}\n`;
    });

    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `Summary_${fileName.replace(/\.[^/.]+$/, "")}.txt`);
    document.body.appendChild(link);
    link.click();
    link.parentNode?.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="mb-6">
          <Link to="/dashboard" className="inline-flex items-center text-sm text-muted-foreground hover:text-studyroot-blue transition-colors">
            <ArrowLeft className="h-4 w-4 mr-1" /> Back to Dashboard
          </Link>
        </div>

        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-5xl font-extrabold text-foreground mb-4">
            AI Study{" "}
            <span className="bg-gradient-to-r from-studyroot-blue to-studyroot-purple bg-clip-text text-transparent">
              Summarizer
            </span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Upload your lecture notes, presentations, or paste study materials to generate a structured revision summary in seconds.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left panel: Input Area */}
          <div className="lg:col-span-5 space-y-6">
            <Card className="bg-card border border-border/50 shadow-lg rounded-2xl overflow-hidden">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-xl font-bold">
                  <Sparkles className="h-5 w-5 text-studyroot-purple" />
                  <span>Configure Summary</span>
                </CardTitle>
                <CardDescription>
                  Provide a file or custom text to begin.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* File Upload zone */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-muted-foreground">Upload Document</label>
                  {!file ? (
                    <div className="border border-dashed border-border/60 hover:border-studyroot-purple/50 rounded-xl p-6 text-center transition-colors cursor-pointer relative bg-muted/20">
                      <input
                        type="file"
                        accept=".pdf,.docx,.pptx,.txt"
                        onChange={handleFileChange}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />
                      <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                      <p className="text-sm font-medium text-foreground">Click or Drag document here</p>
                      <p className="text-xs text-muted-foreground mt-1">PDF, DOCX, PPTX, or TXT (Max: 10MB)</p>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between p-4 bg-muted/40 border border-border/50 rounded-xl">
                      <div className="flex items-center space-x-3 min-w-0">
                        <FileText className="h-6 w-6 text-studyroot-blue flex-shrink-0" />
                        <span className="text-sm font-medium text-foreground truncate">{file.name}</span>
                      </div>
                      <Button variant="ghost" size="sm" onClick={removeFile} className="h-8 w-8 p-0 rounded-full hover:bg-muted">
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>

                {/* Text Area Prompt */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-muted-foreground">Custom Text / Context</label>
                  <Textarea
                    placeholder="Alternatively, paste your study text, paragraphs or syllabus outline here..."
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    className="min-h-[160px] resize-y rounded-xl border-border bg-background focus:ring-1 focus:ring-studyroot-purple"
                  />
                </div>

                <Button
                  onClick={handleSummarize}
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-studyroot-blue to-studyroot-purple hover:from-studyroot-purple hover:to-studyroot-blue text-white font-medium rounded-xl h-11 transition-all duration-300 shadow-md"
                >
                  {loading ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin h-5 w-5 mr-2 text-white" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                      </svg>
                      Summarizing...
                    </span>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4 mr-2" />
                      Generate Summary
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Right panel: Summary Results */}
          <div className="lg:col-span-7">
            {!result ? (
              <Card className="bg-card/40 backdrop-blur-sm border border-border/50 border-dashed rounded-2xl h-[460px] flex flex-col items-center justify-center text-center p-6">
                <div className="w-16 h-16 bg-muted/50 rounded-2xl flex items-center justify-center mb-4">
                  <Sparkles className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-2">No Summary Yet</h3>
                <p className="text-muted-foreground max-w-sm text-sm">
                  Once you configure and generate a summary, the key overview, bullet points, and definitions will appear here.
                </p>
              </Card>
            ) : (
              <Card className="bg-card border border-border/50 shadow-lg rounded-2xl overflow-hidden flex flex-col h-[560px]">
                <CardHeader className="border-b border-border/40 pb-4 flex flex-row items-center justify-between space-y-0">
                  <div>
                    <CardTitle className="text-xl font-bold truncate max-w-[280px] sm:max-w-md">
                      {result.fileName} Summary
                    </CardTitle>
                    <CardDescription>
                      AI-generated study companion
                    </CardDescription>
                  </div>
                  <Button onClick={handleDownloadSummary} variant="outline" size="sm" className="border-border rounded-xl">
                    <Download className="h-4 w-4 mr-2" /> Download TXT
                  </Button>
                </CardHeader>
                <div className="flex-1 overflow-y-auto p-6">
                  <Tabs defaultValue="overview" className="w-full h-full flex flex-col">
                    <TabsList className="grid w-full grid-cols-3 bg-muted/50 rounded-xl p-1 mb-6">
                      <TabsTrigger value="overview" className="rounded-lg font-medium text-sm">Overview</TabsTrigger>
                      <TabsTrigger value="keypoints" className="rounded-lg font-medium text-sm">Key Points</TabsTrigger>
                      <TabsTrigger value="definitions" className="rounded-lg font-medium text-sm">Definitions</TabsTrigger>
                    </TabsList>
                    
                    <div className="flex-1">
                      <TabsContent value="overview" className="mt-0 focus-visible:outline-none space-y-4">
                        <div className="bg-muted/20 p-5 rounded-2xl border border-border/40 leading-relaxed text-foreground">
                          <p>{result.summary.overview}</p>
                        </div>
                      </TabsContent>

                      <TabsContent value="keypoints" className="mt-0 focus-visible:outline-none">
                        <ul className="space-y-3">
                          {result.summary.keyPoints.map((point, index) => (
                            <li key={index} className="flex items-start bg-muted/10 p-4 rounded-xl border border-border/30">
                              <span className="flex-shrink-0 w-6 h-6 bg-studyroot-blue/10 text-studyroot-blue rounded-full flex items-center justify-center font-bold text-xs mr-3 mt-0.5">
                                {index + 1}
                              </span>
                              <span className="text-foreground leading-normal">{point}</span>
                            </li>
                          ))}
                        </ul>
                      </TabsContent>

                      <TabsContent value="definitions" className="mt-0 focus-visible:outline-none">
                        {result.summary.definitions.length === 0 ? (
                          <p className="text-muted-foreground text-center py-6">No specific definitions extracted.</p>
                        ) : (
                          <div className="border border-border/40 rounded-xl overflow-hidden">
                            <table className="w-full text-left border-collapse">
                              <thead>
                                <tr className="bg-muted/40 border-b border-border/40">
                                  <th className="p-3 font-semibold text-xs text-muted-foreground tracking-wider uppercase">Term</th>
                                  <th className="p-3 font-semibold text-xs text-muted-foreground tracking-wider uppercase">Definition</th>
                                </tr>
                              </thead>
                              <tbody>
                                {result.summary.definitions.map((def, idx) => (
                                  <tr key={idx} className="border-b border-border/35 hover:bg-muted/5 transition-colors">
                                    <td className="p-3 font-bold text-sm text-studyroot-purple align-top w-1/3">{def.term}</td>
                                    <td className="p-3 text-sm text-foreground align-top">{def.definition}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        )}
                      </TabsContent>
                    </div>
                  </Tabs>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AISummarize;
