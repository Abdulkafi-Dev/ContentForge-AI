'use client'

import { useState, useRef, useEffect } from 'react'
import { Wand2, Scissors, Loader2, Sparkles } from 'lucide-react'
import { toast } from 'sonner'

interface InteractiveEditorProps {
  value: string
  onChange: (value: string) => void
}

export function InteractiveEditor({ value, onChange }: InteractiveEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const [selection, setSelection] = useState<{ start: number; end: number; text: string } | null>(null)
  const [loadingAction, setLoadingAction] = useState<'rewrite' | 'shorten' | null>(null)

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`
    }
  }, [value])

  const handleSelectionChange = () => {
    const textarea = textareaRef.current
    if (!textarea) return

    const start = textarea.selectionStart
    const end = textarea.selectionEnd

    if (start !== end) {
      setSelection({
        start,
        end,
        text: value.substring(start, end),
      })
    } else {
      setSelection(null)
    }
  }

  const handleAction = async (action: 'rewrite' | 'shorten') => {
    if (!selection) return

    setLoadingAction(action)
    try {
      const res = await fetch('/api/generate/edit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action,
          selectedText: selection.text,
          fullContext: value,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Failed to edit text')
      }

      // Replace text
      const newText = value.substring(0, selection.start) + data.text + value.substring(selection.end)
      onChange(newText)
      
      // Clear selection
      setSelection(null)
      toast.success(`Text successfully ${action === 'rewrite' ? 'rewritten' : 'shortened'}!`)
    } catch (err: any) {
      toast.error(err.message)
    } finally {
      setLoadingAction(null)
    }
  }

  return (
    <div className="relative flex flex-col -m-6 h-full">
      {/* Editor Toolbar */}
      <div className="flex items-center justify-between px-6 py-3 border-b border-border bg-muted/20">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-brand-500" />
          <span className="text-xs font-medium text-muted-foreground">Interactive Workstation</span>
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleAction('rewrite')}
            disabled={!selection || loadingAction !== null}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all bg-background border border-border hover:bg-accent disabled:opacity-50 disabled:cursor-not-allowed text-foreground"
          >
            {loadingAction === 'rewrite' ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Wand2 className="w-3.5 h-3.5" />}
            Rewrite
          </button>
          <button
            onClick={() => handleAction('shorten')}
            disabled={!selection || loadingAction !== null}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all bg-background border border-border hover:bg-accent disabled:opacity-50 disabled:cursor-not-allowed text-foreground"
          >
            {loadingAction === 'shorten' ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Scissors className="w-3.5 h-3.5" />}
            Shorten
          </button>
        </div>
      </div>

      {/* Editor Area */}
      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onSelect={handleSelectionChange}
        onKeyUp={handleSelectionChange}
        onClick={handleSelectionChange}
        className="w-full min-h-[300px] p-6 bg-transparent resize-none focus:outline-none text-sm leading-relaxed"
        placeholder="Your content will appear here... Highlight text to use AI editing tools."
      />
    </div>
  )
}
