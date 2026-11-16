'use client'

import { motion } from 'framer-motion'
import {
  AlertTriangle,
  ArrowDown,
  ArrowRight,
  BookOpen,
  Brain,
  Check,
  Clock,
  Cpu,
  Database,
  FileText,
  HelpCircle,
  Layers,
  Lock,
  RefreshCw,
  Scale,
  Scissors,
  Search,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Target,
  Terminal,
  ThumbsDown,
  ThumbsUp,
  X,
  Zap,
} from 'lucide-react'
import { cn } from '@/lib/utils'

// ==========================================
// SLIDE 4.1: What makes an answer "good"?
// ==========================================
export function AnswerQualityFlowDemo() {
  return (
    <div className="quality-flow-wrapper">
      <div className="quality-pipeline">
        {/* Part 2: Input */}
        <div className="q-pipe-card">
          <span className="q-pipe-part">PART 2</span>
          <strong>INPUT (PROMPT)</strong>
          <small>Instructions, context, constraints, delimiters</small>
        </div>

        <ArrowRight className="size-5 text-muted-foreground shrink-0" />

        {/* Part 4 Focus: The Model */}
        <div className="q-pipe-card q-pipe-center glow-model">
          <div className="glow-badge">
            <Sparkles className="size-3.5" />
            PART 4 FOCUS
          </div>
          <div className="center-title">
            <Cpu className="size-5 text-blue" />
            <strong>THE MODEL ITSELF</strong>
            <HelpCircle className="size-4 text-yellow" />
          </div>
          <small>Knowledge bounds, training weights, architecture & limits</small>
        </div>

        <ArrowRight className="size-5 text-muted-foreground shrink-0" />

        {/* Part 3: Output */}
        <div className="q-pipe-card">
          <span className="q-pipe-part text-green">PART 3</span>
          <strong>OUTPUT (STRUCTURE)</strong>
          <small>JSON Schema, Pydantic types, validations</small>
        </div>
      </div>

      <div className="q-dimensions-grid">
        <div className="q-dim-card">
          <span className="q-dim-tag text-blue">01 · ARCHITECTURE & WEIGHTS</span>
          <p>Prompting changes the request; fine-tuning changes the brain.</p>
        </div>
        <div className="q-dim-card">
          <span className="q-dim-tag text-yellow">02 · CONTEXT RETRIEVAL</span>
          <p>Feeding trusted facts dynamically into the active context window.</p>
        </div>
        <div className="q-dim-card">
          <span className="q-dim-tag text-green">03 · SYSTEMATIC EVALS</span>
          <p>Measuring quality with quantitative test sets instead of guessing.</p>
        </div>
        <div className="q-dim-card">
          <span className="q-dim-tag text-red">04 · BOUNDARIES & RISKS</span>
          <p>Taming hallucinations and respecting cutoff dates & privacy limits.</p>
        </div>
      </div>
    </div>
  )
}

