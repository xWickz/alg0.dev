import type { Algorithm, Step, BigOCurve } from '@lib/types'
import { d } from '@lib/algorithms/shared'

// ============================================================
// BIG O NOTATION
// ============================================================

const BIG_O_CURVES: Omit<BigOCurve, 'visible' | 'highlighted'>[] = [
  { name: 'O(1)', color: '#34d399' },
  { name: 'O(log n)', color: '#22d3ee' },
  { name: 'O(n)', color: '#fb923c' },
  { name: 'O(n log n)', color: '#c084fc' },
  { name: 'O(n²)', color: '#f87171' },
]

function makeCurves(
  visibleNames: string[],
  highlightedName?: string,
): BigOCurve[] {
  return BIG_O_CURVES.map((c) => ({
    ...c,
    visible: visibleNames.includes(c.name),
    highlighted: c.name === highlightedName,
  }))
}

export const bigONotation: Algorithm = {
  id: 'big-o-notation',
  name: 'Big O Notation',
  category: 'Concepts',
  visualization: 'concept',
  code: `// O(1) — Constant time
function getFirst(arr) {
  return arr[0];
}

// O(n) — Linear time
function findMax(arr) {
  let max = arr[0];
  for (let i = 1; i < arr.length; i++) {
    if (arr[i] > max) max = arr[i];
  }
  return max;
}

// O(n²) — Quadratic time
function hasDuplicate(arr) {
  for (let i = 0; i < arr.length; i++) {
    for (let j = i + 1; j < arr.length; j++) {
      if (arr[i] === arr[j]) return true;
    }
  }
  return false;
}

// O(log n) — Logarithmic time
function binarySearch(arr, target) {
  let lo = 0, hi = arr.length - 1;
  while (lo <= hi) {
    const mid = Math.floor((lo + hi) / 2);
    if (arr[mid] === target) return mid;
    if (arr[mid] < target) lo = mid + 1;
    else hi = mid - 1;
  }
  return -1;
}`,
  description: `Big O Notation

Big O Notation describes how an algorithm's running time or space grows relative to the input size. It focuses on the worst-case scenario and ignores constants.

Common complexities (from fastest to slowest):
  O(1)      — Constant: independent of input size
  O(log n)  — Logarithmic: halves the problem each step
  O(n)      — Linear: visits each element once
  O(n log n)— Linearithmic: typical of efficient sorting
  O(n²)     — Quadratic: nested loops over input
  O(2^n)    — Exponential: doubles with each element
  O(n!)     — Factorial: all permutations

The chart shows how each complexity's curve grows as the input size increases.`,

  generateSteps(locale = 'en') {
    const steps: Step[] = []
    const all = BIG_O_CURVES.map((c) => c.name)

    // Helper: visible curves up to a certain name
    const upTo = (name: string) => all.slice(0, all.indexOf(name) + 1)

    // Code line references (1-indexed within the code string):
    //  1: // O(1) — Constant time          15: // O(n²) — Quadratic time
    //  2: function getFirst(arr) {         16: function hasDuplicate(arr) {
    //  3:   return arr[0];                 17:   for (let i = 0; ...) {        ← outer loop
    //  6: // O(n) — Linear time            18:     for (let j = i+1; ...) {    ← inner loop
    //  7: function findMax(arr) {          25: // O(log n) — Logarithmic time
    //  9:   for (let i = 1; ...) {         26: function binarySearch(arr, target) {
    //                                      28:   while (lo <= hi) {

    // Step 1: Introduction — no curves yet
    steps.push({
      concept: { type: 'bigO', curves: makeCurves([]), maxN: 10 },
      description: d(
        locale,
        'Big O measures how an algorithm scales. Watch each curve grow as the input size (n) increases.',
        'Big O mide cómo escala un algoritmo. Observa cómo crece cada curva conforme aumenta el tamaño de entrada (n).',
      ),
      codeLine: 1,
      variables: { complexity: '—' },
    })

    // ── O(1) — one step is enough (it's flat) ──
    steps.push({
      concept: { type: 'bigO', curves: makeCurves(['O(1)'], 'O(1)'), maxN: 10 },
      description: d(
        locale,
        'O(1) — Constant time. No matter how big n gets, operations stay at 1. A perfectly flat line.',
        'O(1) — Tiempo constante. Sin importar cuánto crezca n, las operaciones se mantienen en 1. Una línea perfectamente plana.',
      ),
      codeLine: 3,
      variables: { complexity: 'O(1)', 'ops(1)': 1, 'ops(5)': 1, 'ops(10)': 1 },
    })

    // ── O(log n) — grow from small n to large ──
    steps.push({
      concept: { type: 'bigO', curves: makeCurves(upTo('O(log n)'), 'O(log n)'), maxN: 4 },
      description: d(
        locale,
        'O(log n) — Logarithmic time. At small inputs (n≤4) it barely grows. Let\'s see what happens as n increases...',
        'O(log n) — Tiempo logarítmico. Con entradas pequeñas (n≤4) apenas crece. Veamos qué pasa cuando n aumenta...',
      ),
      codeLine: 26,
      variables: { complexity: 'O(log n)', 'ops(2)': 1, 'ops(4)': 2 },
    })

    steps.push({
      concept: { type: 'bigO', curves: makeCurves(upTo('O(log n)'), 'O(log n)'), maxN: 10 },
      description: d(
        locale,
        'O(log n) at n=10: only ~3.3 operations. Halving the problem each step keeps growth very slow — great for binary search.',
        'O(log n) con n=10: solo ~3.3 operaciones. Dividir el problema a la mitad en cada paso mantiene un crecimiento muy lento — ideal para búsqueda binaria.',
      ),
      codeLine: 28,
      variables: { complexity: 'O(log n)', 'ops(4)': 2, 'ops(10)': '3.3' },
    })

    // ── O(n) — grow from small to large ──
    steps.push({
      concept: { type: 'bigO', curves: makeCurves(upTo('O(n)'), 'O(n)'), maxN: 4 },
      description: d(
        locale,
        'O(n) — Linear time. At n=4, 4 operations. It grows proportionally. Watch the diagonal extend...',
        'O(n) — Tiempo lineal. Con n=4, 4 operaciones. Crece proporcionalmente. Observa cómo se extiende la diagonal...',
      ),
      codeLine: 7,
      variables: { complexity: 'O(n)', 'ops(2)': 2, 'ops(4)': 4 },
    })

    steps.push({
      concept: { type: 'bigO', curves: makeCurves(upTo('O(n)'), 'O(n)'), maxN: 10 },
      description: d(
        locale,
        'O(n) at n=10: exactly 10 operations. One operation per element — notice how it pulls away from O(log n).',
        'O(n) con n=10: exactamente 10 operaciones. Una operación por elemento — observa cómo se aleja de O(log n).',
      ),
      codeLine: 9,
      variables: { complexity: 'O(n)', 'ops(4)': 4, 'ops(10)': 10 },
    })

    // ── O(n log n) — grow from small to large ──
    // No dedicated code example; highlight the O(n) section as the closest reference
    steps.push({
      concept: { type: 'bigO', curves: makeCurves(upTo('O(n log n)'), 'O(n log n)'), maxN: 4 },
      description: d(
        locale,
        'O(n log n) — Linearithmic. At small n it looks close to O(n). Let\'s see it diverge...',
        'O(n log n) — Linearítmico. Con n pequeño se parece a O(n). Veamos cómo diverge...',
      ),
      codeLine: 9,
      variables: { complexity: 'O(n log n)', 'ops(2)': 2, 'ops(4)': 8 },
    })

    steps.push({
      concept: { type: 'bigO', curves: makeCurves(upTo('O(n log n)'), 'O(n log n)'), maxN: 10 },
      description: d(
        locale,
        'O(n log n) at n=10: ~33 operations. Typical of Merge Sort and Quick Sort. It bends away from O(n) as n grows.',
        'O(n log n) con n=10: ~33 operaciones. Típico de Merge Sort y Quick Sort. Se curva alejándose de O(n) conforme n crece.',
      ),
      codeLine: 9,
      variables: { complexity: 'O(n log n)', 'ops(5)': '11.6', 'ops(10)': '33.2' },
    })

    // ── O(n²) — grow from small to large (most dramatic) ──
    steps.push({
      concept: { type: 'bigO', curves: makeCurves(all, 'O(n²)'), maxN: 4 },
      description: d(
        locale,
        'O(n²) — Quadratic time. At n=4 it\'s already 16 operations. Nested loops. Watch it explode...',
        'O(n²) — Tiempo cuadrático. Con n=4 ya son 16 operaciones. Bucles anidados. Observa cómo explota...',
      ),
      codeLine: 16,
      variables: { complexity: 'O(n²)', 'ops(2)': 4, 'ops(4)': 16 },
    })

    steps.push({
      concept: { type: 'bigO', curves: makeCurves(all, 'O(n²)'), maxN: 7 },
      description: d(
        locale,
        'O(n²) at n=7: 49 operations — already double O(n log n). The curve is pulling away fast...',
        'O(n²) con n=7: 49 operaciones — ya el doble de O(n log n). La curva se aleja rápidamente...',
      ),
      codeLine: 17,
      variables: { complexity: 'O(n²)', 'ops(5)': 25, 'ops(7)': 49 },
    })

    steps.push({
      concept: { type: 'bigO', curves: makeCurves(all, 'O(n²)'), maxN: 10 },
      description: d(
        locale,
        'O(n²) at n=10: 100 operations! Three times more than O(n log n). Bubble Sort lives here.',
        'O(n²) con n=10: ¡100 operaciones! Tres veces más que O(n log n). Bubble Sort vive aquí.',
      ),
      codeLine: 18,
      variables: { complexity: 'O(n²)', 'ops(10)': 100, 'vs O(n log n)': '33 → 100' },
    })

    // ── Compare all — zoom out progressively ──
    steps.push({
      concept: { type: 'bigO', curves: makeCurves(all), maxN: 25 },
      description: d(
        locale,
        'Zooming out to n=25. The gap becomes dramatic: O(n²)=625 while O(n)=25. Quadratic is 25× worse!',
        'Ampliando a n=25. La brecha se vuelve dramática: O(n²)=625 mientras O(n)=25. ¡Cuadrático es 25× peor!',
      ),
      codeLine: 1,
      variables: { n: 25, 'O(1)': 1, 'O(n)': 25, 'O(n²)': 625 },
    })

    steps.push({
      concept: { type: 'bigO', curves: makeCurves(all), maxN: 50 },
      description: d(
        locale,
        'At n=50: O(1)=1, O(n)=50, O(n²)=2500. Choosing the right algorithm matters enormously as data grows!',
        'Con n=50: O(1)=1, O(n)=50, O(n²)=2500. ¡Elegir el algoritmo correcto importa enormemente conforme crecen los datos!',
      ),
      codeLine: 1,
      variables: { n: 50, 'O(1)': 1, 'O(n)': 50, 'O(n²)': 2500 },
    })

    return steps
  },
}

