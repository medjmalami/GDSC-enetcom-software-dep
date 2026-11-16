'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  AlertTriangle,
  ArrowRight,
  Bot,
  Brain,
  Check,
  Code2,
  Copy,
  Cpu,
  FileCode,
  Layers,
  MessageSquare,
  RefreshCw,
  Scissors,
  Send,
  ShieldAlert,
  ShieldCheck,
  Sliders,
  Sparkles,
  Terminal,
  User,
  X,
  Zap,
} from 'lucide-react'
import { cn } from '@/lib/utils'

// ==========================================
// SLIDE 5.1: Setup and your first call
// ==========================================
export function FirstCallDemo() {
  return (
    <div className="demo5-wrapper">
      <div className="demo5-call-grid">
        {/* Code Card */}
        <div className="demo5-code-card">
          <div className="code-header">
            <div className="dots-row">
              <span className="dot dot-r" />
              <span className="dot dot-y" />
              <span className="dot dot-g" />
            </div>
            <span className="code-title">first_call.py</span>
            <span className="code-lang">python</span>
          </div>
          <pre className="code-body">
            <code>
              <span className="c-kw">from</span> google <span className="c-kw">import</span> genai{'\n\n'}
              client = genai.<span className="c-fn">Client</span>()  <span className="c-comm"># reads GEMINI_API_KEY from environment</span>{'\n\n'}
              response = client.models.<span className="c-fn">generate_content</span>({'\n'}
              {'    '}model=<span className="c-str">&quot;gemini-2.5-flash&quot;</span>,{'\n'}
              {'    '}contents=<span className="c-str">&quot;Explain what an LLM is in one sentence.&quot;</span>,{'\n'}
              ){'\n'}
              <span className="c-fn">print</span>(response.text)
            </code>
          </pre>
        </div>

        {/* Output Card */}
        <div className="demo5-output-card">
          <div className="out-header">
            <span className="out-tag"><Terminal className="size-3.5" /> TERMINAL OUTPUT</span>
            <span className="badge-example">EXAMPLE OUTPUT</span>
          </div>
          <div className="out-content">
            <p className="out-text">
              &quot;An LLM is an AI model trained on huge amounts of text to predict and generate human-like language.&quot;
            </p>
          </div>
          <div className="out-footer">
            <span className="out-metric"><Check className="size-3 text-green" /> HTTP 200 OK</span>
            <span className="out-metric text-muted-foreground">model: gemini-2.5-flash</span>
          </div>
        </div>
      </div>

      <div className="demo5-callout">
        <Sparkles className="size-4 text-blue shrink-0" />
        <p>
          <strong>Connection:</strong> <code>contents</code> is your prompt (Part 2). Under the hood, Gemini predicts one token at a time (Part 1).
        </p>
      </div>
    </div>
  )
}

