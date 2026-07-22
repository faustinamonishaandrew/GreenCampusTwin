import React, { useState, useRef, useEffect } from 'react';
import {
  Bot,
  Send,
  Sparkles,
  User,
  X,
  ChevronRight,
  RefreshCw,
  Lightbulb,
  CheckCircle2,
  AlertTriangle,
  Brain,
  Zap,
} from 'lucide-react';
import { Building, CopilotMessage, SustainabilityScores } from '../types';
import { SAMPLE_COPILOT_MESSAGES } from '../data/mockData';
import { processCopilotQuery } from '../utils/aiEngine';

interface CopilotProps {
  buildings: Building[];
  scores: SustainabilityScores;
  isFloatingModal?: boolean;
  onCloseModal?: () => void;
}

export const CopilotWidget: React.FC<CopilotProps> = ({
  buildings,
  scores,
  isFloatingModal = false,
  onCloseModal,
}) => {
  const [messages, setMessages] = useState<CopilotMessage[]>(SAMPLE_COPILOT_MESSAGES);
  const [inputQuery, setInputQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const samplePrompts = [
    'Why is electricity high today?',
    'Which building wastes the most water?',
    'Predict tomorrow\'s energy usage.',
    'How can I improve the sustainability score?',
    'Show carbon emissions.',
  ];

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSendMessage = async (queryText?: string) => {
    const textToSend = queryText || inputQuery;
    if (!textToSend.trim() || isLoading) return;

    const userMsg: CopilotMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!queryText) setInputQuery('');
    setIsLoading(true);

    try {
      // Call backend API
      const res = await fetch('/api/copilot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: textToSend }),
      });

      if (res.ok) {
        const data = await res.json();
        const aiMsg: CopilotMessage = {
          id: `ai-${Date.now()}`,
          sender: 'assistant',
          text: data.reply,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          structuredResponse: data.structuredResponse,
          dataHighlights: data.dataHighlights,
          actionableSuggestions: data.actionableSuggestions,
          reasoningChain: data.reasoningChain,
        };
        setMessages((prev) => [...prev, aiMsg]);
      } else {
        throw new Error('API request failed');
      }
    } catch (err) {
      // Client-side fallback
      const localResult = processCopilotQuery(textToSend, buildings, scores);
      const aiMsg: CopilotMessage = {
        id: `ai-${Date.now()}`,
        sender: 'assistant',
        text: localResult.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        structuredResponse: localResult.structuredResponse,
        dataHighlights: localResult.dataHighlights,
        actionableSuggestions: localResult.actionableSuggestions,
        reasoningChain: localResult.reasoningChain,
      };
      setMessages((prev) => [...prev, aiMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className={`flex flex-col bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden ${
        isFloatingModal
          ? 'fixed bottom-4 right-4 z-50 w-96 sm:w-[500px] h-[620px] rounded-3xl'
          : 'w-full h-[720px] rounded-3xl'
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 text-white shrink-0 border-b border-emerald-500/20">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-500 text-white shadow-md shadow-emerald-500/30">
            <Bot className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h3 className="font-extrabold text-sm tracking-tight text-white flex items-center gap-1">
                Greenie AI 🌿
              </h3>
              <span className="rounded-md bg-emerald-500/20 px-1.5 py-0.5 text-[9px] font-bold text-emerald-400 border border-emerald-500/30">
                Online
              </span>
            </div>
            <p className="text-[11px] text-slate-300">
              AI Sustainability Assistant • 1,420 Live IoT Sensors
            </p>
          </div>
        </div>

        {isFloatingModal && onCloseModal && (
          <button
            onClick={onCloseModal}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      {/* Chat History Body */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col space-y-2 ${
              msg.sender === 'user' ? 'items-end' : 'items-start'
            }`}
          >
            <div
              className={`max-w-[88%] p-4 rounded-2xl space-y-2 ${
                msg.sender === 'user'
                  ? 'bg-emerald-500 text-white font-medium rounded-tr-none shadow-md shadow-emerald-500/10'
                  : 'bg-slate-50 dark:bg-slate-800/90 text-slate-900 dark:text-slate-100 rounded-tl-none border border-slate-200/80 dark:border-slate-700/60 shadow-sm'
              }`}
            >
              <div className="flex items-center justify-between gap-2 text-[10px] opacity-75 mb-1">
                <span className="font-bold uppercase tracking-wider flex items-center gap-1">
                  {msg.sender === 'user' ? 'You' : 'Greenie AI 🌿'}
                </span>
                <span>{msg.timestamp}</span>
              </div>

              <div
                className="leading-relaxed whitespace-pre-line"
                dangerouslySetInnerHTML={{
                  __html: msg.text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>'),
                }}
              />

              {/* Structured Response Breakdown */}
              {msg.structuredResponse && (
                <div className="mt-3 p-3.5 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-700/80 space-y-2 text-[11px] shadow-sm">
                  {msg.structuredResponse.problem && (
                    <div className="flex items-start gap-1.5">
                      <span className="font-extrabold text-red-600 dark:text-red-400 shrink-0">Problem:</span>
                      <span className="text-slate-800 dark:text-slate-200 font-semibold">{msg.structuredResponse.problem}</span>
                    </div>
                  )}
                  {msg.structuredResponse.reason && (
                    <div className="flex items-start gap-1.5">
                      <span className="font-extrabold text-amber-600 dark:text-amber-400 shrink-0">Reason:</span>
                      <span className="text-slate-700 dark:text-slate-300">{msg.structuredResponse.reason}</span>
                    </div>
                  )}
                  {msg.structuredResponse.impact && (
                    <div className="flex items-start gap-1.5">
                      <span className="font-extrabold text-blue-600 dark:text-blue-400 shrink-0">Impact:</span>
                      <span className="text-slate-700 dark:text-slate-300 font-medium">{msg.structuredResponse.impact}</span>
                    </div>
                  )}
                  {msg.structuredResponse.recommendation && (
                    <div className="flex items-start gap-1.5">
                      <span className="font-extrabold text-emerald-600 dark:text-emerald-400 shrink-0">Recommendation:</span>
                      <span className="text-slate-900 dark:text-slate-100 font-bold">{msg.structuredResponse.recommendation}</span>
                    </div>
                  )}
                  {msg.structuredResponse.confidenceScore !== undefined && (
                    <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800 text-[10px]">
                      <span className="text-slate-400 font-medium">Greenie AI Confidence Score:</span>
                      <span className="font-extrabold text-emerald-600 dark:text-emerald-400 font-mono bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20">
                        {msg.structuredResponse.confidenceScore}%
                      </span>
                    </div>
                  )}
                </div>
              )}

              {/* Data Highlights */}
              {msg.dataHighlights && msg.dataHighlights.length > 0 && (
                <div className="grid grid-cols-2 gap-1.5 pt-2 border-t border-slate-200/60 dark:border-slate-700/60">
                  {msg.dataHighlights.map((dh, idx) => (
                    <div
                      key={idx}
                      className="p-2 rounded-xl bg-slate-100 dark:bg-slate-900/60 text-[10px]"
                    >
                      <span className="text-slate-400 block">{dh.label}</span>
                      <span className="font-extrabold text-emerald-600 dark:text-emerald-400">
                        {dh.value}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {/* Reasoning Chain */}
              {msg.reasoningChain && (
                <div className="pt-2 border-t border-slate-200/60 dark:border-slate-700/60 text-[10px] text-slate-500 space-y-1">
                  <span className="font-bold uppercase text-[9px] text-slate-400 block">
                    Greenie AI Analytical Chain:
                  </span>
                  <ul className="list-disc pl-4 space-y-0.5">
                    {msg.reasoningChain.map((step, idx) => (
                      <li key={idx}>{step}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Actionable Prompt Chips */}
            {msg.actionableSuggestions && msg.actionableSuggestions.length > 0 && (
              <div className="flex flex-wrap gap-1.5 max-w-[90%] pt-1">
                {msg.actionableSuggestions.map((sug, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSendMessage(sug)}
                    className="text-[10px] font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20 px-3 py-1.5 rounded-full border border-emerald-500/20 transition flex items-center gap-1 shadow-xs hover:scale-105"
                  >
                    <Sparkles className="h-3 w-3 text-emerald-500" />
                    <span>{sug}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}

        {isLoading && (
          <div className="flex items-center gap-2 text-slate-400 text-xs py-2 bg-slate-50 dark:bg-slate-800/50 p-3 rounded-2xl border border-slate-200/60 dark:border-slate-700/60">
            <RefreshCw className="h-4 w-4 animate-spin text-emerald-500" />
            <span>Greenie AI analyzing IoT telemetry and machine learning models...</span>
          </div>
        )}

        <div ref={chatEndRef} />
      </div>

      {/* Quick Example Questions */}
      <div className="px-4 py-2.5 bg-slate-50 dark:bg-slate-800/40 border-t border-slate-200/60 dark:border-slate-800 text-[10px] flex items-center gap-2 overflow-x-auto shrink-0">
        <Lightbulb className="h-3.5 w-3.5 text-amber-500 shrink-0" />
        <span className="font-bold text-slate-400 uppercase shrink-0">Ask Greenie AI:</span>
        {samplePrompts.map((p, idx) => (
          <button
            key={idx}
            onClick={() => handleSendMessage(p)}
            className="shrink-0 font-semibold text-slate-700 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 bg-white dark:bg-slate-700 px-2.5 py-1 rounded-xl border border-slate-200/80 dark:border-slate-600 transition shadow-2xs hover:border-emerald-500/50"
          >
            {p}
          </button>
        ))}
      </div>

      {/* Input Box */}
      <div className="p-3 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 shrink-0">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            placeholder="Ask Greenie AI about campus energy, water leaks, or carbon..."
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            className="flex-1 rounded-2xl bg-slate-100 dark:bg-slate-800 px-4 py-2.5 text-xs text-slate-900 dark:text-white placeholder-slate-400 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
          />
          <button
            type="submit"
            disabled={!inputQuery.trim() || isLoading}
            className="flex h-10 px-4 items-center gap-1.5 justify-center rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs disabled:opacity-40 transition shadow-md shadow-emerald-500/20"
          >
            <span>Ask Greenie AI</span>
            <Send className="h-3.5 w-3.5" />
          </button>
        </form>
      </div>
    </div>
  );
};
