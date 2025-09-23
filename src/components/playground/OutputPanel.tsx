
import { Terminal, X, Trash2, Search, Copy, Filter, Clock, Zap, AlertTriangle, ChevronDown, ChevronRight } from 'lucide-react';
import { OutputPanelProps } from '@/types/playground';
import { Button } from '@/components/ui/button';
import { useState, useMemo } from 'react';

const OutputPanel = ({ output, isRunning, onClear, executionTime, memoryUsage, errorCount }: OutputPanelProps) => {
  const [activeTab, setActiveTab] = useState<'output' | 'errors' | 'performance'>('output');
  const [searchTerm, setSearchTerm] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [filterLevel, setFilterLevel] = useState<'all' | 'info' | 'warning' | 'error'>('all');
  const [expandedSections, setExpandedSections] = useState<Set<number>>(new Set());
  const [copiedLine, setCopiedLine] = useState<number | null>(null);
  // Function to convert ANSI color codes to HTML
  const formatOutput = (text: string) => {
    if (!text) return '';
    
    // ANSI color code mappings
    const ansiColors: Record<string, string> = {
      '[31m': 'text-red-400',      // red
      '[31;1m': 'text-red-400 font-bold',  // bold red
      '[32m': 'text-green-400',    // green
      '[32;1m': 'text-green-400 font-bold', // bold green
      '[33m': 'text-yellow-400',   // yellow
      '[33;1m': 'text-yellow-400 font-bold', // bold yellow
      '[34m': 'text-blue-400',     // blue
      '[34;1m': 'text-blue-400 font-bold',  // bold blue
      '[35m': 'text-purple-400',   // magenta
      '[35;1m': 'text-purple-400 font-bold', // bold magenta
      '[36m': 'text-cyan-400',     // cyan
      '[36;1m': 'text-cyan-400 font-bold',   // bold cyan
      '[37m': 'text-white',        // white
      '[37;1m': 'text-white font-bold',      // bold white
      '[0m': '',                   // reset
    };
    
    let result = text;
    
    // Replace ANSI codes with HTML spans
    Object.entries(ansiColors).forEach(([ansiCode, className]) => {
      if (className === '') {
        // For reset codes, close the span
        result = result.replace(new RegExp(ansiCode.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), '</span>');
      } else {
        // For color codes, open a span with the appropriate class
        result = result.replace(
          new RegExp(ansiCode.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), 
          `<span class="${className}">`
        );
      }
    });
    
    // Clean up any unclosed spans and extra closing spans
    const openSpans = (result.match(/<span/g) || []).length;
    const closeSpans = (result.match(/<\/span>/g) || []).length;
    
    if (openSpans > closeSpans) {
      // Add missing closing spans
      result += '</span>'.repeat(openSpans - closeSpans);
    } else if (closeSpans > openSpans) {
      // Remove extra closing spans
      let extraCloses = closeSpans - openSpans;
      result = result.replace(/<\/span>/g, (match) => {
        if (extraCloses > 0) {
          extraCloses--;
          return '';
        }
        return match;
      });
    }
    
    return result;
  };

  const processedOutput = useMemo(() => {
    if (!output) return { lines: [], errors: [], performance: {} };
    
    const lines = output.split('\n').map((line, index) => ({
      id: index,
      content: line,
      timestamp: new Date().toLocaleTimeString(),
      type: line.includes('error') || line.includes('Error') ? 'error' : 
            line.includes('warning') || line.includes('Warning') ? 'warning' : 'info'
    }));

    const errors = lines.filter(line => line.type === 'error');
    
    const performance = {
      executionTime: executionTime || 0,
      memoryUsage: memoryUsage || 0,
      linesOfOutput: lines.length,
      errorCount: errorCount || errors.length
    };

    return { lines, errors, performance };
  }, [output, executionTime, memoryUsage, errorCount]);

  const filteredLines = useMemo(() => {
    let filtered = processedOutput.lines;
    
    if (filterLevel !== 'all') {
      filtered = filtered.filter(line => line.type === filterLevel);
    }
    
    if (searchTerm) {
      filtered = filtered.filter(line => 
        line.content.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    return filtered;
  }, [processedOutput.lines, filterLevel, searchTerm]);

  const copyToClipboard = async (text: string, lineId: number) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedLine(lineId);
      setTimeout(() => setCopiedLine(null), 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  const toggleSection = (sectionId: number) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(sectionId)) {
      newExpanded.delete(sectionId);
    } else {
      newExpanded.add(sectionId);
    }
    setExpandedSections(newExpanded);
  };

  return (
    <div className="h-full flex flex-col bg-charcoal-900">
      {/* Tabs Header */}
      <div className="flex items-center justify-between bg-charcoal-800 border-b border-charcoal-700">
        <div className="flex">
          <button 
            className={`px-4 py-2 text-sm border-r border-charcoal-600 transition-all ${
              activeTab === 'output' 
                ? 'text-charcoal-200 bg-charcoal-700' 
                : 'text-charcoal-400 hover:text-charcoal-200 hover:bg-charcoal-750'
            }`}
            onClick={() => setActiveTab('output')}
          >
            <Terminal size={14} className="inline mr-1" />
            Output
          </button>
          <button 
            className={`px-4 py-2 text-sm border-r border-charcoal-600 transition-all relative ${
              activeTab === 'errors' 
                ? 'text-charcoal-200 bg-charcoal-700' 
                : 'text-charcoal-400 hover:text-charcoal-200 hover:bg-charcoal-750'
            }`}
            onClick={() => setActiveTab('errors')}
          >
            <AlertTriangle size={14} className="inline mr-1" />
            Errors
            {processedOutput.errors.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {processedOutput.errors.length}
              </span>
            )}
          </button>
          <button 
            className={`px-4 py-2 text-sm transition-all ${
              activeTab === 'performance' 
                ? 'text-charcoal-200 bg-charcoal-700' 
                : 'text-charcoal-400 hover:text-charcoal-200 hover:bg-charcoal-750'
            }`}
            onClick={() => setActiveTab('performance')}
          >
            <Zap size={14} className="inline mr-1" />
            Performance
          </button>
        </div>
        <div className="flex items-center space-x-2 mr-2">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setShowSearch(!showSearch)}
            className={`text-charcoal-400 hover:text-charcoal-200 p-2 ${showSearch ? 'bg-charcoal-700' : ''}`}
            title="Search output"
          >
            <Search size={16} />
          </Button>
          <div className="relative">
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-charcoal-400 hover:text-charcoal-200 p-2"
              title="Filter output"
            >
              <Filter size={16} />
            </Button>
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onClear}
            className="text-charcoal-400 hover:text-charcoal-200 p-2"
            title="Clear output"
          >
            <Trash2 size={16} />
          </Button>
        </div>
      </div>

      {/* Search Bar */}
      {showSearch && (
        <div className="bg-charcoal-800 border-b border-charcoal-700 p-2">
          <div className="flex items-center space-x-2">
            <input
              type="text"
              placeholder="Search in output..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 bg-charcoal-900 text-charcoal-200 px-3 py-1 rounded text-sm focus:outline-none focus:ring-2 focus:ring-gold-600"
            />
            <select
              value={filterLevel}
              onChange={(e) => setFilterLevel(e.target.value as any)}
              className="bg-charcoal-900 text-charcoal-200 px-2 py-1 rounded text-sm focus:outline-none focus:ring-2 focus:ring-gold-600"
            >
              <option value="all">All</option>
              <option value="info">Info</option>
              <option value="warning">Warnings</option>
              <option value="error">Errors</option>
            </select>
          </div>
        </div>
      )}

      {/* Content Area */}
      <div className="flex-1 bg-charcoal-950">
        <div className="p-4 h-full overflow-y-auto">
          {isRunning ? (
            <div className="text-charcoal-400 font-mono text-sm">
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gold-600 mr-2"></div>
                Running...
              </div>
            </div>
          ) : (
            <>
              {/* Output Tab */}
              {activeTab === 'output' && (
                <div>
                  {output ? (
                    <div className="space-y-1">
                      {filteredLines.map((line, index) => (
                        <div
                          key={line.id}
                          className="group flex items-start hover:bg-charcoal-800/50 rounded px-2 py-1 transition-colors"
                        >
                          <div className="flex-shrink-0 w-12 text-charcoal-500 text-xs font-mono mr-3 mt-0.5">
                            {line.id + 1}
                          </div>
                          <div className="flex-1 font-mono text-sm leading-relaxed">
                            <div 
                              className={`${
                                line.type === 'error' ? 'text-red-400' :
                                line.type === 'warning' ? 'text-yellow-400' :
                                'text-charcoal-200'
                              }`}
                              dangerouslySetInnerHTML={{
                                __html: formatOutput(line.content)
                              }}
                            />
                          </div>
                          <div className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity ml-2">
                            <div className="flex items-center space-x-1">
                              <span className="text-charcoal-500 text-xs">
                                {line.timestamp}
                              </span>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => copyToClipboard(line.content, line.id)}
                                className="h-6 w-6 p-0 text-charcoal-400 hover:text-charcoal-200"
                                title="Copy line"
                              >
                                {copiedLine === line.id ? (
                                  <span className="text-green-400">✓</span>
                                ) : (
                                  <Copy size={12} />
                                )}
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                      {filteredLines.length === 0 && searchTerm && (
                        <div className="text-charcoal-400 font-mono text-sm text-center py-8">
                          No matches found for "{searchTerm}"
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-charcoal-400 font-mono text-sm text-center py-8">
                      Program output will appear here...
                    </div>
                  )}
                </div>
              )}

              {/* Errors Tab */}
              {activeTab === 'errors' && (
                <div>
                  {processedOutput.errors.length > 0 ? (
                    <div className="space-y-2">
                      {processedOutput.errors.map((error, index) => (
                        <div
                          key={error.id}
                          className="bg-red-900/20 border border-red-700/30 rounded-lg p-3 hover:bg-red-900/30 transition-colors"
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center mb-1">
                                <AlertTriangle size={16} className="text-red-400 mr-2" />
                                <span className="text-red-400 font-semibold text-sm">
                                  Error on line {error.id + 1}
                                </span>
                              </div>
                              <div 
                                className="text-red-300 font-mono text-sm leading-relaxed"
                                dangerouslySetInnerHTML={{
                                  __html: formatOutput(error.content)
                                }}
                              />
                            </div>
                            <div className="text-charcoal-500 text-xs ml-4">
                              {error.timestamp}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-charcoal-400 font-mono text-sm text-center py-8">
                      <AlertTriangle size={24} className="mx-auto mb-2 text-charcoal-600" />
                      No errors to display
                    </div>
                  )}
                </div>
              )}

              {/* Performance Tab */}
              {activeTab === 'performance' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-charcoal-800 rounded-lg p-4">
                      <div className="flex items-center mb-2">
                        <Clock size={16} className="text-blue-400 mr-2" />
                        <span className="text-charcoal-200 font-semibold text-sm">Execution Time</span>
                      </div>
                      <div className="text-2xl font-mono text-blue-400">
                        {processedOutput.performance.executionTime}ms
                      </div>
                    </div>
                    <div className="bg-charcoal-800 rounded-lg p-4">
                      <div className="flex items-center mb-2">
                        <Zap size={16} className="text-green-400 mr-2" />
                        <span className="text-charcoal-200 font-semibold text-sm">Memory Usage</span>
                      </div>
                      <div className="text-2xl font-mono text-green-400">
                        {(processedOutput.performance.memoryUsage / 1024).toFixed(1)}KB
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-charcoal-800 rounded-lg p-4">
                      <div className="flex items-center mb-2">
                        <Terminal size={16} className="text-purple-400 mr-2" />
                        <span className="text-charcoal-200 font-semibold text-sm">Output Lines</span>
                      </div>
                      <div className="text-2xl font-mono text-purple-400">
                        {processedOutput.performance.linesOfOutput}
                      </div>
                    </div>
                    <div className="bg-charcoal-800 rounded-lg p-4">
                      <div className="flex items-center mb-2">
                        <AlertTriangle size={16} className="text-red-400 mr-2" />
                        <span className="text-charcoal-200 font-semibold text-sm">Error Count</span>
                      </div>
                      <div className="text-2xl font-mono text-red-400">
                        {processedOutput.performance.errorCount}
                      </div>
                    </div>
                  </div>

                  {processedOutput.performance.executionTime > 0 && (
                    <div className="bg-charcoal-800 rounded-lg p-4">
                      <div className="flex items-center mb-3">
                        <span className="text-charcoal-200 font-semibold text-sm">Performance Insights</span>
                      </div>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between text-charcoal-300">
                          <span>Lines per second:</span>
                          <span className="font-mono">
                            {Math.round(processedOutput.performance.linesOfOutput / (processedOutput.performance.executionTime / 1000))}
                          </span>
                        </div>
                        <div className="flex justify-between text-charcoal-300">
                          <span>Memory efficiency:</span>
                          <span className="font-mono">
                            {(processedOutput.performance.memoryUsage / processedOutput.performance.linesOfOutput).toFixed(0)} bytes/line
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default OutputPanel;
