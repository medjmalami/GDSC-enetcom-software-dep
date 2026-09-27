"use client"

import { useEffect, useMemo, useState } from "react"
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"
import { oneDark, oneLight } from "react-syntax-highlighter/dist/esm/styles/prism"
import { ArrowLeft, ArrowRight, Check, Clock3, Keyboard, Moon, Sun, Terminal, X } from "lucide-react"

const C = { blue: "#4285F4", red: "#EA4335", yellow: "#FBBC05", green: "#34A853" }

type Slide = { block: string; kicker: string; title: string; body?: string; kind?: "code" | "diagram" | "break" | "title" | "table"; code?: string; language?: string; bullets?: string[]; accent?: string; note?: string }

const code = {
  hello: `from fastapi import FastAPI\n\napp = FastAPI()\n\n@app.get("/")\ndef read_root():\n    return {"message": "Hello, FastAPI!"}`,
  params: `@app.get("/items/{item_id}")\ndef read_item(item_id: int):\n    return {"item_id": item_id}`,
  query: `@app.get("/items")\ndef list_items(skip: int = 0, limit: int = 10):\n    return {"skip": skip, "limit": limit}`,
  model: `from pydantic import BaseModel\n\nclass Task(BaseModel):\n    id: int\n    title: str\n    done: bool = False`,
  response: `@app.post("/tasks", response_model=Task, status_code=201)\ndef create_task(task: Task):\n    tasks.append(task)\n    return task`,
  setup: `# main.py\nfastapi dev main.py\n\n# Open in your browser\nhttp://127.0.0.1:8000/docs`,
  create: `from fastapi import FastAPI, HTTPException\nfrom pydantic import BaseModel\n\napp = FastAPI()\n\nclass Task(BaseModel):\n    id: int\n    title: str\n    done: bool = False\n\ntasks: list[Task] = []\n\n@app.post("/tasks", response_model=Task, status_code=201)\ndef create_task(task: Task):\n    tasks.append(task)\n    return task`,
  list: `@app.get("/tasks", response_model=list[Task])\ndef read_tasks():\n    return tasks`,
  single: `@app.get("/tasks/{task_id}", response_model=Task)\ndef read_task(task_id: int):\n    for task in tasks:\n        if task.id == task_id:\n            return task\n    raise HTTPException(status_code=404, detail="Task not found")`,
  update: `@app.put("/tasks/{task_id}", response_model=Task)\ndef update_task(task_id: int, updated_task: Task):\n    for index, task in enumerate(tasks):\n        if task.id == task_id:\n            tasks[index] = updated_task\n            return updated_task\n    raise HTTPException(status_code=404, detail="Task not found")`,
  delete: `@app.delete("/tasks/{task_id}")\ndef delete_task(task_id: int):\n    for index, task in enumerate(tasks):\n        if task.id == task_id:\n            tasks.pop(index)\n            return {"message": "Task deleted"}\n    raise HTTPException(status_code=404, detail="Task not found")`,
}

