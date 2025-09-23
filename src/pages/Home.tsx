import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import SyntaxHighlighter from '@/components/SyntaxHighlighter';
import { ArrowRight, Zap, Shield, Cpu, Users, Code2 } from 'lucide-react';
import { Link } from 'react-router-dom';

const Home = () => {
  console.log('Home component is rendering');

  const features = [
    {
      icon: Zap,
      title: 'Blazing Fast',
      description: 'Zero-cost abstractions and compile-time optimizations ensure maximum performance.',
    },
    {
      icon: Shield,
      title: 'Memory Safe',
      description: 'Ownership model prevents common programming errors at compile time.',
    },
    {
      icon: Cpu,
      title: 'Systems Level',
      description: 'Direct hardware access with high-level ergonomics for systems programming.',
    },
    {
      icon: Users,
      title: 'Developer Friendly',
      description: 'Intuitive syntax with powerful tooling and comprehensive error messages.',
    },
  ];

  const codeExample = `fn main() {
    print("Hello, Orus!")
}

fn add(a: i32, b: i32) -> i32 {
    return a + b
}

struct Point {
    x: i32,
    y: i32,
}

let p = Point{ x: 1, y: 2 }
print(p.x)`;

  console.log('Home component features:', features.length);
  console.log('Home component rendering complete');

  return (
    <div className="min-h-screen bg-gradient-to-br from-charcoal-950 via-charcoal-900 to-charcoal-950">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-gold-500/10 via-transparent to-gold-500/10"></div>
        
        {/* Language Version Badge - Top Right */}
        <div className="absolute top-6 right-6 max-w-7xl mx-auto px-6">
          <div className="flex justify-end">
            <Badge className="bg-gold-500/90 border-2 border-gold-400 text-charcoal-950 px-6 py-3 text-base font-bold backdrop-blur-sm shadow-xl shadow-gold-500/30 hover:shadow-gold-400/40 transition-all duration-300 hover:bg-gold-400 hover:scale-105">
              <Code2 className="w-5 h-5 mr-2 text-charcoal-900" />
              <span className="text-charcoal-900 font-mono tracking-wide">v0.3.0-beta</span>
            </Badge>
          </div>
        </div>

        <div className="relative max-w-7xl mx-auto px-6 py-24 lg:py-40 text-center">
          {/* Hero Title */}
          <h1 className="text-5xl lg:text-7xl font-bold mb-6">
            <span className="text-white">The </span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold-400 to-gold-600">
              Orus
            </span>
          </h1>
          <h2 className="text-2xl lg:text-4xl font-light text-charcoal-300 mb-8">
            Programming Language
          </h2>
          
          {/* Hero Tagline */}
          <p className="text-xl lg:text-2xl text-charcoal-400 max-w-3xl mx-auto mb-12 leading-relaxed">
            An experimental interpreted language influenced by modern languages. 
            Build fast, safe, and expressive applications.
          </p>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/install">
              <Button size="lg" className="bg-gold-500 hover:bg-gold-600 text-charcoal-950 font-semibold px-8 py-3 text-lg">
                Get Started
                <ArrowRight className="ml-2" size={20} />
              </Button>
            </Link>
            <Link to="/play">
              <Button 
                variant="outline" 
                size="lg" 
                className="border-gold-500/50 text-gold-400 hover:bg-gold-500/10 px-8 py-3 text-lg"
              >
                Try Online
              </Button>
            </Link>
          </div>
          
          {/* Code Example */}
          <div className="mt-20 max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-semibold text-white mb-2">Hello World in Orus</h3>
              <p className="text-charcoal-400">Simple, expressive, and powerful</p>
            </div>
            <Card className="bg-charcoal-900/50 border-charcoal-700 p-6 backdrop-blur-sm">
              <SyntaxHighlighter 
                code={codeExample}
                language="orus"
              />
            </Card>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-charcoal-900/30">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
              Why Choose Orus?
            </h2>
            <p className="text-xl text-charcoal-400 max-w-3xl mx-auto">
              Built for the modern world, Orus combines the best ideas from systems programming 
              with developer experience innovations.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card 
                  key={index} 
                  className="bg-charcoal-800/50 border-charcoal-700 p-6 hover:bg-charcoal-800/70 transition-all duration-300 group hover:border-gold-500/30"
                >
                  <div className="text-gold-400 mb-4 group-hover:text-gold-300 transition-colors">
                    <Icon size={32} />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-charcoal-300 leading-relaxed">
                    {feature.description}
                  </p>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
            Ready to Build Something Amazing?
          </h2>
          <p className="text-xl text-charcoal-400 mb-8">
            Join the growing community of developers who choose Orus for their systems programming needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/docs">
              <Button size="lg" className="bg-gold-500 hover:bg-gold-600 text-charcoal-950 font-semibold px-8">
                Read the Docs
              </Button>
            </Link>
            <Link to="/roadmap">
              <Button 
                variant="outline" 
                size="lg" 
                className="border-gold-500/50 text-gold-400 hover:bg-gold-500/10 px-8"
              >
                View Roadmap
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