// ==========================================
// SLIDE 4.2: Fine-tuning vs prompting
// ==========================================
export function FinetuningVsPromptingDemo() {
  return (
    <div className="ft-vs-prompt-wrapper">
      <div className="ft-compare-grid">
        {/* Left: Prompting */}
        <div className="ft-col col-prompt">
          <div className="ft-head">
            <span className="ft-badge badge-blue">PROMPTING</span>
            <small>Input-level conditioning</small>
          </div>
          <div className="ft-flow-mini">
            <div className="flow-step">
              <FileText className="size-3.5" />
              <span>Prompt Text</span>
            </div>
            <ArrowRight className="size-3.5 text-muted-foreground" />
            <div className="flow-step step-model">
              <Lock className="size-3 text-blue" />
              <span>Frozen Model</span>
            </div>
            <ArrowRight className="size-3.5 text-muted-foreground" />
            <div className="flow-step step-out">Answer</div>
          </div>
          <div className="ft-tags-list">
            <span className="tag-pill tag-green"><Zap className="size-3" /> Fast (seconds to iterate)</span>
            <span className="tag-pill tag-green"><Check className="size-3" /> Cheap (no training GPU)</span>
            <span className="tag-pill tag-green"><RefreshCw className="size-3" /> Trivial to update</span>
          </div>
        </div>

        {/* Right: Fine-tuning */}
        <div className="ft-col col-ft">
          <div className="ft-head">
            <span className="ft-badge badge-purple">FINE-TUNING</span>
            <small>Weight-level modification</small>
          </div>
          <div className="ft-flow-mini">
            <div className="flow-step">
              <Layers className="size-3.5" />
              <span>1k+ Examples</span>
            </div>
            <ArrowRight className="size-3.5 text-muted-foreground" />
            <div className="flow-step step-model-ft">
              <Sparkles className="size-3 text-yellow animate-pulse" />
              <span>Weights Updated</span>
            </div>
            <ArrowRight className="size-3.5 text-muted-foreground" />
            <div className="flow-step step-out">New Model</div>
          </div>
          <div className="ft-tags-list">
            <span className="tag-pill tag-warn"><Clock className="size-3" /> Slower (hours / days)</span>
            <span className="tag-pill tag-warn"><Scale className="size-3" /> High cost (GPU compute)</span>
            <span className="tag-pill tag-warn"><Database className="size-3" /> Needs curated dataset</span>
          </div>
        </div>
      </div>

      {/* Decision Strip */}
      <div className="ft-decision-strip">
        <span className="decision-tag">DECISION RULE:</span>
        <p>
          Need a <strong>consistent company tone, unique syntax, or high-volume latency reduction</strong> at scale? → <strong>Fine-tune</strong>. Everything else? → <strong>Prompt engineering</strong>.
        </p>
      </div>
    </div>
  )
}

// ==========================================
// SLIDE 4.3: The context window
// ==========================================
export function ContextWindowDemo() {
  return (
    <div className="context-window-wrapper">
      {/* Visual 1: Normal Budget */}
      <div className="ctx-card">
        <div className="ctx-head">
          <span className="ctx-tag text-green"><Check className="size-3.5" /> FITS WITHIN BUDGET</span>
          <small>Everything in active memory is seen by the attention mechanism</small>
        </div>
        <div className="ctx-bar-track">
          <div className="ctx-block block-sys" style={{ width: '18%' }}>
            <span>System Prompt</span>
          </div>
          <div className="ctx-block block-hist" style={{ width: '42%' }}>
            <span>Chat History</span>
          </div>
          <div className="ctx-block block-user" style={{ width: '22%' }}>
            <span>New Question</span>
          </div>
          <div className="ctx-block block-out" style={{ width: '18%' }}>
            <span>Model Output Space</span>
          </div>
        </div>
      </div>

      {/* Visual 2: Overflow / Truncation */}
      <div className="ctx-card card-overflow">
        <div className="ctx-head">
          <span className="ctx-tag text-red"><AlertTriangle className="size-3.5" /> OVERFLOW / TRUNCATION</span>
          <small>Context limit exceeded: oldest tokens get pushed out or ignored</small>
        </div>
        <div className="ctx-bar-track">
          <div className="ctx-block block-cutoff" style={{ width: '22%' }}>
            <Scissors className="size-3.5 text-red" />
            <span>Cut off / Ignored</span>
          </div>
          <div className="ctx-block block-hist" style={{ width: '38%' }}>
            <span>Recent History</span>
          </div>
          <div className="ctx-block block-user" style={{ width: '22%' }}>
            <span>New Question</span>
          </div>
          <div className="ctx-block block-out" style={{ width: '18%' }}>
            <span>Model Output Space</span>
          </div>
        </div>
      </div>

      {/* Teaser Callout */}
      <div className="ctx-teaser-callout">
        <Sparkles className="size-4 text-blue shrink-0" />
        <p>
          <strong>Idea for later:</strong> If the model can accurately use <em>whatever is inside its context</em>, what if our backend automatically injects the exact right company documents right before answering?
        </p>
      </div>
    </div>
  )
}

