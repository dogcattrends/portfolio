"use client";

import { useEffect, useState } from "react";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

type Toast = {
  id: string;
  message: string;
};

export function NotificationCenter({ toasts }: { toasts: Toast[] }): JSX.Element {
  const prefersReducedMotion = usePrefersReducedMotion();
  return (
    <div className="pointer-events-none fixed right-4 bottom-4 z-50 flex flex-col gap-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`rounded-xl bg-foreground/90 px-4 py-3 text-sm font-medium text-background shadow-lg ${
            prefersReducedMotion ? "" : "animate-in fade-in slide-in-from-bottom-2"
          }`}
        >
          {toast.message}
        </div>
      ))}
    </div>
  );
}

export function useNotificationSound(): (message: string) => void {
  const prefersReducedMotion = usePrefersReducedMotion();

  return (message: string) => {
    if (prefersReducedMotion) return;
    try {
      const audioContext = new AudioContext();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      oscillator.type = "sine";
      oscillator.frequency.value = 740;
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      oscillator.start();
      gainNode.gain.exponentialRampToValueAtTime(0.0001, audioContext.currentTime + 0.4);
      oscillator.stop(audioContext.currentTime + 0.4);
    } catch (error) {
      console.warn("Notification sound failed", error, message);
    }
  };
}

export function useToastQueue() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  useEffect(() => {
    if (toasts.length === 0) return;
    const timer = setTimeout(() => setToasts((current) => current.slice(1)), 4000);
    return () => clearTimeout(timer);
  }, [toasts]);

  const push = (message: string) => {
    setToasts((current) => [...current, { id: crypto.randomUUID(), message }]);
  };

  return { toasts, push };
}
