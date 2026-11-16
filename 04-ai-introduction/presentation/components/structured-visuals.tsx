'use client'

import { motion } from 'framer-motion'
import {
  AlertTriangle,
  ArrowDown,
  ArrowRight,
  Braces,
  Check,
  Code2,
  Cpu,
  Database,
  FileCode,
  FileJson,
  Layers,
  RefreshCw,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Terminal,
  X,
} from 'lucide-react'
import { cn } from '@/lib/utils'

// ==========================================
// SLIDE 3.1: Why raw text breaks software
// ==========================================
export function RawTextBreaksDemo() {
  return (
    <div className="raw-breaks-wrapper">
      <div className="raw-prompt-banner">
        <span className="p-chip-highlight">
          <Terminal className="size-3.5" />
          SAME PROMPT SENT 3 TIMES:
        </span>
        <code>&quot;Extract the name and age from: &apos;Sara is 29 years old.&apos;&quot;</code>
      </div>

      <div className="raw-replies-grid">
        <div className="reply-bubble-card">
          <div className="bubble-head">
            <span className="bubble-idx">Reply 1</span>
            <span className="bubble-status text-green"><Check className="size-3" /> Matches expected</span>
          </div>
          <div className="bubble-content text-foreground">
            &quot;Name: Sara, Age: 29&quot;
          </div>
        </div>

        <div className="reply-bubble-card card-warn">
          <div className="bubble-head">
            <span className="bubble-idx">Reply 2</span>
            <span className="bubble-status text-red"><X className="size-3" /> Conversational</span>
          </div>
          <div className="bubble-content">
            &quot;Sure! The person is Sara and she is 29.&quot;
          </div>
        </div>

        <div className="reply-bubble-card card-warn">
          <div className="bubble-head">
            <span className="bubble-idx">Reply 3</span>
            <span className="bubble-status text-red"><X className="size-3" /> Short syntax</span>
          </div>
          <div className="bubble-content">
            &quot;Sara (29)&quot;
          </div>
        </div>
      </div>

      {/* Code card showing Python crash */}
      <div className="raw-code-crash-card">
        <div className="crash-head">
          <span>PARSING CODE ATTEMPT</span>
          <code>python</code>
        </div>
        <div className="crash-code-line">
          <code>age = int(response.split(&quot;Age: &quot;)[1])</code>
        </div>
        <div className="crash-results-row">
          <div className="crash-res res-pass">
            <span>Reply 1:</span>
            <strong>age = 29</strong>
            <Check className="size-3.5 text-green" />
          </div>
          <div className="crash-res res-fail">
            <span>Reply 2:</span>
            <strong>IndexError: list index out of range</strong>
            <X className="size-3.5 text-red" />
          </div>
          <div className="crash-res res-fail">
            <span>Reply 3:</span>
            <strong>IndexError: list index out of range</strong>
            <X className="size-3.5 text-red" />
          </div>
        </div>
      </div>
    </div>
  )
}

// ==========================================
// SLIDE 3.2: What are structured outputs?
// ==========================================
export function StructuredConceptDemo() {
  return (
    <div className="struct-concept-wrapper">
      <div className="struct-compare-row">
        {/* Left: Unstructured Paragraph */}
        <div className="unstructured-card">
          <div className="card-badge-row">
            <span className="badge-bad">UNSTRUCTURED RAW TEXT</span>
            <small>Freeform human prose</small>
          </div>
          <div className="email-mockup">
            <p>
              &quot;Hello support team, I am <span className="hl-name">Sara</span>, I just turned{' '}
              <span className="hl-age">29</span> yesterday! I am writing to you from{' '}
              <span className="hl-city">Tunis</span> regarding my software engineering subscription renewal.&quot;
            </p>
          </div>
        </div>

        {/* Center: Arrow */}
        <div className="struct-arrow-col">
          <span className="struct-arrow-label">LLM Extraction</span>
          <ArrowRight className="size-6 text-blue" />
        </div>

        {/* Right: Clean Structured JSON */}
        <div className="structured-card">
          <div className="card-badge-row">
            <span className="badge-good">STRUCTURED JSON OUTPUT</span>
            <small>Deterministic machine contract</small>
          </div>
          <div className="json-code-box">
            <pre>
{`{
  "`}<span className="hl-name">name</span>{`": "`}<span className="hl-name">Sara</span>{`",
  "`}<span className="hl-age">age</span>{`": `}<span className="hl-age">29</span>{`,
  "`}<span className="hl-city">city</span>{`": "`}<span className="hl-city">Tunis</span>{`"
}`}
            </pre>
          </div>
        </div>
      </div>

      {/* Mini JSON Cheat Card */}
      <div className="json-cheat-strip">
        <span className="cheat-tag"><FileJson className="size-3.5" /> JSON CHEAT SHEET:</span>
        <div className="cheat-items">
          <div className="cheat-pill"><code>&quot;key&quot;: value</code> <span>(Pair)</span></div>
          <div className="cheat-pill"><code>&quot;string&quot;</code> <span>(Text)</span></div>
          <div className="cheat-pill"><code>42</code> <span>(Number)</span></div>
          <div className="cheat-pill"><code>true / false</code> <span>(Boolean)</span></div>
          <div className="cheat-pill"><code>[&quot;a&quot;, &quot;b&quot;]</code> <span>(List)</span></div>
        </div>
      </div>
    </div>
  )
}

