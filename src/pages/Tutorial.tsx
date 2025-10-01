import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import SyntaxHighlighter from '@/components/SyntaxHighlighter';
import { ScrollArea } from '@/components/ui/scroll-area';
import { BookOpen, Compass, Code, Layers, Workflow, Boxes, GitBranch, Lightbulb } from 'lucide-react';

interface TutorialSection {
  id: string;
  title: string;
  description: string;
  bullets: string[];
  code?: string;
}

const tutorialSections: TutorialSection[] = [
  {
    id: 'orientation',
    title: 'Orientation',
    description: 'Understand how Orus treats whitespace, blocks, and comments before writing code.',
    bullets: [
      'Source files are newline-oriented and reject semicolons (`E1007`).',
      'Indentation follows a colon (`:`); tabs count as four spaces and mixing widths fails.',
      'Use `//` for line comments and `/* ... */` for block comments (non-nesting).',
    ],
    code: `// Single line comment
/* Block comment
   over multiple lines */
print("Hello")`,
  },
  {
    id: 'hello-world',
    title: 'Hello, Orus!',
    description: 'First output, formatting helpers, and streaming text without newlines.',
    bullets: [
      '`print` adds a newline and separates arguments with a space.',
      '`print_no_newline` keeps the cursor on the same line for progress messages.',
      'Format tokens such as `@.2f`, `@x`, `@b`, and `@o` inside the leading string literal format the next argument.',
    ],
    code: `print("Hello, Orus!")
print("Pi = @.2f", 3.14159)`,
  },
  {
    id: 'values-types',
    title: 'Values and Types',
    description: 'Numeric defaults, strings, and explicit annotations mirror the reference.',
    bullets: [
      'Integers start as `i32`; larger literals upgrade to `i64` while parsing.',
      'Floating literals are `f64`; strings accept common escape sequences.',
      'Annotate types after the name with `name: Type = value` when inference needs help.',
    ],
    code: `count = 42
big: i64 = 5_000_000_000
ratio = 6.022e23
message = "Line one\\nLine two"`,
  },
  {
    id: 'variables',
    title: 'Variables and Mutability',
    description: 'Bindings are immutable by default but can be switched to `mut` as needed.',
    bullets: [
      'Prefix with `mut` to reassign, otherwise rebinding causes a compile error.',
      'Declare multiple bindings on one line with commas; names accept letters, digits, or `_`.',
      'Compound assignments like `+=` update existing mutable bindings.',
    ],
    code: `score = 10
mut retries = 0
threshold: f64 = 0.75
x = 1, mut y = 2

mut retries += 1`,
  },
  {
    id: 'strings-printing',
    title: 'Strings and Printing',
    description: 'Concatenate strings, reuse formatting tokens, and mix values seamlessly.',
    bullets: [
      'Treat strings like any value—concatenate with `+` or cast other types using `as string`.',
      'Printing helpers accept multiple arguments and handle spacing for you.',
      'Combine literals and expressions to build custom separators.',
    ],
    code: `name = "Orus"
pi = 3.14159
print("Hello", name)
print("Pi ~= @.2f", pi)
combined = "a" + " :: " + "b" + " :: " + "c"
print(combined)`,
  },
  {
    id: 'control-flow',
    title: 'Branching and Loops',
    description: 'Conditionals enforce boolean expressions and loops cover ranges or iterables.',
    bullets: [
      '`if` / `elif` / `else` require boolean conditions—assignments inside conditions are rejected.',
      'Use `while` for condition-based loops, `for` with ranges (`start..end`, `start..=end`, `..step`), or iterate arrays.',
      'Label loops with an apostrophe (`\'outer:`) when you need targeted `break`/`continue` control.',
    ],
    code: `if status == "ok":
    print("ready")
elif status == "retry":
    print("waiting")
else:
    print("failed")

mut attempts = 0
while attempts < 3:
    attempts += 1

for i in 0..10..2:
    print(i)`,
  },
  {
    id: 'arrays',
    title: 'Arrays in Practice',
    description: 'Dynamic arrays grow with helpers and slicing keeps the end bound inclusive.',
    bullets: [
      'Construct arrays with brackets; empty literals default to a dynamic array.',
      '`len` returns an `i32` length, while `push`/`pop` mutate the array in place.',
      'Slices use inclusive upper bounds—pass the length (or omit it) to include the final element.',
    ],
    code: `mut numbers = []
push(numbers, 1)
push(numbers, 2)
push(numbers, 3)
print("len", len(numbers))
print("slice", numbers[0..1])`,
  },
  {
    id: 'functions',
    title: 'Functions and Higher-Order Code',
    description: 'Named functions and inline function values follow the same syntax.',
    bullets: [
      'Define functions with `fn name(params) -> ReturnType:`—omit the arrow for `void`.',
      '`return` exits early; drop the expression to return `void`.',
      'Function expressions (`fn (...) -> ...:`) capture surrounding bindings automatically.',
    ],
    code: `fn add(a: i32, b: i32) -> i32:
    return a + b

square = fn(value: i32) -> i32:
    return value * value

print(add(5, 7))
print(square(6))`,
  },
  {
    id: 'structs',
    title: 'Structs and Methods',
    description: 'Combine data with behaviour using `struct` and `impl` blocks.',
    bullets: [
      'Declare structs with named fields and optional defaults (`y: i32 = 0`).',
      'Construct values via `Type{ field: value }` and mutate fields with dot notation.',
      '`impl` blocks attach methods—functions whose first parameter is `self` become instance methods.',
    ],
    code: `struct Point:
    x: i32
    y: i32 = 0

impl Point:
    fn translate(self, dx: i32, dy: i32) -> Point:
        return Point{ x: self.x + dx, y: self.y + dy }

p = Point{ x: 0, y: 0 }
print(p.translate(3, 4).y)`,
  },
  {
    id: 'enums',
    title: 'Enums and Pattern Matching',
    description: 'Model variants with payloads and handle them exhaustively.',
    bullets: [
      'Enums list variants; each variant can carry data with optional field names.',
      '`match` statements are exhaustive—add a wildcard arm (`_`) to cover the remainder.',
      'Match expressions return values and bindings inside arms are scoped to that arm.',
    ],
    code: `enum Result:
    Ok(value: i32)
    Err(message: string)

outcome = Result.Ok(42)

match outcome:
    Result.Ok(value) ->
        print("ok", value)
    Result.Err(reason) ->
        print("error", reason)`,
  },
  {
    id: 'errors',
    title: 'Error Handling',
    description: 'Guard code with `try` blocks and surface failures using `throw`.',
    bullets: [
      '`try:` introduces protected code; `catch err:` handles thrown values immediately after the block.',
      '`throw expression` raises an error value—control jumps to the nearest handler.',
      'Both `try` and `catch` accept either a single-line statement or an indented block.',
    ],
    code: `try:
    risky = 10 / step
catch err:
    print("caught", err)

throw "unexpected state"`,
  },
  {
    id: 'modules',
    title: 'Modules and Organisation',
    description: 'Tie files to module names and control visibility with `pub`.',
    bullets: [
      'Place `module path` at the top of a file; dotted names map to directories.',
      '`use` at module scope imports other modules entirely or by symbol list.',
      'Use `pub` to export `fn`, `struct`, `enum`, `impl`, or uppercase `global` declarations.',
    ],
    code: `module geometry.points:

    pub struct Point:
        x: i32
        y: i32

    pub fn origin() -> Point:
        return Point{ x: 0, y: 0 }

use geometry.points: Point, origin

fn main():
    p = origin()
    print(Point{ x: 5, y: 6 })`,
  },
  {
    id: 'conversions',
    title: 'Explicit Conversions',
    description: 'Move between numeric, boolean, and string representations with `as`.',
    bullets: [
      'No implicit promotions exist—always cast explicitly with `value as Type`.',
      'Casting `f64` to integers truncates toward zero, while boolean casts follow `true → 1`, `false → 0`.',
      'Any value converts to `string`, and invalid casts raise runtime errors.',
    ],
    code: `value: i32 = 42
flag: bool = value as bool
text = value as string
ratio = (value as f64) / 10.0`,
  },
  {
    id: 'builtins',
    title: 'Built-ins and Utilities',
    description: 'Standard helpers that ship with the runtime.',
    bullets: [
      '`print(...)` and `print_no_newline(...)` cover console output.',
      '`len(array)`, `push(array, value)`, and `pop(array)` manage dynamic arrays.',
      '`time_stamp()` yields a monotonic `f64` timestamp in seconds for rudimentary profiling.',
    ],
    code: `start: f64 = time_stamp()
for i in 0..1_000_000:
    pass
elapsed = time_stamp() - start
print("elapsed seconds:", elapsed)`
  },
];

