"use client";

import { useState } from "react";
import { getAllGames, bulkImportGames } from "@/lib/games";
import { parseGameMonetize, parseGamePix, toGameDraft, mapFeedCategory, type FeedGame } from "@/lib/feedImport";
import { AGE_RATINGS, type AgeRating, type GameSource } from "@/lib/types";

export default function ImportPage() {
  const [source, setSource] = useState<GameSource>("gamemonetize");
  const [page, setPage] = useState(0);
  const [feedGames, setFeedGames] = useState<FeedGame[]>([]);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [ageRating, setAgeRating] = useState<AgeRating>("L");
  const [loadingFeed, setLoadingFeed] = useState(false);
  const [importing, setImporting] = useState(false);
  const [status, setStatus] = useState("");

  async function loadFeed(nextPage: number, append: boolean) {
    setLoadingFeed(true);
    setStatus("");
    try {
      const res = await fetch(`/api/import-feed?source=${source}&page=${nextPage}`);
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      const parsed = source === "gamemonetize" ? parseGameMonetize(data) : parseGamePix(data);
      setFeedGames((prev) => (append ? [...prev, ...parsed] : parsed));
      setPage(nextPage);
    } catch (e) {
      setStatus("Erro ao carregar feed: " + (e as Error).message);
    } finally {
      setLoadingFeed(false);
    }
  }

  function switchSource(s: GameSource) {
    setSource(s);
    setFeedGames([]);
    setSelected(new Set());
    setPage(0);
    setStatus("");
  }

  function toggle(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function toggleAll() {
    if (selected.size === feedGames.length) {
      setSelected(new Set());
    } else {
      setSelected(new Set(feedGames.map((g) => g.externalId)));
    }
  }

  async function handleImport() {
    setImporting(true);
    setStatus("");
    try {
      const existing = await getAllGames();
      const existingExternalIds = new Set(
        existing.filter((g) => g.externalId).map((g) => `${g.source}:${g.externalId}`)
      );
      const toImport = feedGames
        .filter((g) => selected.has(g.externalId))
        .filter((g) => !existingExternalIds.has(`${source}:${g.externalId}`))
        .map((g) => toGameDraft(g, source, ageRating));
      const count = await bulkImportGames(toImport);
      setStatus(`✅ ${count} jogo(s) importado(s) com sucesso.`);
      setSelected(new Set());
    } catch (e) {
      setStatus("Erro ao importar: " + (e as Error).message);
    } finally {
      setImporting(false);
    }
  }

  return (
    <div>
      <h1 className="font-heading text-2xl font-extrabold text-brand-dark">Importar jogos</h1>
      <p className="mt-1 text-sm text-muted">
        Feeds públicos gratuitos — não é preciso conta nem chave de API.
      </p>

      <div className="mt-4 flex gap-2">
        <button
          onClick={() => switchSource("gamemonetize")}
          className={`rounded-full px-4 py-2 text-sm font-extrabold ${
            source === "gamemonetize" ? "bg-brand text-white" : "bg-surface"
          }`}
        >
          🟢 GameMonetize
        </button>
        <button
          onClick={() => switchSource("gamepix")}
          className={`rounded-full px-4 py-2 text-sm font-extrabold ${
            source === "gamepix" ? "bg-brand text-white" : "bg-surface"
          }`}
        >
          🔵 GamePix
        </button>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <button
          onClick={() => loadFeed(0, false)}
          disabled={loadingFeed}
          className="rounded-full bg-accent-blue px-4 py-2 text-sm font-extrabold text-white shadow disabled:opacity-60"
        >
          {loadingFeed ? "Carregando..." : "🔄 Carregar jogos"}
        </button>
        {feedGames.length > 0 && (
          <button
            onClick={() => loadFeed(page + 1, true)}
            disabled={loadingFeed}
            className="rounded-full bg-surface px-4 py-2 text-sm font-extrabold shadow disabled:opacity-60"
          >
            ➕ Carregar mais
          </button>
        )}
        <label className="flex items-center gap-2 text-sm font-bold">
          Classificação para importados:
          <select
            value={ageRating}
            onChange={(e) => setAgeRating(e.target.value as AgeRating)}
            className="rounded-lg border border-black/10 px-2 py-1"
          >
            {AGE_RATINGS.map((r) => (
              <option key={r.value} value={r.value}>
                {r.value} — {r.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      {status && <p className="mt-3 text-sm font-semibold">{status}</p>}

      {feedGames.length > 0 && (
        <>
          <div className="mt-4 flex items-center justify-between">
            <label className="flex items-center gap-2 text-sm font-bold">
              <input
                type="checkbox"
                checked={selected.size === feedGames.length && feedGames.length > 0}
                onChange={toggleAll}
              />
              Selecionar todos ({feedGames.length})
            </label>
            <button
              onClick={handleImport}
              disabled={importing || selected.size === 0}
              className="rounded-full bg-brand px-5 py-2 text-sm font-extrabold text-white shadow disabled:opacity-60"
            >
              {importing ? "Importando..." : `✓ Importar selecionados (${selected.size})`}
            </button>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
            {feedGames.map((g) => (
              <label
                key={g.externalId}
                className={`flex cursor-pointer flex-col overflow-hidden rounded-xl bg-surface shadow ${
                  selected.has(g.externalId) ? "ring-2 ring-brand" : ""
                }`}
              >
                <div className="relative aspect-video">
                  <img src={g.thumbnail} alt={g.title} className="h-full w-full object-cover" />
                  <input
                    type="checkbox"
                    checked={selected.has(g.externalId)}
                    onChange={() => toggle(g.externalId)}
                    className="absolute right-2 top-2 h-5 w-5"
                  />
                </div>
                <div className="p-2">
                  <p className="line-clamp-1 text-xs font-bold">{g.title}</p>
                  <p className="text-[10px] text-muted">{mapFeedCategory(g.category)}</p>
                </div>
              </label>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
