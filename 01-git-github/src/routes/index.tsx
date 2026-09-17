import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import { ScaledSlide } from "@/components/deck/ScaledSlide";
import { slides } from "@/components/deck/slides";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Git & GitHub: From Zero to Collaborative Workflow — GDSC Workshop" },
      {
        name: "description",
        content:
          "A 3-hour instructor-led workshop deck on Git and GitHub for beginners: fundamentals, branching, pull requests and a hands-on lab.",
      },
      { property: "og:title", content: "Git & GitHub: From Zero to Collaborative Workflow" },
      {
        property: "og:description",
        content: "GDSC Sfax session 1 — Git fundamentals, branching, GitHub collaboration and a 45-minute hands-on lab.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Deck,
});

function formatTime(sec: number) {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

function Deck() {
  const [index, setIndex] = useState(0);
  const [grid, setGrid] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [running, setRunning] = useState(false);

  const total = slides.length;
  const current = slides[index]!;

  const go = useCallback(
    (delta: number) => setIndex((i) => Math.min(total - 1, Math.max(0, i + delta))),
    [total],
  );

  useEffect(() => {
    if (!running) return;
    const t = setInterval(() => setElapsed((e) => e + 1), 1000);
    return () => clearInterval(t);
  }, [running]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === " " || e.key === "PageDown") {
        e.preventDefault();
        grid ? setGrid(false) : go(1);
      } else if (e.key === "ArrowLeft" || e.key === "PageUp") {
        e.preventDefault();
        go(-1);
      } else if (e.key === "g" || e.key === "G") {
        setGrid((v) => !v);
      } else if (e.key === "Escape") {
        setGrid(false);
      } else if (e.key === "Home") {
        setIndex(0);
      } else if (e.key === "End") {
        setIndex(total - 1);
      } else if (e.key === "t" || e.key === "T") {
        setRunning((r) => !r);
      } else if (e.key === "f" || e.key === "F") {
        if (document.fullscreenElement) document.exitFullscreen();
        else document.documentElement.requestFullscreen();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [go, grid, total]);

  useEffect(() => {
    document.title = `${index + 1}/${total} — ${current.title}`;
  }, [index, total, current.title]);

  const sections = useMemo(() => {
    const seen = new Set<string>();
    return slides
      .map((sl, i) => ({ ...sl, i }))
      .filter((sl) => (seen.has(sl.section) ? false : (seen.add(sl.section), true)));
  }, []);

  return (
    <main className="relative h-screen w-screen overflow-hidden bg-deck-bg font-sans text-deck-fg">
      <div
        className="absolute inset-0"
        onClick={(e) => {
          if (grid) return;
          const x = e.clientX / window.innerWidth;
          go(x < 0.25 ? -1 : 1);
        }}
      >
        <ScaledSlide>{current.render()}</ScaledSlide>
      </div>

      {/* progress bar */}
      <div className="pointer-events-none absolute bottom-0 left-0 z-20 h-[6px] w-full bg-deck-line">
        <div
          className="h-full bg-g-blue transition-all duration-200"
          style={{ width: `${((index + 1) / total) * 100}%` }}
        />
      </div>

      {/* chrome */}
      <div className="pointer-events-none absolute bottom-[22px] left-0 z-20 flex w-full items-center justify-between px-[28px] text-[15px] text-deck-muted">
        <span className="rounded-full bg-deck-bg-2/80 px-3 py-1">{current.section}</span>
        <div className="pointer-events-auto flex items-center gap-3">
          <button
            onClick={() => setRunning((r) => !r)}
            className="rounded-full bg-deck-bg-2/80 px-3 py-1 font-mono hover:text-deck-fg"
            title="Toggle timer (T)"
          >
            ⏱ {formatTime(elapsed)} {running ? "" : "(paused)"}
          </button>
          <button
            onClick={() => setGrid(true)}
            className="rounded-full bg-deck-bg-2/80 px-3 py-1 hover:text-deck-fg"
            title="Overview (G)"
          >
            Overview
          </button>
          <span className="rounded-full bg-deck-bg-2/80 px-3 py-1 font-mono">
            {index + 1} / {total}
          </span>
        </div>
      </div>

      {grid ? (
        <div className="absolute inset-0 z-30 overflow-y-auto bg-deck-bg/97 p-10 backdrop-blur">
          <div className="mb-6 flex flex-wrap items-center gap-3">
            <h2 className="mr-4 text-2xl font-semibold">Slide overview</h2>
            {sections.map((sec) => (
              <button
                key={sec.section}
                onClick={() => {
                  setIndex(sec.i);
                  setGrid(false);
                }}
                className="rounded-full border border-deck-line px-4 py-1.5 text-sm text-deck-muted hover:border-g-blue hover:text-deck-fg"
              >
                {sec.section}
              </button>
            ))}
            <button
              onClick={() => setGrid(false)}
              className="ml-auto rounded-full border border-deck-line px-4 py-1.5 text-sm hover:border-g-red"
            >
              Close (Esc)
            </button>
          </div>
          <div className="grid grid-cols-4 gap-5">
            {slides.map((sl, i) => (
              <button
                key={sl.id}
                onClick={() => {
                  setIndex(i);
                  setGrid(false);
                }}
                className={`group overflow-hidden rounded-xl border text-left transition ${
                  i === index ? "border-g-blue" : "border-deck-line hover:border-g-yellow"
                }`}
              >
                <div className="relative aspect-video w-full bg-deck-bg-2">
                  <ScaledSlide>{sl.render()}</ScaledSlide>
                </div>
                <div className="flex items-center justify-between px-3 py-2 text-xs text-deck-muted">
                  <span className="truncate">{sl.title}</span>
                  <span className="font-mono">{i + 1}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      ) : null}
    </main>
  );
}
