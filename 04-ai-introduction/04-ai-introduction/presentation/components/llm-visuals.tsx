'use client'

import { motion } from 'framer-motion'
import { ArrowDown, ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'

export function NestedCircles() {
  return (
    <div className="nested" role="img" aria-label="Nested circles: Large Language Models sit inside Deep Learning, which sits inside Machine Learning, which sits inside Artificial Intelligence">
      <div className="ring ring-ai">
        <span>Artificial Intelligence</span>
        <div className="ring ring-ml">
          <span>Machine Learning</span>
          <div className="ring ring-dl">
            <span>Deep Learning</span>
            <div className="ring ring-llm">
              <span>LLM</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function TokenSplit({ word, parts, accent }: { word: string; parts: string[]; accent: string }) {
  return (
    <div className="token-split">
      <code className="token-word">&quot;{word}&quot;</code>
      <ArrowDown className="token-arrow" aria-hidden="true" />
      <div className="token-row">
        {parts.map((p, i) => (
          <motion.span
            key={p + i}
            className={cn('token-chip', `chip-${accent}`)}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 + i * 0.12 }}
          >
            {p}
          </motion.span>
        ))}
      </div>
      <small>
        {parts.length} tokens
      </small>
    </div>
  )
}

export function TokenVisual() {
  return (
    <div className="token-visual" aria-label="Words are split into tokens">
      <TokenSplit word="unbelievable" parts={['un', 'believ', 'able']} accent="blue" />
      <TokenSplit word="tokenization" parts={['token', 'ization']} accent="yellow" />
      <p className="token-caption">{"\"How many r's in strawberry?\" — the model sees chunks, not letters."}</p>
    </div>
  )
}

export function ProbabilityBars({ prompt, options }: { prompt: string; options: [string, number][] }) {
  return (
    <div className="prob">
      <div className="prob-prompt">
        <code>{prompt}</code>
        <span className="prob-blank">___</span>
      </div>
      <div className="prob-list">
        {options.map(([token, p], i) => (
          <div className={cn('prob-row', i === 0 && 'top')} key={token}>
            <code>{token}</code>
            <div className="prob-track">
              <motion.div
                className="prob-fill"
                initial={{ width: 0 }}
                animate={{ width: `${Math.max(p, 1.5)}%` }}
                transition={{ delay: 0.2 + i * 0.08, duration: 0.6, ease: 'easeOut' }}
              />
            </div>
            <span>{p}%</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export function GenerationLoop() {
  const base = ['The', 'capital', 'of', 'France', 'is']
  const steps = [
    { context: base, next: 'Paris' },
    { context: [...base, 'Paris'], next: '.' },
    { context: [...base, 'Paris', '.'], next: '<end>' },
  ]
  return (
    <div className="gen-loop">
      {steps.map((s, i) => (
        <motion.div
          className="gen-step"
          key={i}
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.15 + i * 0.25 }}
        >
          <span className="gen-index">{String(i + 1).padStart(2, '0')}</span>
          <div className="gen-context">
            {s.context.map((t, j) => (
              <span key={j} className={cn(j >= base.length && 'gen-new')}>{t}</span>
            ))}
          </div>
          <ArrowRight className="gen-arrow" aria-hidden="true" />
          <span className={cn('gen-next', s.next === '<end>' && 'gen-end')}>{s.next}</span>
        </motion.div>
      ))}
      <div className="gen-legend">
        <span className="legend-box" /> context window: everything the model can see
      </div>
    </div>
  )
}

const layers = [
  { x: 30, ys: [45, 90, 135] },
  { x: 120, ys: [30, 70, 110, 150] },
  { x: 210, ys: [60, 120] },
]
const LOSS = { x: 262, y: 90 }

export function BackpropVisual() {
  const edges: [number, number, number, number][] = []
  for (let l = 0; l < layers.length - 1; l++) {
    for (const y1 of layers[l].ys) for (const y2 of layers[l + 1].ys) edges.push([layers[l].x, y1, layers[l + 1].x, y2])
  }
  const last = layers[layers.length - 1]
  for (const y of last.ys) edges.push([last.x, y, LOSS.x, LOSS.y])

  return (
    <figure className="backprop">
      <svg viewBox="0 0 320 185" role="img" aria-label="Backpropagation: the forward pass makes a prediction, the loss measures the error, and the backward pass adjusts weights">
        <text x="30" y="12" className="bp-label bp-forward">{'forward pass: predict →'}</text>
        {edges.map(([x1, y1, x2, y2], i) => (
          <line key={`b${i}`} x1={x1} y1={y1} x2={x2} y2={y2} className="bp-edge" />
        ))}
        {edges.map(([x1, y1, x2, y2], i) => (
          <line key={`r${i}`} x1={x1} y1={y1} x2={x2} y2={y2} className="bp-edge-back" />
        ))}
        {layers.map((layer, l) =>
          layer.ys.map((y) => <circle key={`${l}-${y}`} cx={layer.x} cy={y} r="9" className={cn('bp-node', l === 0 && 'bp-in')} />),
        )}
        <rect x={LOSS.x - 4} y={LOSS.y - 17} width="54" height="34" rx="8" className="bp-loss" />
        <text x={LOSS.x + 23} y={LOSS.y - 2} textAnchor="middle" className="bp-loss-title">loss</text>
        <text x={LOSS.x + 23} y={LOSS.y + 10} textAnchor="middle" className="bp-loss-value">how wrong?</text>
        <text x="290" y="180" textAnchor="end" className="bp-label bp-backward">{'← backward pass: nudge weights'}</text>
      </svg>
      <figcaption>repeat billions of times → loss goes down</figcaption>
    </figure>
  )
}

export function CompareLocalCloud({ rows }: { rows: [string, string, string][] }) {
  return (
    <div className="lc-table">
      <div className="lc-head">
        <span />
        <span className="lc-local">Local</span>
        <span className="lc-cloud">Cloud</span>
      </div>
      {rows.map(([dim, local, cloud]) => (
        <div className="lc-row" key={dim}>
          <strong>{dim}</strong>
          <span>{local}</span>
          <span>{cloud}</span>
        </div>
      ))}
    </div>
  )
}
