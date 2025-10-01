import { CodeExample } from '@/types/playground';

export const playgroundExamples: CodeExample[] = [
  {
    title: 'Hello World',
    description: 'Minimal program that prints to stdout',
    code: `print("Hello, Orus!")`,
  },
  {
    title: 'Variables & Mutability',
    description: 'Bindings are immutable by default—opt into mutation with let mut',
    code: `greeting: string = "Hi"
mut counter = 0

print(greeting)
counter += 1
print("Counter:", counter)`,
  },
  {
    title: 'Arrays & Loops',
    description: 'Iterate over arrays and ranges using for and while loops',
    code: `numbers = [1, 2, 3]

for i in 0..len(numbers):
    print("Index", i, "=>", numbers[i])

mut total = 0
for value in numbers:
    total += value

print("Total:", total)`,
  },
  {
    title: 'Structs & Methods',
    description: 'Define data types with methods using impl blocks',
    code: `struct Point:
    x: i32
    y: i32

impl Point:
    fn new(x: i32, y: i32) -> Point:
        return Point{ x: x, y: y }

    fn translate(self, dx: i32, dy: i32) -> Point:
        return Point{ x: self.x + dx, y: self.y + dy }

point = Point.new(2, 4)
shifted = point.translate(3, -1)
print("Shifted:", shifted.x, shifted.y)`,
  },
  {
    title: 'Enums & Matching',
    description: 'Pattern match on enum variants and reuse helpers for comparisons',
    code: `fn max(a: i32, b: i32) -> i32:
    if a > b:
        return a
    return b

enum Signal:
    Green
    Yellow
    Red

fn describe(signal: Signal):
    match signal:
        Signal.Green -> print("go")
        Signal.Yellow -> print("slow")
        Signal.Red -> print("stop")

best = max(10, 42)
print("Max:", best)
describe(Signal.Green)`,
  },
];