// ==========================================
// SLIDE 5.2: Prompt engineering: bad vs good
// ==========================================
export function PromptEngineeringDemo() {
  return (
    <div className="demo5-wrapper">
      <div className="demo5-split-grid">
        {/* Left: Bad Prompt */}
        <div className="demo5-panel panel-bad">
          <div className="panel-badge-bar">
            <span className="badge-bad">❌ BAD PROMPT</span>
            <small>No system persona, no format, no limits</small>
          </div>

          <div className="demo5-code-card compact">
            <pre className="code-body">
              <code>
                response = client.models.<span className="c-fn">generate_content</span>({'\n'}
                {'    '}model=<span className="c-str">&quot;gemini-2.5-flash&quot;</span>,{'\n'}
                {'    '}contents=<span className="c-str">&quot;summarize this: Large language models are...&quot;</span>,{'\n'}
                )
              </code>
            </pre>
          </div>

          <div className="demo5-output-card compact">
            <div className="out-header">
              <span className="out-tag">OUTPUT</span>
              <span className="badge-example">EXAMPLE OUTPUT</span>
            </div>
            <div className="out-content">
              <p className="text-muted-foreground text-xs leading-relaxed">
                &quot;Large language models are complex deep neural networks composed of transformer layers that predict sequential text patterns based on extensive web scraping datasets...&quot;
              </p>
              <small className="text-red block mt-2">⚠️ Long, unconstrained wall of text. Varies on every run.</small>
            </div>
          </div>
        </div>

        {/* Right: Good Prompt */}
        <div className="demo5-panel panel-good">
          <div className="panel-badge-bar">
            <span className="badge-good">✅ GOOD PROMPT</span>
            <small>Role + Task + Constraints + Delimiters</small>
          </div>

          <div className="demo5-code-card compact">
            <pre className="code-body">
              <code>
                <span className="c-kw">from</span> google.genai <span className="c-kw">import</span> types{'\n\n'}
                response = client.models.<span className="c-fn">generate_content</span>({'\n'}
                {'    '}model=<span className="c-str">&quot;gemini-2.5-flash&quot;</span>,{'\n'}
                {'    '}config=types.<span className="c-fn">GenerateContentConfig</span>({'\n'}
                {'        '}<span className="hl-role">system_instruction=&quot;You are a concise tutor for beginners.&quot;</span>{'\n'}
                {'    '}),{'\n'}
                {'    '}contents=<span className="c-str">f&quot;&quot;&quot;</span>{'\n'}
                <span className="hl-task">Summarize the text inside &lt;text&gt; tags</span>{'\n'}
                <span className="hl-constraints">in exactly 3 bullets, under 15 words each</span>,{'\n'}
                <span className="hl-context">for someone with no technical background.</span>{'\n'}
                <span className="hl-delim">&lt;text&gt;{'{text}'}&lt;/text&gt;</span><span className="c-str">&quot;&quot;&quot;</span>{'\n'}
                )
              </code>
            </pre>
          </div>

          <div className="demo5-output-card compact">
            <div className="out-header">
              <span className="out-tag">OUTPUT</span>
              <span className="badge-example">EXAMPLE OUTPUT</span>
            </div>
            <div className="out-content">
              <ul className="good-bullets-list">
                <li>• LLMs are AI systems that predict the next word in a sequence.</li>
                <li>• They learn human speech patterns by reading vast text collections.</li>
                <li>• They act like clever autocompletes, not thinking brains.</li>
              </ul>
              <small className="text-green block mt-2">✅ Exactly 3 short bullets, friendly tone, zero fluff.</small>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ==========================================
// SLIDE 5.3: Structured outputs: the 3 levels
// ==========================================
export function StructuredLevelsCodeDemo() {
  return (
    <div className="demo5-wrapper">
      <div className="demo5-levels-grid">
        {/* Level 1 */}
        <div className="level-card-code">
          <div className="lvl-head">
            <span className="badge-bad">LEVEL 1 · ASK NICELY</span>
            <code>json.loads()</code>
          </div>
          <pre className="lvl-code">
            <code>
              contents=<span className="c-str">&quot;Extract name, age as JSON. Reply only with JSON...&quot;</span>{'\n'}
              data = json.<span className="c-fn">loads</span>(response.text)
            </code>
          </pre>
          <div className="lvl-out out-fail">
            <div className="lvl-out-head">
              <span>OUTPUT</span>
              <span className="badge-example">EXAMPLE</span>
            </div>
            <code>```json{'\n'}&#123; &quot;name&quot;: &quot;Sara&quot;, &quot;age&quot;: 29 &#125;{'\n'}```</code>
            <span className="err-pill"><X className="size-3" /> json.loads fails (markdown ticks)</span>
          </div>
        </div>

        {/* Level 2 */}
        <div className="level-card-code">
          <div className="lvl-head">
            <span className="badge-warn">LEVEL 2 · JSON MODE</span>
            <code>response_mime_type</code>
          </div>
          <pre className="lvl-code">
            <code>
              config=types.<span className="c-fn">GenerateContentConfig</span>({'\n'}
              {'    '}response_mime_type=<span className="c-str">&quot;application/json&quot;</span>{'\n'}
              )
            </code>
          </pre>
          <div className="lvl-out out-warn">
            <div className="lvl-out-head">
              <span>OUTPUT</span>
              <span className="badge-example">EXAMPLE</span>
            </div>
            <code>&#123; &quot;full_name&quot;: &quot;Sara&quot;, &quot;years_old&quot;: 29 &#125;</code>
            <span className="warn-pill"><AlertTriangle className="size-3" /> Valid JSON, but unpredictable keys</span>
          </div>
        </div>

        {/* Level 3 */}
        <div className="level-card-code card-lvl3">
          <div className="lvl-head">
            <span className="badge-good">LEVEL 3 · SCHEMA-ENFORCED</span>
            <code>response_schema=Person</code>
          </div>
          <pre className="lvl-code">
            <code>
              <span className="c-kw">class</span> <span className="c-fn">Person</span>(BaseModel):{'\n'}
              {'    '}name: <span className="c-kw">str</span>; age: <span className="c-kw">int</span>{'\n'}
              config=types.<span className="c-fn">GenerateContentConfig</span>({'\n'}
              {'    '}response_schema=Person{'\n'}
              ){'\n'}
              person = response.parsed  <span className="c-comm"># Typed!</span>
            </code>
          </pre>
          <div className="lvl-out out-pass">
            <div className="lvl-out-head">
              <span>PARSED OBJECT</span>
              <span className="badge-example">EXAMPLE</span>
            </div>
            <code>Person(name=&apos;Sara&apos;, age=29, role=&apos;teacher&apos;)</code>
            <span className="pass-pill"><Check className="size-3" /> Exact types & keys guaranteed</span>
          </div>
        </div>
      </div>

      <div className="reliability-bar-strip">
        <span className="r-label">RELIABILITY LADDER:</span>
        <div className="r-track">
          <div className="r-fill" />
        </div>
        <span className="r-text text-green">Level 3: 100% schema compliance at generation time</span>
      </div>
    </div>
  )
}

// ==========================================
// SLIDE 5.4: Generation parameters
// ==========================================
export function GenerationParamsDemo() {
  return (
    <div className="demo5-wrapper">
      <div className="params-code-banner">
        <code>
          config = types.<span className="c-fn">GenerateContentConfig</span>(temperature=..., max_output_tokens=50)
        </code>
        <span className="banner-note">Same prompt tested 3 times: &quot;Give me a name for a coffee shop.&quot;</span>
      </div>

      <div className="params-outputs-grid">
        {/* T = 0.0 */}
        <div className="param-out-card">
          <div className="param-head">
            <span className="temp-badge badge-blue">TEMPERATURE = 0.0</span>
            <small>Predictable & Deterministic</small>
          </div>
          <div className="run-box">
            <div className="run-line"><span>Run 1:</span> <strong>&quot;The Daily Grind&quot;</strong></div>
            <div className="run-line"><span>Run 2:</span> <strong>&quot;The Daily Grind&quot;</strong></div>
            <div className="run-line"><span>Run 3:</span> <strong>&quot;The Daily Grind&quot;</strong></div>
          </div>
          <div className="param-summary text-blue">
            <Check className="size-3.5" /> Identical completions every time (best for factual extraction).
          </div>
        </div>

        {/* T = 1.0 */}
        <div className="param-out-card">
          <div className="param-head">
            <span className="temp-badge badge-green">TEMPERATURE = 1.0</span>
            <small>Balanced & Natural</small>
          </div>
          <div className="run-box">
            <div className="run-line"><span>Run 1:</span> <strong>&quot;Velvet Bean Roasters&quot;</strong></div>
            <div className="run-line"><span>Run 2:</span> <strong>&quot;Steamy Whispers Cafe&quot;</strong></div>
            <div className="run-line"><span>Run 3:</span> <strong>&quot;Amber Brew Lab&quot;</strong></div>
          </div>
          <div className="param-summary text-green">
            <Sparkles className="size-3.5" /> Varied, creative, yet natural suggestions.
          </div>
        </div>

        {/* T = 2.0 */}
        <div className="param-out-card">
          <div className="param-head">
            <span className="temp-badge badge-red">TEMPERATURE = 2.0</span>
            <small>Maximum Entropy</small>
          </div>
          <div className="run-box">
            <div className="run-line"><span>Run 1:</span> <strong>&quot;Quantum Caffeino-Sphere 9&quot;</strong></div>
            <div className="run-line"><span>Run 2:</span> <strong>&quot;Slurp&apos;n&apos;Nebula Beans!&quot;</strong></div>
            <div className="run-line"><span>Run 3:</span> <strong>&quot;Espresso Zenith Glitch&quot;</strong></div>
          </div>
          <div className="param-summary text-red">
            <AlertTriangle className="size-3.5" /> High randomness, novel or eccentric vocabulary.
          </div>
        </div>
      </div>

      <div className="params-comment-box">
        <code>
          <span className="c-comm"># Advanced optional knobs:</span>{' '}
          top_p=0.95, top_k=40, stop_sequences=[<span className="c-str">&quot;END&quot;</span>], seed=42
        </code>
      </div>
    </div>
  )
}

// ==========================================
// SLIDE 5.5: Bonus demos: tokens, memory, context
// ==========================================
export function BonusDemos() {
  const [activeTab, setActiveTab] = useState<'tokens' | 'chat' | 'context'>('tokens')

  return (
    <div className="demo5-wrapper">
      <div className="bonus-tabs">
        <button
          className={cn('tab-btn', activeTab === 'tokens' && 'active')}
          onClick={() => setActiveTab('tokens')}
        >
          <Cpu className="size-3.5" /> 1. Count Tokens & Usage
        </button>
        <button
          className={cn('tab-btn', activeTab === 'chat' && 'active')}
          onClick={() => setActiveTab('chat')}
        >
          <MessageSquare className="size-3.5" /> 2. Stateless vs. Chat Session
        </button>
        <button
          className={cn('tab-btn', activeTab === 'context' && 'active')}
          onClick={() => setActiveTab('context')}
        >
          <Layers className="size-3.5" /> 3. Context Changes the Answer
        </button>
      </div>

      {activeTab === 'tokens' && (
        <div className="bonus-content-card">
          <div className="bonus-split">
            <div className="demo5-code-card">
              <pre className="code-body">
                <code>
                  r = client.models.<span className="c-fn">count_tokens</span>({'\n'}
                  {'    '}model=<span className="c-str">&quot;gemini-2.5-flash&quot;</span>,{'\n'}
                  {'    '}contents=<span className="c-str">&quot;unbelievable&quot;</span>{'\n'}
                  ){'\n'}
                  <span className="c-fn">print</span>(r.total_tokens)  <span className="c-comm"># 3 tokens</span>{'\n\n'}
                  <span className="c-comm"># Response token usage telemetry:</span>{'\n'}
                  <span className="c-fn">print</span>(response.usage_metadata){'\n'}
                  <span className="c-comm"># prompt_token_count: 14</span>{'\n'}
                  <span className="c-comm"># candidates_token_count: 26</span>
                </code>
              </pre>
            </div>
            <div className="token-visual-box">
              <span className="label-sm">TOKEN CHUNKS:</span>
              <div className="token-chips-display">
                <span className="chip-part chip-blue">un</span>
                <span className="chip-part chip-green">believ</span>
                <span className="chip-part chip-yellow">able</span>
              </div>
              <div className="token-metric-badge">
                <Check className="size-3 text-green" /> Total: 3 tokens billed
              </div>
              <small className="text-muted-foreground block mt-2">
                APIs bill on input tokens + generated tokens. Context limit is capped in tokens.
              </small>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'chat' && (
        <div className="bonus-content-card">
          <div className="bonus-split">
            {/* Stateless */}
            <div className="chat-demo-col col-bad">
              <span className="badge-bad">STATELESS API CALLS</span>
              <pre className="code-body text-xs">
                <code>
                  client.models.generate_content(<span className="c-str">&quot;My name is Sara.&quot;</span>){'\n'}
                  client.models.generate_content(<span className="c-str">&quot;What is my name?&quot;</span>)
                </code>
              </pre>
              <div className="chat-bubble-out out-red">
                &quot;I do not know your name. You haven&apos;t told me yet.&quot;
              </div>
              <small className="text-red">Model has zero memory between HTTP requests.</small>
            </div>

            {/* Chat Session */}
            <div className="chat-demo-col col-good">
              <span className="badge-good">CHAT SESSION (client.chats.create)</span>
              <pre className="code-body text-xs">
                <code>
                  chat = client.chats.<span className="c-fn">create</span>(model=<span className="c-str">&quot;gemini-2.5-flash&quot;</span>){'\n'}
                  chat.<span className="c-fn">send_message</span>(<span className="c-str">&quot;My name is Sara.&quot;</span>){'\n'}
                  chat.<span className="c-fn">send_message</span>(<span className="c-str">&quot;What is my name?&quot;</span>)
                </code>
              </pre>
              <div className="chat-bubble-out out-green">
                &quot;Your name is Sara!&quot;
              </div>
              <small className="text-green">The SDK automatically manages and resends the conversation history.</small>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'context' && (
        <div className="bonus-content-card">
          <div className="bonus-split">
            {/* Without Context */}
            <div className="chat-demo-col col-bad">
              <span className="badge-bad">NO CONTEXT GIVEN</span>
              <pre className="code-body text-xs">
                <code>
                  contents=<span className="c-str">&quot;What is Acme Store&apos;s refund policy?&quot;</span>
                </code>
              </pre>
              <div className="chat-bubble-out out-red">
                &quot;Acme Store typically offers 30-day refunds for unopened merchandise with a receipt...&quot;
              </div>
              <small className="text-red">⚠️ Hallucination risk: Model guesses a plausible generic policy.</small>
            </div>

            {/* Grounded with Context */}
            <div className="chat-demo-col col-good">
              <span className="badge-good">GROUNDED WITH CONTEXT</span>
              <pre className="code-body text-xs">
                <code>
                  contents=<span className="c-str">f&quot;&quot;&quot;Policy: Refunds within 14 days with receipt.{'\n'}Question: What is Acme Store&apos;s refund policy?&quot;&quot;&quot;</span>
                </code>
              </pre>
              <div className="chat-bubble-out out-green">
                &quot;According to Acme Store&apos;s policy, refunds are permitted strictly within 14 days of purchase with a receipt.&quot;
              </div>
              <small className="text-green">✅ Accurate and factual: whatever is in context, the model can use.</small>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// ==========================================
// SLIDE 5.6: Recap
// ==========================================
export function FinalRecapDemo() {
  const pillars = [
    { num: '01', title: 'API Call', desc: 'Prompt text in → Next-token prediction out', icon: Terminal, color: 'blue' },
    { num: '02', title: 'Prompt Craft', desc: 'Roles, context, constraints, and delimiters', icon: Sparkles, color: 'green' },
    { num: '03', title: 'Structured Data', desc: 'JSON Schema + Pydantic validation for software', icon: FileCode, color: 'yellow' },
    { num: '04', title: 'Parameters', desc: 'Temperature & token limits shape randomness', icon: Sliders, color: 'red' },
    { num: '05', title: 'Context & Grounding', desc: 'Injecting facts eliminates hallucinations', icon: Layers, color: 'blue' },
  ]

  return (
    <div className="recap-wrapper">
      <div className="recap-cards-row">
        {pillars.map((p) => {
          const Icon = p.icon
          return (
            <div className={cn('recap-card', `border-${p.color}`)} key={p.num}>
              <div className="rc-top">
                <span className={cn('rc-idx', `text-${p.color}`)}>{p.num}</span>
                <div className={cn('rc-icon', `icon-${p.color}`)}>
                  <Icon className="size-4" />
                </div>
              </div>
              <strong>{p.title}</strong>
              <p>{p.desc}</p>
            </div>
          )
        })}
      </div>

      <div className="recap-pipeline-strip">
        <div className="rp-item">API Client</div>
        <ArrowRight className="size-4 text-muted-foreground" />
        <div className="rp-item">Engineered Prompt</div>
        <ArrowRight className="size-4 text-muted-foreground" />
        <div className="rp-item">Grounded Context</div>
        <ArrowRight className="size-4 text-muted-foreground" />
        <div className="rp-item">Pydantic Schema</div>
        <ArrowRight className="size-4 text-muted-foreground" />
        <div className="rp-item rp-final">Deterministic Software System</div>
      </div>
    </div>
  )
}
