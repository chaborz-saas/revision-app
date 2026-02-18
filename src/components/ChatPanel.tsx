'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { MessageCircle, X, ChevronDown, Loader2 } from 'lucide-react';
import ChatMessage from '@/components/ChatMessage';
import ChatInput from '@/components/ChatInput';

interface Course {
  id: number;
  title: string;
  subject: string;
}

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

interface ChatPanelProps {
  courseId?: number;
}

export default function ChatPanel({ courseId: initialCourseId }: ChatPanelProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourseId, setSelectedCourseId] = useState<number | undefined>(initialCourseId);
  const [sessionId, setSessionId] = useState<string>('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Initialize session
  useEffect(() => {
    setSessionId(crypto.randomUUID());
  }, []);

  // Load courses for the selector
  useEffect(() => {
    async function loadCourses() {
      try {
        const res = await fetch('/api/cours');
        if (res.ok) {
          const data = await res.json();
          setCourses(Array.isArray(data) ? data : []);
        }
      } catch (err) {
        console.error('Erreur chargement cours:', err);
      }
    }
    loadCourses();
  }, []);

  // Update selected course if prop changes
  useEffect(() => {
    if (initialCourseId !== undefined) {
      setSelectedCourseId(initialCourseId);
    }
  }, [initialCourseId]);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleNewConversation = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    setMessages([]);
    setSessionId(crypto.randomUUID());
    setError(null);
    setIsStreaming(false);
  }, []);

  const handleSend = useCallback(
    async (content: string) => {
      if (isStreaming || !sessionId) return;

      setError(null);

      // Add user message
      const userMsg: Message = {
        id: crypto.randomUUID(),
        role: 'user',
        content,
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, userMsg]);

      // Prepare messages for API (only role + content)
      const apiMessages = [...messages, userMsg].map((m) => ({
        role: m.role,
        content: m.content,
      }));

      // Add placeholder assistant message
      const assistantId = crypto.randomUUID();
      const assistantMsg: Message = {
        id: assistantId,
        role: 'assistant',
        content: '',
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, assistantMsg]);
      setIsStreaming(true);

      try {
        const controller = new AbortController();
        abortControllerRef.current = controller;

        const res = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            messages: apiMessages,
            courseId: selectedCourseId,
            sessionId,
          }),
          signal: controller.signal,
        });

        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          throw new Error(errData.error || 'Erreur du serveur');
        }

        if (!res.body) {
          throw new Error('Pas de stream dans la reponse');
        }

        const reader = res.body.getReader();
        const decoder = new TextDecoder();

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const text = decoder.decode(value, { stream: true });
          setMessages((prev) =>
            prev.map((m) =>
              m.id === assistantId
                ? { ...m, content: m.content + text }
                : m
            )
          );
        }
      } catch (err) {
        if (err instanceof Error && err.name === 'AbortError') {
          return;
        }
        console.error('Erreur streaming:', err);
        setError(err instanceof Error ? err.message : 'Erreur inconnue');
        // Remove empty assistant message on error
        setMessages((prev) =>
          prev.filter((m) => m.id !== assistantId || m.content.length > 0)
        );
      } finally {
        setIsStreaming(false);
        abortControllerRef.current = null;
      }
    },
    [isStreaming, sessionId, messages, selectedCourseId]
  );

  return (
    <>
      {/* Floating button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-cyan-600 hover:bg-cyan-500 text-white rounded-full shadow-lg shadow-cyan-500/25 flex items-center justify-center transition-all duration-300 hover:scale-110"
        >
          <MessageCircle size={24} />
        </button>
      )}

      {/* Panel overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-50"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Chat panel */}
      <div
        className={`fixed top-0 right-0 h-full w-[400px] bg-zinc-900 border-l border-zinc-800 z-50 flex flex-col transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex-shrink-0 border-b border-zinc-800 p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-cyan-600/20 flex items-center justify-center">
                <MessageCircle size={16} className="text-cyan-400" />
              </div>
              <h2 className="text-sm font-semibold text-zinc-100">Chat IA</h2>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={handleNewConversation}
                className="px-2.5 py-1 text-xs rounded-md bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-zinc-200 transition-colors"
              >
                Nouveau
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 rounded-lg hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 flex items-center justify-center transition-colors"
              >
                <X size={16} />
              </button>
            </div>
          </div>

          {/* Course selector */}
          <div className="relative">
            <select
              value={selectedCourseId ?? ''}
              onChange={(e) =>
                setSelectedCourseId(
                  e.target.value ? Number(e.target.value) : undefined
                )
              }
              className="w-full appearance-none bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-xs text-zinc-300 outline-none focus:border-cyan-600 transition-colors cursor-pointer pr-8"
            >
              <option value="">Sans contexte de cours</option>
              {courses.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.title}
                </option>
              ))}
            </select>
            <ChevronDown
              size={14}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none"
            />
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full text-center px-4">
              <div className="w-16 h-16 rounded-2xl bg-cyan-600/10 flex items-center justify-center mb-4">
                <MessageCircle size={28} className="text-cyan-400" />
              </div>
              <h3 className="text-sm font-medium text-zinc-300 mb-1">
                Assistant de revision
              </h3>
              <p className="text-xs text-zinc-500 leading-relaxed">
                Pose une question sur tes cours, demande des explications ou de
                l&apos;aide pour reviser.
              </p>
            </div>
          )}

          {messages.map((msg) => (
            <ChatMessage
              key={msg.id}
              role={msg.role}
              content={msg.content}
              timestamp={msg.timestamp}
            />
          ))}

          {isStreaming && messages[messages.length - 1]?.content === '' && (
            <div className="flex items-center gap-2 text-zinc-500 text-xs pl-11">
              <Loader2 size={12} className="animate-spin" />
              <span>Reflexion en cours...</span>
            </div>
          )}

          {error && (
            <div className="mx-2 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs">
              {error}
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="flex-shrink-0 border-t border-zinc-800 p-3">
          <ChatInput onSend={handleSend} disabled={isStreaming} />
        </div>
      </div>
    </>
  );
}
