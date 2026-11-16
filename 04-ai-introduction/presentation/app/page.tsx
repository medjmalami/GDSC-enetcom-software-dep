'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useTheme } from 'next-themes'
import { AlertTriangle, ArrowLeft, ArrowRight, Check, Code2, ExternalLink, Maximize2, Moon, ShieldCheck, Sparkles, Sun, Terminal } from 'lucide-react'
import { cn } from '@/lib/utils'
import { BackpropVisual, CompareLocalCloud, GenerationLoop, NestedCircles, ProbabilityBars, TokenVisual } from '@/components/llm-visuals'
import {
  AnatomyPromptDemo,
  ChainOfThoughtDemo,
  DelimitersDemo,
  FewShotDemo,
  PromptProbDemo,
  PromptTakeawaysDemo,
  RolesChatDemo,
  ZeroShotDemo,
} from '@/components/prompt-visuals'
import {
  JsonSchemaDemo,
  PydanticDemo,
  RawTextBreaksDemo,
  StructuredConceptDemo,
  StructuredLevelsDemo,
  StructuredTakeawaysDemo,
  ValidationFlowDemo,
} from '@/components/structured-visuals'
import {
  AnswerQualityFlowDemo,
  ContextWindowDemo,
  EvaluationMatrixDemo,
  FinetuningVsPromptingDemo,
  GoodVsWeakCasesDemo,
  HallucinationMitigationDemo,
  ModelLimitsDemo,
  QualityTakeawaysDemo,
} from '@/components/quality-visuals'
import {
  BonusDemos,
  FinalRecapDemo,
  FirstCallDemo,
  GenerationParamsDemo,
  PromptEngineeringDemo,
  StructuredLevelsCodeDemo,
} from '@/components/live-demo-visuals'

const LOGO = ({ compact = false }: { compact?: boolean }) => (
  <div className={cn('flex items-center gap-2', compact && 'scale-90 origin-left')} aria-label="GDSC Enetcom logo placeholder">
    <div className="flex size-9 items-center justify-center rounded-xl border border-dashed border-border bg-card text-xs font-bold text-muted-foreground">LOGO</div>
    <span className="text-sm font-semibold tracking-tight">GDSC Enetcom</span>
  </div>
)

