import React, { useState } from 'react';
import { 
  Play, 
  Square, 
  Settings, 
  Share2, 
  Download, 
  FolderOpen, 
  FileText, 
  Terminal, 
  Bug, 
  Activity,
  ChevronRight,
  ChevronDown,
  Code,
  BookOpen,
  Sparkles,
  Sun,
  Moon,
  Maximize2,
  Minimize2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/components/ui/resizable';
import CodeEditor from './CodeEditor';
import ModernOutputPanel from './ModernOutputPanel';
import { usePlayground } from '@/hooks/usePlayground';

const ModernPlayground = () => {
  const {
    code,
    setCode,
    output,
    isRunning,
    executionTime,
    memoryUsage,
    errorCount,
    runCode,
    resetCode,
    shareCode,
    exportCode,
    showHelp,
    clearOutput,
    handleExampleSelect
  } = usePlayground();

  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState<'output' | 'problems' | 'debug'>('output');
  const [bottomPanelHeight, setBottomPanelHeight] = useState(30);
  const [showBottomPanel, setShowBottomPanel] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const examples = [
    { name: 'Hello World', code: 'fn main() {\n    print("Hello, World!")\n}' },
    { name: 'Variables', code: 'fn main() {\n    let x = 42\n    let name = "Orus"\n    print(x)\n    print(name)\n}' },
    { name: 'Functions', code: 'fn greet(name: string) -> string {\n    return "Hello " + name\n}\n\nfn main() {\n    print(greet("World"))\n}' },
  ];

  const handleRunCode = () => {
    setShowBottomPanel(true);
    runCode();
  };

  return (
    <div className={`h-screen flex flex-col ${darkMode ? 'dark' : ''} bg-slate-50 dark:bg-slate-900`}>
      {/* Modern Header */}
      <header className="h-12 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between px-4 z-10">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Code className="w-4 h-4 text-white" />
            </div>
            <h1 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Orus Playground</h1>
          </div>
          
          <div className="flex items-center space-x-1">
            <Button
              onClick={handleRunCode}
              disabled={isRunning}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 h-8 text-sm font-medium"
            >
              {isRunning ? <Square className="w-4 h-4 mr-1" /> : <Play className="w-4 h-4 mr-1" />}
              {isRunning ? 'Stop' : 'Run'}
            </Button>
            
            <Button variant="ghost" size="sm" className="h-8 px-3">
              <Share2 className="w-4 h-4 mr-1" />
              Share
            </Button>
            
            <Button variant="ghost" size="sm" className="h-8 px-3">
              <Download className="w-4 h-4 mr-1" />
              Export
            </Button>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setDarkMode(!darkMode)}
            className="h-8 w-8 p-0"
          >
            {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="h-8 w-8 p-0"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </Button>
          
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            <Settings className="w-4 h-4" />
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex min-h-0">
        {/* Left Sidebar */}
        <div className={`${sidebarCollapsed ? 'w-12' : 'w-64'} bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 transition-all duration-200 flex flex-col`}>
          <div className="p-3 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
            {!sidebarCollapsed && (
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Explorer</span>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="h-6 w-6 p-0"
            >
              <ChevronRight className={`w-4 h-4 transition-transform ${sidebarCollapsed ? '' : 'rotate-180'}`} />
            </Button>
          </div>

          {!sidebarCollapsed && (
            <div className="flex-1 p-3 space-y-4">
              {/* File Explorer */}
              <div>
                <div className="flex items-center space-x-2 mb-2">
                  <FolderOpen className="w-4 h-4 text-slate-500" />
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Files</span>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center space-x-2 px-2 py-1 rounded hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer">
                    <FileText className="w-4 h-4 text-blue-500" />
                    <span className="text-sm text-slate-700 dark:text-slate-300">main.orus</span>
                  </div>
                </div>
              </div>

              {/* Examples */}
              <div>
                <div className="flex items-center space-x-2 mb-2">
                  <BookOpen className="w-4 h-4 text-slate-500" />
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Examples</span>
                </div>
                <div className="space-y-1">
                  {examples.map((example, index) => (
                    <div
                      key={index}
                      onClick={() => setCode(example.code)}
                      className="flex items-center space-x-2 px-2 py-1 rounded hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer"
                    >
                      <Code className="w-4 h-4 text-purple-500" />
                      <span className="text-sm text-slate-700 dark:text-slate-300">{example.name}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* AI Assistant */}
              <div>
                <div className="flex items-center space-x-2 mb-2">
                  <Sparkles className="w-4 h-4 text-slate-500" />
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">AI Assistant</span>
                </div>
                <Button variant="outline" size="sm" className="w-full justify-start h-8">
                  <Sparkles className="w-4 h-4 mr-2" />
                  Ask AI
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Main Editor Area */}
        <div className="flex-1 flex flex-col min-w-0">
          <ResizablePanelGroup direction="vertical" className="flex-1">
            {/* Code Editor */}
            <ResizablePanel defaultSize={showBottomPanel ? 70 : 100} minSize={30}>
              <div className="h-full bg-white dark:bg-slate-900">
                <div className="h-10 bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 flex items-center px-4">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  </div>
                  <div className="ml-4 flex items-center space-x-2">
                    <FileText className="w-4 h-4 text-slate-500" />
                    <span className="text-sm text-slate-700 dark:text-slate-300">main.orus</span>
                  </div>
                </div>
                <div className="h-[calc(100%-2.5rem)]">
                  <CodeEditor code={code} onChange={setCode} />
                </div>
              </div>
            </ResizablePanel>

            {/* Bottom Panel */}
            {showBottomPanel && (
              <>
                <ResizableHandle className="h-1 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors" />
                <ResizablePanel defaultSize={30} minSize={20}>
                  <div className="h-full bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-700">
                    {/* Bottom Panel Tabs */}
                    <div className="h-10 bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between px-4">
                      <div className="flex items-center space-x-1">
                        <button
                          onClick={() => setActiveTab('output')}
                          className={`px-3 py-1 text-sm rounded transition-colors ${
                            activeTab === 'output'
                              ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
                              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
                          }`}
                        >
                          <Terminal className="w-4 h-4 mr-1 inline" />
                          Output
                        </button>
                        <button
                          onClick={() => setActiveTab('problems')}
                          className={`px-3 py-1 text-sm rounded transition-colors ${
                            activeTab === 'problems'
                              ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
                              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
                          }`}
                        >
                          <Bug className="w-4 h-4 mr-1 inline" />
                          Problems
                          {errorCount > 0 && (
                            <span className="ml-1 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full">
                              {errorCount}
                            </span>
                          )}
                        </button>
                        <button
                          onClick={() => setActiveTab('debug')}
                          className={`px-3 py-1 text-sm rounded transition-colors ${
                            activeTab === 'debug'
                              ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
                              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
                          }`}
                        >
                          <Activity className="w-4 h-4 mr-1 inline" />
                          Debug
                        </button>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowBottomPanel(false)}
                        className="h-6 w-6 p-0"
                      >
                        <ChevronDown className="w-4 h-4" />
                      </Button>
                    </div>

                    {/* Panel Content */}
                    <div className="h-[calc(100%-2.5rem)]">
                      {activeTab === 'output' && (
                        <ModernOutputPanel
                          output={output}
                          isRunning={isRunning}
                          onClear={clearOutput}
                          executionTime={executionTime}
                          memoryUsage={memoryUsage}
                          errorCount={errorCount}
                        />
                      )}
                      {activeTab === 'problems' && (
                        <div className="p-4 text-slate-600 dark:text-slate-400">
                          <h3 className="font-medium mb-2">Problems</h3>
                          {errorCount > 0 ? (
                            <div className="space-y-2">
                              <div className="flex items-start space-x-2 p-2 bg-red-50 dark:bg-red-900/20 rounded">
                                <Bug className="w-4 h-4 text-red-500 mt-0.5" />
                                <div>
                                  <div className="text-sm font-medium text-red-700 dark:text-red-400">
                                    {errorCount} error{errorCount > 1 ? 's' : ''} found
                                  </div>
                                  <div className="text-xs text-red-600 dark:text-red-400">
                                    Check the output tab for details
                                  </div>
                                </div>
                              </div>
                            </div>
                          ) : (
                            <div className="text-sm text-slate-500">No problems detected</div>
                          )}
                        </div>
                      )}
                      {activeTab === 'debug' && (
                        <div className="p-4 text-slate-600 dark:text-slate-400">
                          <h3 className="font-medium mb-2">Debug Console</h3>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span>Execution Time:</span>
                              <span className="font-mono">{executionTime}ms</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Memory Usage:</span>
                              <span className="font-mono">{(memoryUsage / 1024).toFixed(1)}KB</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Lines of Code:</span>
                              <span className="font-mono">{code.split('\n').length}</span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </ResizablePanel>
              </>
            )}
          </ResizablePanelGroup>
        </div>
      </div>

      {/* Status Bar */}
      <div className="h-6 bg-blue-600 text-white text-xs flex items-center justify-between px-4">
        <div className="flex items-center space-x-4">
          <span>Orus Language</span>
          <span>Line 1, Column 1</span>
        </div>
        <div className="flex items-center space-x-4">
          <span>UTF-8</span>
          <span>Spaces: 2</span>
        </div>
      </div>
    </div>
  );
};

export default ModernPlayground;