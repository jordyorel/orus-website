import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Circle, Clock, Shield, Cpu, Package, Settings, Users, Target } from 'lucide-react';

const Roadmap = () => {
  const roadmapItems = [
    {
      version: 'Now',
      title: 'Language Core (v0.7.0)',
      status: 'completed',
      date: 'Current',
      description: 'Interpreter with stable syntax, generics, modules, and runtime diagnostics.',
      features: [
        'Pattern matching, error handling, and impl blocks',
        'Generics with constraints and cross-module specialization',
        'Minimal std library covering math, random, collections, datetime',
        'Robust tests plus REPL and project execution modes',
      ],
      icon: CheckCircle,
      progress: '100%',
    },
    {
      version: 'Next',
      title: 'Standard Library Expansion (v0.8.0)',
      status: 'in-progress',
      date: 'Planned',
      description: 'Strengthen the everyday toolkit before layering advanced features.',
      features: [
        'File and directory I/O helpers',
        'Environment access and command-line parsing',
        'Richer collection and string utilities',
        'Quality-of-life CLI tooling and documentation improvements',
      ],
      icon: Clock,
      progress: '0%',
    },
    {
      version: 'Later',
      title: 'Tooling & Ecosystem (v0.9.0+)',
      status: 'planned',
      date: 'Future',
      description: 'Lay groundwork for package distribution and editor support.',
      features: [
        'Package manager with registry and reproducible builds',
        'Language server, formatter, and profiling tools',
        'Debugging and diagnostics enhancements',
        'Expanded std modules exploring networking and async primitives',
      ],
      icon: Package,
      progress: '0%',
    },
    {
      version: '1.0 Vision',
      title: 'Production Readiness',
      status: 'future',
      date: 'Long term',
      description: 'Stabilize the runtime, ecosystem, and documentation for wider adoption.',
      features: [
        'Stability commitments and semantic versioning',
        'Comprehensive learning resources and examples',
        'Community-driven library catalog',
        'Long-term support cadence and release process',
      ],
      icon: Target,
      progress: '0%',
    },
  ];

  const currentFeatures = [
    { name: 'Generics & Type Inference', status: 'complete', description: 'Type parameters with constraints and forward declarations are available today.' },
    { name: 'Module System', status: 'complete', description: 'Organize code with modules, aliases, and public exports.' },
    { name: 'Pattern Matching & Errors', status: 'complete', description: 'match expressions and try/catch blocks provide expressive control flow.' },
    { name: 'Runtime Diagnostics', status: 'complete', description: 'Errors include file, line, column, and stack traces for quick debugging.' },
    { name: 'Standard Library', status: 'partial', description: 'Focused math, random, collections, and datetime helpers ship with v0.7.0.' },
    { name: 'Filesystem APIs', status: 'missing', description: 'Planned additions cover file reads/writes and directory introspection.' },
    { name: 'Package Management', status: 'missing', description: 'A registry and dependency workflow will accompany tooling milestones.' },
    { name: 'Async & Concurrency', status: 'missing', description: 'Experiments reserved until the standard library and tooling expand.' },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'in-progress':
        return 'bg-gold-500/20 text-gold-400 border-gold-500/30';
      case 'planned':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'future':
        return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      default:
        return 'bg-charcoal-500/20 text-charcoal-400 border-charcoal-500/30';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle size={16} className="text-green-400" />;
      case 'in-progress':
        return <Clock size={16} className="text-gold-400" />;
      default:
        return <Circle size={16} className="text-charcoal-400" />;
    }
  };

  const getProgressColor = (progress: string) => {
    const percent = parseInt(progress);
    if (percent === 100) return 'bg-green-500';
    if (percent > 50) return 'bg-gold-500';
    if (percent > 0) return 'bg-blue-500';
    return 'bg-charcoal-600';
  };

  const getFeatureStatusColor = (status: string) => {
    switch (status) {
      case 'complete':
        return 'text-green-400';
      case 'partial':
        return 'text-gold-400';
      case 'missing':
        return 'text-red-400';
      default:
        return 'text-charcoal-400';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-charcoal-950 via-charcoal-900 to-charcoal-950 py-20">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16 animate-fade-in">
          <h1 className="text-4xl lg:text-5xl font-bold text-white mb-6">
            <span className="text-gold-400">Orus</span> Development Roadmap
          </h1>
          <p className="text-xl text-charcoal-400 max-w-4xl mx-auto mb-8">
            Transform Orus from an experimental language into a production-ready programming language 
            suitable for real-world applications and widespread adoption.
          </p>
          
          {/* Progress Overview */}
          <div className="flex justify-center space-x-8 mb-8">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-400">v0.7.0</div>
              <div className="text-sm text-charcoal-400">Current Version</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gold-400">Language Core</div>
              <div className="text-sm text-charcoal-400">Stable today</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-400">v1.0.0</div>
              <div className="text-sm text-charcoal-400">Long-term target</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-400">Next: v0.8.0</div>
              <div className="text-sm text-charcoal-400">Library & tooling focus</div>
            </div>
          </div>

          {/* Conservative Versioning Notice */}
          <Card className="bg-blue-500/10 border-blue-500/30 p-6 mb-8 max-w-4xl mx-auto">
            <div className="flex items-start space-x-4">
              <Target className="text-blue-400 flex-shrink-0 mt-1" size={24} />
              <div className="text-left">
                <h3 className="text-lg font-semibold text-white mb-2">Conservative Versioning Philosophy</h3>
                <p className="text-charcoal-300 text-sm">
                  Version 0.7.0 captures a language-focused milestone. We will only label 1.0 once the
                  expanded standard library, tooling, and ecosystem are ready for sustained production use.
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Current State Assessment */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">Current State Assessment</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {currentFeatures.map((feature, index) => (
              <Card key={index} className="bg-charcoal-800/50 border-charcoal-700 p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-white mb-1">{feature.name}</h3>
                    <p className="text-charcoal-400 text-sm">{feature.description}</p>
                  </div>
                  <div className={`text-sm font-medium ${getFeatureStatusColor(feature.status)} capitalize`}>
                    {feature.status}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Current Status Banner */}
        <Card className="bg-gradient-to-r from-green-500/10 to-blue-500/10 border-green-500/30 p-6 mb-12">
            <div className="flex items-center space-x-4">
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-green-500/20 border-2 border-green-400">
                <Cpu className="text-green-400" size={24} />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-white mb-2">🎯 Honest Assessment: Core Language Locked In</h3>
                <p className="text-charcoal-300">
                  v0.7.0 delivers the interpreter, generics, modules, and diagnostics described in the language guide.
                  The next wave targets everyday libraries and tooling before exploring concurrency or package workflows.
                </p>
              </div>
              <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30 font-bold px-4 py-2">
                v0.7.0 Current
              </Badge>
            </div>
        </Card>

        {/* Development Timeline */}
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-green-400 via-gold-500 via-blue-500 via-purple-500 to-cyan-500"></div>
          
          <div className="space-y-8">
            {roadmapItems.map((item, index) => {
              const Icon = item.icon;
              return (
                <div key={item.version} className="relative flex items-start space-x-6">
                  {/* Timeline dot */}
                  <div className={`relative z-10 flex items-center justify-center w-16 h-16 rounded-full border-4 ${
                    item.status === 'completed' 
                      ? 'bg-green-500 border-green-400' 
                      : item.status === 'in-progress'
                      ? 'bg-gold-500 border-gold-400'
                      : item.status === 'planned'
                      ? 'bg-blue-500 border-blue-400'
                      : item.status === 'future'
                      ? 'bg-purple-500 border-purple-400'
                      : 'bg-charcoal-800 border-charcoal-600'
                  }`}>
                    <Icon size={24} className="text-white" />
                  </div>
                  
                  {/* Content */}
                  <div className="flex-1 pb-8">
                    <Card className="bg-charcoal-800/50 border-charcoal-700 p-6 hover:bg-charcoal-800/70 transition-all duration-300">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h3 className="text-2xl font-bold text-white">{item.version}</h3>
                            <Badge className={`${getStatusColor(item.status)} font-medium`}>
                              {getStatusIcon(item.status)}
                              <span className="ml-1 capitalize">{item.status.replace('-', ' ')}</span>
                            </Badge>
                            {item.progress && (
                              <Badge className="bg-charcoal-700 text-charcoal-300 border-charcoal-600">
                                {item.progress}
                              </Badge>
                            )}
                          </div>
                          <h4 className="text-xl font-semibold text-gold-400 mb-2">{item.title}</h4>
                          <p className="text-charcoal-400 mb-4">{item.description}</p>
                          
                          {/* Progress Bar */}
                          {item.progress && (
                            <div className="mb-4">
                              <div className="flex justify-between text-sm text-charcoal-400 mb-1">
                                <span>Progress</span>
                                <span>{item.progress}</span>
                              </div>
                              <div className="w-full bg-charcoal-700 rounded-full h-2">
                                <div 
                                  className={`h-2 rounded-full transition-all duration-300 ${getProgressColor(item.progress)}`}
                                  style={{ width: item.progress }}
                                ></div>
                              </div>
                            </div>
                          )}
                        </div>
                        <span className="text-charcoal-500 font-medium text-sm whitespace-nowrap ml-4">
                          {item.date}
                        </span>
                      </div>
                      
                      <div>
                        <h5 className="text-white font-medium mb-3">Key Features & Deliverables:</h5>
                        <ul className="space-y-2">
                          {item.features.map((feature, featureIndex) => (
                            <li key={featureIndex} className="flex items-start space-x-2 text-charcoal-300 text-sm">
                              {item.status === 'completed' ? (
                                <CheckCircle size={16} className="text-green-400 flex-shrink-0 mt-0.5" />
                              ) : item.status === 'in-progress' ? (
                                <Clock size={16} className="text-gold-400 flex-shrink-0 mt-0.5" />
                              ) : (
                                <Circle size={16} className="text-charcoal-500 flex-shrink-0 mt-0.5" />
                              )}
                              <span>{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </Card>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Success Metrics & Technical Details */}
        <div className="grid md:grid-cols-3 gap-6 mt-16 mb-12">
          <Card className="bg-charcoal-800/50 border-charcoal-700 p-6">
            <div className="flex items-center space-x-3 mb-4">
              <Settings className="text-gold-400" size={24} />
              <h3 className="text-xl font-semibold text-white">Technical Metrics</h3>
            </div>
            <ul className="space-y-2 text-charcoal-300 text-sm">
              <li>• Interpreter implemented in C with mark-sweep GC</li>
              <li>• Cross-platform builds for macOS, Linux, and WSL</li>
              <li>• Generic prepass resolves forward references safely</li>
              <li>• CLI supports REPL, script, and project execution modes</li>
              <li>• 200+ regression samples in the <code className="text-gold-400">tests/</code> directory</li>
            </ul>
          </Card>

          <Card className="bg-charcoal-800/50 border-charcoal-700 p-6">
            <div className="flex items-center space-x-3 mb-4">
              <Users className="text-blue-400" size={24} />
              <h3 className="text-xl font-semibold text-white">Ecosystem Metrics</h3>
            </div>
            <ul className="space-y-2 text-charcoal-300 text-sm">
              <li>• LANGUAGE.md and TUTORIAL.md maintained alongside the code</li>
              <li>• Standard library modules for math, collections, random, datetime</li>
              <li>• Install automation via <code className="text-gold-400">make</code> or <code className="text-gold-400">install.sh</code></li>
              <li>• Extensive documentation roadmap in <code className="text-gold-400">docs/</code></li>
              <li>• Examples double as executable tests within <code className="text-gold-400">tests/</code></li>
            </ul>
          </Card>

          <Card className="bg-charcoal-800/50 border-charcoal-700 p-6">
            <div className="flex items-center space-x-3 mb-4">
              <Shield className="text-purple-400" size={24} />
              <h3 className="text-xl font-semibold text-white">Developer Experience</h3>
            </div>
            <ul className="space-y-2 text-charcoal-300 text-sm">
              <li>• Detailed runtime errors with file, line, and stack traces</li>
              <li>• Pattern matching and inline conditionals keep branching clear</li>
              <li>• Built-in helpers cover printing, arrays, iteration, and math</li>
              <li>• Generics accept Numeric or Comparable constraints</li>
              <li>• try/catch enables graceful recovery from runtime issues</li>
            </ul>
          </Card>
        </div>

        {/* Development Priorities */}
        <Card className="bg-charcoal-800/50 border-charcoal-700 p-8 mb-12">
          <h3 className="text-2xl font-semibold text-white mb-6 text-center">Current Development Priorities</h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <h4 className="text-lg font-semibold text-gold-400 mb-3">Short-Term (v0.8.0)</h4>
              <ul className="space-y-2 text-charcoal-300 text-sm">
                <li>• File, directory, and environment APIs</li>
                <li>• Command-line parsing helpers</li>
                <li>• Additional collection and string utilities</li>
                <li>• Documentation updates for new built-ins</li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold text-blue-400 mb-3">Medium-Term (v0.9.0)</h4>
              <ul className="space-y-2 text-charcoal-300 text-sm">
                <li>• Package manager and registry workflow</li>
                <li>• Language server, formatter, and linting story</li>
                <li>• Debugging hooks and profiler experiments</li>
                <li>• Expanded std modules (JSON, IO utilities)</li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold text-purple-400 mb-3">Long-Term (1.0.0)</h4>
              <ul className="space-y-2 text-charcoal-300 text-sm">
                <li>• Concurrency and async experimentation</li>
                <li>• Performance tuning and profiling insights</li>
                <li>• Stabilized APIs and semantic versioning</li>
                <li>• Community-driven ecosystem milestones</li>
              </ul>
            </div>
          </div>
        </Card>

        {/* Call to Action */}
        <Card className="bg-gradient-to-r from-gold-500/10 to-gold-600/10 border-gold-500/30 p-8 mt-16">
          <div className="text-center">
            <h3 className="text-2xl font-semibold text-white mb-4">Join the Orus Journey to 1.0</h3>
            <p className="text-charcoal-300 mb-6 max-w-3xl mx-auto">
              Help us transform Orus into a production-ready language. We're building something special 
              with conservative versioning that reflects real progress toward production adoption.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="https://github.com/jordyorel/Orus-lang" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center px-6 py-3 bg-gold-500 hover:bg-gold-600 text-charcoal-950 font-semibold rounded-lg transition-colors"
              >
                View Repository
              </a>
              <a 
                href="https://github.com/jordyorel/Orus-lang/blob/main/docs/LANGUAGE.md" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center px-6 py-3 border border-gold-500/50 text-gold-400 hover:bg-gold-500/10 rounded-lg transition-colors"
              >
                Read LANGUAGE.md
              </a>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Roadmap;
