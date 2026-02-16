import { useRef, useEffect, useCallback, useMemo } from 'react'
import Editor, { type Monaco, useMonaco } from '@monaco-editor/react'
import type { Locale } from '../i18n/translations'
import { translations } from '../i18n/translations'

interface CodePanelProps {
  code: string
  description: string
  currentLine?: number
  variables?: Record<string, string | number | boolean | null>
  activeTab: 'code' | 'about'
  onTabChange: (tab: 'code' | 'about') => void
  locale?: Locale
}

/** Custom dark theme that matches the app background */
function defineTheme(monaco: Monaco) {
  monaco.editor.defineTheme('algoviz-dark', {
    base: 'vs-dark',
    inherit: true,
    rules: [],
    colors: {
      'editor.background': '#000000',
      'editor.lineHighlightBackground': '#ffffff06',
      'editorLineNumber.foreground': '#333',
      'editorLineNumber.activeForeground': '#63b3ed',
      'editor.selectionBackground': '#ffffff15',
      'editorCursor.foreground': '#fff',
    },
  })
}

export default function CodePanel({
  code,
  description,
  currentLine,
  variables,
  activeTab,
  onTabChange,
  locale = 'en',
}: CodePanelProps) {
  const t = translations[locale]
  const editorRef = useRef<any>(null)
  const decorationsRef = useRef<string[]>([])
  const monaco = useMonaco()

  const handleEditorDidMount = useCallback(
    (editor: any, monacoInstance: Monaco) => {
      defineTheme(monacoInstance)
      monacoInstance.editor.setTheme('algoviz-dark')
      editorRef.current = editor

      // Apply initial line highlight
      if (currentLine != null && currentLine > 0) {
        decorationsRef.current = editor.deltaDecorations(
          [],
          [
            {
              range: new monacoInstance.Range(currentLine, 1, currentLine, 1),
              options: {
                isWholeLine: true,
                className: 'algoviz-active-line',
                linesDecorationsClassName: 'algoviz-active-line-gutter',
              },
            },
          ],
        )
      }
    },
    [currentLine],
  )

  // Build inline variable annotation for the active line
  const inlineVarText = useMemo(() => {
    if (!variables || Object.keys(variables).length === 0) return ''
    const parts = Object.entries(variables).map(
      ([k, v]) => `${k} = ${typeof v === 'string' ? v : JSON.stringify(v)}`,
    )
    return '  // ' + parts.join(', ')
  }, [variables])

  // Update line highlight + inline variable annotation when currentLine/variables change
  useEffect(() => {
    const editor = editorRef.current
    if (!editor || !monaco) return

    if (currentLine != null && currentLine > 0) {
      const decorations: any[] = [
        {
          range: new monaco.Range(currentLine, 1, currentLine, 1),
          options: {
            isWholeLine: true,
            className: 'algoviz-active-line',
            linesDecorationsClassName: 'algoviz-active-line-gutter',
          },
        },
      ]

      // Add inline variable annotation after the active line content
      if (inlineVarText) {
        decorations.push({
          range: new monaco.Range(
            currentLine,
            Number.MAX_SAFE_INTEGER,
            currentLine,
            Number.MAX_SAFE_INTEGER,
          ),
          options: {
            after: {
              content: inlineVarText,
              inlineClassName: 'algoviz-inline-vars',
            },
          },
        })
      }

      decorationsRef.current = editor.deltaDecorations(decorationsRef.current, decorations)

      // Scroll to the active line
      editor.revealLineInCenterIfOutsideViewport(currentLine)
    } else {
      decorationsRef.current = editor.deltaDecorations(decorationsRef.current, [])
    }
  }, [currentLine, monaco, inlineVarText])

  return (
    <div className="flex flex-col h-full">
      {/* Tabs */}
      <div
        className="flex border-b border-white/[0.08] shrink-0"
        role="tablist"
        aria-label="Code and details tabs"
      >
        {(['code', 'about'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => onTabChange(tab)}
            role="tab"
            aria-selected={activeTab === tab}
            aria-controls={`tabpanel-${tab}`}
            id={`tab-${tab}`}
            tabIndex={activeTab === tab ? 0 : -1}
            className={`px-5 py-3 text-xs font-medium transition-all relative capitalize ${
              activeTab === tab ? 'text-white' : 'text-neutral-600 hover:text-neutral-400'
            }`}
          >
            {tab === 'code' ? t.tabCode : t.tabAbout}
            {activeTab === tab && (
              <div className="absolute bottom-0 left-2 right-2 h-px bg-white" aria-hidden="true" />
            )}
          </button>
        ))}
      </div>

      {/* Content */}
      {activeTab === 'code' ? (
        <div
          className="flex-1 flex flex-col overflow-hidden"
          role="tabpanel"
          id="tabpanel-code"
          aria-labelledby="tab-code"
        >
          <div className="flex-1 overflow-hidden">
            <Editor
              defaultLanguage="javascript"
              value={code}
              theme="vs-dark"
              onMount={handleEditorDidMount}
              options={{
                readOnly: true,
                domReadOnly: true,
                minimap: { enabled: false },
                scrollBeyondLastLine: false,
                fontSize: 13,
                lineHeight: 28,
                fontFamily: "'Geist Mono', ui-monospace, monospace",
                fontLigatures: true,
                renderLineHighlight: 'none',
                overviewRulerLanes: 0,
                hideCursorInOverviewRuler: true,
                overviewRulerBorder: false,
                scrollbar: {
                  vertical: 'hidden',
                  horizontal: 'hidden',
                  handleMouseWheel: true,
                },
                lineNumbers: 'on',
                lineDecorationsWidth: 12,
                lineNumbersMinChars: 3,
                glyphMargin: false,
                folding: false,
                contextmenu: false,
                selectionHighlight: false,
                occurrencesHighlight: 'off',
                renderLineHighlightOnlyWhenFocus: false,
                matchBrackets: 'never',
                padding: { top: 12, bottom: 12 },
                guides: { indentation: false },
                wordWrap: 'off',
                cursorStyle: 'line-thin',
                cursorBlinking: 'solid',
              }}
            />
          </div>

          {/* Variables panel */}
          {variables && Object.keys(variables).length > 0 && (
            <div className="shrink-0 border-t border-white/[0.08]">
              <div className="px-4 py-2 flex items-center gap-2">
                <div className="flex items-center gap-1.5">
                  <svg
                    className="w-3.5 h-3.5 text-neutral-500"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M4.745 3A23.933 23.933 0 003 12c0 3.183.62 6.22 1.745 9M19.5 3c.967 2.78 1.5 5.817 1.5 9s-.533 6.22-1.5 9M8.25 8.885l1.444-.89a.75.75 0 011.105.402l2.402 7.206a.75.75 0 001.104.401l1.445-.889"
                    />
                  </svg>
                  <span className="text-[10px] font-semibold text-neutral-500 uppercase tracking-wider">
                    Variables
                  </span>
                </div>
              </div>
              <div className="px-4 pb-3 flex flex-wrap gap-x-3 gap-y-1.5">
                {Object.entries(variables).map(([name, value]) => (
                  <div
                    key={name}
                    className="inline-flex items-center gap-1.5 text-[12px] font-mono"
                  >
                    <span className="text-neutral-300">{name}</span>
                    <span className="text-neutral-600">=</span>
                    <span
                      className={`font-medium ${
                        typeof value === 'number'
                          ? 'text-amber-300/90'
                          : typeof value === 'boolean'
                            ? value
                              ? 'text-emerald-400/90'
                              : 'text-red-400/90'
                            : value === null
                              ? 'text-neutral-600'
                              : 'text-sky-300/90'
                      }`}
                    >
                      {value === null
                        ? 'null'
                        : typeof value === 'boolean'
                          ? String(value)
                          : String(value)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div
          className="flex-1 overflow-auto p-6"
          role="tabpanel"
          id="tabpanel-about"
          aria-labelledby="tab-about"
        >
          <article className="text-[13px] text-neutral-400 leading-relaxed whitespace-pre-wrap font-[inherit]">
            {description.split('\n').map((line, i) => {
              if (i === 0 && line.trim()) {
                return (
                  <h3 key={i} className="text-lg font-semibold text-white mb-4 font-heading">
                    {line}
                  </h3>
                )
              }
              if (line.match(/^[A-ZÁ-Ú][a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+:$/)) {
                return (
                  <h4
                    key={i}
                    className="text-sm font-semibold text-neutral-200 mt-5 mb-2 font-heading"
                  >
                    {line}
                  </h4>
                )
              }
              if (line.trim().startsWith('-') || line.trim().startsWith('•')) {
                return (
                  <div key={i} className="flex gap-2 ml-2 my-0.5" role="listitem">
                    <span className="text-neutral-600 shrink-0" aria-hidden="true">
                      {'•'}
                    </span>
                    <span>{line.trim().replace(/^[-•]\s*/, '')}</span>
                  </div>
                )
              }
              if (line.match(/^\s{2,}/)) {
                return (
                  <div key={i} className="font-mono text-xs text-neutral-500 ml-4 my-0.5">
                    {line.trim()}
                  </div>
                )
              }
              if (line.trim().match(/^\d+\./)) {
                return (
                  <div key={i} className="flex gap-2 ml-2 my-0.5">
                    <span>{line.trim()}</span>
                  </div>
                )
              }
              if (!line.trim()) {
                return <div key={i} className="h-2" />
              }
              return (
                <p key={i} className="my-1">
                  {line}
                </p>
              )
            })}
          </article>
        </div>
      )}
    </div>
  )
}