const referenceHighlights = [
  {
    title: 'Boolean Logic and Operators',
    description: 'Use familiar arithmetic (`+`, `-`, `*`, `/`, `%`) and comparisons (`<`, `<=`, `>`, `>=`, `==`, `!=`). Logical operators stay textual: `and`, `or`, `not`.',
  },
  {
    title: 'matches Keyword',
    description: '`flag matches Flag.On` is sugar for equality with enums and improves readability in conditions.',
  },
  {
    title: 'Slices Are Inclusive',
    description: 'Array slices such as `numbers[0..1]` include both index `0` and `1`; provide the length or omit the end to include the last element.',
  },
  {
    title: 'Globals Must Be Uppercase',
    description: 'Declare globals with `global` at module scope, ensure the identifier is uppercase, and mark them `mut` only when necessary.',
  },
];

const Tutorial = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-charcoal-950 via-charcoal-900 to-charcoal-950">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <header className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <Badge className="bg-gold-500/20 border border-gold-500/40 text-gold-300">
              Source: TUTORIAL.md & LANGUAGE.md
            </Badge>
            <BookOpen className="text-gold-400" size={20} />
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4">
            Orus Tutorial
          </h1>
          <p className="text-xl text-charcoal-300 max-w-3xl leading-relaxed">
            Walk through the language exactly as implemented today. These sections mirror the repository tutorial and
            language reference so you can copy-paste examples straight into the Orus playground.
          </p>
        </header>

        <div className="grid lg:grid-cols-[320px_minmax(0,1fr)] gap-8 items-start">
          <aside className="hidden lg:block">
            <Card className="bg-charcoal-800/60 border-charcoal-700 p-6 sticky top-24">
              <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Compass size={18} className="text-gold-400" />
                Tutorial Map
              </h2>
              <ScrollArea className="max-h-[60vh] pr-2">
                <nav className="space-y-2">
                  {tutorialSections.map((section) => (
                    <a
                      key={section.id}
                      href={`#${section.id}`}
                      className="block text-sm text-charcoal-300 hover:text-gold-300 transition-colors"
                    >
                      {section.title}
                    </a>
                  ))}
                </nav>
              </ScrollArea>
            </Card>
          </aside>

          <main className="space-y-10">
            {tutorialSections.map((section) => (
              <div key={section.id} id={section.id} className="scroll-mt-24">
                <Card className="bg-charcoal-800/50 border-charcoal-700 p-8 space-y-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-full bg-gold-500/15 text-gold-300">
                      <Workflow size={20} />
                    </div>
                    <div>
                      <h2 className="text-2xl font-semibold text-white">{section.title}</h2>
                      <p className="text-charcoal-300">{section.description}</p>
                    </div>
                  </div>

                  <ul className="list-disc list-inside space-y-2 text-charcoal-200">
                    {section.bullets.map((item, idx) => (
                      <li key={idx} className="leading-relaxed">
                        {item}
                      </li>
                    ))}
                  </ul>

                  {section.code && (
                    <SyntaxHighlighter code={section.code} language="orus" />
                  )}
                </Card>
              </div>
            ))}

            <Card className="bg-gradient-to-r from-gold-500/10 to-gold-600/10 border border-gold-500/30 p-8 space-y-6">
              <div className="flex items-center gap-3">
                <Layers size={22} className="text-gold-300" />
                <h2 className="text-2xl font-semibold text-white">Reference Highlights</h2>
              </div>
              <p className="text-charcoal-200">
                The language reference (`LANGUAGE.md`) expands on every rule. Here are a few checkpoints to revisit while experimenting in the playground:
              </p>
              <div className="grid md:grid-cols-2 gap-4">
                {referenceHighlights.map((item) => (
                  <Card key={item.title} className="bg-charcoal-900/60 border border-charcoal-700 p-5 space-y-2">
                    <div className="flex items-center gap-2 text-gold-300">
                      <Code size={18} />
                      <span className="font-semibold text-white">{item.title}</span>
                    </div>
                    <p className="text-sm text-charcoal-300 leading-relaxed">
                      {item.description}
                    </p>
                  </Card>
                ))}
              </div>
            </Card>

            <Card className="bg-charcoal-800/60 border border-charcoal-700 p-8 flex flex-col md:flex-row gap-6 md:items-center md:justify-between">
              <div>
                <h2 className="text-2xl font-semibold text-white flex items-center gap-2">
                  <Boxes size={22} className="text-gold-300" />
                  Next Steps
                </h2>
                <p className="text-charcoal-300 mt-2 leading-relaxed">
                  Jump into the Orus playground to run these snippets or open the markdown sources for additional context and edge cases.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <a
                  href="/play"
                  className="inline-flex items-center justify-center px-5 py-3 rounded-md bg-gold-500 text-charcoal-950 font-semibold shadow-sm hover:bg-gold-400 transition-colors"
                >
                  Try in Playground
                </a>
                <div className="flex flex-col text-sm text-charcoal-300">
                  <span className="flex items-center gap-2">
                    <GitBranch size={16} className="text-gold-300" />
                    Review `TUTORIAL.md`
                  </span>
                  <span className="flex items-center gap-2">
                    <Lightbulb size={16} className="text-gold-300" />
                    Review `LANGUAGE.md`
                  </span>
                </div>
              </div>
            </Card>
          </main>
        </div>
      </div>
    </div>
  );
};

export default Tutorial;
