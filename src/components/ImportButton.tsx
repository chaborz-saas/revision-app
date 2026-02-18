'use client';

import { useState, useCallback } from 'react';
import { Upload, CheckCircle, AlertCircle } from 'lucide-react';
import Button from '@/components/ui/Button';
import ProgressBar from '@/components/ui/ProgressBar';

interface ImportState {
  active: boolean;
  status: string;
  message: string;
  total: number;
  current: number;
  currentFile: string;
  done: boolean;
  error: boolean;
  imported: number;
}

interface ImportButtonProps {
  onComplete?: () => void;
}

export default function ImportButton({ onComplete }: ImportButtonProps) {
  const [state, setState] = useState<ImportState>({
    active: false,
    status: '',
    message: '',
    total: 0,
    current: 0,
    currentFile: '',
    done: false,
    error: false,
    imported: 0,
  });

  const startImport = useCallback(async () => {
    setState({
      active: true,
      status: 'scanning',
      message: 'Scan des fichiers PDF...',
      total: 0,
      current: 0,
      currentFile: '',
      done: false,
      error: false,
      imported: 0,
    });

    try {
      const response = await fetch('/api/import');

      if (!response.ok) {
        throw new Error(`Erreur serveur: ${response.status}`);
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error('Le streaming n\'est pas supporte par le navigateur.');
      }

      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();

        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (!line.startsWith('data: ')) continue;
          try {
            const data = JSON.parse(line.slice(6));

            setState(prev => ({
              ...prev,
              status: data.status || prev.status,
              message: data.message || prev.message,
              total: data.total ?? prev.total,
              current: data.current ?? prev.current,
              currentFile: data.currentFile || prev.currentFile,
              done: data.status === 'done' || data.status === 'empty',
              error: data.status === 'error',
              imported: data.imported ?? prev.imported,
            }));
          } catch {
            // Ignorer les lignes malformees
          }
        }
      }

      if (onComplete) {
        setTimeout(onComplete, 500);
      }
    } catch (err) {
      const errMsg = err instanceof Error ? err.message : 'Erreur inconnue';
      setState(prev => ({
        ...prev,
        status: 'error',
        message: `Erreur: ${errMsg}`,
        done: true,
        error: true,
      }));
    }
  }, [onComplete]);

  const reset = useCallback(() => {
    setState({
      active: false,
      status: '',
      message: '',
      total: 0,
      current: 0,
      currentFile: '',
      done: false,
      error: false,
      imported: 0,
    });
  }, []);

  if (!state.active) {
    return (
      <Button onClick={startImport} icon={<Upload size={16} />} size="lg">
        Importer mes cours
      </Button>
    );
  }

  return (
    <div className="w-full max-w-md space-y-3">
      <div className="flex items-center gap-2">
        {state.done && !state.error && (
          <CheckCircle size={18} className="text-emerald-400 flex-shrink-0" />
        )}
        {state.error && (
          <AlertCircle size={18} className="text-red-400 flex-shrink-0" />
        )}
        {!state.done && (
          <div className="w-4 h-4 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin flex-shrink-0" />
        )}
        <p className="text-sm text-zinc-300">{state.message}</p>
      </div>

      {state.total > 0 && (
        <div className="space-y-1.5">
          <ProgressBar
            value={state.current}
            max={state.total}
            color={state.error ? '#ef4444' : '#06b6d4'}
            size="md"
          />
          <div className="flex justify-between text-xs text-zinc-500">
            <span>
              {state.currentFile && !state.done
                ? state.currentFile
                : state.done
                ? `${state.imported} cours importe(s)`
                : 'Preparation...'}
            </span>
            <span>{state.current}/{state.total}</span>
          </div>
        </div>
      )}

      {state.done && (
        <div className="pt-1">
          <Button onClick={reset} variant="secondary" size="sm">
            Fermer
          </Button>
        </div>
      )}
    </div>
  );
}