const slides = [
  { type: 'title', kicker: 'SESSION 04', title: 'AI Introduction', subtitle: 'Large Language Models · Prompting Fundamentals · Structured Outputs · Quality & Live Gemini Demo', body: 'GDSC Enetcom · Software Engineering Department', presenter: 'Presenters: Mohamed Amine Jmal & Mohamed Mortadha Dridi' },
  { type: 'agenda', title: "Today's route map", subtitle: 'From how a model predicts text to getting reliable, structured answers out of it.', items: ['Large Language Models', 'Prompting Fundamentals', 'Structured Outputs', 'Quality & Limits', 'Live Gemini Demo'] },
  { type: 'divider', part: '01', title: 'Large Language Models', subtitle: 'What they are, how they generate text, and how they are trained.' },
  { type: 'llm', part: '01', title: 'What is an LLM?', subtitle: 'A model trained on huge amounts of text to predict what comes next.', bullets: ['Trained on huge amounts of text', 'Predicts what comes next', 'Examples: Gemini, GPT, Claude, Llama'] },
  { type: 'tokens', part: '01', title: 'Tokens, not words', subtitle: 'Models read and write in small chunks of text called tokens.', items: [['Vocabulary', 'The fixed set of tokens a model knows.'], ['Cost', 'APIs bill per input + output token.'], ['Context limits', 'Window size is measured in tokens.'], ['Odd behavior', 'Counting letters is hard: it sees chunks.']], link: 'https://platform.openai.com/tokenizer' },
  { type: 'predict', part: '01', title: 'Next-token prediction', subtitle: 'For every step, the model scores every token in its vocabulary.', prompt: 'The capital of France is', options: [['Paris', 92], ['a', 3], ['the', 2], ['located', 1], ['…other', 2]], footer: 'The model outputs probabilities, not a single answer.' },
  { type: 'loop', part: '01', title: 'One token at a time', subtitle: 'Pick a token, append it to the input, predict again.', notes: [['Generation loop', 'Repeats until a stop token or a length limit.'], ['Context window', 'Everything the model can "see" at once.'], ['Inference ≠ training', "This is using a model. Next: how it's built."]] },
  { type: 'training', part: '01', title: "How it's trained", subtitle: 'Three stages turn raw text into a helpful assistant.', concepts: [['Loss', 'A score for how wrong the prediction was.'], ['Backpropagation', "Adjust the model's weights slightly to reduce the loss."]], stages: [['Pretraining', 'Predict the next token across a huge text corpus'], ['Fine-tuning', 'Teach the model to follow instructions'], ['RLHF', 'People rank answers, the model learns preferences']] },
  { type: 'params', part: '01', title: 'Generation parameters', subtitle: 'Knobs that change how the next token is picked.', items: [['Temperature', 'Low = predictable, high = creative'], ['Top-k', 'Only choose among the k most likely tokens'], ['Top-p', 'Only choose among tokens covering p% of probability'], ['Max tokens', 'Hard limit on output length'], ['Stop sequences', 'Text that ends generation'], ['Freq. / presence penalty', 'Discourage repetition'], ['Seed', 'Helps (not guarantees) reproducible outputs']], demo: ['T = 0.2', 'T = 0.8', 'T = 1.5'], footer: 'Not every API exposes all of these (e.g. OpenAI and Gemini differ).' },
  { type: 'hallucinations', part: '01', title: 'Hallucinations', subtitle: 'Confident, fluent, and wrong.', why: 'The model optimizes for plausible text, not truth. If a fact is missing, it still produces something that sounds right.', mitigation: ['Verify important facts', 'Give it sources to quote from', 'Lower the temperature'] },
  { type: 'final', part: '01', title: 'Takeaways', subtitle: 'Same model concepts, two ways to run them.', items: ['An LLM is a pattern predictor, not a database or a mind', 'Parameters shape its output; verify important facts'], rows: [['Examples', 'Llama, Gemma, Mistral, Qwen', 'Gemini, GPT, Claude'], ['How', 'Ollama, LM Studio on your machine', 'HTTP API + API key'], ['Privacy', 'Data never leaves your device', 'Prompts sent to the provider'], ['Cost', 'Free per token, you pay in hardware', 'Pay per token, no hardware'], ['Quality', 'Smaller models, good for simple tasks', 'Frontier models, best reasoning'], ['Hardware', 'Needs RAM / GPU (≈5 GB for an 8B model)', 'Any laptop with internet'], ['Offline', 'Works offline', 'Needs a connection']], footer: 'We use a cloud API in the demos; everything you learn applies to local models too.' },
  { type: 'divider', part: '02', title: 'Prompting Fundamentals', subtitle: 'How to steer next-token predictions: roles, context, and clear constraints.' },
  {
    type: 'prompt-what',
    part: '02',
    title: 'What is a prompt?',
    subtitle: 'The input text that steers the model’s next-token predictions.',
    bullets: [
      'Definition: the input text that steers the model’s next-token predictions',
      'Different prompt → different probability distribution → different output',
      'Vague prompt = vague answer',
    ],
    footer: 'A prompt is the initial condition that sets the trajectory for the generation loop.',
  },
  {
    type: 'prompt-roles',
    part: '02',
    title: 'Roles: system / user / assistant',
    subtitle: 'Structuring conversation state in an inherently stateless model.',
    bullets: [
      'System: sets behavior, persona, rules',
      'User: the actual request',
      'Assistant: the model’s previous replies',
      'Stateless: the model has no memory, the full conversation is resent every time',
    ],
  },
  {
    type: 'prompt-anatomy',
    part: '02',
    title: 'Anatomy of a good prompt',
    subtitle: 'Four essential building blocks for reliable, high-signal results.',
    bullets: [
      'Four parts: Task, Context, Constraints, Output format',
    ],
    footer: 'Color-coded prompt segments ensure every constraint is explicit before the model generates token #1.',
  },
  {
    type: 'prompt-zero-shot',
    part: '02',
    title: 'Zero-shot prompting',
    subtitle: 'Asking directly without providing example input/output pairs.',
    bullets: [
      'Definition: ask directly, no examples',
      'Works for: simple, common tasks',
      'Fails for: custom formats, unusual labels',
    ],
    footer: 'Zero-shot relies purely on pretraining patterns. Fast and cheap, but brittle for specialized schemas.',
  },
  {
    type: 'prompt-few-shot',
    part: '02',
    title: 'Few-shot prompting',
    subtitle: 'Steering the model by demonstrating the exact pattern to follow.',
    bullets: [
      'Definition: include 2–5 input → output examples in the prompt',
      'Why it works: the model continues the pattern it sees',
      'Tips: keep examples consistent and varied',
      'Trade-off: more tokens = more cost, less context left',
    ],
    footer: 'Few-shot turns ambiguous instructions into concrete pattern-continuation.',
  },
  {
    type: 'prompt-cot',
    part: '02',
    title: 'Chain-of-Thought (CoT)',
    subtitle: 'Giving the model computational scratchpad space before it answers.',
    bullets: [
      'Definition: ask the model to reason step by step before answering',
      'Why it works: it writes one token at a time, so writing steps gives it room to compute',
      'Note: newer reasoning models do this internally',
    ],
    footer: 'LLMs cannot pause to calculate. Writing intermediate reasoning tokens is their actual compute step.',
  },
  {
    type: 'prompt-delimiters',
    part: '02',
    title: 'Delimiters',
    subtitle: 'Separating system instructions from untrusted user data.',
    bullets: [
      'Purpose: separate instructions from data',
      'Styles: triple quotes, ###, XML-like tags',
      'Why: avoids confusion and reduces prompt injection',
    ],
    footer: 'Treating user inputs as isolated data blocks prevents prompt injection and hallucinations.',
  },
  {
    type: 'prompt-takeaways',
    part: '02',
    title: 'Prompting takeaways',
    subtitle: 'The fundamental toolkit for everyday AI engineering.',
    bullets: [
      'Be specific',
      'Show examples',
      'Let the model reason',
      'Separate your data',
      'Prompting is iterative: test, adjust, repeat',
      'Bridge: what if we need the output in a strict format for software? → Part 3',
    ],
  },
  { type: 'divider', part: '03', title: 'Structured Outputs', subtitle: 'Bridging free-form text and reliable software with JSON Schema and Pydantic.' },
  {
    type: 'struct-breaks',
    part: '03',
    title: 'Why raw text breaks software',
    subtitle: 'Free-form text is probabilistic; software requires deterministic structure.',
    bullets: [
      'LLMs reply in free-form text',
      'Software needs predictable structure',
      'Small wording changes = broken code',
    ],
    footer: 'Relying on string splitting (split, regex) against an LLM is a guaranteed production outage.',
  },
  {
    type: 'struct-what',
    part: '03',
    title: 'What are structured outputs?',
    subtitle: 'Constraining model completions into strict, predictable data schemas.',
    bullets: [
      'Definition: the model’s answer follows a format you define',
      'Most common format: JSON',
      'Same input, same shape, every time',
    ],
    footer: 'JSON matches key-value mappings directly into application objects and database records.',
  },
  {
    type: 'struct-schema',
    part: '03',
    title: 'JSON Schema: The Contract',
    subtitle: 'The blueprint that specifies types, keys, and allowed values.',
    bullets: [
      'A contract that describes the allowed shape of the JSON',
      'Defines: field names, types, required fields, allowed values',
      'Sent to the model along with the prompt',
    ],
    footer: 'The schema is sent directly to the model provider to constrain or validate the generation.',
  },
  {
    type: 'struct-pydantic',
    part: '03',
    title: 'Pydantic: Python’s Schema Engine',
    subtitle: 'Define your data model as a Python class; get validation and schema for free.',
    bullets: [
      'Python library: define the structure as a class',
      'Generates the JSON Schema for you',
      'Parses and validates the data into a typed object',
    ],
    footer: 'Pydantic bridges Python typing directly with the model’s JSON Schema contract.',
  },
  {
    type: 'struct-validation',
    part: '03',
    title: 'Validation & Handling Failures',
    subtitle: 'Defensive engineering: what to do when the model makes a mistake.',
    bullets: [
      'Never trust model output blindly',
      'Validate before using it',
      'On failure: retry with the error message',
    ],
    footer: 'Feeding validation errors back into the conversation context enables the model to self-correct.',
  },
  {
    type: 'struct-levels',
    part: '03',
    title: 'How do we get structured output?',
    subtitle: 'From asking nicely in prompts to guaranteed grammar-constrained decoding.',
    bullets: [
      'Level 1: ask nicely in prompt ("Reply only with JSON") - can still fail',
      'Level 2: JSON mode - valid JSON, but any shape',
      'Level 3: schema-enforced outputs - follows your exact schema',
      'Support varies by provider (OpenAI, Gemini, etc.)',
    ],
    footer: 'Modern frontier models support Level 3: constrained grammar masks prevent invalid tokens during generation.',
  },
  {
    type: 'struct-takeaways',
    part: '03',
    title: 'Structured Outputs takeaways',
    subtitle: 'The bridge from experimental prompts to production software.',
    bullets: [
      'Raw text is for humans, structured data is for software',
      'JSON Schema defines the contract',
      'Pydantic builds and checks it in Python',
      'Always validate',
      'Bridge: prompts & formats are only part of the story. What else decides answer quality? → Part 4',
    ],
  },
  { type: 'divider', part: '04', title: 'Quality, Limits & Improvements', subtitle: 'What defines the quality of an LLM answer and how to systematically improve it.' },
  {
    type: 'quality-good',
    part: '04',
    title: 'What makes an answer "good"?',
    subtitle: 'Looking beyond prompt syntax to the model, its knowledge, and its limits.',
    bullets: [
      'Part 1: how the model works',
      'Part 2: what goes in (prompts)',
      'Part 3: what comes out (structure)',
      'Part 4: what else can we change to get better answers?',
    ],
    footer: 'Quality is holistic: it is shaped by your input prompt, the model weights, active context, and validation rules.',
  },
  {
    type: 'quality-finetuning',
    part: '04',
    title: 'Fine-tuning vs prompting',
    subtitle: 'Conditioning inputs versus rewriting the model’s internal weights.',
    bullets: [
      'Prompting: changes the input, the model stays the same',
      'Fine-tuning: changes the model’s weights with extra training',
      'Start with prompting, fine-tune only when prompting is not enough',
    ],
    footer: 'Rule of thumb: Always exhaust prompt engineering and few-shot examples before training custom weights.',
  },
  {
    type: 'quality-context',
    part: '04',
    title: 'The context window',
    subtitle: 'The working memory boundary that governs attention and recall.',
    bullets: [
      'Everything the model can "see" at once, measured in tokens',
      'Includes your prompt, the history and the answer',
      'Too much input: older text gets cut off or ignored',
      'Anything you put in the context, the model can use',
    ],
    footer: 'Everything inside the active context window is available to the attention mechanism for zero-shot synthesis.',
  },
  {
    type: 'quality-eval',
    part: '04',
    title: 'Evaluating answers',
    subtitle: 'Transitioning from subjective spot-checks to repeatable test suites.',
    bullets: [
      'How do you know an answer got better?',
      'Use a small test set of questions with known good answers',
      'Compare versions side by side',
      'Judge by clear criteria: correct, complete, right format, right tone',
    ],
    footer: 'Caption: "Measure, don\'t guess." Automated test sets protect against prompt regressions.',
  },
  {
    type: 'quality-limits',
    part: '04',
    title: 'Model limits',
    subtitle: 'The inherent boundaries of frozen pretrained neural networks.',
    bullets: [
      'Knowledge cutoff: knows nothing after its training data ends',
      'No access to your private data (files, company docs)',
      'Can hallucinate (Part 1): next slide covers what to do about it',
      'Costs and speed grow with model size and prompt length',
      'Can reflect bias in its training data',
    ],
    footer: 'Models do not possess persistent awareness or live search unless explicitly connected to external tooling.',
  },
  {
    type: 'quality-hallucinations',
    part: '04',
    title: 'Reducing and fixing hallucinations',
    subtitle: 'Techniques to prevent false confabulations and catch them when they happen.',
    bullets: [
      'Reduce BEFORE: Put trusted info in context, allow "I don’t know", lower temperature, ask for sources',
      'Fix AFTER: Verify against trusted sources, re-prompt with missing facts, human review on high stakes',
      'Hallucinations can be reduced, not eliminated',
    ],
    footer: 'Allowing the model to refuse and grounding it with trusted context dramatically drops hallucination rates.',
  },
  {
    type: 'quality-good-weak',
    part: '04',
    title: 'What LLMs are good at, and what they are not',
    subtitle: 'Knowing when to delegate to an LLM versus traditional deterministic software.',
    bullets: [
      'Good at: writing, summarizing, translating, classifying, extracting, explaining, brainstorming',
      'Weak at: exact math, up-to-the-minute facts, anything needing guaranteed accuracy',
      'Rule: use it as a fast assistant, verify what matters',
    ],
    footer: 'Pair LLMs with deterministic calculators, database query engines, and validation schemas.',
  },
  {
    type: 'quality-takeaways',
    part: '04',
    title: 'Part 4 takeaways',
    subtitle: 'The complete mental model of applied AI engineering.',
    bullets: [
      'Quality depends on the model, the input, the output format and accessible knowledge',
      'Prompt first, fine-tune only if needed',
      'Measure improvements with test suites',
      'Know the limits and respect boundaries',
      'Reduce hallucinations with context and clear instructions, and always verify what matters',
    ],
  },
  { type: 'divider', part: '05', title: 'Live Demo with Gemini API', subtitle: 'Hands-on Python: first call, prompt refinement, Pydantic schemas, and parameters.' },
  {
    type: 'demo-first-call',
    part: '05',
    title: 'Setup & your first API call',
    subtitle: 'From zero to generated tokens in 5 lines of Python.',
    bullets: [
      'Get a free API key from Google AI Studio',
      'Store it as an environment variable, never in code',
      'Install: pip install google-genai pydantic',
    ],
  },
  {
    type: 'demo-prompt-craft',
    part: '05',
    title: 'Prompt engineering: bad vs good',
    subtitle: 'Witnessing the impact of system personas, constraints, and delimiters in code.',
    bullets: [
      'Same model, same task, different prompt',
      'Bad: no system instruction, no context, no format',
      'Good: role + task + context + constraints + delimiters',
    ],
    footer: 'Notice how the good prompt guarantees brevity, structure, and tone directly from the API.',
  },
  {
    type: 'demo-structured',
    part: '05',
    title: 'Structured outputs: the 3 levels',
    subtitle: 'From asking nicely in prompts to guaranteed Pydantic schema decoding.',
    bullets: [
      'Level 1: ask nicely in the prompt (fails JSON parsing)',
      'Level 2: JSON mode (valid syntax, unpredictable keys)',
      'Level 3: schema-enforced output with Pydantic (100% deterministic)',
      'Same input: "Sara is 29 years old and teaches math in Tunis."',
    ],
    footer: 'response.parsed immediately returns a validated, typed Python instance of your Pydantic class.',
  },
  {
    type: 'demo-params',
    part: '05',
    title: 'Generation parameters in action',
    subtitle: 'Comparing temperature = 0.0, 1.0, and 2.0 on the same coffee shop naming prompt.',
    bullets: [
      'Same prompt, different settings, different behavior (callback to Part 1)',
      'Temperature: low = predictable, high = creative',
      'max_output_tokens caps the length',
    ],
    footer: 'Run each multiple times: T=0.0 yields identical completions; T=2.0 yields high-variance wild ideas.',
  },
  {
    type: 'demo-bonus',
    part: '05',
    title: 'Bonus demos: tokens, memory, context',
    subtitle: 'Counting tokens, conversational multi-turn chat sessions, and grounding context.',
    bullets: [
      'Tokens: what you pay for and what fills the context window',
      'Stateless: the model remembers nothing between raw calls',
      'Context: give the model information and it can use it accurately',
    ],
    footer: 'The Python SDK chat object abstracts state by resending full turn history on every message.',
  },
  {
    type: 'demo-recap',
    part: '05',
    title: 'Workshop recap: The 5 Pillars',
    subtitle: 'Everything you need to build intelligent, production-ready software with LLMs.',
    bullets: [
      'One API call = prompt in, text out',
      'Better prompts, better answers',
      'Structured outputs make answers usable by software',
      'Parameters, history and context shape every response',
    ],
  },
]