// ==========================================
// SLIDE 3.3: JSON Schema
// ==========================================
export function JsonSchemaDemo() {
  return (
    <div className="schema-demo-wrapper">
      <div className="schema-grid">
        {/* Left: JSON Schema contract */}
        <div className="schema-card">
          <div className="schema-card-head">
            <span className="schema-tag">THE CONTRACT (JSON SCHEMA)</span>
            <small>Sent along with prompt to enforce shape</small>
          </div>
          <div className="schema-code-view">
            <div className="schema-rule-row rule-name">
              <span className="rule-badge">name</span>
              <code>type: string</code>
              <small className="req-tag">required</small>
            </div>
            <div className="schema-rule-row rule-age">
              <span className="rule-badge">age</span>
              <code>type: integer</code>
              <small className="req-tag">required</small>
            </div>
            <div className="schema-rule-row rule-role">
              <span className="rule-badge">role</span>
              <code>enum: [&quot;student&quot;, &quot;teacher&quot;]</code>
            </div>
          </div>
        </div>

        {/* Right: Validation Samples */}
        <div className="samples-card">
          <div className="schema-card-head">
            <span className="samples-tag">EVALUATING MODEL OUTPUTS</span>
            <small>Checked against schema</small>
          </div>

          <div className="samples-list">
            {/* Sample 1: Valid */}
            <div className="sample-row sample-valid">
              <div className="sample-status"><Check className="size-4 text-green" /> <strong>VALID</strong></div>
              <code>{`{ "name": "Sara", "age": 29, "role": "student" }`}</code>
              <span className="sample-note text-green">Matches all types, fields, and enum values</span>
            </div>

            {/* Sample 2: Wrong Type */}
            <div className="sample-row sample-invalid">
              <div className="sample-status"><X className="size-4 text-red" /> <strong>REJECTED</strong></div>
              <code>{`{ "name": "Sara", "age": "twenty nine", "role": "student" }`}</code>
              <span className="sample-note text-red">❌ age must be integer, got string</span>
            </div>

            {/* Sample 3: Not in Enum */}
            <div className="sample-row sample-invalid">
              <div className="sample-status"><X className="size-4 text-red" /> <strong>REJECTED</strong></div>
              <code>{`{ "name": "Sara", "age": 29, "role": "astronaut" }`}</code>
              <span className="sample-note text-red">❌ role &quot;astronaut&quot; not in allowed enum</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ==========================================
// SLIDE 3.4: Pydantic
// ==========================================
export function PydanticDemo() {
  return (
    <div className="pydantic-wrapper">
      <div className="pydantic-compare-grid">
        {/* Left: Python Pydantic Model */}
        <div className="pydantic-col">
          <div className="pydantic-head">
            <span className="py-tag">1. DEFINE IN PYTHON (PYDANTIC)</span>
            <code>models.py</code>
          </div>
          <div className="code-box">
            <pre>
{`from pydantic import BaseModel
from typing import Literal

class Person(BaseModel):
    name: str
    age: int
    role: Literal["student", "teacher"]`}
            </pre>
          </div>
        </div>

        {/* Center Arrow */}
        <div className="pydantic-arrow-col">
          <span className="pydantic-gen-pill">Auto-generated by Pydantic</span>
          <ArrowRight className="size-5 text-blue" />
        </div>

        {/* Right: Equivalent JSON Schema */}
        <div className="pydantic-col">
          <div className="pydantic-head">
            <span className="json-tag">2. EXPORTED JSON SCHEMA</span>
            <code>Person.model_json_schema()</code>
          </div>
          <div className="code-box">
            <pre>
{`{
  "type": "object",
  "properties": {
    "name": { "type": "string" },
    "age": { "type": "integer" },
    "role": { "enum": ["student", "teacher"] }
  },
  "required": ["name", "age", "role"]
}`}
            </pre>
          </div>
        </div>
      </div>

      {/* Bottom Validated Object Card */}
      <div className="pydantic-bottom-card">
        <div className="pydantic-parse-step">
          <span className="step-tag">3. INSTANTIATE & VALIDATE AT RUNTIME:</span>
          <code>person = Person.model_validate_json(llm_output)</code>
        </div>
        <ArrowRight className="size-4 text-green shrink-0" />
        <div className="pydantic-typed-result">
          <Check className="size-4 text-green" />
          <span>Typed Python Object: <strong>Person(name=&apos;Sara&apos;, age=29, role=&apos;student&apos;)</strong></span>
        </div>
      </div>
    </div>
  )
}

// ==========================================
// SLIDE 3.5: Validation and failures
// ==========================================
export function ValidationFlowDemo() {
  return (
    <div className="val-flow-wrapper">
      <div className="val-flow-main">
        {/* Step 1: LLM */}
        <div className="flow-node node-llm">
          <div className="f-tag">STEP 1</div>
          <span className="f-title"><Cpu className="size-4" /> LLM Output</span>
          <small>Raw JSON string</small>
        </div>

        <ArrowRight className="size-5 text-muted-foreground shrink-0" />

        {/* Step 2: Pydantic Validation */}
        <div className="flow-node node-validate">
          <div className="f-tag">STEP 2</div>
          <span className="f-title"><ShieldCheck className="size-4 text-blue" /> Pydantic Validation</span>
          <small>Type & Schema Check</small>
        </div>

        <ArrowRight className="size-5 text-muted-foreground shrink-0" />

        {/* Branches */}
        <div className="flow-branches">
          {/* Pass Branch */}
          <div className="branch-card branch-pass">
            <div className="branch-header text-green">
              <Check className="size-4" />
              <strong>PASS (Valid Data)</strong>
            </div>
            <code>app.handle_user(person)</code>
            <small>Safe to insert into PostgreSQL, call APIs, run logic</small>
          </div>

          {/* Fail Branch */}
          <div className="branch-card branch-fail">
            <div className="branch-header text-red">
              <X className="size-4" />
              <strong>FAIL (ValidationError)</strong>
            </div>
            <code>&quot;age: Input should be a valid integer&quot;</code>
            <div className="retry-pill">
              <RefreshCw className="size-3.5" />
              <span>Feed error back to LLM for targeted retry <strong>(max 2–3 retries)</strong></span>
            </div>
          </div>
        </div>
      </div>

      <div className="val-callout">
        <ShieldAlert className="size-4 text-yellow shrink-0" />
        <span><strong>Golden Rule:</strong> Never trust model output blindly. Always parse with Pydantic before writing to your database.</span>
      </div>
    </div>
  )
}

// ==========================================
// SLIDE 3.6: How do we get structured output?
// ==========================================
export function StructuredLevelsDemo() {
  return (
    <div className="levels-wrapper">
      <div className="levels-grid">
        {/* Left: 3 Reliability Levels */}
        <div className="levels-list">
          <div className="level-item lvl-1">
            <div className="level-badge badge-lvl1">LEVEL 1 · LEAST RELIABLE (~80%)</div>
            <strong>Prompt Instruction (&quot;Ask Nicely&quot;)</strong>
            <p>&quot;Reply strictly in JSON...&quot; Model can still add markdown ticks (```json), conversational intro text, or miss keys.</p>
          </div>

          <div className="level-item lvl-2">
            <div className="level-badge badge-lvl2">LEVEL 2 · MODERATE (~95%)</div>
            <strong>JSON Mode (API Flag)</strong>
            <p>Guarantees syntactically valid JSON (no markdown wrappers), but does <em>not</em> guarantee the exact fields or types.</p>
          </div>

          <div className="level-item lvl-3">
            <div className="level-badge badge-lvl3">LEVEL 3 · 100% ENFORCED (SCHEMA)</div>
            <strong>Constrained Decoding (Structured Outputs)</strong>
            <p>Grammar-constrained sampling: the decoding engine mathematically blocks tokens that violate your JSON Schema.</p>
          </div>
        </div>

        {/* Right: Constrained Generation Visualization */}
        <div className="token-mask-card">
          <div className="mask-head">
            <span className="mask-tag">UNDER THE HOOD: TOKEN MASKING</span>
            <small>Context currently at: <code>{`{ "age": `}</code></small>
          </div>

          <div className="token-candidates">
            <div className="token-candidate token-blocked">
              <code>&quot;twenty&quot;</code>
              <span className="candidate-status text-red"><X className="size-3" /> BLOCKED (0% prob)</span>
            </div>
            <div className="token-candidate token-blocked">
              <code>&quot;Sure&quot;</code>
              <span className="candidate-status text-red"><X className="size-3" /> BLOCKED (0% prob)</span>
            </div>
            <div className="token-candidate token-allowed">
              <code>2</code>
              <span className="candidate-status text-green"><Check className="size-3" /> ALLOWED (digit)</span>
            </div>
            <div className="token-candidate token-allowed">
              <code>29</code>
              <span className="candidate-status text-green"><Check className="size-3" /> ALLOWED (digit)</span>
            </div>
          </div>

          <div className="mask-caption">
            &quot;The schema acts as an active grammar mask during token sampling: invalid tokens are assigned probability 0.&quot;
          </div>
        </div>
      </div>
    </div>
  )
}

// ==========================================
// SLIDE 3.7: Takeaways & Bridge to Part 4
// ==========================================
export function StructuredTakeawaysDemo() {
  const points = [
    {
      num: '01',
      title: 'Raw text vs. Data',
      desc: 'Raw text is for humans to read; structured JSON is for software systems to consume.',
      icon: Terminal,
      color: 'blue',
    },
    {
      num: '02',
      title: 'JSON Schema Contract',
      desc: 'Defines exact types, mandatory keys, and allowed enum values upfront.',
      icon: Braces,
      color: 'green',
    },
    {
      num: '03',
      title: 'Pydantic in Python',
      desc: 'Auto-generates schemas and parses model responses into typed, validated Python classes.',
      icon: FileCode,
      color: 'yellow',
    },
    {
      num: '04',
      title: 'Always Validate',
      desc: 'Never trust LLM output implicitly; validate and retry with errors on failure.',
      icon: ShieldCheck,
      color: 'red',
    },
  ]

  return (
    <div className="struct-takeaways-wrapper">
      {/* 4 Cards Grid */}
      <div className="struct-cards-grid">
        {points.map((p) => {
          const Icon = p.icon
          return (
            <div className={cn('struct-takeaway-card', `border-${p.color}`)} key={p.num}>
              <div className="card-top">
                <span className={cn('st-idx', `text-${p.color}`)}>{p.num}</span>
                <div className={cn('st-icon', `icon-${p.color}`)}>
                  <Icon className="size-4" />
                </div>
              </div>
              <strong>{p.title}</strong>
              <p>{p.desc}</p>
            </div>
          )
        })}
      </div>

      {/* Pipeline Row (OPTIONAL) */}
      <div className="struct-pipeline-strip">
        <div className="pipe-node">Raw Text</div>
        <ArrowRight className="size-4 text-muted-foreground" />
        <div className="pipe-node">JSON Schema</div>
        <ArrowRight className="size-4 text-muted-foreground" />
        <div className="pipe-node">Pydantic Object</div>
        <ArrowRight className="size-4 text-muted-foreground" />
        <div className="pipe-node pipe-node-final">Production Database / App</div>
      </div>

      {/* Bridge to Part 4 */}
      <div className="bridge-pill bridge-p4">
        <div className="pill-tag tag-bridge">
          <Sparkles className="size-3.5" />
          BRIDGE TO PART 4: QUALITY & LIMITS
        </div>
        <p>
          Prompts and formats structure the text coming <em>out</em> of the model. But what <strong>else can we change</strong> to get better answers? What are the model&apos;s limits, and how do we measure improvement?
        </p>
      </div>
    </div>
  )
}
