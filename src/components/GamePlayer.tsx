"use client";

import { useEffect, useRef, useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { recordPlayStart, recordPlaySeconds } from "@/lib/history";
import type { Game } from "@/lib/types";

const FLUSH_INTERVAL_MS = 30_000;

export default function GamePlayer({ game }: { game: Game }) {
  const { user } = useAuth();
  const [playing, setPlaying] = useState(false);
  const secondsSinceFlush = useRef(0);
  const tickRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const flushRef = useRef<ReturnType<typeof setInterval> | null>(null);

  function flush() {
    if (user && secondsSinceFlush.current > 0) {
      recordPlaySeconds(user.uid, game.id, secondsSinceFlush.current);
      secondsSinceFlush.current = 0;
    }
  }

  function startPlaying() {
    setPlaying(true);
    if (user) recordPlayStart(user.uid, game.id);
    tickRef.current = setInterval(() => {
      secondsSinceFlush.current += 1;
    }, 1000);
    flushRef.current = setInterval(flush, FLUSH_INTERVAL_MS);
  }

  useEffect(() => {
    return () => {
      if (tickRef.current) clearInterval(tickRef.current);
      if (flushRef.current) clearInterval(flushRef.current);
      flush();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const ratio = game.width && game.height ? game.width / game.height : 16 / 9;

  return (
    <div className="overflow-hidden rounded-2xl bg-black shadow-lg">
      {playing ? (
        <div style={{ aspectRatio: ratio }}>
          <iframe
            src={game.url}
            title={game.title}
            allow="fullscreen; autoplay; gamepad; xr-spatial-tracking"
            allowFullScreen
            className="h-full w-full border-0"
          />
        </div>
      ) : (
        <button
          onClick={startPlaying}
          className="relative flex w-full items-center justify-center"
          style={{ aspectRatio: ratio }}
        >
          <img
            src={game.thumbnail}
            alt={game.title}
            className="absolute inset-0 h-full w-full object-cover opacity-60"
          />
          <span className="relative flex h-16 w-16 items-center justify-center rounded-full bg-brand text-2xl text-white shadow-xl">
            ▶
          </span>
          <span className="absolute bottom-4 rounded-full bg-white/90 px-4 py-1.5 text-sm font-extrabold text-brand-dark">
            Clique para jogar
          </span>
        </button>
      )}
    </div>
  );
}