const slides: Slide[] = [
  { block: "Block 0 · Welcome", kicker: "GDSC Enetcom · Software Engineering · Session 2", title: "FastAPI Fundamentals", body: "Building Your First CRUD API", kind: "title", accent: C.blue, note: "2h 30m workshop" },
  { block: "Block 0 · Welcome", kicker: "Quick recap", title: "What Git & GitHub gave us", bullets: ["Version control: a history you can trust", "Collaboration: work together without overwriting each other", "Today we build something worth committing: an API"], accent: C.green },
  { block: "Block 0 · Welcome", kicker: "Before we start", title: "Quick readiness check", bullets: ["Python 3.10+ ready", "fastapi[standard] installed from the pre-session instructions", "If something is missing, flag it now — we’ll troubleshoot in the setup checkpoint"], accent: C.yellow },
  { block: "Block 0 · Welcome", kicker: "The route through today", title: "Theory → break → build → ship", bullets: ["01 / API & FastAPI theory · 65 min", "02 / Break · 10 min", "03 / Hands-on CRUD build · 90 min", "04 / Wrap-up & next steps · 15 min"], accent: C.blue },
  { block: "Block 1 · Theory", kicker: "01 · The mental model", title: "What is an API?", body: "A contract that lets one program ask another program for data or an action.", kind: "diagram", accent: C.blue },
  { block: "Block 1 · Theory", kicker: "02 · HTTP verbs", title: "Methods map to CRUD", kind: "table", accent: C.red },
  { block: "Block 1 · Theory", kicker: "03 · Design principles", title: "REST, in one breath", bullets: ["Resources, not actions: /tasks instead of /getAllTasks", "URLs identify things; HTTP methods describe intent", "Stateless requests: each request carries what the server needs"], accent: C.green },
  { block: "Block 1 · Theory", kicker: "04 · Why FastAPI", title: "Python speed, typed", bullets: ["Async-ready performance, powered by Starlette", "Type hints become automatic request validation", "Pydantic models keep data honest", "Interactive docs appear automatically"], accent: C.blue },
  { block: "Block 1 · Theory", kicker: "05 · Reference", title: "What you should already have", body: "The standard extra bundles FastAPI, Uvicorn, and the FastAPI CLI — no separate server install needed.", code: `pip install "fastapi[standard]"`, language: "bash", accent: C.yellow, note: "Reference / verification — not a group install" },
  { block: "Block 1 · Theory", kicker: "06 · First route", title: "Hello, FastAPI", body: "Create an app, decorate a function, run the dev server.", code: code.hello, language: "python", accent: C.blue, note: "Run: fastapi dev main.py · Equivalent: uvicorn main:app --reload" },
  { block: "Block 1 · Theory", kicker: "07 · Inputs", title: "Path parameters", body: "The type annotation validates and converts the URL segment for us.", code: code.params, language: "python", accent: C.red },
  { block: "Block 1 · Theory", kicker: "08 · Inputs", title: "Query parameters", body: "Optional values with defaults make pagination-style APIs simple.", code: code.query, language: "python", accent: C.green },
  { block: "Block 1 · Theory", kicker: "09 · Inputs", title: "Request bodies", body: "Pydantic models define the shape of JSON your endpoint accepts.", code: code.model, language: "python", accent: C.yellow },
  { block: "Block 1 · Theory", kicker: "10 · Outputs", title: "Response models & status codes", body: "Be explicit about what leaves your API — and what happened.", code: code.response, language: "python", accent: C.blue },
  { block: "Block 1 · Theory", kicker: "11 · Built-in tooling", title: "Your API writes its own docs", bullets: ["/docs → Swagger UI: try requests in the browser", "/redoc → ReDoc: a clean reference view", "Schemas, parameters, and responses stay in sync with code"], accent: C.green, note: "Show both URLs live" },
  { block: "Block 1 · Theory", kicker: "12 · Failure paths", title: "Errors are part of the contract", code: `from fastapi import HTTPException\n\nraise HTTPException(\n    status_code=404,\n    detail="Task not found",\n)`, language: "python", accent: C.red },
  { block: "Block 1 · Theory", kicker: "13 · Scope check", title: "Today’s storage is intentionally fake", body: "We’ll use a Python list/dict as an in-memory store. Databases arrive in a later session.", kind: "diagram", accent: C.yellow, note: "Keep the learning loop tight" },
  { block: "Break · 10 min", kicker: "Pause & reset", title: "Break", body: "Stretch, compare notes, and be back ready to build.", kind: "break", accent: C.yellow, note: "Next: a complete CRUD API" },
  { block: "Block 2 · Hands-on", kicker: "Checkpoint 01 · Setup", title: "Make sure the loop runs", bullets: ["Create a fresh project folder and main.py", "Confirm fastapi imports correctly", "Run fastapi dev main.py", "Troubleshoot individually — no fresh group installs"], code: code.setup, language: "bash", accent: C.blue },
  { block: "Block 2 · Hands-on", kicker: "Checkpoint 02 · Model", title: "Define the resource", code: code.model, language: "python", accent: C.yellow },
  { block: "Block 2 · Hands-on", kicker: "Checkpoint 03 · Storage", title: "Our fake database", body: "A list is enough to practice the API contract before persistence complicates the picture.", code: `tasks: list[Task] = []`, language: "python", accent: C.green },
  { block: "Block 2 · Hands-on", kicker: "Checkpoint 04 · Create", title: "POST /tasks", body: "Accept a validated Task, append it, and return 201 Created.", code: code.create, language: "python", accent: C.blue },
  { block: "Block 2 · Hands-on", kicker: "Checkpoint 05 · Read", title: "GET /tasks", body: "Return the complete collection.", code: code.list, language: "python", accent: C.green },
  { block: "Block 2 · Hands-on", kicker: "Checkpoint 06 · Read one", title: "GET /tasks/{task_id}", body: "Find one item — or give the client a useful 404.", code: code.single, language: "python", accent: C.red },
  { block: "Block 2 · Hands-on", kicker: "Checkpoint 07 · Update", title: "PUT /tasks/{task_id}", body: "Replace the resource at a known identifier.", code: code.update, language: "python", accent: C.yellow },
  { block: "Block 2 · Hands-on", kicker: "Checkpoint 08 · Delete", title: "DELETE /tasks/{task_id}", body: "Remove the item and confirm the action.", code: code.delete, language: "python", accent: C.red },
  { block: "Block 2 · Hands-on", kicker: "Checkpoint 09 · Test", title: "Try every endpoint in /docs", bullets: ["POST a task", "GET the collection and one task", "PUT an update", "DELETE it, then verify the 404", "fastapi dev auto-reloads after edits"], accent: C.blue, note: "Live-coding checkpoint" },
  { block: "Block 2 · Hands-on", kicker: "Optional stretch", title: "Filter the collection", code: `@app.get("/tasks")\ndef read_tasks(done: bool | None = None):\n    if done is None:\n        return tasks\n    return [task for task in tasks if task.done == done]`, language: "python", accent: C.green, note: "Try: GET /tasks?done=true" },
  { block: "Block 3 · Wrap-up", kicker: "Recap", title: "You built the full CRUD loop", kind: "table", accent: C.blue },
  { block: "Block 3 · Wrap-up", kicker: "What’s next", title: "Persistence, not magic", bullets: ["SQLite for a friendly local next step", "Postgres when your app needs a real shared database", "Same API ideas — a durable store underneath"], accent: C.yellow },
  { block: "Block 3 · Wrap-up", kicker: "Keep exploring", title: "Resources", bullets: ["fastapi.tiangolo.com", "docs.pydantic.dev", "This session’s code in the GitHub repo", "Revisit /docs as your API evolves"], accent: C.green },
  { block: "Block 3 · Wrap-up", kicker: "Open floor", title: "Questions?", body: "What felt clear? What would you like to build with this next?", accent: C.red },
  { block: "Block 3 · Wrap-up", kicker: "Thank you", title: "Ship something small", body: "Thanks for building with us. Share your feedback before you leave.", accent: C.blue, note: "GDSC Enetcom · Software Engineering" },
]

