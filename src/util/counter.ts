export function Counter(array: string[]) {
  const count: { [key: string]: number } = {}
  array.forEach((val) => (count[val] = (count[val] || 0) + 1))
  return Object.entries(count).map(([x, y], _) => ({ key: x, value: y }))
}
