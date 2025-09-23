
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Copy, Download, Terminal, CheckCircle } from 'lucide-react';
import { useState } from 'react';

const Install = () => {
  const [copiedText, setCopiedText] = useState<string | null>(null);

  const copyToClipboard = (text: string, identifier: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(identifier);
    setTimeout(() => setCopiedText(null), 2000);
  };

  const installMethods = [
    {
      title: 'Curl (Recommended)',
      description: 'One-line installation for Unix-like systems',
      command: 'curl --proto \'=https\' --tlsv1.2 -sSf https://sh.orus.dev | sh',
      id: 'curl'
    },
    {
      title: 'PowerShell (Windows)',
      description: 'Installation script for Windows systems',
      command: 'iwr -useb https://win.orus.dev | iex',
      id: 'powershell'
    },
    {
      title: 'Homebrew (macOS)',
      description: 'Install via Homebrew package manager',
      command: 'brew install orus',
      id: 'homebrew'
    },
  ];

  const requirements = [
    'Operating System: Linux, macOS, or Windows',
    'Architecture: x86_64 or ARM64',
    'Memory: 512MB RAM minimum',
    'Disk Space: 100MB available space'
  ];

  const quickStart = `# Create a new Orus project
orus new hello_world
cd hello_world

# Build and run
orus run

# Build for release
orus build --release`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-charcoal-950 via-charcoal-900 to-charcoal-950 py-20">
      <div className="max-w-4xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16 animate-fade-in">
          <h1 className="text-4xl lg:text-5xl font-bold text-white mb-6">
            Install <span className="text-gold-400">Orus</span>
          </h1>
          <p className="text-xl text-charcoal-400 max-w-2xl mx-auto">
            Get up and running with Orus in just a few minutes. Choose your preferred installation method below.
          </p>
        </div>

        {/* Installation Methods */}
        <div className="space-y-6 mb-16">
          {installMethods.map((method) => (
            <Card key={method.id} className="bg-charcoal-800/50 border-charcoal-700 p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-xl font-semibold text-white mb-2">{method.title}</h3>
                  <p className="text-charcoal-400">{method.description}</p>
                </div>
                <Download className="text-gold-400 mt-1" size={24} />
              </div>
              
              <div className="bg-charcoal-900 rounded-lg p-4 flex items-center justify-between">
                <code className="text-gold-300 font-fira text-sm lg:text-base flex-1 mr-4">
                  {method.command}
                </code>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => copyToClipboard(method.command, method.id)}
                  className="text-charcoal-300 hover:text-gold-400 p-2"
                >
                  {copiedText === method.id ? (
                    <CheckCircle size={16} className="text-green-400" />
                  ) : (
                    <Copy size={16} />
                  )}
                </Button>
              </div>
            </Card>
          ))}
        </div>

        {/* System Requirements */}
        <Card className="bg-charcoal-800/50 border-charcoal-700 p-6 mb-16">
          <h3 className="text-2xl font-semibold text-white mb-4 flex items-center">
            <Terminal className="mr-3 text-gold-400" size={24} />
            System Requirements
          </h3>
          <ul className="space-y-2">
            {requirements.map((req, index) => (
              <li key={index} className="text-charcoal-300 flex items-center">
                <CheckCircle className="mr-3 text-green-400 flex-shrink-0" size={16} />
                {req}
              </li>
            ))}
          </ul>
        </Card>

        {/* Quick Start */}
        <Card className="bg-charcoal-800/50 border-charcoal-700 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-2xl font-semibold text-white">Quick Start</h3>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => copyToClipboard(quickStart, 'quickstart')}
              className="text-charcoal-300 hover:text-gold-400"
            >
              {copiedText === 'quickstart' ? (
                <CheckCircle size={16} className="text-green-400" />
              ) : (
                <Copy size={16} />
              )}
            </Button>
          </div>
          
          <div className="bg-charcoal-900 rounded-lg p-4">
            <pre className="text-gold-300 font-fira text-sm lg:text-base overflow-x-auto">
              <code>{quickStart}</code>
            </pre>
          </div>
          
          <p className="text-charcoal-400 mt-4">
            After installation, you'll have access to the <code className="text-gold-400 font-fira">orus</code> command. 
            Create your first project and start building!
          </p>
        </Card>

        {/* Next Steps */}
        <div className="text-center mt-16">
          <h3 className="text-2xl font-semibold text-white mb-4">What's Next?</h3>
          <p className="text-charcoal-400 mb-6">
            Now that you have Orus installed, explore our documentation and try the playground.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button className="bg-gold-500 hover:bg-gold-600 text-charcoal-950 font-semibold">
              Read the Docs
            </Button>
            <Button variant="outline" className="border-gold-500/50 text-gold-400 hover:bg-gold-500/10">
              Try Playground
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Install;