// ==========================================
// SLIDE 4.4: Evaluating answers
// ==========================================
export function EvaluationMatrixDemo() {
  const tests = [
    { q: 'Extract customer name & age', v1: false, v2: true, v3: true },
    { q: 'Return strict JSON format', v1: false, v2: false, v3: true },
    { q: 'Handle missing data gracefully', v1: false, v2: true, v3: true },
    { q: 'Correct professional tone', v1: true, v2: true, v3: true },
    { q: 'Reject out-of-bounds questions', v1: true, v2: false, v3: true },
  ]

  return (
    <div className="eval-demo-wrapper">
      <div className="eval-grid">
        {/* Table of test evaluations */}
        <div className="eval-table-card">
          <div className="eval-card-head">
            <span className="eval-tag">TEST SUITE BENCHMARK</span>
            <small>5 standardized test queries with ground-truth answers</small>
          </div>
          <table className="eval-table">
            <thead>
              <tr>
                <th>Test Query</th>
                <th>Prompt v1</th>
                <th>Prompt v2</th>
                <th>Prompt v3</th>
              </tr>
            </thead>
            <tbody>
              {tests.map((t, idx) => (
                <tr key={idx}>
                  <td>{t.q}</td>
                  <td className={cn(t.v1 ? 'cell-pass' : 'cell-fail')}>
                    {t.v1 ? <Check className="size-3.5" /> : <X className="size-3.5" />}
                  </td>
                  <td className={cn(t.v2 ? 'cell-pass' : 'cell-fail')}>
                    {t.v2 ? <Check className="size-3.5" /> : <X className="size-3.5" />}
                  </td>
                  <td className={cn(t.v3 ? 'cell-pass' : 'cell-fail')}>
                    {t.v3 ? <Check className="size-3.5" /> : <X className="size-3.5" />}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Bar chart scores */}
        <div className="eval-scores-card">
          <div className="eval-card-head">
            <span className="eval-tag">SCORE PER VERSION</span>
            <small>Accuracy %</small>
          </div>

          <div className="eval-bars-list">
            <div className="eval-score-row">
              <div className="v-label"><span>v1 (Initial)</span> <b>2/5 (40%)</b></div>
              <div className="eval-track"><div className="eval-fill fill-red" style={{ width: '40%' }} /></div>
            </div>
            <div className="eval-score-row">
              <div className="v-label"><span>v2 (+Few-shot)</span> <b>3/5 (60%)</b></div>
              <div className="eval-track"><div className="eval-fill fill-yellow" style={{ width: '60%' }} /></div>
            </div>
            <div className="eval-score-row">
              <div className="v-label"><span>v3 (+CoT & Schema)</span> <b>5/5 (100%)</b></div>
              <div className="eval-track"><div className="eval-fill fill-green" style={{ width: '100%' }} /></div>
            </div>
          </div>

          <div className="eval-footer-quote">
            &quot;Measure, don&apos;t guess: compare prompt versions against fixed test suites.&quot;
          </div>
        </div>
      </div>
    </div>
  )
}

// ==========================================
// SLIDE 4.5: Model limits
// ==========================================
export function ModelLimitsDemo() {
  return (
    <div className="limits-demo-wrapper">
      {/* Timeline with Cutoff */}
      <div className="limits-timeline-card">
        <div className="limits-head">
          <span className="limits-tag">THE KNOWLEDGE CUTOFF BOUNDARY</span>
          <small>Pretrained weights only know what existed up to training time</small>
        </div>

        <div className="timeline-track">
          <div className="time-section section-past">
            <BookOpen className="size-4 text-blue" />
            <span>Pretraining Data (Web, Books, Code)</span>
          </div>

          <div className="cutoff-divider">
            <div className="cutoff-line" />
            <span className="cutoff-label">KNOWLEDGE CUTOFF</span>
          </div>

          <div className="time-section section-future">
            <HelpCircle className="size-4 text-muted-foreground" />
            <span>Today (The Unknown Future)</span>
            <div className="cutoff-bubble">
              &quot;Who won yesterday&apos;s match?&quot; → <em>Hallucinates or refuses</em>
            </div>
          </div>
        </div>
      </div>

      {/* Private files & limits row */}
      <div className="limits-cards-row">
        <div className="lim-box lim-private">
          <div className="lim-box-head">
            <Lock className="size-4 text-red" />
            <strong>Zero Private Data Access</strong>
          </div>
          <p>The model knows Wikipedia, but knows 0% about your company database, private PDFs, or internal APIs.</p>
        </div>

        <div className="lim-box lim-bias">
          <div className="lim-box-head">
            <Scale className="size-4 text-yellow" />
            <strong>Training Bias & Cutoffs</strong>
          </div>
          <p>Models mirror biases in web text and reflect outdated facts from the pretraining era.</p>
        </div>

        <div className="lim-box lim-cost">
          <div className="lim-box-head">
            <Clock className="size-4 text-blue" />
            <strong>Cost & Latency Growth</strong>
          </div>
          <p>Longer context and larger reasoning models increase token bills and generation latency.</p>
        </div>
      </div>
    </div>
  )
}

// ==========================================
// SLIDE 4.6: Reducing and fixing hallucinations
// ==========================================
export function HallucinationMitigationDemo() {
  return (
    <div className="hallu-mit-wrapper">
      <div className="hallu-mit-grid">
        {/* DEMO 1: Prevent Before Generation */}
        <div className="mit-panel panel-prevent">
          <div className="mit-head">
            <span className="mit-tag text-green">1. PREVENT (ALLOW REFUSAL)</span>
            <small>Query: &quot;Who wrote &apos;Neural Gardens of Mars&apos; (2019)?&quot;</small>
          </div>

          <div className="chat-pair-compare">
            <div className="chat-sub sub-bad">
              <span className="sub-tag text-red">NO GUARDRAIL</span>
              <p>&quot;The paper was authored by Dr. Marcus Sterling and Dr. Elena Vance in 2019.&quot;</p>
              <small className="text-red">❌ Invented fictitious authors (Hallucination)</small>
            </div>
            <div className="chat-sub sub-good">
              <span className="sub-tag text-green">GUARDRAIL: &quot;IF UNSURE, SAY I DON&apos;T KNOW&quot;</span>
              <p>&quot;I don&apos;t know. That paper does not appear in verified scientific archives.&quot;</p>
              <small className="text-green">✅ Honest refusal</small>
            </div>
          </div>
        </div>

        {/* DEMO 2: Catch and Fix Loop */}
        <div className="mit-panel panel-fix">
          <div className="mit-head">
            <span className="mit-tag text-blue">2. CATCH & FIX (GROUNDED LOOP)</span>
            <small>Verify against ground-truth source</small>
          </div>

          <div className="fix-flow-loop">
            <div className="f-step">Answer generated</div>
            <ArrowRight className="size-3.5 text-muted-foreground" />
            <div className="f-step f-step-check">Verify vs Source</div>
            <div className="f-branches-vert">
              <div className="fb-item fb-match">
                <Check className="size-3.5 text-green" />
                <span>Match → Safe to use</span>
              </div>
              <div className="fb-item fb-mismatch">
                <RefreshCw className="size-3.5 text-yellow" />
                <span>Mismatch → Re-prompt with verified context</span>
              </div>
            </div>
          </div>
          <div className="fix-note">
            💡 <strong>Key link:</strong> Putting facts in the context window fixes what the weights don&apos;t know.
          </div>
        </div>
      </div>

      {/* Risk Strip */}
      <div className="risk-strip">
        <span className="risk-title">STAKES DECIDE VERIFICATION:</span>
        <div className="risk-item">
          <strong>Low Stakes</strong> (brainstorming, summaries) → <em>Light spot-checking</em>
        </div>
        <div className="risk-item item-high">
          <strong>High Stakes</strong> (medical, financial, legal) → <em>100% Deterministic verification</em>
        </div>
      </div>
    </div>
  )
}

// ==========================================
// SLIDE 4.7: What LLMs are good at, and what they are not
// ==========================================
export function GoodVsWeakCasesDemo() {
  const goodCases = [
    { title: 'Writing & Drafting', desc: 'Emails, docs, creative prose' },
    { title: 'Summarization', desc: 'Condensing long articles & logs' },
    { title: 'Code Refactoring', desc: 'Explaining code & finding bugs' },
    { title: 'Extraction & Tagging', desc: 'Parsing entities into JSON' },
  ]

  const weakCases = [
    { title: 'Exact Arithmetic', desc: 'Multi-digit multiplication, math logic' },
    { title: 'Live Events', desc: 'Facts after cutoff date' },
    { title: 'Deterministic Rules', desc: 'Strict protocols needing 100% zero variance' },
    { title: 'High-Stakes Truth', desc: 'Medical diagnoses, legal citations' },
  ]

  return (
    <div className="good-weak-wrapper">
      <div className="good-weak-grid">
        {/* Good at */}
        <div className="gw-col col-good">
          <div className="gw-head text-green">
            <ThumbsUp className="size-4" />
            <strong>WHAT LLMs EXCEL AT</strong>
          </div>
          <div className="gw-list">
            {goodCases.map((c) => (
              <div className="gw-card card-good" key={c.title}>
                <Check className="size-3.5 text-green shrink-0" />
                <div>
                  <strong>{c.title}</strong>
                  <p>{c.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Weak at */}
        <div className="gw-col col-weak">
          <div className="gw-head text-red">
            <ThumbsDown className="size-4" />
            <strong>WHERE TO BE CAREFUL</strong>
          </div>
          <div className="gw-list">
            {weakCases.map((c) => (
              <div className="gw-card card-weak" key={c.title}>
                <X className="size-3.5 text-red shrink-0" />
                <div>
                  <strong>{c.title}</strong>
                  <p>{c.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="gw-rule-banner">
        <Sparkles className="size-4 text-blue shrink-0" />
        <span><strong>Golden Rule:</strong> Treat an LLM as an incredibly fast, creative junior intern—always verify what matters.</span>
      </div>
    </div>
  )
}

// ==========================================
// SLIDE 4.8: Takeaways
// ==========================================
export function QualityTakeawaysDemo() {
  const points = [
    { num: '01', title: 'Holistic Quality', desc: 'Model + Prompt + Context + Structure all decide answer quality.', icon: Cpu, color: 'blue' },
    { num: '02', title: 'Prompt Before Fine-Tuning', desc: 'Fine-tune only when prompt iteration reaches a ceiling.', icon: Sparkles, color: 'green' },
    { num: '03', title: 'Measure, Don’t Guess', desc: 'Run standardized test sets with clear accuracy scoring.', icon: Target, color: 'yellow' },
    { num: '04', title: 'Respect Boundaries', desc: 'Remember cutoffs, zero private access, and bias in training data.', icon: Lock, color: 'red' },
    { num: '05', title: 'Context Tames Hallucinations', desc: 'Ground with facts, allow "I don’t know", and verify high-stakes claims.', icon: ShieldCheck, color: 'blue' },
  ]

  return (
    <div className="q-takeaways-wrapper">
      <div className="q-takeaways-grid">
        {points.map((p) => {
          const Icon = p.icon
          return (
            <div className={cn('q-takeaway-card', `border-${p.color}`)} key={p.num}>
              <div className="qt-top">
                <span className={cn('qt-idx', `text-${p.color}`)}>{p.num}</span>
                <div className={cn('qt-icon', `icon-${p.color}`)}>
                  <Icon className="size-4" />
                </div>
              </div>
              <strong>{p.title}</strong>
              <p>{p.desc}</p>
            </div>
          )
        })}
      </div>

      <div className="session-complete-banner">
        <Sparkles className="size-4 text-green" />
        <span>You now possess the foundational pillars of modern AI engineering: <strong>Models, Prompts, Structured Contracts, and Quality Control</strong>.</span>
      </div>
    </div>
  )
}
