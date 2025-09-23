
import { Card } from '@/components/ui/card';
import SyntaxHighlighter from '@/components/SyntaxHighlighter';

export interface DocSection {
  title: string;
  nextSection: string | null;
  content: JSX.Element;
}

export const getDocContent = (sectionName: string): DocSection => {
  switch (sectionName) {
    case 'hello-world':
      return {
        title: 'Hello World',
        nextSection: 'syntax',
        content: (
          <div className="space-y-6">
            <p className="text-charcoal-300 leading-relaxed">
              A simple program prints text using the built-in <code className="bg-charcoal-800 px-2 py-1 rounded text-gold-400">print</code> function:
            </p>
            
            <SyntaxHighlighter
              code={`fn main() {
    print("Hello, Orus!")
}`}
              language="orus"
            />
            
            <p className="text-charcoal-300 leading-relaxed">
              The interpreter looks for a <code className="bg-charcoal-800 px-2 py-1 rounded text-gold-400">main</code> function in the entry file. 
              Exactly one such function must exist across the project.
            </p>

            <h3 className="text-xl font-semibold text-white">Interactive Input</h3>
            <p className="text-charcoal-300 leading-relaxed">
              Get user input with the <code className="bg-charcoal-800 px-2 py-1 rounded text-gold-400">input</code> function:
            </p>
            
            <SyntaxHighlighter
              code={`fn main() {
    let name = input("What's your name? ")
    print("Hello, {}!", name)
}`}
              language="orus"
            />
          </div>
        )
      };
      
    case 'syntax':
      return {
        title: 'Basic Syntax',
        nextSection: 'variables',
        content: (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-white">Variables and Mutability</h3>
            <p className="text-charcoal-300 leading-relaxed">
              Variables are declared with <code className="bg-charcoal-800 px-2 py-1 rounded text-gold-400">let</code>.
            </p>
            
            <SyntaxHighlighter
              code={`let number: i32 = 5     // immutable
let mut count = 0       // mutable, type inferred as i32`}
              language="orus"
            />
            
            <ul className="list-disc list-inside text-charcoal-300 space-y-2">
              <li><strong>Immutability</strong> is the default. Reassigning an immutable binding is a compile-time error.</li>
              <li>Use <code className="bg-charcoal-800 px-2 py-1 rounded text-gold-400">let mut</code> to allow reassignment.</li>
              <li>Variables are block scoped and must be declared inside functions.</li>
            </ul>

            <h3 className="text-xl font-semibold text-white">Comments</h3>
            <SyntaxHighlighter
              code={`// single line
let x = 1 /* inline */ + 2

/*
This is a block comment.
*/`}
              language="orus"
            />

            <h3 className="text-xl font-semibold text-white">String Formatting</h3>
            <p className="text-charcoal-300 leading-relaxed">
              Use <code className="bg-charcoal-800 px-2 py-1 rounded text-gold-400">{`{}`}</code> placeholders for string interpolation:
            </p>
            
            <SyntaxHighlighter
              code={`let name = "Alice"
let age = 30
print("Hello, {}! You are {} years old.", name, age)`}
              language="orus"
            />
          </div>
        )
      };
      
    case 'variables':
      return {
        title: 'Variables & Types',
        nextSection: 'functions',
        content: (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-white">Primitive Types</h3>
            <ul className="list-disc list-inside text-charcoal-300 space-y-2">
              <li><code className="bg-charcoal-800 px-2 py-1 rounded text-gold-400">i32</code> – 32‑bit signed integer</li>
              <li><code className="bg-charcoal-800 px-2 py-1 rounded text-gold-400">i64</code> – 64‑bit signed integer</li>
              <li><code className="bg-charcoal-800 px-2 py-1 rounded text-gold-400">u32</code> – 32‑bit unsigned integer</li>
              <li><code className="bg-charcoal-800 px-2 py-1 rounded text-gold-400">u64</code> – 64‑bit unsigned integer</li>
              <li><code className="bg-charcoal-800 px-2 py-1 rounded text-gold-400">f64</code> – double precision floating point</li>
              <li><code className="bg-charcoal-800 px-2 py-1 rounded text-gold-400">bool</code> – boolean (true or false)</li>
              <li><code className="bg-charcoal-800 px-2 py-1 rounded text-gold-400">string</code> – UTF‑8 text</li>
            </ul>
            
            <SyntaxHighlighter
              code={`let flag: bool = true
let text = "hello"       // type inference
let pi: f64 = 3.14159
let count: u32 = 100`}
              language="orus"
            />
            
            <h3 className="text-xl font-semibold text-white">Type Casting</h3>
            <p className="text-charcoal-300 leading-relaxed">
              Numeric types never convert implicitly. Use <code className="bg-charcoal-800 px-2 py-1 rounded text-gold-400">as</code> to cast:
            </p>
            
            <SyntaxHighlighter
              code={`let a: i32 = -5
let b: u32 = a as u32
let big: u64 = a as u64
let c: i32 = big as i32
let f: f64 = a as f64`}
              language="orus"
            />

            <h3 className="text-xl font-semibold text-white">Constants</h3>
            <p className="text-charcoal-300 leading-relaxed">
              Constants are compile-time values that never change:
            </p>
            
            <SyntaxHighlighter
              code={`const MAX_USERS: i32 = 100
const PI: f64 = 3.14159
const APP_NAME: string = "MyApp"`}
              language="orus"
            />
          </div>
        )
      };

    case 'functions':
      return {
        title: 'Functions',
        nextSection: 'control-flow',
        content: (
          <div className="space-y-6">
            <p className="text-charcoal-300 leading-relaxed">
              Functions are defined with <code className="bg-charcoal-800 px-2 py-1 rounded text-gold-400">fn</code>. Parameter types are required and the return type follows <code className="bg-charcoal-800 px-2 py-1 rounded text-gold-400">-&gt;</code>.
            </p>
            
            <SyntaxHighlighter
              code={`fn add(a: i32, b: i32) -> i32 {
    return a + b
}

fn greet(name: string) {    // no return value
    print("Hello, {}!", name)
}

// Function with multiple parameters
fn calculate_area(width: f64, height: f64) -> f64 {
    return width * height
}`}
              language="orus"
            />

            <h3 className="text-xl font-semibold text-white">Default Parameters</h3>
            <p className="text-charcoal-300 leading-relaxed">
              Functions can have default parameter values:
            </p>
            
            <SyntaxHighlighter
              code={`fn power(base: i32, exponent: i32 = 2) -> i32 {
    let mut result = 1
    for i in 0..exponent {
        result = result * base
    }
    return result
}

// Usage
let square = power(5)      // uses default exponent of 2
let cube = power(5, 3)     // explicit exponent`}
              language="orus"
            />
            
            <p className="text-charcoal-300 leading-relaxed">
              Functions may be declared after their call site. Generic functions can also be referenced before their definitions thanks to a prepass that records all generic signatures.
            </p>
          </div>
        )
      };

    case 'control-flow':
      return {
        title: 'Control Flow',
        nextSection: 'pattern-matching',
        content: (
          <div className="space-y-6">
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
            
            <p className="text-charcoal-300 leading-relaxed">
              An inline form <code className="bg-charcoal-800 px-2 py-1 rounded text-gold-400">condition ? expr1 : expr2</code> evaluates to <code className="bg-charcoal-800 px-2 py-1 rounded text-gold-400">expr1</code> when the condition is true, otherwise <code className="bg-charcoal-800 px-2 py-1 rounded text-gold-400">expr2</code>.
            </p>

            <SyntaxHighlighter
              code={`let age = 20
let status = age >= 18 ? "adult" : "minor"
print("Status: {}", status)`}
              language="orus"
            />

            <h3 className="text-xl font-semibold text-white">Loops</h3>
            <SyntaxHighlighter
              code={`// Range-based for loop
for i in 0..5 {          // 0 to 4
    print(i)
}

// Inclusive range
for i in 0..=5 {         // 0 to 5
    print(i)
}

// While loop
let mut count = 0
while count < 10 {
    print("Count: {}", count)
    count = count + 1
}

// Infinite loop with break
loop {
    let input = input("Enter 'quit' to exit: ")
    if input == "quit" {
        break
    }
    print("You entered: {}", input)
}

// Continue statement
for i in 0..10 {
    if i % 2 == 0 {
        continue  // skip even numbers
    }
    print("Odd: {}", i)
}`}
              language="orus"
            />
          </div>
        )
      };

    case 'pattern-matching':
      return {
        title: 'Pattern Matching',
        nextSection: 'arrays',
        content: (
          <div className="space-y-6">
            <p className="text-charcoal-300 leading-relaxed">
              <code className="bg-charcoal-800 px-2 py-1 rounded text-gold-400">match</code> compares a value against patterns, similar to <code className="bg-charcoal-800 px-2 py-1 rounded text-gold-400">switch</code> in other languages but with explicit patterns like Rust.
            </p>
            
            <SyntaxHighlighter
              code={`match value {
    0 => print("zero"),
    1 => print("one"),
    2 | 3 => print("two or three"),  // multiple patterns
    _ => print("other"),
}`}
              language="orus"
            />

            <h3 className="text-xl font-semibold text-white">Range Patterns</h3>
            <p className="text-charcoal-300 leading-relaxed">
              Match against ranges of values:
            </p>
            
            <SyntaxHighlighter
              code={`match score {
    90..=100 => print("A"),
    80..=89 => print("B"), 
    70..=79 => print("C"),
    60..=69 => print("D"),
    _ => print("F"),
}`}
              language="orus"
            />

            <h3 className="text-xl font-semibold text-white">Match with Guards</h3>
            <p className="text-charcoal-300 leading-relaxed">
              Add conditions to patterns with <code className="bg-charcoal-800 px-2 py-1 rounded text-gold-400">if</code>:
            </p>
            
            <SyntaxHighlighter
              code={`match number {
    x if x > 0 => print("positive: {}", x),
    x if x < 0 => print("negative: {}", x),
    0 => print("zero"),
}`}
              language="orus"
            />
            
            <p className="text-charcoal-300 leading-relaxed">
              The first matching branch runs. Use <code className="bg-charcoal-800 px-2 py-1 rounded text-gold-400">_</code> as a wildcard.
            </p>
          </div>
        )
      };

    case 'arrays':
      return {
        title: 'Arrays & Slicing',
        nextSection: 'structs',
        content: (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-white">Fixed Arrays</h3>
            <p className="text-charcoal-300 leading-relaxed">
              Fixed-length arrays use <code className="bg-charcoal-800 px-2 py-1 rounded text-gold-400">[T; N]</code> syntax. Elements are zero indexed.
            </p>
            
            <SyntaxHighlighter
              code={`let nums: [i32; 3] = [1, 2, 3]
let first = nums[0]
nums[1] = 20

// Array with same value repeated
let zeros: [i32; 5] = [0; 5]  // [0, 0, 0, 0, 0]`}
              language="orus"
            />

            <h3 className="text-xl font-semibold text-white">Dynamic Arrays</h3>
            <p className="text-charcoal-300 leading-relaxed">
              Built-in functions can grow arrays dynamically.
            </p>
            
            <SyntaxHighlighter
              code={`let mut values: [i32; 1] = [0]
push(values, 10)
push(values, 20)
print("Length: {}", len(values))  // 3

let last = pop(values)
print("Popped: {}", last)  // 20`}
              language="orus"
            />

            <h3 className="text-xl font-semibold text-white">Array Iteration</h3>
            <p className="text-charcoal-300 leading-relaxed">
              Iterate over arrays with for loops:
            </p>
            
            <SyntaxHighlighter
              code={`let fruits = ["apple", "banana", "cherry"]

// Iterate over values
for fruit in fruits {
    print("Fruit: {}", fruit)
}

// Iterate with index
for i in 0..len(fruits) {
    print("{}: {}", i, fruits[i])
}`}
              language="orus"
            />

            <h3 className="text-xl font-semibold text-white">Slicing</h3>
            <p className="text-charcoal-300 leading-relaxed">
              Subarrays are created with <code className="bg-charcoal-800 px-2 py-1 rounded text-gold-400">[start..end]</code> (end exclusive).
            </p>
            
            <SyntaxHighlighter
              code={`let numbers = [1, 2, 3, 4, 5]
let part = numbers[1..4]   // [2, 3, 4]
let start = numbers[..3]   // [1, 2, 3]  
let end = numbers[2..]     // [3, 4, 5]
let copy = numbers[..]     // [1, 2, 3, 4, 5]`}
              language="orus"
            />
          </div>
        )
      };

    case 'structs':
      return {
        title: 'Structs & Methods',
        nextSection: 'enums',
        content: (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-white">Defining Structs</h3>
            <p className="text-charcoal-300 leading-relaxed">
              Structs group named fields.
            </p>
            
            <SyntaxHighlighter
              code={`struct Point {
    x: i32,
    y: i32,
}

let p = Point{ x: 1, y: 2 }
print("Point: ({}, {})", p.x, p.y)

// Struct update syntax
let p2 = Point{ x: 5, ..p }  // x: 5, y: 2`}
              language="orus"
            />

            <h3 className="text-xl font-semibold text-white">Methods with impl</h3>
            <p className="text-charcoal-300 leading-relaxed">
              Methods attach functions to a struct inside an <code className="bg-charcoal-800 px-2 py-1 rounded text-gold-400">impl</code> block. This style is similar to Rust.
            </p>
            
            <SyntaxHighlighter
              code={`impl Point {
    // Associated function (constructor)
    fn new(x: i32, y: i32) -> Point {
        return Point{ x: x, y: y }
    }

    // Method that takes self by value
    fn distance_from_origin(self) -> f64 {
        let dx = self.x as f64
        let dy = self.y as f64
        return (dx * dx + dy * dy).sqrt()
    }

    // Method that mutates self
    fn move_by(mut self, dx: i32, dy: i32) {
        self.x = self.x + dx
        self.y = self.y + dy
    }
}

// Usage
let mut p = Point::new(3, 4)
print("Distance: {}", p.distance_from_origin())
p.move_by(1, 1)`}
              language="orus"
            />

            <h3 className="text-xl font-semibold text-white">Tuple Structs</h3>
            <p className="text-charcoal-300 leading-relaxed">
              Structs with unnamed fields:
            </p>
            
            <SyntaxHighlighter
              code={`struct Color(u8, u8, u8)

let red = Color(255, 0, 0)
print("Red component: {}", red.0)`}
              language="orus"
            />
          </div>
        )
      };

    case 'enums':
      return {
        title: 'Enums & Option Types',
        nextSection: 'generics',
        content: (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-white">Basic Enums</h3>
            <p className="text-charcoal-300 leading-relaxed">
              Enums define types with multiple variants:
            </p>
            
            <SyntaxHighlighter
              code={`enum Direction {
    North,
    South,
    East,
    West,
}

let dir = Direction::North
match dir {
    Direction::North => print("Going north"),
    Direction::South => print("Going south"),
    Direction::East => print("Going east"),
    Direction::West => print("Going west"),
}`}
              language="orus"
            />

            <h3 className="text-xl font-semibold text-white">Enums with Data</h3>
            <p className="text-charcoal-300 leading-relaxed">
              Enum variants can hold data:
            </p>
            
            <SyntaxHighlighter
              code={`enum Message {
    Quit,
    Move{ x: i32, y: i32 },
    Write(string),
    ChangeColor(u8, u8, u8),
}

let msg = Message::Move{ x: 10, y: 20 }
match msg {
    Message::Quit => print("Quitting"),
    Message::Move{ x, y } => print("Moving to ({}, {})", x, y),
    Message::Write(text) => print("Text: {}", text),
    Message::ChangeColor(r, g, b) => print("Color: ({}, {}, {})", r, g, b),
}`}
              language="orus"
            />

            <h3 className="text-xl font-semibold text-white">Option Type</h3>
            <p className="text-charcoal-300 leading-relaxed">
              Handle nullable values safely with <code className="bg-charcoal-800 px-2 py-1 rounded text-gold-400">Option</code>:
            </p>
            
            <SyntaxHighlighter
              code={`enum Option<T> {
    Some(T),
    None,
}

fn divide(a: f64, b: f64) -> Option<f64> {
    if b == 0.0 {
        return Option::None
    } else {
        return Option::Some(a / b)
    }
}

let result = divide(10.0, 2.0)
match result {
    Option::Some(value) => print("Result: {}", value),
    Option::None => print("Cannot divide by zero"),
}`}
              language="orus"
            />
          </div>
        )
      };

    case 'generics':
      return {
        title: 'Generics',
        nextSection: 'modules',
        content: (
          <div className="space-y-6">
            <p className="text-charcoal-300 leading-relaxed">
              Functions and structs may take type parameters using angle brackets.
            </p>
            
            <SyntaxHighlighter
              code={`fn id<T>(x: T) -> T {
    return x
}

struct Box<T> { 
    value: T 
}

// Generic function with multiple type parameters
fn pair<T, U>(first: T, second: U) -> (T, U) {
    return (first, second)
}`}
              language="orus"
            />
            
            <p className="text-charcoal-300 leading-relaxed">
              Type arguments can often be inferred:
            </p>
            
            <SyntaxHighlighter
              code={`let num_box = Box { value: 42 }           // Box<i32>
let str_box: Box<string> = Box { value: "hello" }
let result = pair("hello", 123)           // (string, i32)`}
              language="orus"
            />

            <h3 className="text-xl font-semibold text-white">Constraints</h3>
            <p className="text-charcoal-300 leading-relaxed">
              Type parameters may declare constraints. <code className="bg-charcoal-800 px-2 py-1 rounded text-gold-400">Numeric</code> enables arithmetic and bitwise operators while <code className="bg-charcoal-800 px-2 py-1 rounded text-gold-400">Comparable</code> allows comparison and equality.
            </p>
            
            <SyntaxHighlighter
              code={`fn add<T: Numeric>(a: T, b: T) -> T { 
    return a + b 
}

fn min<T: Comparable>(a: T, b: T) -> T { 
    if a < b { return a } else { return b } 
}

fn max_of_three<T: Comparable>(a: T, b: T, c: T) -> T {
    let temp = if a > b { a } else { b }
    return if temp > c { temp } else { c }
}`}
              language="orus"
            />

            <h3 className="text-xl font-semibold text-white">Generic Implementations</h3>
            <p className="text-charcoal-300 leading-relaxed">
              Implement methods for generic types:
            </p>
            
            <SyntaxHighlighter
              code={`struct Stack<T> {
    items: [T; 0],
}

impl<T> Stack<T> {
    fn new() -> Stack<T> {
        return Stack { items: [] }
    }
    
    fn push(mut self, item: T) {
        push(self.items, item)
    }
    
    fn pop(mut self) -> Option<T> {
        if len(self.items) == 0 {
            return Option::None
        }
        return Option::Some(pop(self.items))
    }
}`}
              language="orus"
            />
          </div>
        )
      };

    case 'modules':
      return {
        title: 'Modules',
        nextSection: 'error-handling',
        content: (
          <div className="space-y-6">
            <p className="text-charcoal-300 leading-relaxed">
              Code can be split into multiple files. Use <code className="bg-charcoal-800 px-2 py-1 rounded text-gold-400">use</code> to load an entire module.
            </p>
            
            <SyntaxHighlighter
              code={`use math::utils
use datetime as dt

fn main() {
    utils::helper()
    dt::now()
}`}
              language="orus"
            />

            <h3 className="text-xl font-semibold text-white">Public Functions</h3>
            <p className="text-charcoal-300 leading-relaxed">
              Use the <code className="bg-charcoal-800 px-2 py-1 rounded text-gold-400">pub</code> keyword before a top-level function to export it from a module.
            </p>
            
            <SyntaxHighlighter
              code={`// utils.orus
pub fn helper() {
    print("from helper")
}

fn private_helper() {
    print("this is private")
}

pub struct Point {
    pub x: i32,
    y: i32,  // private field
}

// main.orus
use utils

fn main() {
    utils::helper()  // works
    let p = utils::Point { x: 5, y: 10 }  // error: y is private
}`}
              language="orus"
            />

            <h3 className="text-xl font-semibold text-white">Module Hierarchy</h3>
            <p className="text-charcoal-300 leading-relaxed">
              Organize code with nested modules:
            </p>
            
            <SyntaxHighlighter
              code={`// math/mod.orus
pub use geometry::Point
pub use algebra::solve

// math/geometry.orus  
pub struct Point { pub x: f64, pub y: f64 }

// math/algebra.orus
pub fn solve(a: f64, b: f64, c: f64) -> Option<f64> {
    // quadratic formula implementation
}`}
              language="orus"
            />
          </div>
        )
      };

    case 'error-handling':
      return {
        title: 'Error Handling',
        nextSection: 'builtins',
        content: (
          <div className="space-y-6">
            <p className="text-charcoal-300 leading-relaxed">
              <code className="bg-charcoal-800 px-2 py-1 rounded text-gold-400">try</code>/<code className="bg-charcoal-800 px-2 py-1 rounded text-gold-400">catch</code> blocks handle runtime errors.
            </p>
            
            <SyntaxHighlighter
              code={`try {
    let x = 10 / 0
} catch err {
    print("Error: {}", err)
}`}
              language="orus"
            />

            <h3 className="text-xl font-semibold text-white">Result Type</h3>
            <p className="text-charcoal-300 leading-relaxed">
              Use <code className="bg-charcoal-800 px-2 py-1 rounded text-gold-400">Result</code> for recoverable errors:
            </p>
            
            <SyntaxHighlighter
              code={`enum Result<T, E> {
    Ok(T),
    Err(E),
}

fn parse_number(text: string) -> Result<i32, string> {
    try {
        let num = int(text)
        return Result::Ok(num)
    } catch err {
        return Result::Err("Invalid number format")
    }
}

let result = parse_number("42")
match result {
    Result::Ok(num) => print("Number: {}", num),
    Result::Err(msg) => print("Error: {}", msg),
}`}
              language="orus"
            />

            <h3 className="text-xl font-semibold text-white">Propagating Errors</h3>
            <p className="text-charcoal-300 leading-relaxed">
              Use the <code className="bg-charcoal-800 px-2 py-1 rounded text-gold-400">?</code> operator to propagate errors:
            </p>
            
            <SyntaxHighlighter
              code={`fn read_and_parse(filename: string) -> Result<i32, string> {
    let content = read_file(filename)?  // propagate error if file read fails
    let number = parse_number(content)? // propagate error if parse fails
    return Result::Ok(number)
}

// Equivalent to:
fn read_and_parse_verbose(filename: string) -> Result<i32, string> {
    match read_file(filename) {
        Result::Ok(content) => {
            match parse_number(content) {
                Result::Ok(number) => return Result::Ok(number),
                Result::Err(e) => return Result::Err(e),
            }
        },
        Result::Err(e) => return Result::Err(e),
    }
}`}
              language="orus"
            />
            
            <p className="text-charcoal-300 leading-relaxed">
              Error messages include the file, line and column as well as a short stack trace.
            </p>
          </div>
        )
      };

    case 'builtins':
      return {
        title: 'Built-in Functions',
        nextSection: 'best-practices',
        content: (
          <div className="space-y-6">
            <p className="text-charcoal-300 leading-relaxed">
              Common utilities are always available without importing.
            </p>
            
            <h3 className="text-xl font-semibold text-white">I/O Functions</h3>
            <ul className="list-disc list-inside text-charcoal-300 space-y-2">
              <li><code className="bg-charcoal-800 px-2 py-1 rounded text-gold-400">print(values...)</code> - Print values to stdout</li>
              <li><code className="bg-charcoal-800 px-2 py-1 rounded text-gold-400">println(values...)</code> - Print values with newline</li>
              <li><code className="bg-charcoal-800 px-2 py-1 rounded text-gold-400">input(prompt)</code> - Read user input</li>
              <li><code className="bg-charcoal-800 px-2 py-1 rounded text-gold-400">read_file(path)</code> - Read entire file as string</li>
              <li><code className="bg-charcoal-800 px-2 py-1 rounded text-gold-400">write_file(path, content)</code> - Write string to file</li>
            </ul>

            <h3 className="text-xl font-semibold text-white">Array Functions</h3>
            <ul className="list-disc list-inside text-charcoal-300 space-y-2">
              <li><code className="bg-charcoal-800 px-2 py-1 rounded text-gold-400">len(value)</code> - Get length of array or string</li>
              <li><code className="bg-charcoal-800 px-2 py-1 rounded text-gold-400">push(array, value)</code> - Add element to array</li>
              <li><code className="bg-charcoal-800 px-2 py-1 rounded text-gold-400">pop(array)</code> - Remove and return last element</li>
              <li><code className="bg-charcoal-800 px-2 py-1 rounded text-gold-400">insert(array, index, value)</code> - Insert at specific position</li>
              <li><code className="bg-charcoal-800 px-2 py-1 rounded text-gold-400">remove(array, index)</code> - Remove element at index</li>
              <li><code className="bg-charcoal-800 px-2 py-1 rounded text-gold-400">reserve(array, capacity)</code> - Preallocate capacity</li>
              <li><code className="bg-charcoal-800 px-2 py-1 rounded text-gold-400">sort(array)</code> - Sort array in place</li>
              <li><code className="bg-charcoal-800 px-2 py-1 rounded text-gold-400">reverse(array)</code> - Reverse array in place</li>
            </ul>

            <h3 className="text-xl font-semibold text-white">String Functions</h3>
            <ul className="list-disc list-inside text-charcoal-300 space-y-2">
              <li><code className="bg-charcoal-800 px-2 py-1 rounded text-gold-400">split(string, delimiter)</code> - Split string into array</li>
              <li><code className="bg-charcoal-800 px-2 py-1 rounded text-gold-400">join(array, separator)</code> - Join array into string</li>
              <li><code className="bg-charcoal-800 px-2 py-1 rounded text-gold-400">trim(string)</code> - Remove whitespace</li>
              <li><code className="bg-charcoal-800 px-2 py-1 rounded text-gold-400">upper(string)</code> - Convert to uppercase</li>
              <li><code className="bg-charcoal-800 px-2 py-1 rounded text-gold-400">lower(string)</code> - Convert to lowercase</li>
              <li><code className="bg-charcoal-800 px-2 py-1 rounded text-gold-400">contains(string, substring)</code> - Check if contains substring</li>
              <li><code className="bg-charcoal-800 px-2 py-1 rounded text-gold-400">starts_with(string, prefix)</code> - Check if starts with prefix</li>
              <li><code className="bg-charcoal-800 px-2 py-1 rounded text-gold-400">ends_with(string, suffix)</code> - Check if ends with suffix</li>
            </ul>

            <h3 className="text-xl font-semibold text-white">Math Functions</h3>
            <ul className="list-disc list-inside text-charcoal-300 space-y-2">
              <li><code className="bg-charcoal-800 px-2 py-1 rounded text-gold-400">abs(number)</code> - Absolute value</li>
              <li><code className="bg-charcoal-800 px-2 py-1 rounded text-gold-400">sqrt(number)</code> - Square root</li>
              <li><code className="bg-charcoal-800 px-2 py-1 rounded text-gold-400">pow(base, exponent)</code> - Power function</li>
              <li><code className="bg-charcoal-800 px-2 py-1 rounded text-gold-400">sin(radians)</code> - Sine function</li>
              <li><code className="bg-charcoal-800 px-2 py-1 rounded text-gold-400">cos(radians)</code> - Cosine function</li>
              <li><code className="bg-charcoal-800 px-2 py-1 rounded text-gold-400">tan(radians)</code> - Tangent function</li>
              <li><code className="bg-charcoal-800 px-2 py-1 rounded text-gold-400">floor(number)</code> - Round down</li>
              <li><code className="bg-charcoal-800 px-2 py-1 rounded text-gold-400">ceil(number)</code> - Round up</li>
              <li><code className="bg-charcoal-800 px-2 py-1 rounded text-gold-400">round(number)</code> - Round to nearest</li>
            </ul>

            <h3 className="text-xl font-semibold text-white">Utility Functions</h3>
            <ul className="list-disc list-inside text-charcoal-300 space-y-2">
              <li><code className="bg-charcoal-800 px-2 py-1 rounded text-gold-400">type_of(value)</code> - Get type name as string</li>
              <li><code className="bg-charcoal-800 px-2 py-1 rounded text-gold-400">timestamp()</code> - Current Unix timestamp</li>
              <li><code className="bg-charcoal-800 px-2 py-1 rounded text-gold-400">int(text)</code> - Parse integer from string</li>
              <li><code className="bg-charcoal-800 px-2 py-1 rounded text-gold-400">float(text)</code> - Parse float from string</li>
              <li><code className="bg-charcoal-800 px-2 py-1 rounded text-gold-400">random()</code> - Random float between 0 and 1</li>
              <li><code className="bg-charcoal-800 px-2 py-1 rounded text-gold-400">random_int(min, max)</code> - Random integer in range</li>
              <li><code className="bg-charcoal-800 px-2 py-1 rounded text-gold-400">sleep(seconds)</code> - Pause execution</li>
            </ul>
            
            <SyntaxHighlighter
              code={`// Array example
let mut arr: [i32; 1] = [1]
reserve(arr, 10) // preallocate capacity
push(arr, 2)
push(arr, 3)
sort(arr)
print("Sorted: {:?}", arr)

// String example
let text = "  Hello, World!  "
let clean = trim(text)
let words = split(clean, ", ")
print("Words: {:?}", words)

// Math example
let angle = 3.14159 / 4.0  // 45 degrees in radians
print("sin(45°) = {}", sin(angle))
print("Random: {}", random_int(1, 100))`}
              language="orus"
            />
          </div>
        )
      };

    case 'best-practices':
      return {
        title: 'Best Practices',
        nextSection: 'examples',
        content: (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-white">Naming Conventions</h3>
            <ul className="list-disc list-inside text-charcoal-300 space-y-2">
              <li>Functions and variables use <code className="bg-charcoal-800 px-2 py-1 rounded text-gold-400">snake_case</code></li>
              <li>Struct and enum names use <code className="bg-charcoal-800 px-2 py-1 rounded text-gold-400">PascalCase</code></li>
              <li>Constants are written in <code className="bg-charcoal-800 px-2 py-1 rounded text-gold-400">UPPER_SNAKE_CASE</code></li>
              <li>Module names use <code className="bg-charcoal-800 px-2 py-1 rounded text-gold-400">snake_case</code></li>
            </ul>

            <h3 className="text-xl font-semibold text-white">Immutability First</h3>
            <p className="text-charcoal-300 leading-relaxed">
              Favor immutable bindings and avoid <code className="bg-charcoal-800 px-2 py-1 rounded text-gold-400">let mut</code> unless mutation is necessary. This reduces accidental state changes and eases reasoning about code.
            </p>

            <SyntaxHighlighter
              code={`// Prefer this
let numbers = [1, 2, 3, 4, 5]
let doubled = map(numbers, |x| x * 2)

// Over this
let mut numbers = [1, 2, 3, 4, 5]
for i in 0..len(numbers) {
    numbers[i] = numbers[i] * 2
}`}
              language="orus"
            />

            <h3 className="text-xl font-semibold text-white">Error Handling</h3>
            <p className="text-charcoal-300 leading-relaxed">
              Use <code className="bg-charcoal-800 px-2 py-1 rounded text-gold-400">Result</code> and <code className="bg-charcoal-800 px-2 py-1 rounded text-gold-400">Option</code> types for safer error handling instead of panicking:
            </p>

            <SyntaxHighlighter
              code={`// Good: explicit error handling
fn divide(a: f64, b: f64) -> Result<f64, string> {
    if b == 0.0 {
        return Result::Err("Division by zero")
    }
    return Result::Ok(a / b)
}

// Bad: potential panic
fn divide_unsafe(a: f64, b: f64) -> f64 {
    return a / b  // panics if b is 0
}`}
              language="orus"
            />

            <h3 className="text-xl font-semibold text-white">Module Organization</h3>
            <p className="text-charcoal-300 leading-relaxed">
              Group related functions and structs into modules. Use <code className="bg-charcoal-800 px-2 py-1 rounded text-gold-400">pub</code> to expose only necessary definitions and keep implementation details private.
            </p>

            <h3 className="text-xl font-semibold text-white">Performance Tips</h3>
            <ul className="list-disc list-inside text-charcoal-300 space-y-2">
              <li>Use <code className="bg-charcoal-800 px-2 py-1 rounded text-gold-400">reserve()</code> when you know the final size of arrays</li>
              <li>Prefer slicing over copying for subarray operations</li>
              <li>Use pattern matching instead of nested if-else chains</li>
              <li>Consider using references for large struct parameters</li>
            </ul>

            <SyntaxHighlighter
              code={`// Efficient array growth
let mut data: [i32; 0] = []
reserve(data, 1000)  // allocate once
for i in 0..1000 {
    push(data, i)
}

// Efficient string processing
fn process_words(text: string) -> [string; 0] {
    let words = split(text, " ")
    return filter(words, |word| len(word) > 3)
}`}
              language="orus"
            />
          </div>
        )
      };

    case 'examples':
      return {
        title: 'Practical Examples',
        nextSection: null,
        content: (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-white">Calculator</h3>
            <p className="text-charcoal-300 leading-relaxed">
              A simple calculator with error handling:
            </p>
            
            <SyntaxHighlighter
              code={`fn main() {
    loop {
        let input = input("Enter calculation (or 'quit'): ")
        if input == "quit" {
            break
        }
        
        match evaluate(input) {
            Result::Ok(result) => print("Result: {}", result),
            Result::Err(error) => print("Error: {}", error),
        }
    }
}

fn evaluate(expr: string) -> Result<f64, string> {
    let parts = split(trim(expr), " ")
    if len(parts) != 3 {
        return Result::Err("Format: <number> <operator> <number>")
    }
    
    let a = float(parts[0])?
    let op = parts[1]
    let b = float(parts[2])?
    
    match op {
        "+" => Result::Ok(a + b),
        "-" => Result::Ok(a - b),
        "*" => Result::Ok(a * b),
        "/" => {
            if b == 0.0 {
                Result::Err("Division by zero")
            } else {
                Result::Ok(a / b)
            }
        },
        _ => Result::Err("Unknown operator"),
    }
}`}
              language="orus"
            />

            <h3 className="text-xl font-semibold text-white">File Processing</h3>
            <p className="text-charcoal-300 leading-relaxed">
              Count words in a text file:
            </p>
            
            <SyntaxHighlighter
              code={`fn main() {
    let filename = input("Enter filename: ")
    match count_words(filename) {
        Result::Ok(count) => print("Word count: {}", count),
        Result::Err(error) => print("Error: {}", error),
    }
}

fn count_words(filename: string) -> Result<i32, string> {
    let content = read_file(filename)?
    let words = split(content, " ")
    let mut count = 0
    
    for word in words {
        let trimmed = trim(word)
        if len(trimmed) > 0 {
            count = count + 1
        }
    }
    
    return Result::Ok(count)
}`}
              language="orus"
            />

            <h3 className="text-xl font-semibold text-white">Data Structures</h3>
            <p className="text-charcoal-300 leading-relaxed">
              A simple linked list implementation:
            </p>
            
            <SyntaxHighlighter
              code={`enum List<T> {
    Empty,
    Node{ value: T, next: Box<List<T>> },
}

impl<T> List<T> {
    fn new() -> List<T> {
        return List::Empty
    }
    
    fn push(self, value: T) -> List<T> {
        return List::Node{
            value: value,
            next: Box::new(self)
        }
    }
    
    fn length(self) -> i32 {
        match self {
            List::Empty => 0,
            List::Node{ value, next } => 1 + next.length(),
        }
    }
    
    fn contains<U: Comparable>(self, target: U) -> bool {
        match self {
            List::Empty => false,
            List::Node{ value, next } => {
                value == target || next.contains(target)
            }
        }
    }
}

fn main() {
    let mut list = List::new()
    list = list.push(1)
    list = list.push(2)
    list = list.push(3)
    
    print("Length: {}", list.length())
    print("Contains 2: {}", list.contains(2))
}`}
              language="orus"
            />

            <h3 className="text-xl font-semibold text-white">JSON-like Parser</h3>
            <p className="text-charcoal-300 leading-relaxed">
              A simple key-value parser:
            </p>
            
            <SyntaxHighlighter
              code={`struct KeyValue {
    key: string,
    value: string,
}

fn parse_config(content: string) -> [KeyValue; 0] {
    let lines = split(content, "\n")
    let mut config: [KeyValue; 0] = []
    
    for line in lines {
        let trimmed = trim(line)
        if len(trimmed) == 0 || starts_with(trimmed, "#") {
            continue  // skip empty lines and comments
        }
        
        if contains(trimmed, "=") {
            let parts = split(trimmed, "=")
            if len(parts) == 2 {
                let kv = KeyValue{
                    key: trim(parts[0]),
                    value: trim(parts[1])
                }
                push(config, kv)
            }
        }
    }
    
    return config
}

fn main() {
    let config_text = "
# Configuration file
name = MyApp
version = 1.0
debug = true
"
    
    let config = parse_config(config_text)
    for item in config {
        print("{} = {}", item.key, item.value)
    }
}`}
              language="orus"
            />
          </div>
        )
      };
      
    default:
      return {
        title: 'Documentation',
        nextSection: null,
        content: (
          <div className="text-center py-12">
            <p className="text-charcoal-400 text-lg">
              Documentation for "{sectionName}" is coming soon.
            </p>
          </div>
        )
      };
  }
};