function SlideVisual({ slide, dark }: { slide: Slide; dark: boolean }) {
  if (slide.kind === "diagram") return <div className="diagram"><div className="diagram-node client">Client</div><ArrowRight className="diagram-arrow" /><div className="diagram-node server">FastAPI<br /><span>server</span></div><ArrowRight className="diagram-arrow" /><div className="diagram-node data">Data<br /><span>source</span></div></div>
  if (slide.kind === "table") return <div className="method-table"><div className="method-row header"><span>HTTP</span><span>CRUD</span><span>Intent</span></div>{[["GET", "Read", "Fetch a resource"], ["POST", "Create", "Add a resource"], ["PUT / PATCH", "Update", "Change a resource"], ["DELETE", "Delete", "Remove a resource"]].map(([a,b,c]) => <div className="method-row" key={a}><strong>{a}</strong><span className={`pill ${b.toLowerCase()}`}>{b}</span><span>{c}</span></div>)}</div>
  if (slide.kind === "break") return <div className="break-visual"><Clock3 /><strong>10:00</strong><span>Take five. Then we build.</span></div>
  if (slide.code) return <SyntaxHighlighter language={slide.language || "python"} style={dark ? oneDark : oneLight} showLineNumbers customStyle={{ margin: 0, borderRadius: "18px", padding: "24px 26px", fontSize: "clamp(14px, 1.35vw, 21px)", lineHeight: 1.55, minHeight: "180px", display: "flex", alignItems: "center" }}>{slide.code}</SyntaxHighlighter>
  return null
}

