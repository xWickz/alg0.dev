import type { Step, HighlightType } from '../lib/types'

const highlightColors: Record<HighlightType, string> = {
  comparing: '#60a5fa',
  swapped: '#f87171',
  selected: '#fbbf24',
  sorted: '#34d399',
  pivot: '#c084fc',
  found: '#4ade80',
  current: '#fb923c',
  searching: '#38bdf8',
  left: '#60a5fa',
  right: '#f472b6',
  merged: '#818cf8',
  minimum: '#fbbf24',
  placed: '#4ade80',
  conflict: '#f87171',
  checking: '#fbbf24',
  wall: '#475569',
  path: '#22d3ee',
  start: '#60a5fa',
  end: '#f87171',
  given: '#94a3b8',
  active: '#fb923c',
  visited: '#a78bfa',
}

const DEFAULT_COLOR = '#555'

interface ArrayVisualizerProps {
  step: Step
}

export default function ArrayVisualizer({ step }: ArrayVisualizerProps) {
  const { array = [], highlights = {}, sorted = [] } = step

  if (array.length === 0) return null

  const maxValue = Math.max(...array, 1)
  const barGap = array.length > 12 ? 2 : 4

  const activeHighlights = Object.entries(highlights)
    .filter(([, type]) => type)
    .map(([idx, type]) => `index ${idx}: ${type}`)
    .join(', ')

  return (
    <div
      className="flex-1 flex flex-col items-center justify-center gap-6 w-full"
      role="img"
      aria-label={`Array visualization: ${array.length} elements [${array.join(', ')}]${activeHighlights ? `. Active: ${activeHighlights}` : ''}`}
    >
      {/* Bar chart */}
      <div
        className="flex items-end w-full max-w-3xl"
        style={{ height: '300px', gap: `${barGap}px` }}
        aria-hidden="true"
      >
        {array.map((value, index) => {
          const highlight = highlights[index]
          const isSorted = sorted.includes(index)
          const color = highlight
            ? highlightColors[highlight]
            : isSorted
              ? highlightColors.sorted
              : DEFAULT_COLOR

          const heightPercent = Math.max((value / maxValue) * 100, 2)
          const isActive = !!highlight

          return (
            <div
              key={index}
              className="flex-1 flex flex-col items-center justify-end h-full relative"
            >
              {/* Value label above bar */}
              <span
                className="text-[11px] font-mono font-semibold mb-2 transition-all duration-300"
                style={{ color }}
              >
                {value}
              </span>

              {/* Bar */}
              <div
                className="w-full rounded-t-sm transition-all duration-300 ease-in-out relative"
                style={{
                  height: `${heightPercent}%`,
                  backgroundColor: color,
                  opacity: !highlight && !isSorted ? 0.6 : 1,
                }}
              />
            </div>
          )
        })}
      </div>

      {/* Index row */}
      <div className="flex w-full max-w-3xl" style={{ gap: `${barGap}px` }} aria-hidden="true">
        {array.map((_, index) => {
          const highlight = highlights[index]
          const isSorted = sorted.includes(index)
          const color = highlight
            ? highlightColors[highlight]
            : isSorted
              ? highlightColors.sorted
              : '#333'

          return (
            <div
              key={index}
              className="flex-1 text-center text-[10px] font-mono py-1 rounded-md transition-all duration-300"
              style={{
                backgroundColor: `${color}12`,
                color: color,
                borderBottom: highlight ? `2px solid ${color}40` : '2px solid transparent',
              }}
            >
              {index}
            </div>
          )
        })}
      </div>
    </div>
  )
}
