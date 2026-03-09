import { useEffect, useState } from 'react';

interface ToastMessage {
  id: number;
  text: string;
  type: 'success' | 'error';
}

let toastId = 0;
let listeners: ((t: ToastMessage) => void)[] = [];

export function showToast(text: string, type: 'success' | 'error' = 'success') {
  listeners.forEach(fn => fn({ id: ++toastId, text, type }));
}

export default function ToastContainer() {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  useEffect(() => {
    const handler = (t: ToastMessage) => {
      setToasts(prev => [...prev, t]);
      setTimeout(() => setToasts(prev => prev.filter(x => x.id !== t.id)), 3200);
    };
    listeners.push(handler);
    return () => { listeners = listeners.filter(l => l !== handler); };
  }, []);

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2">
      {toasts.map(t => (
        <div
          key={t.id}
          className="px-5 py-3 rounded-[10px] text-sm font-bold animate-in slide-in-from-right"
          style={{
            background: t.type === 'success' ? '#1abc9c' : '#e74c3c',
            color: '#fff',
            fontFamily: 'var(--font-mono)',
          }}
        >
          {t.text}
        </div>
      ))}
    </div>
  );
}
