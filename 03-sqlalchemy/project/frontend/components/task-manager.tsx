'use client'

import { FormEvent, useEffect, useMemo, useState } from 'react'
import {
  Check,
  CheckCircle2,
  Circle,
  Edit3,
  ListTodo,
  Loader2,
  Plus,
  RotateCcw,
  Trash2,
  X,
} from 'lucide-react'

import { Button } from '@/components/ui/button'

 type Task = {
  id: number
  title: string
  done: boolean
}

type Filter = 'all' | 'pending' | 'completed'

const API_URL = (process.env.NEXT_PUBLIC_API_URL || '').replace(/\/$/, '')

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  if (!API_URL) throw new Error('Set NEXT_PUBLIC_API_URL to connect to your task API.')
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: { 'Content-Type': 'application/json', ...options?.headers },
  })
  if (!response.ok) {
    throw new Error(`Request failed (${response.status}). Please try again.`)
  }
  if (response.status === 204) return undefined as T
  return response.json()
}

export function TaskManager() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [filter, setFilter] = useState<Filter>('all')
  const [newTitle, setNewTitle] = useState('')
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editingTitle, setEditingTitle] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const loadTasks = async () => {
    setLoading(true)
    setError('')
    try {
      setTasks(await request<Task[]>('/tasks'))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to load tasks.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void loadTasks()
  }, [])

  const counts = useMemo(() => ({
    all: tasks.length,
    pending: tasks.filter((task) => !task.done).length,
    completed: tasks.filter((task) => task.done).length,
  }), [tasks])

  const visibleTasks = tasks.filter((task) => filter === 'all' || (filter === 'completed' ? task.done : !task.done))

  async function createTask(event: FormEvent) {
    event.preventDefault()
    const title = newTitle.trim()
    if (!title) return
    setSaving(true)
    setError('')
    try {
      const created = await request<Task>('/tasks', { method: 'POST', body: JSON.stringify({ title, done: false }) })
      setTasks((current) => [created, ...current])
      setNewTitle('')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to create task.')
    } finally {
      setSaving(false)
    }
  }

  async function toggleTask(task: Task) {
    setError('')
    try {
      const updated = await request<Task>(`/tasks/${task.id}`, { method: 'PUT', body: JSON.stringify({ ...task, done: !task.done }) })
      setTasks((current) => current.map((item) => item.id === updated.id ? updated : item))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to update task.')
    }
  }

  async function saveEdit(task: Task) {
    const title = editingTitle.trim()
    if (!title) return
    setSaving(true)
    setError('')
    try {
      const updated = await request<Task>(`/tasks/${task.id}`, { method: 'PUT', body: JSON.stringify({ ...task, title }) })
      setTasks((current) => current.map((item) => item.id === updated.id ? updated : item))
      setEditingId(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to save task.')
    } finally {
      setSaving(false)
    }
  }

  async function deleteTask(task: Task) {
    if (!window.confirm(`Delete “${task.title}”? This cannot be undone.`)) return
    setError('')
    try {
      await request<void>(`/tasks/${task.id}`, { method: 'DELETE' })
      setTasks((current) => current.filter((item) => item.id !== task.id))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to delete task.')
    }
  }

  return (
    <main className="min-h-screen bg-[#f7f8f6] text-[#1e2722]">
      <div className="mx-auto flex min-h-screen w-full max-w-5xl flex-col px-5 py-8 sm:px-8 lg:px-12 lg:py-12">
        <header className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl bg-[#dceee4] text-[#286341] shadow-sm">
              <ListTodo aria-hidden="true" />
            </div>
            <span className="text-sm font-semibold tracking-tight text-[#53635a]">Focus board</span>
          </div>
          <div className="hidden items-center gap-2 text-xs font-medium text-[#7b887f] sm:flex">
            <span className="size-2 rounded-full bg-[#72b890]" aria-hidden="true" />
            Your day, organized
          </div>
        </header>

        <section className="mt-14 max-w-2xl sm:mt-20">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-[#6c9b7d]">Good to see you</p>
          <h1 className="text-4xl font-semibold tracking-[-0.04em] text-[#1e2722] sm:text-5xl">Tasks</h1>
          <p className="mt-4 text-base leading-7 text-[#758178]">Keep the important things moving, one small win at a time.</p>
        </section>

        <form onSubmit={createTask} className="mt-9 flex max-w-3xl items-center gap-3 rounded-2xl border border-[#dfe8e1] bg-white p-2.5 shadow-[0_10px_30px_rgba(40,68,50,0.06)]">
          <label htmlFor="new-task" className="sr-only">Add a new task</label>
          <input id="new-task" value={newTitle} onChange={(event) => setNewTitle(event.target.value)} placeholder="What needs to get done?" className="min-w-0 flex-1 bg-transparent px-3 text-sm text-[#26332b] outline-none placeholder:text-[#aab5ad]" />
          <Button type="submit" disabled={saving || !newTitle.trim()} className="rounded-xl bg-[#285f3f] px-4 text-white hover:bg-[#1f4d32] disabled:opacity-50">
            {saving ? <Loader2 className="animate-spin" data-icon="inline-start" /> : <Plus data-icon="inline-start" />}
            <span className="hidden sm:inline">Add task</span><span className="sm:hidden">Add</span>
          </Button>
        </form>

        {error && (
          <div role="alert" className="mt-4 flex items-center justify-between rounded-xl border border-[#f0d5d0] bg-[#fff8f6] px-4 py-3 text-sm text-[#a34d43]">
            <span>{error}</span><button type="button" onClick={() => void loadTasks()} className="ml-4 inline-flex items-center gap-1 font-semibold hover:underline"><RotateCcw aria-hidden="true" /> Retry</button>
          </div>
        )}

        <section className="mt-12 flex-1" aria-label="Task list">
          <div className="flex flex-col gap-4 border-b border-[#e2e9e3] pb-4 sm:flex-row sm:items-center sm:justify-between">
            <div><h2 className="text-lg font-semibold tracking-tight">Your list</h2><p className="mt-1 text-sm text-[#89948c]">{counts.pending} {counts.pending === 1 ? 'task' : 'tasks'} left to complete</p></div>
            <div className="flex rounded-xl bg-[#e9efea] p-1" role="group" aria-label="Filter tasks">
              {(['all', 'pending', 'completed'] as Filter[]).map((item) => (
                <button key={item} type="button" onClick={() => setFilter(item)} aria-pressed={filter === item} className={`rounded-lg px-3 py-2 text-xs font-semibold capitalize transition-colors ${filter === item ? 'bg-white text-[#285f3f] shadow-sm' : 'text-[#78857c] hover:text-[#40564a]'}`}>{item}<span className="ml-1.5 text-[10px] opacity-60">{counts[item]}</span></button>
              ))}
            </div>
          </div>

          <div className="mt-5 flex flex-col gap-3">
            {loading ? Array.from({ length: 3 }).map((_, index) => <div key={index} className="h-[74px] animate-pulse rounded-2xl bg-[#e9efea]" />) : visibleTasks.length === 0 ? (
              <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-[#ccd9cf] bg-white/60 px-6 py-16 text-center"><div className="mb-4 flex size-12 items-center justify-center rounded-full bg-[#e4f1e8] text-[#5a9b72]"><CheckCircle2 /></div><h3 className="font-semibold">{filter === 'all' ? 'A clear board' : `No ${filter} tasks`}</h3><p className="mt-2 max-w-xs text-sm leading-6 text-[#89948c]">{filter === 'all' ? 'Add your first task above and make some progress.' : 'Try another filter or add a new task to your list.'}</p></div>
            ) : visibleTasks.map((task) => (
              <article key={task.id} className="group flex items-center gap-3 rounded-2xl border border-[#e1e9e2] bg-white px-4 py-3.5 shadow-[0_4px_16px_rgba(40,68,50,0.035)] transition-all hover:border-[#c7dccd] hover:shadow-[0_8px_24px_rgba(40,68,50,0.07)] sm:px-5">
                <button type="button" onClick={() => void toggleTask(task)} aria-label={task.done ? `Mark ${task.title} as pending` : `Mark ${task.title} as complete`} className={`flex size-6 shrink-0 items-center justify-center rounded-full border-2 transition-colors ${task.done ? 'border-[#6ca87f] bg-[#6ca87f] text-white' : 'border-[#c7d2ca] text-transparent hover:border-[#6ca87f]'}`}>{task.done ? <Check /> : <Circle aria-hidden="true" />}</button>
                {editingId === task.id ? <input autoFocus value={editingTitle} onChange={(event) => setEditingTitle(event.target.value)} onKeyDown={(event) => { if (event.key === 'Enter') void saveEdit(task); if (event.key === 'Escape') setEditingId(null) }} className="min-w-0 flex-1 rounded-lg border border-[#b7d0bd] bg-[#f7fbf8] px-3 py-2 text-sm outline-none ring-[#8dbb99] focus:ring-2" aria-label="Edit task title" /> : <div className="min-w-0 flex-1"><p className={`truncate text-sm font-medium ${task.done ? 'text-[#9aa69d] line-through' : 'text-[#2c382f]'}`}>{task.title}</p><p className="mt-1 text-xs text-[#9ba89f]">{task.done ? 'Completed' : 'In progress'}</p></div>}
                <div className="flex shrink-0 items-center gap-1 opacity-100 transition-opacity sm:opacity-0 sm:group-hover:opacity-100 sm:focus-within:opacity-100">
                  {editingId === task.id ? <><button type="button" onClick={() => void saveEdit(task)} aria-label="Save task" className="rounded-lg p-2 text-[#4c8b61] hover:bg-[#edf6ef]"><Check /></button><button type="button" onClick={() => setEditingId(null)} aria-label="Cancel editing" className="rounded-lg p-2 text-[#7d8b81] hover:bg-[#f0f3f0]"><X /></button></> : <><button type="button" onClick={() => { setEditingId(task.id); setEditingTitle(task.title) }} aria-label={`Edit ${task.title}`} className="rounded-lg p-2 text-[#8b998f] hover:bg-[#edf6ef] hover:text-[#4c8b61]"><Edit3 /></button><button type="button" onClick={() => void deleteTask(task)} aria-label={`Delete ${task.title}`} className="rounded-lg p-2 text-[#a9aba5] hover:bg-[#fff0ed] hover:text-[#bd5a4e]"><Trash2 /></button></>}
                </div>
              </article>
            ))}
          </div>
        </section>
        <footer className="mt-12 border-t border-[#e2e9e3] pt-5 text-xs text-[#9aa59d]">{counts.completed} completed · {counts.all} total</footer>
      </div>
    </main>
  )
}