// ============================================================
// RECURSION
// ============================================================
export const recursion: Algorithm = {
  id: 'recursion',
  name: 'Recursion',
  category: 'Concepts',
  visualization: 'concept',
  code: `function factorial(n) {
  // Base case: factorial of 0 or 1 is 1
  if (n <= 1) return 1;

  // Recursive case: n * factorial(n - 1)
  return n * factorial(n - 1);
}

// factorial(5) unfolds as:
// 5 * factorial(4)
//   4 * factorial(3)
//     3 * factorial(2)
//       2 * factorial(1)
//         → 1 (base case)
//       → 2 * 1 = 2
//     → 3 * 2 = 6
//   → 4 * 6 = 24
// → 5 * 24 = 120`,
  description: `Recursion

Recursion is a technique where a function calls itself to solve smaller instances of the same problem. Every recursive function needs:

1. Base case: A condition that stops the recursion
2. Recursive case: The function calls itself with a smaller input

How it works (factorial example):
1. factorial(5) calls factorial(4)
2. factorial(4) calls factorial(3)
3. ... down to factorial(1) which returns 1 (base case)
4. Results propagate back up: 1 → 2 → 6 → 24 → 120

Key concepts:
  - Call stack: each recursive call is pushed onto the stack
  - Stack overflow: too many recursive calls can exhaust memory
  - Tail recursion: optimization where the recursive call is the last operation

Common recursive algorithms:
  - Factorial, Fibonacci
  - Tree traversals
  - Merge Sort, Quick Sort
  - Backtracking (N-Queens, Sudoku)`,

  generateSteps(locale = 'en') {
    const steps: Step[] = []

    // Code line references (1-indexed within the code string):
    //  1: function factorial(n) {
    //  2:   // Base case: factorial of 0 or 1 is 1
    //  3:   if (n <= 1) return 1;
    //  4:   (empty)
    //  5:   // Recursive case: n * factorial(n - 1)
    //  6:   return n * factorial(n - 1);
    //  7: }

    // Step 1: Introduction
    steps.push({
      concept: {
        type: 'callStack',
        frames: [],
      },
      description: d(
        locale,
        'Let\'s compute factorial(5). Recursion breaks the problem into smaller calls stacked on the call stack.',
        'Calculemos factorial(5). La recursión divide el problema en llamadas más pequeñas apiladas en la pila de llamadas.',
      ),
      codeLine: 1,
      variables: { n: 5 },
    })

    // Going down the call stack
    steps.push({
      concept: {
        type: 'callStack',
        frames: [
          { label: 'factorial(5)', detail: '5 × factorial(4)', state: 'active' },
        ],
      },
      description: d(
        locale,
        'factorial(5): n=5, not a base case. It needs factorial(4), so it pushes a new call onto the stack.',
        'factorial(5): n=5, no es caso base. Necesita factorial(4), así que agrega una nueva llamada a la pila.',
      ),
      codeLine: 6,
      variables: { n: 5, returns: '5 × factorial(4)' },
    })

    steps.push({
      concept: {
        type: 'callStack',
        frames: [
          { label: 'factorial(5)', detail: '5 × factorial(4)', state: 'waiting' },
          { label: 'factorial(4)', detail: '4 × factorial(3)', state: 'active' },
        ],
      },
      description: d(
        locale,
        'factorial(4): n=4, not a base case. Call factorial(3). The stack grows deeper.',
        'factorial(4): n=4, no es caso base. Llamar factorial(3). La pila crece.',
      ),
      codeLine: 6,
      variables: { n: 4, returns: '4 × factorial(3)', stackDepth: 2 },
    })

    steps.push({
      concept: {
        type: 'callStack',
        frames: [
          { label: 'factorial(5)', detail: '5 × factorial(4)', state: 'waiting' },
          { label: 'factorial(4)', detail: '4 × factorial(3)', state: 'waiting' },
          { label: 'factorial(3)', detail: '3 × factorial(2)', state: 'active' },
        ],
      },
      description: d(
        locale,
        'factorial(3): n=3, not a base case. Call factorial(2). Stack keeps growing.',
        'factorial(3): n=3, no es caso base. Llamar factorial(2). La pila sigue creciendo.',
      ),
      codeLine: 6,
      variables: { n: 3, returns: '3 × factorial(2)', stackDepth: 3 },
    })

    steps.push({
      concept: {
        type: 'callStack',
        frames: [
          { label: 'factorial(5)', detail: '5 × factorial(4)', state: 'waiting' },
          { label: 'factorial(4)', detail: '4 × factorial(3)', state: 'waiting' },
          { label: 'factorial(3)', detail: '3 × factorial(2)', state: 'waiting' },
          { label: 'factorial(2)', detail: '2 × factorial(1)', state: 'active' },
        ],
      },
      description: d(
        locale,
        'factorial(2): n=2, not a base case. Call factorial(1). Almost at the base!',
        'factorial(2): n=2, no es caso base. Llamar factorial(1). ¡Casi en el caso base!',
      ),
      codeLine: 6,
      variables: { n: 2, returns: '2 × factorial(1)', stackDepth: 4 },
    })

    steps.push({
      concept: {
        type: 'callStack',
        frames: [
          { label: 'factorial(5)', detail: '5 × factorial(4)', state: 'waiting' },
          { label: 'factorial(4)', detail: '4 × factorial(3)', state: 'waiting' },
          { label: 'factorial(3)', detail: '3 × factorial(2)', state: 'waiting' },
          { label: 'factorial(2)', detail: '2 × factorial(1)', state: 'waiting' },
          { label: 'factorial(1)', detail: 'return 1', state: 'base' },
        ],
      },
      description: d(
        locale,
        'factorial(1): BASE CASE reached! n ≤ 1, return 1. Now results will propagate back up the stack.',
        'factorial(1): ¡CASO BASE alcanzado! n ≤ 1, retorna 1. Ahora los resultados se propagan hacia arriba.',
      ),
      codeLine: 3,
      variables: { n: 1, returns: 1, stackDepth: 5 },
    })

    // Going back up the call stack
    steps.push({
      concept: {
        type: 'callStack',
        frames: [
          { label: 'factorial(5)', detail: '5 × factorial(4)', state: 'waiting' },
          { label: 'factorial(4)', detail: '4 × factorial(3)', state: 'waiting' },
          { label: 'factorial(3)', detail: '3 × factorial(2)', state: 'waiting' },
          { label: 'factorial(2)', detail: '2 × 1 = 2', state: 'active' },
        ],
      },
      description: d(
        locale,
        'Back to factorial(2): receives 1 from factorial(1). Returns 2 × 1 = 2. Frame popped from stack.',
        'Volviendo a factorial(2): recibe 1 de factorial(1). Retorna 2 × 1 = 2. Frame eliminado de la pila.',
      ),
      codeLine: 6,
      variables: { n: 2, 'factorial(1)': 1, returns: '2 × 1 = 2', stackDepth: 4 },
    })

    steps.push({
      concept: {
        type: 'callStack',
        frames: [
          { label: 'factorial(5)', detail: '5 × factorial(4)', state: 'waiting' },
          { label: 'factorial(4)', detail: '4 × factorial(3)', state: 'waiting' },
          { label: 'factorial(3)', detail: '3 × 2 = 6', state: 'active' },
        ],
      },
      description: d(
        locale,
        'Back to factorial(3): receives 2 from factorial(2). Returns 3 × 2 = 6. Stack unwinding.',
        'Volviendo a factorial(3): recibe 2 de factorial(2). Retorna 3 × 2 = 6. La pila se desenrolla.',
      ),
      codeLine: 6,
      variables: { n: 3, 'factorial(2)': 2, returns: '3 × 2 = 6', stackDepth: 3 },
    })

    steps.push({
      concept: {
        type: 'callStack',
        frames: [
          { label: 'factorial(5)', detail: '5 × factorial(4)', state: 'waiting' },
          { label: 'factorial(4)', detail: '4 × 6 = 24', state: 'active' },
        ],
      },
      description: d(
        locale,
        'Back to factorial(4): receives 6 from factorial(3). Returns 4 × 6 = 24. Almost done!',
        'Volviendo a factorial(4): recibe 6 de factorial(3). Retorna 4 × 6 = 24. ¡Casi listo!',
      ),
      codeLine: 6,
      variables: { n: 4, 'factorial(3)': 6, returns: '4 × 6 = 24', stackDepth: 2 },
    })

    steps.push({
      concept: {
        type: 'callStack',
        frames: [
          { label: 'factorial(5)', detail: '5 × 24 = 120', state: 'resolved' },
        ],
      },
      description: d(
        locale,
        'Back to factorial(5): receives 24 from factorial(4). Returns 5 × 24 = 120. Done! The call stack is empty.',
        'Volviendo a factorial(5): recibe 24 de factorial(4). Retorna 5 × 24 = 120. ¡Listo! La pila está vacía.',
      ),
      codeLine: 6,
      variables: { n: 5, 'factorial(4)': 24, result: 120, stackDepth: 0 },
    })

    return steps
  },
}