function Dots() { return <div className="flex gap-1.5" aria-hidden="true">{['blue','red','yellow','green'].map((c) => <i key={c} className={cn('size-2 rounded-full', `dot-${c}`)} />)}</div> }
function CodeBlock({ value, accent = 'blue', lang = 'python' }: { value: string; accent?: string; lang?: string }) { return <div className={cn('code-panel', `code-${accent}`)}><div className="flex items-center justify-between border-b border-white/10 px-4 py-2 text-[10px] uppercase tracking-[0.18em] text-white/50"><span>{lang}</span><Terminal className="size-3" /></div><pre className="overflow-auto p-4 text-[clamp(9px,1.05vw,14px)] leading-[1.55] text-slate-100"><code>{value}</code></pre></div> }
function SectionLabel({ part }: { part?: string }) { return part ? <div className="mb-3 flex items-center gap-3 text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground"><span className="accent-line" /> Part {part}</div> : null }
function Slide({ slide }: { slide: any }) {
  const common = <><SectionLabel part={slide.part} /><h1 className="slide-title">{slide.title}</h1>{slide.subtitle && <p className="slide-subtitle">{slide.subtitle}</p>}</>
  if (slide.type === 'title') return <div className="slide-shell title-slide"><div className="title-orb orb-blue" /><div className="title-orb orb-yellow" /><LOGO /><Dots /><div className="max-w-4xl"><div className="eyebrow">{slide.kicker}</div><h1 className="hero-title">{slide.title}</h1><p className="hero-subtitle">{slide.subtitle}</p><div className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-muted-foreground"><span>{slide.presenter}</span><span className="text-border">/</span><span>{slide.body}</span></div></div><div className="bracket">&lt; / &gt;</div></div>
  if (slide.type === 'divider') return <div className={cn('slide-shell divider-slide', `part-${slide.part}`)}><Dots /><div className="divider-number">{slide.part}</div><div><div className="eyebrow">GDSC ENETCOM · SOFTWARE ENGINEERING</div><h1 className="slide-title">{slide.title}</h1><p className="slide-subtitle">{slide.subtitle}</p></div><div className="bracket">&lt; &gt;</div></div>
  if (slide.type === 'agenda') return <div className="slide-shell">{common}<div className="agenda-grid">{slide.items.map((item: string, i: number) => <div className="agenda-card" key={item}><span>0{i + 1}</span><strong>{item}</strong><ArrowRight className="size-5 text-muted-foreground" /></div>)}</div></div>
  if (slide.type === 'llm') return <div className="slide-shell">{common}<div className="llm-grid"><div className="bullet-list">{slide.bullets.map((b: string) => <div key={b}><Check className="size-5 text-green" /><span>{b}</span></div>)}</div><NestedCircles /></div></div>
  if (slide.type === 'tokens') return <div className="slide-shell">{common}<div className="split-grid"><TokenVisual /><div className="note-stack">{slide.items.map((it: string[]) => <div key={it[0]}><strong>{it[0]}</strong><span>{it[1]}</span></div>)}<a className="try-link" href={slide.link} target="_blank" rel="noreferrer">Try it: paste a sentence into a tokenizer <ExternalLink className="size-3.5" /></a></div></div></div>
  if (slide.type === 'predict') return <div className="slide-shell">{common}<ProbabilityBars prompt={slide.prompt} options={slide.options} /><p className="callout">{slide.footer}</p></div>
  if (slide.type === 'loop') return <div className="slide-shell">{common}<div className="split-grid loop-grid"><GenerationLoop /><div className="note-stack">{slide.notes.map((n: string[]) => <div key={n[0]}><strong>{n[0]}</strong><span>{n[1]}</span></div>)}</div></div></div>
  if (slide.type === 'training') return <div className="slide-shell">{common}<div className="training-grid"><BackpropVisual /><div className="note-stack">{slide.concepts.map((c: string[]) => <div key={c[0]}><strong>{c[0]}</strong><span>{c[1]}</span></div>)}</div></div><div className="stage-strip">{slide.stages.map((s: string[], i: number) => <div className="stage-card" key={s[0]}><span>0{i + 1}</span><strong>{s[0]}</strong><small>{s[1]}</small></div>)}</div></div>
  if (slide.type === 'params') return <div className="slide-shell">{common}<div className="param-grid">{slide.items.map((p: string[]) => <div className="param-card" key={p[0]}><code>{p[0]}</code><span>{p[1]}</span></div>)}<div className="param-card param-demo"><code>Demo</code><span>Same prompt, 3 outputs:</span><div className="demo-chips">{slide.demo.map((d: string) => <i key={d}>{d}</i>)}</div></div></div><p className="callout">{slide.footer}</p></div>
  if (slide.type === 'hallucinations') return <div className="slide-shell">{common}<div className="hallu-grid"><div className="hallu-card"><span className="hallu-tag">WHY</span><p>{slide.why}</p></div><div className="hallu-card hallu-example"><span className="hallu-tag"><AlertTriangle className="size-3.5" /> REAL EXAMPLE</span><div className="chat-bubble">Cite cases that support my claim.</div><div className="chat-bubble chat-ai">See <em>Varghese v. China Southern Airlines</em>, 925 F.3d 1339 (11th Cir. 2019).</div><small><b>That case does not exist.</b> Mata v. Avianca (2023): lawyers were sanctioned for filing ChatGPT-invented citations.</small></div><div className="hallu-card hallu-fix"><span className="hallu-tag"><ShieldCheck className="size-3.5" /> MITIGATION</span>{slide.mitigation.map((m: string) => <p className="fix-item" key={m}><Check className="size-4" />{m}</p>)}</div></div></div>
  if (slide.type === 'final') return <div className="slide-shell">{common}<div className="final-grid"><div className="takeaway-list compact">{slide.items.map((x: string, i: number) => <div key={x}><span>0{i + 1}</span><strong>{x}</strong></div>)}</div><div><div className="lc-title">Local vs cloud LLMs</div><CompareLocalCloud rows={slide.rows} /></div></div><p className="callout">{slide.footer}</p></div>
  if (slide.type === 'prompt-what') return (
    <div className="slide-shell">
      {common}
      <div className="prompt-bullets-bar">
        {slide.bullets.map((b: string) => (
          <div key={b} className="p-chip">
            <Check className="size-3.5 text-green shrink-0" />
            <span>{b}</span>
          </div>
        ))}
      </div>
      <PromptProbDemo />
      {slide.footer && <p className="callout">{slide.footer}</p>}
    </div>
  )
  if (slide.type === 'prompt-roles') return (
    <div className="slide-shell">
      {common}
      <div className="prompt-bullets-bar">
        {slide.bullets.map((b: string) => (
          <div key={b} className="p-chip">
            <span className="p-dot" />
            <span>{b}</span>
          </div>
        ))}
      </div>
      <RolesChatDemo />
    </div>
  )
  if (slide.type === 'prompt-anatomy') return (
    <div className="slide-shell">
      {common}
      <div className="prompt-bullets-bar">
        {slide.bullets.map((b: string) => (
          <div key={b} className="p-chip p-chip-highlight">
            <Sparkles className="size-3.5 text-blue shrink-0" />
            <strong>{b}</strong>
          </div>
        ))}
      </div>
      <AnatomyPromptDemo />
      {slide.footer && <p className="callout">{slide.footer}</p>}
    </div>
  )
  if (slide.type === 'prompt-zero-shot') return (
    <div className="slide-shell">
      {common}
      <div className="prompt-bullets-bar">
        {slide.bullets.map((b: string) => (
          <div key={b} className="p-chip">
            <span className="p-dot" />
            <span>{b}</span>
          </div>
        ))}
      </div>
      <ZeroShotDemo />
      {slide.footer && <p className="callout">{slide.footer}</p>}
    </div>
  )
  if (slide.type === 'prompt-few-shot') return (
    <div className="slide-shell">
      {common}
      <div className="prompt-bullets-bar">
        {slide.bullets.map((b: string) => (
          <div key={b} className="p-chip">
            <span className="p-dot" />
            <span>{b}</span>
          </div>
        ))}
      </div>
      <FewShotDemo />
      {slide.footer && <p className="callout">{slide.footer}</p>}
    </div>
  )
  if (slide.type === 'prompt-cot') return (
    <div className="slide-shell">
      {common}
      <div className="prompt-bullets-bar">
        {slide.bullets.map((b: string) => (
          <div key={b} className="p-chip">
            <span className="p-dot" />
            <span>{b}</span>
          </div>
        ))}
      </div>
      <ChainOfThoughtDemo />
      {slide.footer && <p className="callout">{slide.footer}</p>}
    </div>
  )
  if (slide.type === 'prompt-delimiters') return (
    <div className="slide-shell">
      {common}
      <div className="prompt-bullets-bar">
        {slide.bullets.map((b: string) => (
          <div key={b} className="p-chip">
            <span className="p-dot" />
            <span>{b}</span>
          </div>
        ))}
      </div>
      <DelimitersDemo />
      {slide.footer && <p className="callout">{slide.footer}</p>}
    </div>
  )
  if (slide.type === 'prompt-takeaways') return (
    <div className="slide-shell">
      {common}
      <div className="prompt-bullets-bar">
        {slide.bullets.slice(0, 4).map((b: string) => (
          <div key={b} className="p-chip">
            <span className="p-dot" />
            <span>{b}</span>
          </div>
        ))}
      </div>
      <PromptTakeawaysDemo />
    </div>
  )
  if (slide.type === 'struct-breaks') return (
    <div className="slide-shell">
      {common}
      <div className="prompt-bullets-bar">
        {slide.bullets.map((b: string) => (
          <div key={b} className="p-chip">
            <span className="p-dot" />
            <span>{b}</span>
          </div>
        ))}
      </div>
      <RawTextBreaksDemo />
      {slide.footer && <p className="callout">{slide.footer}</p>}
    </div>
  )
  if (slide.type === 'struct-what') return (
    <div className="slide-shell">
      {common}
      <div className="prompt-bullets-bar">
        {slide.bullets.map((b: string) => (
          <div key={b} className="p-chip">
            <span className="p-dot" />
            <span>{b}</span>
          </div>
        ))}
      </div>
      <StructuredConceptDemo />
      {slide.footer && <p className="callout">{slide.footer}</p>}
    </div>
  )
  if (slide.type === 'struct-schema') return (
    <div className="slide-shell">
      {common}
      <div className="prompt-bullets-bar">
        {slide.bullets.map((b: string) => (
          <div key={b} className="p-chip">
            <span className="p-dot" />
            <span>{b}</span>
          </div>
        ))}
      </div>
      <JsonSchemaDemo />
      {slide.footer && <p className="callout">{slide.footer}</p>}
    </div>
  )
  if (slide.type === 'struct-pydantic') return (
    <div className="slide-shell">
      {common}
      <div className="prompt-bullets-bar">
        {slide.bullets.map((b: string) => (
          <div key={b} className="p-chip p-chip-highlight">
            <Sparkles className="size-3.5 text-blue shrink-0" />
            <strong>{b}</strong>
          </div>
        ))}
      </div>
      <PydanticDemo />
      {slide.footer && <p className="callout">{slide.footer}</p>}
    </div>
  )
  if (slide.type === 'struct-validation') return (
    <div className="slide-shell">
      {common}
      <div className="prompt-bullets-bar">
        {slide.bullets.map((b: string) => (
          <div key={b} className="p-chip">
            <span className="p-dot" />
            <span>{b}</span>
          </div>
        ))}
      </div>
      <ValidationFlowDemo />
      {slide.footer && <p className="callout">{slide.footer}</p>}
    </div>
  )
  if (slide.type === 'struct-levels') return (
    <div className="slide-shell">
      {common}
      <div className="prompt-bullets-bar">
        {slide.bullets.map((b: string) => (
          <div key={b} className="p-chip">
            <span className="p-dot" />
            <span>{b}</span>
          </div>
        ))}
      </div>
      <StructuredLevelsDemo />
      {slide.footer && <p className="callout">{slide.footer}</p>}
    </div>
  )
  if (slide.type === 'struct-takeaways') return (
    <div className="slide-shell">
      {common}
      <div className="prompt-bullets-bar">
        {slide.bullets.slice(0, 4).map((b: string) => (
          <div key={b} className="p-chip">
            <span className="p-dot" />
            <span>{b}</span>
          </div>
        ))}
      </div>
      <StructuredTakeawaysDemo />
    </div>
  )
  if (slide.type === 'quality-good') return (
    <div className="slide-shell">
      {common}
      <div className="prompt-bullets-bar">
        {slide.bullets.map((b: string) => (
          <div key={b} className="p-chip">
            <span className="p-dot" />
            <span>{b}</span>
          </div>
        ))}
      </div>
      <AnswerQualityFlowDemo />
      {slide.footer && <p className="callout">{slide.footer}</p>}
    </div>
  )
  if (slide.type === 'quality-finetuning') return (
    <div className="slide-shell">
      {common}
      <div className="prompt-bullets-bar">
        {slide.bullets.map((b: string) => (
          <div key={b} className="p-chip">
            <span className="p-dot" />
            <span>{b}</span>
          </div>
        ))}
      </div>
      <FinetuningVsPromptingDemo />
      {slide.footer && <p className="callout">{slide.footer}</p>}
    </div>
  )
  if (slide.type === 'quality-context') return (
    <div className="slide-shell">
      {common}
      <div className="prompt-bullets-bar">
        {slide.bullets.map((b: string) => (
          <div key={b} className="p-chip">
            <span className="p-dot" />
            <span>{b}</span>
          </div>
        ))}
      </div>
      <ContextWindowDemo />
      {slide.footer && <p className="callout">{slide.footer}</p>}
    </div>
  )
  if (slide.type === 'quality-eval') return (
    <div className="slide-shell">
      {common}
      <div className="prompt-bullets-bar">
        {slide.bullets.map((b: string) => (
          <div key={b} className="p-chip">
            <span className="p-dot" />
            <span>{b}</span>
          </div>
        ))}
      </div>
      <EvaluationMatrixDemo />
      {slide.footer && <p className="callout">{slide.footer}</p>}
    </div>
  )
  if (slide.type === 'quality-limits') return (
    <div className="slide-shell">
      {common}
      <div className="prompt-bullets-bar">
        {slide.bullets.map((b: string) => (
          <div key={b} className="p-chip">
            <span className="p-dot" />
            <span>{b}</span>
          </div>
        ))}
      </div>
      <ModelLimitsDemo />
      {slide.footer && <p className="callout">{slide.footer}</p>}
    </div>
  )
  if (slide.type === 'quality-hallucinations') return (
    <div className="slide-shell">
      {common}
      <div className="prompt-bullets-bar">
        {slide.bullets.map((b: string) => (
          <div key={b} className="p-chip">
            <span className="p-dot" />
            <span>{b}</span>
          </div>
        ))}
      </div>
      <HallucinationMitigationDemo />
      {slide.footer && <p className="callout">{slide.footer}</p>}
    </div>
  )
  if (slide.type === 'quality-good-weak') return (
    <div className="slide-shell">
      {common}
      <div className="prompt-bullets-bar">
        {slide.bullets.map((b: string) => (
          <div key={b} className="p-chip">
            <span className="p-dot" />
            <span>{b}</span>
          </div>
        ))}
      </div>
      <GoodVsWeakCasesDemo />
      {slide.footer && <p className="callout">{slide.footer}</p>}
    </div>
  )
  if (slide.type === 'quality-takeaways') return (
    <div className="slide-shell">
      {common}
      <div className="prompt-bullets-bar">
        {slide.bullets.slice(0, 4).map((b: string) => (
          <div key={b} className="p-chip">
            <span className="p-dot" />
            <span>{b}</span>
          </div>
        ))}
      </div>
      <QualityTakeawaysDemo />
    </div>
  )
  if (slide.type === 'demo-first-call') return (
    <div className="slide-shell">
      {common}
      <div className="prompt-bullets-bar">
        {slide.bullets.map((b: string) => (
          <div key={b} className="p-chip">
            <span className="p-dot" />
            <span>{b}</span>
          </div>
        ))}
      </div>
      <FirstCallDemo />
      {slide.footer && <p className="callout">{slide.footer}</p>}
    </div>
  )
  if (slide.type === 'demo-prompt-craft') return (
    <div className="slide-shell">
      {common}
      <div className="prompt-bullets-bar">
        {slide.bullets.map((b: string) => (
          <div key={b} className="p-chip">
            <span className="p-dot" />
            <span>{b}</span>
          </div>
        ))}
      </div>
      <PromptEngineeringDemo />
      {slide.footer && <p className="callout">{slide.footer}</p>}
    </div>
  )
  if (slide.type === 'demo-structured') return (
    <div className="slide-shell">
      {common}
      <div className="prompt-bullets-bar">
        {slide.bullets.map((b: string) => (
          <div key={b} className="p-chip">
            <span className="p-dot" />
            <span>{b}</span>
          </div>
        ))}
      </div>
      <StructuredLevelsCodeDemo />
      {slide.footer && <p className="callout">{slide.footer}</p>}
    </div>
  )
  if (slide.type === 'demo-params') return (
    <div className="slide-shell">
      {common}
      <div className="prompt-bullets-bar">
        {slide.bullets.map((b: string) => (
          <div key={b} className="p-chip">
            <span className="p-dot" />
            <span>{b}</span>
          </div>
        ))}
      </div>
      <GenerationParamsDemo />
      {slide.footer && <p className="callout">{slide.footer}</p>}
    </div>
  )
  if (slide.type === 'demo-bonus') return (
    <div className="slide-shell">
      {common}
      <div className="prompt-bullets-bar">
        {slide.bullets.map((b: string) => (
          <div key={b} className="p-chip">
            <span className="p-dot" />
            <span>{b}</span>
          </div>
        ))}
      </div>
      <BonusDemos />
      {slide.footer && <p className="callout">{slide.footer}</p>}
    </div>
  )
  if (slide.type === 'demo-recap') return (
    <div className="slide-shell">
      {common}
      <div className="prompt-bullets-bar">
        {slide.bullets.map((b: string) => (
          <div key={b} className="p-chip">
            <span className="p-dot" />
            <span>{b}</span>
          </div>
        ))}
      </div>
      <FinalRecapDemo />
    </div>
  )
  if (slide.type === 'content') return <div className="slide-shell">{common}<div className="content-grid"><div className="big-icon"><Code2 /></div><div className="bullet-list">{slide.bullets.map((b: string) => <div key={b}><Check className="size-5 text-green" /><span>{b}</span></div>)}</div></div></div>
  if (slide.type === 'live') return <div className="slide-shell live-slide">{common}<div className="laptop"><div className="laptop-screen"><Terminal className="size-10 text-blue" /><span>{slide.file}</span></div><div className="laptop-base" /></div><div className="chip-row">{slide.chips.map((c: string) => <span key={c}>{c}</span>)}</div></div>
  if (slide.type === 'code') return <div className="slide-shell">{common}<div className="code-layout"><CodeBlock value={slide.code} accent={slide.accent} lang={slide.lang} /><div className="code-note"><div className="note-marker" /><span>{slide.note}</span></div></div></div>
  if (slide.type === 'table') return <div className="slide-shell">{common}<div className="compare-table"><div className="table-head">{slide.head.map((h: string) => <span key={h}>{h}</span>)}</div>{slide.rows.map((r: string[]) => <div className="table-row" key={r[0]}><strong>{r[0]}</strong><span>{r[1]}</span><span>{r[2]}</span></div>)}</div></div>
  if (slide.type === 'steps') return <div className="slide-shell">{common}<div className="step-grid">{slide.steps.map((s: string, i: number) => <div className="step-item" key={s}><span>{String(i + 1).padStart(2, '0')}</span><strong>{s}</strong></div>)}</div></div>
  if (slide.type === 'pitfalls' || slide.type === 'challenge') return <div className="slide-shell">{common}<div className="pitfall-grid">{slide.items.map((x: string, i: number) => <div className="pitfall" key={x}><span>0{i + 1}</span><strong>{x}</strong></div>)}</div></div>
  if (slide.type === 'takeaways') return <div className="slide-shell takeaways">{common}<div className="takeaway-list">{slide.items.map((x: string, i: number) => <div key={x}><span>0{i + 1}</span><strong>{x}</strong></div>)}</div></div>
  return <div className="slide-shell closing"><LOGO /><Dots /><div><div className="bracket">&lt; / &gt;</div><h1 className="hero-title">{slide.title}</h1><p className="hero-subtitle">{slide.subtitle}</p><p className="mt-8 text-sm text-muted-foreground">{slide.body}</p></div><div className="contact-placeholder">contact / socials</div></div>
}

