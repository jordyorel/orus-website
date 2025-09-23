import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import DocsSidebar from '@/components/DocsSidebar';
import SyntaxHighlighter from '@/components/SyntaxHighlighter';
import { Book, ArrowRight, Code, Zap, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';

const Docs = () => {
  const quickLinks = [
    {
      title: 'Getting Started Guide',
      description: 'Learn the basics of Orus programming',
      icon: Book,
      path: '/docs/hello-world'
    },
    {
      title: 'Language Features',
      description: 'Explore Orus syntax and capabilities',  
      icon: Code,
      path: '/docs/syntax'
    },
    {
      title: 'Built-in Functions',
      description: 'Discover Orus built-in utilities',
      icon: Zap,
      path: '/docs/builtins'
    },
    {
      title: 'Memory & Safety',
      description: 'Understanding ownership and types',
      icon: Shield,
      path: '/docs/variables'
    }
  ];

  const exampleCode = `fn main() {
    print("Hello, Orus!")
}

// Variables and mutability
let number: i32 = 5     // immutable
let mut count = 0       // mutable

// Structs and methods
struct Point {
    x: i32,
    y: i32,
}

impl Point {
    fn new(x: i32, y: i32) -> Point {
        return Point{ x: x, y: y }
    }
    
    fn move_by(self, dx: i32, dy: i32) {
        self.x = self.x + dx
        self.y = self.y + dy
    }
}

// Pattern matching
match value {
    0 => print("zero"),
    1 => print("one"), 
    _ => print("other"),
}

// Arrays and iteration
let nums: [i32; 3] = [1, 2, 3]
for i in 0..5 {
    print(i)
}`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-charcoal-950 via-charcoal-900 to-charcoal-950">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex gap-8">
          {/* Sidebar */}
          <div className="w-80 flex-shrink-0 hidden lg:block">
            <DocsSidebar />
          </div>
          
          {/* Main Content */}
          <div className="flex-1 max-w-4xl min-w-0">
            <div className="mb-12 animate-fade-in">
              <h1 className="text-4xl lg:text-5xl font-bold text-white mb-6">
                <span className="text-gold-400">Orus</span> Documentation
              </h1>
              <p className="text-xl text-charcoal-400 max-w-3xl">
                Complete guide to the Orus programming language. Learn everything from basic syntax 
                to advanced language features like generics, modules, and error handling.
              </p>
            </div>

            <Card className="bg-charcoal-800/50 border-charcoal-700 p-8 mb-8">
              <h2 className="text-2xl font-semibold text-white mb-4">Introduction to Orus</h2>
              <p className="text-charcoal-300 mb-4 leading-relaxed">
                Orus is an experimental interpreted language influenced by modern scripting languages and Rust-like syntax. 
                This guide covers the features available in version 0.7.0 and serves both as a tutorial and reference.
              </p>
              <p className="text-charcoal-300 mb-6 leading-relaxed">
                Key features include immutability by default, pattern matching, generics with constraints, 
                module system, error handling with try/catch, and a rich set of built-in functions 
                for common programming tasks.
              </p>
              
              <div className="flex flex-wrap gap-3">
                <span className="px-3 py-1 bg-gold-500/20 text-gold-400 rounded-full text-sm font-medium border border-gold-500/30">
                  Rust-inspired
                </span>
                <span className="px-3 py-1 bg-gold-500/20 text-gold-400 rounded-full text-sm font-medium border border-gold-500/30">
                  Pattern Matching
                </span>
                <span className="px-3 py-1 bg-gold-500/20 text-gold-400 rounded-full text-sm font-medium border border-gold-500/30">
                  Generics
                </span>
                <span className="px-3 py-1 bg-gold-500/20 text-gold-400 rounded-full text-sm font-medium border border-gold-500/30">
                  Interpreted
                </span>
              </div>
            </Card>

            <div className="mb-8">
              <h2 className="text-2xl font-semibold text-white mb-6">Quick Start</h2>
              <div className="grid md:grid-cols-2 gap-4">
                {quickLinks.map((link, index) => {
                  const Icon = link.icon;
                  return (
                    <Link key={index} to={link.path}>
                      <Card className="bg-charcoal-800/50 border-charcoal-700 p-6 hover:bg-charcoal-800/70 transition-all duration-300 group hover:border-gold-500/30 h-full">
                        <div className="flex items-start space-x-4">
                          <div className="text-gold-400 group-hover:text-gold-300 transition-colors">
                            <Icon size={24} />
                          </div>
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-gold-400 transition-colors">
                              {link.title}
                            </h3>
                            <p className="text-charcoal-400 text-sm">
                              {link.description}
                            </p>
                          </div>
                          <ArrowRight 
                            className="text-charcoal-600 group-hover:text-gold-400 transition-colors" 
                            size={16} 
                          />
                        </div>
                      </Card>
                    </Link>
                  );
                })}
              </div>
            </div>

            <Card className="bg-charcoal-800/50 border-charcoal-700 p-6 mb-8">
              <h3 className="text-xl font-semibold text-white mb-4">Example: Orus Language Features</h3>
              <p className="text-charcoal-400 mb-4">
                Here's an overview of key Orus syntax including variables, structs, methods, and pattern matching:
              </p>
              
              <SyntaxHighlighter 
                code={exampleCode}
                language="orus"
              />
            </Card>

            <Card className="bg-gradient-to-r from-gold-500/10 to-gold-600/10 border-gold-500/30 p-8">
              <h3 className="text-2xl font-semibold text-white mb-4">Ready to Start Learning?</h3>
              <p className="text-charcoal-300 mb-6">
                Begin your journey with Orus by following our step-by-step tutorials and examples.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/docs/hello-world">
                  <Button className="bg-gold-500 hover:bg-gold-600 text-charcoal-950 font-semibold">
                    Start Tutorial
                    <ArrowRight className="ml-2" size={16} />
                  </Button>
                </Link>
                <Link to="/play">
                  <Button 
                    variant="outline" 
                    className="border-gold-500/50 text-gold-400 hover:bg-gold-500/10"
                  >
                    Try in Playground
                  </Button>
                </Link>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Docs;