// ============================================================
// STACK
// ============================================================

type SQItem = { value: number; state: 'normal' | 'entering' | 'leaving' }

function sq(items: SQItem[]): SQItem[] {
  return items
}

export const stack: Algorithm = {
  id: 'stack',
  name: 'Stack',
  category: 'Data Structures',
  visualization: 'concept',
  code: `class Stack {
  constructor() { this.items = []; }

  push(item) {
    this.items.push(item);
  }

  pop() {
    return this.items.pop();
  }

  peek() {
    return this.items[this.items.length - 1];
  }

  isEmpty() {
    return this.items.length === 0;
  }

  get size() {
    return this.items.length;
  }
}`,
  description: `Stack

A Stack is a linear data structure that follows the LIFO principle — Last In, First Out. Like a stack of plates: you add and remove from the top only.

Operations:
  - push: add element to the top — O(1)
  - pop: remove element from the top — O(1)
  - peek: view top element without removing — O(1)
  - isEmpty: check if stack is empty — O(1)

Applications:
  - Undo/redo functionality
  - Browser history (back/forward)
  - Function call stack
  - Depth-First Search (DFS)
  - Expression evaluation and parsing
  - Balanced parentheses checking

Space Complexity: O(n) for n elements`,

  generateSteps(locale = 'en') {
    const steps: Step[] = []

    steps.push({
      concept: { type: 'stackQueue', structure: 'stack', items: [] },
      description: d(locale,
        'An empty Stack. LIFO: Last In, First Out — like a stack of plates.',
        'Una Pila vacía. LIFO: Último en Entrar, Primero en Salir — como una pila de platos.',
      ),
      codeLine: 1,
      variables: { size: 0 },
    })

    steps.push({
      concept: { type: 'stackQueue', structure: 'stack', items: sq([{ value: 10, state: 'entering' }]), operation: 'push(10)' },
      description: d(locale,
        'push(10): 10 is placed on top. It\'s the only element.',
        'push(10): 10 se coloca arriba. Es el único elemento.',
      ),
      codeLine: 4,
      variables: { operation: 'push(10)', top: 10, size: 1 },
    })

    steps.push({
      concept: { type: 'stackQueue', structure: 'stack', items: sq([{ value: 10, state: 'normal' }, { value: 20, state: 'entering' }]), operation: 'push(20)' },
      description: d(locale,
        'push(20): 20 goes on top of 10.',
        'push(20): 20 va encima del 10.',
      ),
      codeLine: 4,
      variables: { operation: 'push(20)', top: 20, size: 2 },
    })

    steps.push({
      concept: { type: 'stackQueue', structure: 'stack', items: sq([{ value: 10, state: 'normal' }, { value: 20, state: 'normal' }, { value: 30, state: 'entering' }]), operation: 'push(30)' },
      description: d(locale,
        'push(30): Stack is now [10, 20, 30] with 30 on top.',
        'push(30): La pila ahora es [10, 20, 30] con 30 arriba.',
      ),
      codeLine: 4,
      variables: { operation: 'push(30)', top: 30, size: 3 },
    })

    steps.push({
      concept: { type: 'stackQueue', structure: 'stack', items: sq([{ value: 10, state: 'normal' }, { value: 20, state: 'normal' }, { value: 30, state: 'normal' }, { value: 42, state: 'entering' }]), operation: 'push(42)' },
      description: d(locale,
        'push(42): The most recent element is always on top.',
        'push(42): El elemento más reciente siempre está arriba.',
      ),
      codeLine: 4,
      variables: { operation: 'push(42)', top: 42, size: 4 },
    })

    steps.push({
      concept: { type: 'stackQueue', structure: 'stack', items: sq([{ value: 10, state: 'normal' }, { value: 20, state: 'normal' }, { value: 30, state: 'normal' }]), operation: 'pop() → 42', removedValue: 42 },
      description: d(locale,
        'pop() → 42. LIFO: the last pushed element is removed first!',
        'pop() → 42. LIFO: ¡el último elemento apilado se retira primero!',
      ),
      codeLine: 8,
      variables: { operation: 'pop()', removed: 42, top: 30, size: 3 },
    })

    steps.push({
      concept: { type: 'stackQueue', structure: 'stack', items: sq([{ value: 10, state: 'normal' }, { value: 20, state: 'normal' }]), operation: 'pop() → 30', removedValue: 30 },
      description: d(locale,
        'pop() → 30. Now 20 is the top. Elements come out in reverse insertion order.',
        'pop() → 30. Ahora 20 está arriba. Los elementos salen en orden inverso al de inserción.',
      ),
      codeLine: 8,
      variables: { operation: 'pop()', removed: 30, top: 20, size: 2 },
    })

    steps.push({
      concept: { type: 'stackQueue', structure: 'stack', items: sq([{ value: 10, state: 'normal' }, { value: 20, state: 'normal' }]), operation: 'peek() → 20' },
      description: d(locale,
        'peek() → 20. View the top without removing it. All operations are O(1)!',
        'peek() → 20. Ver el tope sin eliminarlo. ¡Todas las operaciones son O(1)!',
      ),
      codeLine: 11,
      variables: { operation: 'peek()', top: 20, size: 2, complexity: 'O(1)' },
    })

    return steps
  },
}

