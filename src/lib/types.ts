export type VisualizationType = 'array' | 'graph' | 'matrix'

export type HighlightType =
  | 'comparing'
  | 'swapped'
  | 'selected'
  | 'sorted'
  | 'pivot'
  | 'found'
  | 'current'
  | 'searching'
  | 'left'
  | 'right'
  | 'merged'
  | 'minimum'
  | 'placed'
  | 'conflict'
  | 'checking'
  | 'wall'
  | 'path'
  | 'start'
  | 'end'
  | 'given'
  | 'active'
  | 'visited'

export interface GraphNode {
  id: number
  label: string
  x: number
  y: number
}

export interface GraphEdge {
  from: number
  to: number
  weight?: number
}

export interface GraphState {
  nodes: GraphNode[]
  edges: GraphEdge[]
  visitedNodes: number[]
  currentNode: number | null
  visitedEdges: [number, number][]
  currentEdge: [number, number] | null
  queue?: number[]
  stack?: number[]
  distances?: Record<number, number | string>
}

export interface MatrixState {
  rows: number
  cols: number
  values: (number | string)[][]
  highlights: Record<string, HighlightType>
}

export interface Step {
  array?: number[]
  highlights?: Record<number, HighlightType>
  sorted?: number[]
  graph?: GraphState
  matrix?: MatrixState
  codeLine?: number
  description?: string
  variables?: Record<string, string | number | boolean | null>
}

export interface Algorithm {
  id: string
  name: string
  category: string
  description: string
  code: string
  visualization: VisualizationType
  generateSteps: () => Step[]
}

export interface Category {
  name: string
  algorithms: Algorithm[]
}
