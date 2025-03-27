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
    <main className="container mx-auto p-4 max-w-3xl" data-oid="6ydksmc">
      <div className="relative mt-48 mb-2" data-oid="trcpn.g">
        <h1
          className="text-lg text-gray-600 dark:text-gray-400"
          data-oid="tms56ua"
        >
          Summarize
        </h1>
        <ThemeToggle data-oid="zkv_83s" />
      </div>

      <Textarea
        ref={textareaRef}
        placeholder="... "
        className="w-full rounded-md resize-none overflow-hidden px-3 py-3 min-h-10 text-sm/6 border-0 focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 bg-gray-100 dark:bg-gray-900 text-gray-600 dark:text-gray-400 placeholder:text-gray-400 dark:placeholder:text-gray-600"
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={1}
        data-oid="d7b_wvx"
      />

      <div
        className="flex flex-col sm:flex-row items-center gap-4 mt-4"
        data-oid="l3iqjhl"
      >
        <div
          className="flex-grow flex flex-col sm:flex-row gap-4 w-full sm:w-auto"
          data-oid="m85gm7q"
        >
          <Select
            value={summaryType}
            onValueChange={(value) => setSummaryType(value as SummaryType)}
            data-oid="oou.x8r"
          >
            <SelectTrigger
              className="w-full sm:w-[180px] h-10 bg-gray-100 hover:bg-gray-100/80 border-gray-100 text-gray-600 dark:bg-gray-900 dark:hover:bg-gray-900/80 dark:border-gray-900 dark:text-gray-400"
              data-oid="hf.g.zh"
            >
              <SelectValue placeholder="Summary type" data-oid="65l9_8." />
            </SelectTrigger>
            <SelectContent
              className="bg-gray-100 border-white text-gray-600 dark:bg-gray-900 dark:border-gray-800 dark:text-gray-400"
              data-oid="6w83j_f"
            >
              <SelectItem value="word" data-oid="xrkc0co">
                To One Word
              </SelectItem>
              <SelectItem value="sentence" data-oid="cnd4i.z">
                To One Sentence
              </SelectItem>
            </SelectContent>
          </Select>

          <Button
            className="w-auto bg-indigo-100 hover:bg-indigo-100/80 text-indigo-600 dark:bg-indigo-900 dark:hover:bg-indigo-900/80 dark:text-indigo-300"
            onClick={handleSummarize}
            disabled={!text.trim() || isLoading}
            data-oid="3au:s_a"
          >
            {isLoading ? "Summarizing..." : "Summarize"}
          </Button>
        </div>
      </div>

      {entries.length > 0 && (
        <div className="space-y-4 mt-8" data-oid="mc93j9s">
          {entries.map((entry, index) => (
            <Card
              key={entry.id}
              className={`overflow-hidden bg-transparent border-0 border-none ${index === 0 ? "" : "blur-sm"} hover:blur-none transition-all duration-520 text-gray-400 dark:text-gray-600 shadow-none`}
              data-oid="ockkf4c"
            >
              <CardHeader className="py-3 px-0" data-oid="f315nk1">
                <CardTitle
                  className="text-lg font-normal text-gray-600 dark:text-gray-400"
                  data-oid="gaq57sw"
                >
                  {entry.summaryText}
                </CardTitle>
                <div
                  className="text-xs text-gray-400 dark:text-gray-600"
                  data-oid="j1nek4c"
                >
                  Summarized to one {entry.summaryType} •{" "}
                  {new Date(entry.timestamp).toLocaleString()}
                </div>
              </CardHeader>
              <CardContent className="py-3 px-0" data-oid=":z:ub9r">
                <div className="relative" data-oid="-inb8wm">
                  <p
                    className={`text-sm/6 whitespace-pre-wrap ${!expandedEntries[entry.id] ? "line-clamp-4" : ""}`}
                    data-oid="npciqfk"
                  >
                    {entry.originalText}
                  </p>
                  {entry.originalText.split("\n").length > 4 ||
                  entry.originalText.length > 500 ? (
                    <button
                      onClick={() => toggleExpand(entry.id)}
                      className="text-xs text-indigo-500 hover:text-indigo-600 dark:text-indigo-400 dark:hover:text-indigo-300 mt-1"
                      data-oid="2alw:2e"
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