// ============================================================
// QUEUE
// ============================================================

export const queue: Algorithm = {
  id: 'queue',
  name: 'Queue',
  category: 'Data Structures',
  visualization: 'concept',
  code: `class Queue {
  constructor() { this.items = []; }

  enqueue(item) {
    this.items.push(item);
  }

  dequeue() {
    return this.items.shift();
  }

  front() {
    return this.items[0];
  }

  isEmpty() {
    return this.items.length === 0;
  }

  get size() {
    return this.items.length;
  }
}`,
  description: `Queue

A Queue is a linear data structure that follows the FIFO principle — First In, First Out. Like a line at a store: the first person in line is served first.

Operations:
  - enqueue: add element to the back — O(1)
  - dequeue: remove element from the front — O(1)*
  - front: view front element without removing — O(1)
  - isEmpty: check if queue is empty — O(1)

*Note: shift() is O(n) with arrays; use a linked list or circular buffer for true O(1).

Applications:
  - Task scheduling (CPU, printer)
  - Breadth-First Search (BFS)
  - Message buffers and event queues
  - Rate limiting
  - Order processing systems

Space Complexity: O(n) for n elements`,

  generateSteps(locale = 'en') {
    const steps: Step[] = []

    steps.push({
      concept: { type: 'stackQueue', structure: 'queue', items: [] },
      description: d(locale,
        'An empty Queue. FIFO: First In, First Out — like a line at a store.',
        'Una Cola vacía. FIFO: Primero en Entrar, Primero en Salir — como una fila en una tienda.',
      ),
      codeLine: 1,
      variables: { size: 0 },
    })

    steps.push({
      concept: { type: 'stackQueue', structure: 'queue', items: sq([{ value: 10, state: 'entering' }]), operation: 'enqueue(10)' },
      description: d(locale,
        'enqueue(10): 10 enters at the back of the queue.',
        'enqueue(10): 10 entra por el final de la cola.',
      ),
      codeLine: 4,
      variables: { operation: 'enqueue(10)', front: 10, size: 1 },
    })

    steps.push({
      concept: { type: 'stackQueue', structure: 'queue', items: sq([{ value: 10, state: 'normal' }, { value: 20, state: 'entering' }]), operation: 'enqueue(20)' },
      description: d(locale,
        'enqueue(20): 20 joins at the back. 10 is still at the front.',
        'enqueue(20): 20 se une al final. 10 sigue al frente.',
      ),
      codeLine: 4,
      variables: { operation: 'enqueue(20)', front: 10, size: 2 },
    })

    steps.push({
      concept: { type: 'stackQueue', structure: 'queue', items: sq([{ value: 10, state: 'normal' }, { value: 20, state: 'normal' }, { value: 30, state: 'entering' }]), operation: 'enqueue(30)' },
      description: d(locale,
        'enqueue(30): Queue is [10, 20, 30]. 10 arrived first, so it\'s served first.',
        'enqueue(30): La cola es [10, 20, 30]. 10 llegó primero, así que se atiende primero.',
      ),
      codeLine: 4,
      variables: { operation: 'enqueue(30)', front: 10, size: 3 },
    })

    steps.push({
      concept: { type: 'stackQueue', structure: 'queue', items: sq([{ value: 10, state: 'normal' }, { value: 20, state: 'normal' }, { value: 30, state: 'normal' }, { value: 42, state: 'entering' }]), operation: 'enqueue(42)' },
      description: d(locale,
        'enqueue(42): 42 goes to the back. Processing order: 10 → 20 → 30 → 42.',
        'enqueue(42): 42 va al final. Orden de procesamiento: 10 → 20 → 30 → 42.',
      ),
      codeLine: 4,
      variables: { operation: 'enqueue(42)', front: 10, size: 4 },
    })

    steps.push({
      concept: { type: 'stackQueue', structure: 'queue', items: sq([{ value: 20, state: 'normal' }, { value: 30, state: 'normal' }, { value: 42, state: 'normal' }]), operation: 'dequeue() → 10', removedValue: 10 },
      description: d(locale,
        'dequeue() → 10. FIFO: the first element added is removed first! Unlike a stack.',
        'dequeue() → 10. FIFO: ¡el primer elemento añadido se retira primero! A diferencia de una pila.',
      ),
      codeLine: 8,
      variables: { operation: 'dequeue()', removed: 10, front: 20, size: 3 },
    })

    steps.push({
      concept: { type: 'stackQueue', structure: 'queue', items: sq([{ value: 30, state: 'normal' }, { value: 42, state: 'normal' }]), operation: 'dequeue() → 20', removedValue: 20 },
      description: d(locale,
        'dequeue() → 20. Now 30 is at the front. Elements are always processed in arrival order.',
        'dequeue() → 20. Ahora 30 está al frente. Los elementos se procesan siempre en orden de llegada.',
      ),
      codeLine: 8,
      variables: { operation: 'dequeue()', removed: 20, front: 30, size: 2 },
    })

    steps.push({
      concept: { type: 'stackQueue', structure: 'queue', items: sq([{ value: 30, state: 'normal' }, { value: 42, state: 'normal' }]), operation: 'front() → 30' },
      description: d(locale,
        'front() → 30. View the front without removing it. All operations are O(1)!',
        'front() → 30. Ver el frente sin eliminarlo. ¡Todas las operaciones son O(1)!',
      ),
      codeLine: 12,
      variables: { operation: 'front()', front: 30, size: 2, complexity: 'O(1)' },
    })

    return steps
  },
}
