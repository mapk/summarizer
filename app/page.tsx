"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ThemeToggle } from "@/components/theme-toggle";
import { summarizeText } from "@/app/actions";

type SummaryType = "word" | "sentence";
type SummaryEntry = {
  id: string;
  originalText: string;
  summaryText: string;
  summaryType: SummaryType;
  timestamp: number;
};

export default function Home() {
  const [text, setText] = useState("");
  const [summaryType, setSummaryType] = useState<SummaryType>("sentence");
  const [entries, setEntries] = useState<SummaryEntry[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [expandedEntries, setExpandedEntries] = useState<
    Record<string, boolean>
  >({});

  useEffect(() => {
    const savedEntries = localStorage.getItem("summaryEntries");
    if (savedEntries) {
      setEntries(JSON.parse(savedEntries));
    }
  }, []);

  // Auto-resize the textarea when text changes
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height =
        textareaRef.current.scrollHeight + "px";
    }
  }, [text]);

  const saveEntries = (newEntries: SummaryEntry[]) => {
    localStorage.setItem("summaryEntries", JSON.stringify(newEntries));
    setEntries(newEntries);
  };

  const handleSummarize = async () => {
    if (!text.trim()) return;

    // Add debouncing to prevent rapid-fire requests
    if (isLoading) return;

    setIsLoading(true);

    try {
      const summary = await summarizeText(text, summaryType);

      const newEntry: SummaryEntry = {
        id: Date.now().toString(),
        originalText: text,
        summaryText: summary,
        summaryType,
        timestamp: Date.now(),
      };

      const updatedEntries = [newEntry, ...entries];
      saveEntries(updatedEntries);
      setText("");

      // Reset textarea height
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
      }
    } catch (error) {
      console.error("Error summarizing text:", error);
      // Add user-friendly error message
      alert("Unable to generate summary. Please try again in a few moments.");
    } finally {
      setIsLoading(false);
    }
  };

  const toggleExpand = (id: string) => {
    setExpandedEntries((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <main className="container mx-auto p-4 max-w-3xl">
      <div className="relative mt-48">
        <h1 className="text-base text-gray-600 dark:text-gray-400 mb-4 leading-none">
          Boil it down
        </h1>
        <ThemeToggle />
      </div>

      <Textarea
        ref={textareaRef}
        placeholder="... "
        className="w-full rounded-md resize-none overflow-hidden px-3 py-3 min-h-10 text-sm border-0 focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 placeholder:text-gray-400 dark:placeholder:text-gray-600"
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={1}
      />

      <div className="flex flex-col sm:flex-row items-center gap-4 mt-4">
        <div className="flex-grow flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <Select
            value={summaryType}
            onValueChange={(value: SummaryType) => setSummaryType(value)}
          >
            <SelectTrigger className="w-full sm:w-[180px] h-10 border-0 focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 bg-gray-100 hover:bg-gray-100/80 text-gray-600 dark:bg-gray-800 dark:hover:bg-gray-800/80 dark:text-gray-400">
              <SelectValue placeholder="Summary type" />
            </SelectTrigger>
            <SelectContent className="bg-gray-100 border-white text-gray-600 dark:bg-gray-800 dark:border-gray-800 dark:text-gray-400">
              <SelectItem value="word">To One Word</SelectItem>
              <SelectItem value="sentence">To One Sentence</SelectItem>
            </SelectContent>
          </Select>

          <Button
            className="w-auto h-10 focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 bg-indigo-100 hover:bg-indigo-100/80 text-indigo-600 dark:bg-indigo-950 dark:hover:bg-indigo-900/80 dark:text-indigo-300"
            onClick={handleSummarize}
            disabled={!text.trim() || isLoading}
          >
            {isLoading ? "Summarizing..." : "Summarize"}
          </Button>
        </div>

        {entries.length > 0 && (
          <button
            onClick={() => {
              localStorage.removeItem("summaryEntries");
              setEntries([]);
            }}
            className="text-xs text-indigo-500 hover:text-indigo-600 dark:text-indigo-400 dark:hover:text-indigo-300 transition-colors"
          >
            Clear history
          </button>
        )}
      </div>

      {entries.length > 0 && (
        <div className="space-y-4 mt-8">
          {entries.map((entry, index) => (
            <Card
              key={entry.id}
              className={`overflow-hidden bg-transparent border-0 border-none ${
                index === 0 ? "" : "blur-sm"
              } hover:blur-none transition-all duration-520 text-gray-400 dark:text-gray-600 shadow-none`}
            >
              <CardHeader className="py-3 px-0">
                <CardTitle className="text-base font-normal text-gray-600 dark:text-gray-400">
                  {entry.summaryText}
                </CardTitle>
                <div className="text-xs text-gray-400 dark:text-gray-600">
                  Summarized to one {entry.summaryType} •{" "}
                  {new Date(entry.timestamp).toLocaleString()}
                </div>
              </CardHeader>
              <CardContent className="py-3 px-0">
                <div className="relative">
                  <p
                    className={`text-sm whitespace-pre-wrap ${
                      !expandedEntries[entry.id] ? "line-clamp-4" : ""
                    }`}
                  >
                    {entry.originalText}
                  </p>
                  {entry.originalText.split("\n").length > 4 ||
                  entry.originalText.length > 500 ? (
                    <button
                      onClick={() => toggleExpand(entry.id)}
                      className="text-xs text-indigo-500 hover:text-indigo-600 dark:text-indigo-400 dark:hover:text-indigo-300 mt-1"
                    >
                      {expandedEntries[entry.id] ? "Show less" : "Show more"}
                    </button>
                  ) : null}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </main>
  );
}
