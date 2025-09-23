import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Circle, Clock, Zap, Shield, Code, Sparkles, Cpu, Layers, Package, Settings, Globe, Database, Server, Wrench, Users, Target } from 'lucide-react';

const Roadmap = () => {
  const roadmapItems = [
    {
      version: 'Current',
      title: 'Foundation Complete - Conservative v0.3.0',
      status: 'completed',
      date: 'Current',
      description: 'Strong language foundations with honest assessment of production readiness (~20-25% complete)',
      features: [
        'Static typing with full type inference and generics',
        'Complete module system with pub/private visibility',
        'Error handling with try/catch blocks',
        'Mark-sweep garbage collection with memory safety',
        'Standard library: math, random, collections, datetime',
        'Comprehensive testing suite (209 test files)',
        'Full-featured REPL and project execution'
      ],
      icon: CheckCircle,
      color: 'green',
      progress: '100%'
    },
    {
      version: 'Phase 1',
      title: 'Foundation Infrastructure (v0.3.0 - 0.4.0)',
      status: 'in-progress',
      date: '6-9 months',
      description: 'Essential I/O operations, system integration, and core developer tooling',
      features: [
        'File I/O operations (read/write files, directory operations)',
        'Environment variables and process management',
        'Command line argument parsing',
        'Interactive debugger with breakpoints and variable inspection',
        'Code formatter for consistent style',
        'Extended standard library (std/io, std/strings, std/json, std/testing)'
      ],
      icon: Clock,
      color: 'gold',
      progress: '25%'
    },
    {
      version: 'Phase 2',
      title: 'Developer Experience (v0.5.0 - 0.7.0)',
      status: 'planned',
      date: '6-12 months',
      description: 'Package management, advanced tooling, and network programming capabilities',
      features: [
        'Full package management system with dependency resolution',
        'Package registry and reproducible builds',
        'Language Server Protocol (LSP) for IDE integration',
        'Performance profiler and documentation generator',
        'Network programming (HTTP client/server, TCP/UDP sockets)',
        'Cryptography and encoding libraries'
      ],
      icon: Package,
      color: 'blue',
      progress: '0%'
    },
    {
      version: 'Phase 3',
      title: 'Production Features (v0.8.0 - 0.9.0)',
      status: 'planned',
      date: '6-12 months',
      description: 'Async/await, threading, JIT compilation, and production operations',
      features: [
        'Async/await for non-blocking I/O and concurrency',
        'Native threading support with synchronization',
        'JIT compilation for performance optimization',
        'Database connectivity and advanced data processing',
        'Production monitoring and observability',
        'Advanced error handling and deployment support'
      ],
      icon: Zap,
      color: 'purple',
      progress: '0%'
    },
    {
      version: 'Phase 4',
      title: 'Ecosystem Maturity (v1.0.0+)',
      status: 'future',
      date: 'Ongoing',
      description: 'Community growth, specialized domains, and production readiness',
      features: [
        'Mature package ecosystem (100+ quality packages)',
        'Comprehensive documentation and learning resources',
        'Web development frameworks and tooling',
        'Data science libraries and visualization',
        'Systems programming and C interoperability',
        'Active community and conference presence'
      ],
      icon: Globe,
      color: 'cyan',
      progress: '0%'
    }
  ];

  const currentFeatures = [
    { name: 'Static Typing & Generics', status: 'complete', description: 'Full type inference with generic functions and structs' },
    { name: 'Module System', status: 'complete', description: 'Modules with use statements and pub visibility' },
    { name: 'Error Handling', status: 'complete', description: 'Try/catch blocks for exception handling' },
    { name: 'Garbage Collection', status: 'complete', description: 'Mark-sweep GC with memory safety' },
    { name: 'Standard Library', status: 'partial', description: 'Math, random, collections, datetime modules' },
    { name: 'File I/O', status: 'missing', description: 'Essential for real-world applications' },
    { name: 'Package Management', status: 'missing', description: 'Dependency management and distribution' },
    { name: 'Network Programming', status: 'missing', description: 'HTTP, TCP/UDP socket support' }
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
              <div className="text-2xl font-bold text-green-400">v0.3.0</div>
              <div className="text-sm text-charcoal-400">Current Version</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gold-400">20-25%</div>
              <div className="text-sm text-charcoal-400">Production Ready</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-400">v1.0.0</div>
              <div className="text-sm text-charcoal-400">Target Release</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-400">24-36</div>
              <div className="text-sm text-charcoal-400">Months Timeline</div>
            </div>
          </div>

          {/* Conservative Versioning Notice */}
          <Card className="bg-blue-500/10 border-blue-500/30 p-6 mb-8 max-w-4xl mx-auto">
            <div className="flex items-start space-x-4">
              <Target className="text-blue-400 flex-shrink-0 mt-1" size={24} />
              <div className="text-left">
                <h3 className="text-lg font-semibold text-white mb-2">Conservative Versioning Philosophy</h3>
                <p className="text-charcoal-300 text-sm">
                  We've adopted honest versioning where v0.3.0 reflects ~20-25% production completeness. 
                  Version 1.0.0 will represent true production readiness with a complete ecosystem, 
                  not just language features.
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
              <h3 className="text-xl font-semibold text-white mb-2">🎯 Honest Assessment: Strong Foundations Built</h3>
              <p className="text-charcoal-300">
                Orus has excellent language foundations with generics, modules, GC, and error handling. 
                However, essential production features like file I/O, package management, and networking are still needed.
              </p>
            </div>
            <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30 font-bold px-4 py-2">
              v0.3.0 Current
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
              <li>• 90% of Python performance for similar tasks</li>
              <li>• {'<'}50MB baseline memory usage</li>
              <li>• {'<'}100ms cold start time</li>
              <li>• {'>'}95% standard library test coverage</li>
              <li>• 209 comprehensive test files</li>
            </ul>
          </Card>

          <Card className="bg-charcoal-800/50 border-charcoal-700 p-6">
            <div className="flex items-center space-x-3 mb-4">
              <Users className="text-blue-400" size={24} />
              <h3 className="text-xl font-semibold text-white">Ecosystem Metrics</h3>
            </div>
            <ul className="space-y-2 text-charcoal-300 text-sm">
              <li>• 100+ packages in registry</li>
              <li>• {'<'}30s average time to find documentation</li>
              <li>• 1000+ active developers</li>
              <li>• 10+ companies using in production</li>
              <li>• Comprehensive learning resources</li>
            </ul>
          </Card>

          <Card className="bg-charcoal-800/50 border-charcoal-700 p-6">
            <div className="flex items-center space-x-3 mb-4">
              <Shield className="text-purple-400" size={24} />
              <h3 className="text-xl font-semibold text-white">Developer Experience</h3>
            </div>
            <ul className="space-y-2 text-charcoal-300 text-sm">
              <li>• {'<'}5 minutes from install to first program</li>
              <li>• 90% of errors provide actionable suggestions</li>
              <li>• Full IDE support with LSP integration</li>
              <li>• Junior developers productive within 1 week</li>
              <li>• Consistent code formatting and style</li>
            </ul>
          </Card>
        </div>

        {/* Development Priorities */}
        <Card className="bg-charcoal-800/50 border-charcoal-700 p-8 mb-12">
          <h3 className="text-2xl font-semibold text-white mb-6 text-center">Current Development Priorities</h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <h4 className="text-lg font-semibold text-gold-400 mb-3">Short-Term (v0.3.0)</h4>
              <ul className="space-y-2 text-charcoal-300 text-sm">
                <li>• Essential I/O operations (file, environment, process)</li>
                <li>• Interactive debugger with breakpoints</li>
                <li>• Code formatter for consistent style</li>
                <li>• Extended standard library modules</li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold text-blue-400 mb-3">Medium-Term (v0.4.0 - 0.6.0)</h4>
              <ul className="space-y-2 text-charcoal-300 text-sm">
                <li>• Package management system with registry</li>
                <li>• Language Server Protocol for IDE integration</li>
                <li>• Network programming capabilities</li>
                <li>• Advanced tooling (profiler, documentation)</li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold text-purple-400 mb-3">Long-Term (v0.7.0 - 1.0.0)</h4>
              <ul className="space-y-2 text-charcoal-300 text-sm">
                <li>• Async/await and threading support</li>
                <li>• JIT compilation for performance</li>
                <li>• Production operations and monitoring</li>
                <li>• Complete ecosystem maturity</li>
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
                href="https://github.com/orus-lang/orus" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center px-6 py-3 bg-gold-500 hover:bg-gold-600 text-charcoal-950 font-semibold rounded-lg transition-colors"
              >
                View Development
              </a>
              <a 
                href="https://discord.gg/orus" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center px-6 py-3 border border-gold-500/50 text-gold-400 hover:bg-gold-500/10 rounded-lg transition-colors"
              >
                Join Community
              </a>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Roadmap;
