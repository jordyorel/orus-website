import SyntaxHighlighter from '@/components/SyntaxHighlighter';

export interface DocSection {
  title: string;
  nextSection: string | null;
  content: JSX.Element;
}

const sections: Record<string, DocSection> = {
  'hello-world': {
    title: 'Hello World',
    nextSection: 'variables',
    content: (
      <div className="space-y-6">
        <p className="text-charcoal-300 leading-relaxed">
          A simple Orus program prints text using the built-in <code className="bg-charcoal-800 px-2 py-1 rounded text-gold-400">print</code> function. The interpreter searches for a single <code className="bg-charcoal-800 px-2 py-1 rounded text-gold-400">main</code> function across the entry file and uses it as the starting point of execution.
        </p>

        <SyntaxHighlighter
          code={`fn main() {
    print("Hello, Orus!")
}`}
          language="orus"
        />

        <p className="text-charcoal-300 leading-relaxed">
          You can organize larger programs into multiple modules. Only the entry file must provide a <code className="bg-charcoal-800 px-2 py-1 rounded text-gold-400">main</code> function.
        </p>
      </div>
    ),
  },
  variables: {
    title: 'Variables & Mutability',
    nextSection: 'constants',
    content: (
      <div className="space-y-6">
        <p className="text-charcoal-300 leading-relaxed">
          Declare variables with <code className="bg-charcoal-800 px-2 py-1 rounded text-gold-400">let</code>. Bindings are immutable by default and live for the scope in which they are declared. Add <code className="bg-charcoal-800 px-2 py-1 rounded text-gold-400">mut</code> when reassignment is required.
        </p>

        <SyntaxHighlighter
          code={`let number: i32 = 5     // immutable
let mut count = 0       // mutable, type inferred as i32

fn bump() {
    let mut value = 1
    value = 2       // ✅ allowed
    // value = 3.0  // ❌ type mismatch
}`}
          language="orus"
        />

        <ul className="list-disc list-inside text-charcoal-300 space-y-2">
          <li><strong>Immutability</strong> helps reason about state. Rebinding an immutable name is a compile-time error.</li>
          <li>Types never change after initialization. Use explicit annotations when inference is insufficient.</li>
          <li>Variables must be declared inside functions; there are no global mutable bindings.</li>
        </ul>
      </div>
    ),
  },
  constants: {
    title: 'Constants & Statics',
    nextSection: 'types',
    content: (
      <div className="space-y-6">
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-white">Compile-time Constants</h3>
          <p className="text-charcoal-300 leading-relaxed">
            Use <code className="bg-charcoal-800 px-2 py-1 rounded text-gold-400">const</code> to declare compile-time values. Constants may appear at the top level and can be marked <code className="bg-charcoal-800 px-2 py-1 rounded text-gold-400">pub</code> so other modules can access them.
          </p>
          <SyntaxHighlighter
            code={`pub const LIMIT: i32 = 10

fn main() {
    for i in 0..LIMIT {
        print(i)
    }
}`}
            language="orus"
          />
        </div>

        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-white">Static Variables</h3>
          <p className="text-charcoal-300 leading-relaxed">
            Define global state with <code className="bg-charcoal-800 px-2 py-1 rounded text-gold-400">static</code>. Add <code className="bg-charcoal-800 px-2 py-1 rounded text-gold-400">mut</code> for mutability. Statics must live at the top level of a file.
          </p>
          <SyntaxHighlighter
            code={`static mut COUNTER: u64 = 0u

fn increment() {
    COUNTER = COUNTER + 1u
}`}
            language="orus"
          />
        </div>
      </div>
    ),
  },
  types: {
    title: 'Primitive Types & Casting',
    nextSection: 'operators',
    content: (
      <div className="space-y-6">
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-white">Primitive Types</h3>
          <ul className="list-disc list-inside text-charcoal-300 space-y-2">
            <li><code className="bg-charcoal-800 px-2 py-1 rounded text-gold-400">i32</code> – 32-bit signed integer</li>
            <li><code className="bg-charcoal-800 px-2 py-1 rounded text-gold-400">i64</code> – 64-bit signed integer</li>
            <li><code className="bg-charcoal-800 px-2 py-1 rounded text-gold-400">u32</code> – 32-bit unsigned integer</li>
            <li><code className="bg-charcoal-800 px-2 py-1 rounded text-gold-400">u64</code> – 64-bit unsigned integer</li>
            <li><code className="bg-charcoal-800 px-2 py-1 rounded text-gold-400">f64</code> – double precision floating point</li>
            <li><code className="bg-charcoal-800 px-2 py-1 rounded text-gold-400">bool</code> – <code>true</code> or <code>false</code></li>
            <li><code className="bg-charcoal-800 px-2 py-1 rounded text-gold-400">string</code> – UTF-8 text</li>
            <li><code className="bg-charcoal-800 px-2 py-1 rounded text-gold-400">void</code> – lack of a return value</li>
            <li><code className="bg-charcoal-800 px-2 py-1 rounded text-gold-400">nil</code> – explicit nil literal</li>
          </ul>
        </div>

        <SyntaxHighlighter
          code={`let flag: bool = true
let text = "hello"       // type inference
let big: u64 = 1_000_000u
`}
          language="orus"
        />

        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-white">Casting Rules</h3>
          <p className="text-charcoal-300 leading-relaxed">
            Numeric types never convert implicitly. Use <code className="bg-charcoal-800 px-2 py-1 rounded text-gold-400">as</code> to change representation. Integer casts truncate on overflow, and floating point casts round toward zero.
          </p>
          <SyntaxHighlighter
            code={`let a: i32 = -5
let b: u32 = a as u32
let c: f64 = b as f64
let d: i32 = c as i32
let truthy: bool = b as bool`}
            language="orus"
          />
        </div>

        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-white">Numeric Literals</h3>
          <p className="text-charcoal-300 leading-relaxed">
            Integer literals default to decimal but support hexadecimal with <code className="bg-charcoal-800 px-2 py-1 rounded text-gold-400">0x</code>. Append <code className="bg-charcoal-800 px-2 py-1 rounded text-gold-400">u</code> for unsigned values and use underscores for readability.
          </p>
          <SyntaxHighlighter
            code={`let dec = 42
let hex = 0x2A
let big = 1_000_000u`}
            language="orus"
          />
        </div>

        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-white">Comments</h3>
          <SyntaxHighlighter
            code={`// single line comment
let x = 1 /* inline */ + 2

/*
Block comments span multiple lines.
*/`}
            language="orus"
          />
        </div>
      </div>
    ),
  },
  operators: {
    title: 'Operators',
    nextSection: 'control-flow',
    content: (
      <div className="space-y-6">
        <p className="text-charcoal-300 leading-relaxed">
          Orus provides familiar arithmetic (<code className="bg-charcoal-800 px-2 py-1 rounded text-gold-400">+</code>, <code className="bg-charcoal-800 px-2 py-1 rounded text-gold-400">-</code>, <code className="bg-charcoal-800 px-2 py-1 rounded text-gold-400">*</code>, <code className="bg-charcoal-800 px-2 py-1 rounded text-gold-400">/</code>, <code className="bg-charcoal-800 px-2 py-1 rounded text-gold-400">%</code>) and comparison operators as well as logical operators (<code className="bg-charcoal-800 px-2 py-1 rounded text-gold-400">and</code>, <code className="bg-charcoal-800 px-2 py-1 rounded text-gold-400">or</code>, <code className="bg-charcoal-800 px-2 py-1 rounded text-gold-400">not</code>). Bitwise operations use <code className="bg-charcoal-800 px-2 py-1 rounded text-gold-400">&amp;</code>, <code className="bg-charcoal-800 px-2 py-1 rounded text-gold-400">|</code>, <code className="bg-charcoal-800 px-2 py-1 rounded text-gold-400">^</code>, <code className="bg-charcoal-800 px-2 py-1 rounded text-gold-400">!</code>, <code className="bg-charcoal-800 px-2 py-1 rounded text-gold-400">&lt;&lt;</code>, and <code className="bg-charcoal-800 px-2 py-1 rounded text-gold-400">&gt;&gt;</code> with both operands sharing the same integer type.
        </p>

        <SyntaxHighlighter
          code={`let total = (a + b) * 2
let active = not disabled and count > 0
let masked = flags & 0xFF
let next = condition ? left : right`}
          language="orus"
        />

        <p className="text-charcoal-300 leading-relaxed">
          The inline conditional form <code className="bg-charcoal-800 px-2 py-1 rounded text-gold-400">condition ? expr1 : expr2</code> evaluates to <code className="bg-charcoal-800 px-2 py-1 rounded text-gold-400">expr1</code> when the condition is true, otherwise <code className="bg-charcoal-800 px-2 py-1 rounded text-gold-400">expr2</code>.
        </p>
      </div>
    ),
  },
  'control-flow': {
    title: 'Control Flow',
    nextSection: 'arrays',
    content: (
      <div className="space-y-6">
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-white">Conditionals</h3>
          <SyntaxHighlighter
            code={`if n > 0 {
    print("positive")
} elif n == 0 {
    print("zero")
} else {
    print("negative")
}`}
            language="orus"
          />
        </div>

        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-white">Loops</h3>
          <SyntaxHighlighter
            code={`for i in 0..5 {          // 0 to 4
    print(i)
}

while condition {
    // repeat while true
}

break      // exit loop
continue   // next iteration`}
            language="orus"
          />
        </div>
      </div>
    ),
  },
  arrays: {
    title: 'Arrays & Slicing',
    nextSection: 'structs',
    content: (
      <div className="space-y-6">
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-white">Fixed-length Arrays</h3>
          <SyntaxHighlighter
            code={`let nums: [i32; 3] = [1, 2, 3]
let first = nums[0]
nums[1] = 20`}
            language="orus"
          />
        </div>

        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-white">Growing Arrays</h3>
          <SyntaxHighlighter
            code={`let values: [i32; 1] = [0]
push(values, 10)
print(len(values))  // 2`}
            language="orus"
          />
        </div>

        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-white">Slicing</h3>
          <SyntaxHighlighter
            code={`let part = nums[0..2]
let prefix = nums[..2]
let suffix = nums[1..]
let whole = nums[..]`}
            language="orus"
          />
        </div>
      </div>
    ),
  },
  structs: {
    title: 'Structs & Methods',
    nextSection: 'functions',
    content: (
      <div className="space-y-6">
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-white">Struct Declarations</h3>
          <SyntaxHighlighter
            code={`struct Point {
    x: i32,
    y: i32,
}

let p = Point{ x: 1, y: 2 }
print(p.x)`}
            language="orus"
          />
        </div>

        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-white">Methods with impl</h3>
          <SyntaxHighlighter
            code={`impl Point {
    fn new(x: i32, y: i32) -> Point {
        return Point{ x: x, y: y }
    }

    fn move_by(self, dx: i32, dy: i32) {
        self.x = self.x + dx
        self.y = self.y + dy
    }
}

let p = Point.new(1, 2)
p.move_by(3, 4)`}
            language="orus"
          />
        </div>
      </div>
    ),
  },
  functions: {
    title: 'Functions',
    nextSection: 'pattern-matching',
    content: (
      <div className="space-y-6">
        <p className="text-charcoal-300 leading-relaxed">
          Define functions with <code className="bg-charcoal-800 px-2 py-1 rounded text-gold-400">fn</code>. Parameter types are mandatory and the return type follows <code className="bg-charcoal-800 px-2 py-1 rounded text-gold-400">-&gt;</code>. Functions may be declared after their call sites—the interpreter performs a prepass to register signatures.
        </p>

        <SyntaxHighlighter
          code={`fn add(a: i32, b: i32) -> i32 {
    return a + b
}

fn greet(name: string) {
    print("Hello, {}!", name)
}`}
          language="orus"
        />
      </div>
    ),
  },
  'pattern-matching': {
    title: 'Pattern Matching',
    nextSection: 'error-handling',
    content: (
      <div className="space-y-6">
        <p className="text-charcoal-300 leading-relaxed">
          Use <code className="bg-charcoal-800 px-2 py-1 rounded text-gold-400">match</code> to compare a value against patterns. Branches execute from top to bottom and the first match wins. Use <code className="bg-charcoal-800 px-2 py-1 rounded text-gold-400">_</code> as a wildcard.
        </p>

        <SyntaxHighlighter
          code={`match value {
    0 => print("zero"),
    1 => print("one"),
    _ => print("other"),
}`}
          language="orus"
        />
      </div>
    ),
  },
  'error-handling': {
    title: 'Error Handling',
    nextSection: 'generics',
    content: (
      <div className="space-y-6">
        <p className="text-charcoal-300 leading-relaxed">
          Wrap fallible operations inside <code className="bg-charcoal-800 px-2 py-1 rounded text-gold-400">try</code>/<code className="bg-charcoal-800 px-2 py-1 rounded text-gold-400">catch</code>. The interpreter includes the file, line, column, and a short stack trace in error messages.
        </p>

        <SyntaxHighlighter
          code={`try {
    let x = 10 / 0
} catch err {
    print("Error: {}", err)
}`}
          language="orus"
        />
      </div>
    ),
  },
  generics: {
    title: 'Generics',
    nextSection: 'modules',
    content: (
      <div className="space-y-6">
        <SyntaxHighlighter
          code={`fn id<T>(x: T) -> T {
    return x
}

struct Box<T> { value: T }

let a = id<i32>(5)
let b: Box<string> = Box { value: "hi" }`}
          language="orus"
        />

        <p className="text-charcoal-300 leading-relaxed">
          Add constraints like <code className="bg-charcoal-800 px-2 py-1 rounded text-gold-400">Numeric</code> and <code className="bg-charcoal-800 px-2 py-1 rounded text-gold-400">Comparable</code> to enable arithmetic or comparison operators. The <code className="bg-charcoal-800 px-2 py-1 rounded text-gold-400">Numeric</code> constraint implies comparability.
        </p>

        <SyntaxHighlighter
          code={`fn add<T: Numeric>(a: T, b: T) -> T {
    return a + b
}

fn min<T: Comparable>(a: T, b: T) -> T {
    if a < b {
        return a
    }
    return b
}`}
          language="orus"
        />

        <p className="text-charcoal-300 leading-relaxed">
          Generics can cross module boundaries. A prepass specializes functions and structs before execution.
        </p>

        <SyntaxHighlighter
          code={`// util.orus
pub fn identity<T>(val: T) -> T {
    return val
}

// main.orus
use util

fn main() {
    print(util.identity<i32>(42))
}`}
          language="orus"
        />
      </div>
    ),
  },
  modules: {
    title: 'Modules',
    nextSection: 'builtins',
    content: (
      <div className="space-y-6">
        <p className="text-charcoal-300 leading-relaxed">
          Split code across files and load modules with <code className="bg-charcoal-800 px-2 py-1 rounded text-gold-400">use</code>. Imports run once per module. Reference items through the module name or an alias.
        </p>

        <SyntaxHighlighter
          code={`use math::utils
use datetime as dt

fn main() {
    utils.helper()
    dt.now()
}`}
          language="orus"
        />

        <p className="text-charcoal-300 leading-relaxed">
          Add <code className="bg-charcoal-800 px-2 py-1 rounded text-gold-400">pub</code> to expose top-level declarations. Struct fields and methods are currently module-private.
        </p>

        <SyntaxHighlighter
          code={`// utils.orus
pub fn helper() {
    print("from helper")
}

pub struct Point { x: i32, y: i32 }
`}
          language="orus"
        />
      </div>
    ),
  },
  builtins: {
    title: 'Built-in Functions',
    nextSection: 'best-practices',
    content: (
      <div className="space-y-6">
        <p className="text-charcoal-300 leading-relaxed">
          Common helpers are available without imports. The list below covers the most frequently used built-ins.
        </p>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h4 className="text-lg font-semibold text-white mb-2">Core Utilities</h4>
            <ul className="list-disc list-inside text-charcoal-300 space-y-2">
              <li><code className="bg-charcoal-800 px-2 py-1 rounded text-gold-400">print(values...)</code></li>
              <li><code className="bg-charcoal-800 px-2 py-1 rounded text-gold-400">len(value)</code></li>
              <li><code className="bg-charcoal-800 px-2 py-1 rounded text-gold-400">push(array, value)</code> / <code className="bg-charcoal-800 px-2 py-1 rounded text-gold-400">pop(array)</code></li>
              <li><code className="bg-charcoal-800 px-2 py-1 rounded text-gold-400">reserve(array, capacity)</code></li>
              <li><code className="bg-charcoal-800 px-2 py-1 rounded text-gold-400">range(start, end)</code></li>
              <li><code className="bg-charcoal-800 px-2 py-1 rounded text-gold-400">sum(array)</code>, <code className="bg-charcoal-800 px-2 py-1 rounded text-gold-400">min(array)</code>, <code className="bg-charcoal-800 px-2 py-1 rounded text-gold-400">max(array)</code></li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold text-white mb-2">Type Helpers</h4>
            <ul className="list-disc list-inside text-charcoal-300 space-y-2">
              <li><code className="bg-charcoal-800 px-2 py-1 rounded text-gold-400">type_of(value)</code></li>
              <li><code className="bg-charcoal-800 px-2 py-1 rounded text-gold-400">is_type(value, name)</code></li>
              <li><code className="bg-charcoal-800 px-2 py-1 rounded text-gold-400">input(prompt)</code></li>
              <li><code className="bg-charcoal-800 px-2 py-1 rounded text-gold-400">int(text)</code>, <code className="bg-charcoal-800 px-2 py-1 rounded text-gold-400">float(text)</code></li>
              <li><code className="bg-charcoal-800 px-2 py-1 rounded text-gold-400">timestamp()</code></li>
              <li><code className="bg-charcoal-800 px-2 py-1 rounded text-gold-400">sorted(array, key=nil, reverse)</code></li>
            </ul>
          </div>
        </div>

        <SyntaxHighlighter
          code={`let arr: [i32; 1] = [1]
reserve(arr, 10)
push(arr, 2)
print(len(arr))`}
          language="orus"
        />
      </div>
    ),
  },
  'best-practices': {
    title: 'Best Practices',
    nextSection: 'feature-status',
    content: (
      <div className="space-y-6">
        <ul className="list-disc list-inside text-charcoal-300 space-y-2">
          <li>Group related code into modules and expose only necessary <code className="bg-charcoal-800 px-2 py-1 rounded text-gold-400">pub</code> items.</li>
          <li>Favor immutable bindings. Reach for <code className="bg-charcoal-800 px-2 py-1 rounded text-gold-400">let mut</code> only when mutation improves clarity.</li>
          <li>Adopt naming conventions: snake_case for functions/variables, CamelCase for structs, and UPPER_SNAKE for constants.</li>
          <li>Wrap fallible logic in <code className="bg-charcoal-800 px-2 py-1 rounded text-gold-400">try</code>/<code className="bg-charcoal-800 px-2 py-1 rounded text-gold-400">catch</code> blocks or return sentinel values like <code className="bg-charcoal-800 px-2 py-1 rounded text-gold-400">nil</code>.</li>
          <li>Use the examples under <code className="bg-charcoal-800 px-2 py-1 rounded text-gold-400">tests/</code> as regression tests and add new files when fixing bugs.</li>
          <li>Enable verbose checks with <code className="bg-charcoal-800 px-2 py-1 rounded text-gold-400">DEBUG=1</code> and consult debugging references when tracking tricky issues.</li>
        </ul>
      </div>
    ),
  },
  'feature-status': {
    title: 'Feature Status',
    nextSection: null,
    content: (
      <div className="space-y-4 text-charcoal-300 leading-relaxed">
        <p>Version 0.7.0 focuses on a solid core language with a minimal standard library. The following summary mirrors the current state of the implementation.</p>
        <ul className="list-disc list-inside space-y-2">
          <li>Modules, pattern matching, error handling, and <code className="bg-charcoal-800 px-2 py-1 rounded text-gold-400">impl</code> blocks are fully implemented.</li>
          <li>Generics support forward declarations, constraints, cross-module specialization, and improved inference.</li>
          <li>The standard library remains intentionally small; more built-ins are planned.</li>
          <li>Initial <code className="bg-charcoal-800 px-2 py-1 rounded text-gold-400">std/</code> modules include helpers like <code className="bg-charcoal-800 px-2 py-1 rounded text-gold-400">std/math</code>.</li>
          <li>A basic <code className="bg-charcoal-800 px-2 py-1 rounded text-gold-400">std/random</code> module ships with limitations documented in the project.</li>
        </ul>
      </div>
    ),
  },
};

export const getDocContent = (sectionName: string): DocSection => {
  return sections[sectionName] ?? sections['hello-world'];
};
