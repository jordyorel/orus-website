
import { CodeExample } from '@/types/playground';

export const playgroundExamples: CodeExample[] = [
  {
    title: 'Hello World',
    description: 'Basic hello world program',
    code: `fn main() {
    println!("Hello, Orus!");
}`
  },
  {
    title: 'Variables & Mutability',
    description: 'Working with variables and mutability',
    code: `fn main() {
    // Immutable variable
    let x = 5;
    println!("The value of x is: {}", x);
    
    // Mutable variable
    let mut y = 5;
    println!("The value of y is: {}", y);
    
    y = 6;
    println!("The value of y is: {}", y);
}`
  },
  {
    title: 'Data Types',
    description: 'Working with different data types',
    code: `fn main() {
    // Integer types
    let a: i32 = 42;
    let b: u64 = 100;
    
    // Floating point types
    let x: f32 = 3.14;
    let y: f64 = 2.718281828;
    
    // Boolean type
    let is_active: bool = true;
    
    // Character type
    let letter: char = 'A';
    
    println!("Integer: {}, Unsigned: {}", a, b);
    println!("Float32: {}, Float64: {}", x, y);
    println!("Boolean: {}, Character: {}", is_active, letter);
}`
  },
  {
    title: 'Functions',
    description: 'Defining and calling functions',
    code: `fn main() {
    println!("Hello, world!");
    
    another_function();
    function_with_parameter(5);
    print_labeled_measurement(5, 'h');
    
    let x = five();
    println!("The value of x is: {}", x);
    
    let x = plus_one(5);
    println!("The value of x is: {}", x);
}

fn another_function() {
    println!("Another function.");
}

fn function_with_parameter(x: i32) {
    println!("The value of x is: {}", x);
}

fn print_labeled_measurement(value: i32, unit_label: char) {
    println!("The measurement is: {}{}", value, unit_label);
}

fn five() -> i32 {
    5
}

fn plus_one(x: i32) -> i32 {
    x + 1
}`
  },
  {
    title: 'Control Flow',
    description: 'Using if expressions and loops',
    code: `fn main() {
    let number = 6;

    if number % 4 == 0 {
        println!("number is divisible by 4");
    } else if number % 3 == 0 {
        println!("number is divisible by 3");
    } else if number % 2 == 0 {
        println!("number is divisible by 2");
    } else {
        println!("number is not divisible by 4, 3, or 2");
    }
    
    // Using if in a let statement
    let condition = true;
    let number = if condition { 5 } else { 6 };
    println!("The value of number is: {}", number);
    
    // Loop example
    let mut counter = 0;
    let result = loop {
        counter += 1;
        
        if counter == 10 {
            break counter * 2;
        }
    };
    println!("The result is {}", result);
    
    // While loop
    let mut number = 3;
    while number != 0 {
        println!("{}!", number);
        number -= 1;
    }
    println!("LIFTOFF!!!");
    
    // For loop
    let a = [10, 20, 30, 40, 50];
    for element in a {
        println!("the value is: {}", element);
    }
    
    for number in (1..4).rev() {
        println!("{}!", number);
    }
    println!("LIFTOFF!!!");
}`
  }
];
