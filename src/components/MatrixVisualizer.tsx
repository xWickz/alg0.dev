import type { Step, HighlightType } from '../lib/types'

const highlightStyles: Record<string, { bg: string; text: string; border: string }> = {
  placed: { bg: 'rgba(34,197,94,0.12)', text: '#4ade80', border: 'rgba(34,197,94,0.25)' },
  conflict: { bg: 'rgba(239,68,68,0.12)', text: '#f87171', border: 'rgba(239,68,68,0.25)' },
  checking: { bg: 'rgba(234,179,8,0.10)', text: '#fbbf24', border: 'rgba(234,179,8,0.25)' },
  found: { bg: 'rgba(34,197,94,0.18)', text: '#4ade80', border: 'rgba(34,197,94,0.35)' },
  current: { bg: 'rgba(255,255,255,0.08)', text: '#fff', border: 'rgba(255,255,255,0.2)' },
  comparing: { bg: 'rgba(96,165,250,0.12)', text: '#60a5fa', border: 'rgba(96,165,250,0.25)' },
  selected: { bg: 'rgba(251,191,36,0.10)', text: '#fbbf24', border: 'rgba(251,191,36,0.25)' },
  sorted: { bg: 'rgba(52,211,153,0.10)', text: '#34d399', border: 'rgba(52,211,153,0.25)' },
  searching: { bg: 'rgba(56,189,248,0.10)', text: '#38bdf8', border: 'rgba(56,189,248,0.25)' },
  wall: { bg: 'rgba(255,255,255,0.06)', text: '#888', border: 'rgba(255,255,255,0.1)' },
  path: { bg: 'rgba(34,211,238,0.12)', text: '#22d3ee', border: 'rgba(34,211,238,0.25)' },
  start: { bg: 'rgba(96,165,250,0.12)', text: '#60a5fa', border: 'rgba(96,165,250,0.25)' },
  end: { bg: 'rgba(248,113,113,0.12)', text: '#f87171', border: 'rgba(248,113,113,0.25)' },
  given: { bg: 'rgba(148,163,184,0.08)', text: '#cbd5e1', border: 'rgba(148,163,184,0.15)' },
  active: { bg: 'rgba(255,255,255,0.08)', text: '#fff', border: 'rgba(255,255,255,0.2)' },
  visited: { bg: 'rgba(167,139,250,0.10)', text: '#a78bfa', border: 'rgba(167,139,250,0.25)' },
  left: { bg: 'rgba(96,165,250,0.10)', text: '#60a5fa', border: 'rgba(96,165,250,0.2)' },
  right: { bg: 'rgba(244,114,182,0.10)', text: '#f472b6', border: 'rgba(244,114,182,0.2)' },
  merged: { bg: 'rgba(129,140,248,0.10)', text: '#818cf8', border: 'rgba(129,140,248,0.25)' },
  pivot: { bg: 'rgba(192,132,252,0.10)', text: '#c084fc', border: 'rgba(192,132,252,0.25)' },
}

// Symbols for special values
const valueSymbols: Record<string, string> = {
  Q: '♛',
  S: '▶',
  E: '◆',
  W: '■',
}

interface MatrixVisualizerProps {
  step: Step
}

export default function MatrixVisualizer({ step }: MatrixVisualizerProps) {
  const { matrix } = step
  if (!matrix) return null

  const { rows, cols, values, highlights = {} } = matrix

  // Adaptive cell sizing
  const maxDim = Math.max(rows, cols)
  const cellSize =
    maxDim <= 5
      ? 'w-14 h-14 text-2xl'
      : maxDim <= 6
        ? 'w-12 h-12 text-xl'
        : maxDim <= 8
          ? 'w-10 h-10 text-lg'
          : 'w-8 h-8 text-sm'
  const gapSize = maxDim <= 6 ? 'gap-1.5' : 'gap-1'
  const fontSize = maxDim <= 5 ? 'text-xs' : maxDim <= 8 ? 'text-[10px]' : 'text-[9px]'

  // Build text description for screen readers
  const specialCells: string[] = []
  const highlightedCells: string[] = []
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const val = values[r]?.[c]
      if (val === 'Q') specialCells.push(`Queen at row ${r + 1} column ${c + 1}`)
      const h = highlights[`${r},${c}`]
      if (h) highlightedCells.push(`(${r + 1},${c + 1}): ${h}`)
    }
  }

  return (
    <div
      className="flex-1 flex items-center justify-center"
      role="img"
      aria-label={`${rows}×${cols} board.${specialCells.length > 0 ? ` ${specialCells.join('; ')}.` : ''}${highlightedCells.length > 0 ? ` Highlights: ${highlightedCells.join(', ')}.` : ''}`}
    >
      <div
        className={`grid ${gapSize}`}
        style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}
        aria-hidden="true"
      >
        {Array.from({ length: rows }).map((_, row) =>
          Array.from({ length: cols }).map((_, col) => {
            const key = `${row},${col}`
            const highlight = highlights[key]
            const value = values[row]?.[col]
            const isDark = (row + col) % 2 === 1
            const styles = highlight ? highlightStyles[highlight] : null
            const symbol = typeof value === 'string' ? valueSymbols[value] : undefined

            return (
              <div
                key={key}
                className={`${cellSize} flex items-center justify-center rounded-lg transition-all duration-300 border`}
                style={{
                  backgroundColor:
                    styles?.bg || (isDark ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.01)'),
                  borderColor:
                    styles?.border ||
                    (isDark ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.03)'),
                }}
              >
                {symbol ? (
                  <span
                    className="leading-none transition-all duration-300"
                    style={{
                      color: styles?.text || '#e2e8f0',
                      filter:
                        highlight === 'found'
                          ? 'drop-shadow(0 0 6px rgba(74,222,128,0.5))'
                          : 'none',
                    }}
                  >
                    {symbol}
                  </span>
                ) : value !== 0 && value !== '' && value != null ? (
                  <span
                    className={`font-mono font-semibold leading-none transition-all duration-300 ${fontSize}`}
                    style={{
                      color: styles?.text || '#e2e8f0',
                    }}
                  >
                    {value}
                  </span>
                ) : null}
              </div>
            )
          }),
        )}
      </div>
    </div>
  )
}
