'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import {
  MessageCircle,
  Plus,
  ChevronDown,
  Loader2,
  Clock,
  BookOpen,
} from 'lucide-react';
import ChatMessage from '@/components/ChatMessage';
import ChatInput from '@/components/ChatInput';

interface Course {
  id: number;
  title: string;
  subject: string;
}

interface Session {
  session_id: string;
  started_at: string;
  message_count: number;
  course_id: number | null;
}

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [selectedCourseId, setSelectedCourseId] = useState<number | undefined>();
  const [sessionId, setSessionId] = useState<string>('');
  const [loadingSessions, setLoadingSessions] = useState(true);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Initialize session
  useEffect(() => {
    setSessionId(crypto.randomUUID());
  }, []);

  // Load courses
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

  // Load sessions
  const loadSessions = useCallback(async () => {
    try {
      setLoadingSessions(true);
      const res = await fetch('/api/chat/sessions');
      if (res.ok) {
        const data = await res.json();
        setSessions(data.sessions || []);
      }
    } catch (err) {
      console.error('Erreur chargement sessions:', err);
    } finally {
      setLoadingSessions(false);
    }
  }, []);

  useEffect(() => {
    loadSessions();
  }, [loadSessions]);

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

  const handleLoadSession = useCallback(
    async (sid: string) => {
      if (sid === sessionId) return;

      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      setIsStreaming(false);
      setError(null);
      setLoadingHistory(true);

      try {
        const res = await fetch(`/api/chat/history?sessionId=${encodeURIComponent(sid)}`);
        if (!res.ok) throw new Error('Erreur chargement historique');

        const data = await res.json();
        const history = (data.messages || []).map(
          (m: { id: number; role: string; content: string; created_at: string; course_id: number | null }) => ({
            id: String(m.id),
            role: m.role as 'user' | 'assistant',
            content: m.content,
            timestamp: m.created_at,
          })
        );

        setSessionId(sid);
        setMessages(history);

        // Set course context from session
        const session = sessions.find((s) => s.session_id === sid);
        if (session?.course_id) {
          setSelectedCourseId(session.course_id);
        }
      } catch (err) {
        console.error('Erreur chargement session:', err);
        setError('Impossible de charger cette conversation');
      } finally {
        setLoadingHistory(false);
      }
    },
    [sessionId, sessions]
  );

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

      // Prepare messages for API
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

        // Refresh sessions after a new message exchange
        loadSessions();
      } catch (err) {
        if (err instanceof Error && err.name === 'AbortError') {
          return;
        }
        console.error('Erreur streaming:', err);
        setError(err instanceof Error ? err.message : 'Erreur inconnue');
        setMessages((prev) =>
          prev.filter((m) => m.id !== assistantId || m.content.length > 0)
        );
      } finally {
        setIsStreaming(false);
        abortControllerRef.current = null;
      }
    },
    [isStreaming, sessionId, messages, selectedCourseId, loadSessions]
  );

  function formatSessionDate(dateStr: string): string {
    try {
      const date = new Date(dateStr);
      const now = new Date();
      const diffMs = now.getTime() - date.getTime();
      const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

      if (diffDays === 0) return "Aujourd'hui";
      if (diffDays === 1) return 'Hier';
      if (diffDays < 7) return `Il y a ${diffDays} jours`;
      return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
    } catch {
      return '';
    }
  }

  function getCourseName(courseId: number | null): string {
    if (!courseId) return '';
    const course = courses.find((c) => c.id === courseId);
    return course?.title || '';
  }

  return (
    <div className="flex h-[calc(100vh-4rem)] -m-8">
      {/* Sessions sidebar */}
      <div className="w-72 flex-shrink-0 border-r border-zinc-800 bg-zinc-900/50 flex flex-col">
        <div className="p-4 border-b border-zinc-800">
          <button
            onClick={handleNewConversation}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-sm font-medium transition-colors"
          >
            <Plus size={16} />
            Nouvelle conversation
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {loadingSessions ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 size={20} className="animate-spin text-zinc-500" />
            </div>
          ) : sessions.length === 0 ? (
            <div className="text-center py-8 px-4">
              <Clock size={20} className="mx-auto text-zinc-600 mb-2" />
              <p className="text-xs text-zinc-500">Aucune conversation</p>
            </div>
          ) : (
            sessions.map((s) => (
              <button
                key={s.session_id}
                onClick={() => handleLoadSession(s.session_id)}
                className={`w-full text-left px-3 py-2.5 rounded-lg transition-colors text-sm ${
                  s.session_id === sessionId
                    ? 'bg-cyan-600/10 border border-cyan-600/30 text-cyan-400'
                    : 'hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <MessageCircle size={12} />
                  <span className="font-medium truncate text-xs">
                    {formatSessionDate(s.started_at)}
                  </span>
                  <span className="text-[10px] text-zinc-600 ml-auto">
                    {s.message_count} msg
                  </span>
                </div>
                {s.course_id && (
                  <div className="flex items-center gap-1 text-[10px] text-zinc-600 pl-5">
                    <BookOpen size={10} />
                    <span className="truncate">{getCourseName(s.course_id)}</span>
                  </div>
                )}
              </button>
            ))
          )}
        </div>
      </div>

      {/* Main chat area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar with course selector */}
        <div className="flex-shrink-0 border-b border-zinc-800 px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-cyan-600/20 flex items-center justify-center">
              <MessageCircle size={18} className="text-cyan-400" />
            </div>
            <div>
              <h1 className="text-base font-semibold text-zinc-100">Chat IA</h1>
              <p className="text-[11px] text-zinc-500">
                {isStreaming
                  ? 'Reflexion en cours...'
                  : `${messages.length} messages`}
              </p>
            </div>
          </div>

          <div className="relative">
            <select
              value={selectedCourseId ?? ''}
              onChange={(e) =>
                setSelectedCourseId(
                  e.target.value ? Number(e.target.value) : undefined
                )
              }
              className="appearance-none bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-xs text-zinc-300 outline-none focus:border-cyan-600 transition-colors cursor-pointer pr-8 min-w-[200px]"
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

        {/* Messages area */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
          {loadingHistory ? (
            <div className="flex items-center justify-center h-full">
              <div className="flex flex-col items-center gap-3">
                <Loader2 size={24} className="animate-spin text-cyan-500" />
                <p className="text-sm text-zinc-500">Chargement de la conversation...</p>
              </div>
            </div>
          ) : messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="w-20 h-20 rounded-2xl bg-cyan-600/10 flex items-center justify-center mb-6">
                <MessageCircle size={36} className="text-cyan-400" />
              </div>
              <h2 className="text-lg font-semibold text-zinc-200 mb-2">
                Assistant de revision IA
              </h2>
              <p className="text-sm text-zinc-500 max-w-md leading-relaxed mb-6">
                Pose une question sur tes cours, demande des explications, des exemples
                ou de l&apos;aide pour preparer tes examens.
              </p>
              <div className="grid grid-cols-2 gap-3 max-w-lg">
                {[
                  'Explique-moi le theoreme de Pythagore',
                  'Resume les causes de la Revolution francaise',
                  'Aide-moi a comprendre les fonctions derivees',
                  'Quels sont les points cles a retenir pour mon exam ?',
                ].map((suggestion) => (
                  <button
                    key={suggestion}
                    onClick={() => handleSend(suggestion)}
                    className="text-left px-4 py-3 rounded-xl bg-zinc-800/50 border border-zinc-700/50 hover:border-cyan-600/30 hover:bg-zinc-800 text-xs text-zinc-400 hover:text-zinc-200 transition-all duration-200"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <>
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
                <div className="mx-2 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                  {error}
                </div>
              )}
            </>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input area */}
        <div className="flex-shrink-0 border-t border-zinc-800 px-6 py-4">
          <div className="max-w-3xl mx-auto">
            <ChatInput onSend={handleSend} disabled={isStreaming} />
          </div>
        </div>
      </div>
    </div>
  );
}