export default function FastAPIDeck() {
  const [index, setIndex] = useState(0)
  const [dark, setDark] = useState(true)
  const [showHelp, setShowHelp] = useState(false)
  const slide = slides[index]
  const progress = useMemo(() => `${index + 1} / ${slides.length}`, [index])

  useEffect(() => { const saved = window.localStorage.getItem("fastapi-theme"); if (saved) setDark(saved === "dark") }, [])
  useEffect(() => { document.documentElement.dataset.deckTheme = dark ? "dark" : "light"; window.localStorage.setItem("fastapi-theme", dark ? "dark" : "light") }, [dark])
  useEffect(() => { const onKey = (event: KeyboardEvent) => { if (event.key === "ArrowRight" || event.key === " " || event.key === "PageDown") { event.preventDefault(); setIndex((value) => Math.min(value + 1, slides.length - 1)) } if (event.key === "ArrowLeft" || event.key === "PageUp") { event.preventDefault(); setIndex((value) => Math.max(value - 1, 0)) } if (event.key === "?" || event.key === "/") setShowHelp((value) => !value) }; window.addEventListener("keydown", onKey); return () => window.removeEventListener("keydown", onKey) }, [])

  return <main className={`deck ${dark ? "is-dark" : "is-light"}`} style={{ "--accent": slide.accent || C.blue } as React.CSSProperties}>
    <header className="topbar"><div className="brand"><span className="brand-mark"><i></i><i></i><i></i><i></i></span><span>GDSC <b>·</b> FastAPI Fundamentals</span></div><div className="top-actions"><span className="slide-count">{progress}</span><button className="icon-button" onClick={() => setShowHelp(true)} aria-label="Show keyboard shortcuts"><Keyboard /></button><button className="icon-button" onClick={() => setDark((value) => !value)} aria-label={`Switch to ${dark ? "light" : "dark"} theme`}>{dark ? <Sun /> : <Moon />}</button></div></header>
    <section className={`slide ${slide.kind === "title" ? "title-slide" : ""}`} aria-live="polite"><div className="slide-meta"><span className="block-label">{slide.block}</span><span className="slide-kicker">{slide.kicker}</span></div><div className="slide-content"><div className="copy"><div className="eyebrow"><span className="eyebrow-dot"></span>{String(index + 1).padStart(2, "0")}</div><h1>{slide.title}</h1>{slide.body && <p className="lead">{slide.body}</p>}{slide.bullets && <ul>{slide.bullets.map((bullet) => <li key={bullet}><Check />{bullet}</li>)}</ul>}{slide.note && <div className="speaker-note"><Terminal />{slide.note}</div>}</div><div className="visual"><SlideVisual slide={slide} dark={dark} /></div></div>{slide.kind === "title" && <div className="title-signature"><span>2h 30m live workshop</span><span>Session 02</span></div>}</section>
    <footer className="controls"><div className="progress-track" aria-label="Slide navigation">{slides.map((item, itemIndex) => <button key={itemIndex} className={`dot ${itemIndex === index ? "active" : ""} ${itemIndex < index ? "visited" : ""}`} style={{ "--dot-color": item.accent || C.blue } as React.CSSProperties} onClick={() => setIndex(itemIndex)} aria-label={`Go to slide ${itemIndex + 1}: ${item.title}`} />)}</div><div className="nav-actions"><button className="nav-button" onClick={() => setIndex((value) => Math.max(value - 1, 0))} disabled={index === 0}><ArrowLeft />Previous</button><button className="nav-button next" onClick={() => setIndex((value) => Math.min(value + 1, slides.length - 1))} disabled={index === slides.length - 1}>Next<ArrowRight /></button></div></footer>
    {showHelp && <div className="help-backdrop" onClick={() => setShowHelp(false)}><aside className="help-card" onClick={(event) => event.stopPropagation()}><button className="close-help" onClick={() => setShowHelp(false)} aria-label="Close shortcuts"><X /></button><span className="eyebrow-dot"></span><h2>Presenter controls</h2><p>Keep the focus on the room, not the interface.</p><div className="shortcut"><kbd>←</kbd><kbd>→</kbd><span>Previous / next slide</span></div><div className="shortcut"><kbd>Space</kbd><span>Advance slide</span></div><div className="shortcut"><kbd>?</kbd><span>Toggle this panel</span></div><div className="shortcut"><kbd>Click a dot</kbd><span>Jump to any slide</span></div></aside></div>}
  </main>
}

export { slides }

/* Intentional: this component owns the workshop's static slide configuration so it can be reordered in one place. */