export default function Page() {
  const [current, setCurrent] = useState(0)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const { theme, setTheme } = useTheme()
  const slide = slides[current]
  const go = useCallback((delta: number) => setCurrent((i) => Math.min(slides.length - 1, Math.max(0, i + delta))), [])
  useEffect(() => { const onKey = (e: KeyboardEvent) => { if (e.key === 'ArrowRight' || e.key === ' ') { e.preventDefault(); go(1) } else if (e.key === 'ArrowLeft') { e.preventDefault(); go(-1) } else if (e.key.toLowerCase() === 't') setTheme(theme === 'dark' ? 'light' : 'dark'); else if (e.key.toLowerCase() === 'f') document.documentElement.requestFullscreen?.() }; window.addEventListener('keydown', onKey); return () => window.removeEventListener('keydown', onKey) }, [go, theme, setTheme])
  const progress = useMemo(() => ((current + 1) / slides.length) * 100, [current])
  return <main className={cn('deck-app', isFullscreen && 'is-fullscreen')} onDoubleClick={() => setIsFullscreen((x) => !x)}><div className="progress"><span style={{ width: `${progress}%` }} /></div><div className="topbar"><span className="deck-mark">AI / LLM <span>SESSION 04</span></span><div className="top-actions"><button className="icon-button" aria-label="Toggle theme" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>{theme === 'dark' ? <Sun /> : <Moon />}</button><button className="icon-button" aria-label="Fullscreen" onClick={() => document.documentElement.requestFullscreen?.()}><Maximize2 /></button></div></div><div className="stage"><AnimatePresence mode="wait"><motion.div key={current} className="slide-frame" initial={{ opacity: 0, x: 18 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -18 }} transition={{ duration: 0.24, ease: 'easeOut' }}><Slide slide={slide} /></motion.div></AnimatePresence></div><button className="nav-button nav-left" aria-label="Previous slide" onClick={() => go(-1)} disabled={current === 0}><ArrowLeft /></button><button className="nav-button nav-right" aria-label="Next slide" onClick={() => go(1)} disabled={current === slides.length - 1}><ArrowRight /></button><div className="bottombar"><span>GDSC Enetcom</span><div className="counter">{String(current + 1).padStart(2, '0')} <i>/</i> {String(slides.length).padStart(2, '0')}</div></div></main>
}
