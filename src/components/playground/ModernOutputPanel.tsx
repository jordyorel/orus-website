import React, { useState, useMemo } from 'react';
import { 
  Terminal, 
  Copy, 
  Search, 
  Filter, 
  Clock, 
  Zap, 
  AlertTriangle, 
  CheckCircle,
  XCircle,
  Info,
  ChevronRight,
  MoreHorizontal
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { OutputPanelProps } from '@/types/playground';

const ModernOutputPanel = ({ output, isRunning, onClear, executionTime, memoryUsage, errorCount }: OutputPanelProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [filterLevel, setFilterLevel] = useState<'all' | 'info' | 'warning' | 'error'>('all');
  const [copiedLine, setCopiedLine] = useState<number | null>(null);

  const formatOutput = (text: string) => {
    if (!text) return '';
    
    // ANSI color code mappings for modern theme
    const ansiColors: Record<string, string> = {
      '[31m': 'text-red-500 dark:text-red-400',
      '[31;1m': 'text-red-500 dark:text-red-400 font-semibold',
      '[32m': 'text-green-500 dark:text-green-400',
      '[32;1m': 'text-green-500 dark:text-green-400 font-semibold',
      '[33m': 'text-yellow-500 dark:text-yellow-400',
      '[33;1m': 'text-yellow-500 dark:text-yellow-400 font-semibold',
      '[34m': 'text-blue-500 dark:text-blue-400',
      '[34;1m': 'text-blue-500 dark:text-blue-400 font-semibold',
      '[35m': 'text-purple-500 dark:text-purple-400',
      '[35;1m': 'text-purple-500 dark:text-purple-400 font-semibold',
      '[36m': 'text-cyan-500 dark:text-cyan-400',
      '[36;1m': 'text-cyan-500 dark:text-cyan-400 font-semibold',
      '[37m': 'text-slate-700 dark:text-slate-300',
      '[37;1m': 'text-slate-700 dark:text-slate-300 font-semibold',
      '[0m': '',
    };
    
    let result = text;
    
    Object.entries(ansiColors).forEach(([ansiCode, className]) => {
      if (className === '') {
        result = result.replace(new RegExp(ansiCode.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), '</span>');
      } else {
        result = result.replace(
          new RegExp(ansiCode.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), 
          `<span class="${className}">`
        );
      }
    });
    
    // Clean up spans
    const openSpans = (result.match(/<span/g) || []).length;
    const closeSpans = (result.match(/<\/span>/g) || []).length;
    
    if (openSpans > closeSpans) {
      result += '</span>'.repeat(openSpans - closeSpans);
    } else if (closeSpans > openSpans) {
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

  const getLineIcon = (type: string) => {
    switch (type) {
      case 'error':
        return <XCircle className="w-3 h-3 text-red-500" />;
      case 'warning':
        return <AlertTriangle className="w-3 h-3 text-yellow-500" />;
      default:
        return <Info className="w-3 h-3 text-blue-500" />;
    }
  };

  return (
    <div className="h-full flex flex-col bg-white dark:bg-slate-900">
      {/* Modern Header */}
      <div className="flex items-center justify-between p-3 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800">
        <div className="flex items-center space-x-3">
          <Terminal className="w-4 h-4 text-slate-600 dark:text-slate-400" />
          <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Output</span>
          {processedOutput.lines.length > 0 && (
            <span className="text-xs text-slate-500 bg-slate-200 dark:bg-slate-700 px-2 py-0.5 rounded-full">
              {processedOutput.lines.length} lines
            </span>
          )}
        </div>
        
        <div className="flex items-center space-x-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowSearch(!showSearch)}
            className={`h-7 w-7 p-0 ${showSearch ? 'bg-slate-200 dark:bg-slate-700' : ''}`}
          >
            <Search className="w-3.5 h-3.5" />
          </Button>
          <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
            <Filter className="w-3.5 h-3.5" />
          </Button>
          <Button variant="ghost" size="sm" onClick={onClear} className="h-7 w-7 p-0">
            <MoreHorizontal className="w-3.5 h-3.5" />
          </Button>
        </div>
      </div>

      {/* Search Bar */}
      {showSearch && (
        <div className="p-3 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800">
          <div className="flex items-center space-x-2">
            <input
              type="text"
              placeholder="Search output..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 px-3 py-1.5 rounded border border-slate-300 dark:border-slate-600 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <select
              value={filterLevel}
              onChange={(e) => setFilterLevel(e.target.value as any)}
              className="bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 px-2 py-1.5 rounded border border-slate-300 dark:border-slate-600 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
      <div className="flex-1 overflow-hidden">
        {isRunning ? (
          <div className="h-full flex items-center justify-center">
            <div className="flex items-center space-x-3 text-slate-600 dark:text-slate-400">
              <div className="animate-spin rounded-full h-5 w-5 border-2 border-blue-500 border-t-transparent"></div>
              <span className="text-sm">Running your code...</span>
            </div>
          </div>
        ) : output ? (
          <div className="h-full overflow-y-auto">
            {filteredLines.length > 0 ? (
              <div className="p-4 space-y-1">
                {filteredLines.map((line) => (
                  <div
                    key={line.id}
                    className="group flex items-start space-x-3 py-1 px-2 rounded hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                  >
                    <div className="flex-shrink-0 w-4 flex justify-center mt-0.5">
                      {getLineIcon(line.type)}
                    </div>
                    <div className="flex-shrink-0 w-10 text-xs text-slate-500 font-mono mt-0.5">
                      {line.id + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div 
                        className={`text-sm font-mono leading-relaxed ${
                          line.type === 'error' ? 'text-red-600 dark:text-red-400' :
                          line.type === 'warning' ? 'text-yellow-600 dark:text-yellow-400' :
                          'text-slate-700 dark:text-slate-300'
                        }`}
                        dangerouslySetInnerHTML={{
                          __html: formatOutput(line.content)
                        }}
                      />
                    </div>
                    <div className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="flex items-center space-x-2">
                        <span className="text-xs text-slate-500">
                          {line.timestamp}
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard(line.content, line.id)}
                          className="h-6 w-6 p-0 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                        >
                          {copiedLine === line.id ? (
                            <CheckCircle className="w-3 h-3 text-green-500" />
                          ) : (
                            <Copy className="w-3 h-3" />
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : searchTerm ? (
              <div className="h-full flex items-center justify-center">
                <div className="text-center text-slate-500">
                  <Search className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No matches found for "{searchTerm}"</p>
                </div>
              </div>
            ) : (
              <div className="h-full flex items-center justify-center">
                <div className="text-center text-slate-500">
                  <Terminal className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No output to display</p>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="h-full flex items-center justify-center">
            <div className="text-center text-slate-500">
              <Terminal className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p className="text-sm mb-1">Ready to run your code</p>
              <p className="text-xs">Press the Run button to see output here</p>
            </div>
          </div>
        )}
      </div>

      {/* Performance Stats Footer */}
      {(executionTime > 0 || memoryUsage > 0) && (
        <div className="border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-4 py-2">
          <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-400">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1">
                <Clock className="w-3 h-3" />
                <span>{executionTime}ms</span>
              </div>
              <div className="flex items-center space-x-1">
                <Zap className="w-3 h-3" />
                <span>{(memoryUsage / 1024).toFixed(1)}KB</span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <span>{processedOutput.lines.length} lines</span>
              {errorCount > 0 && (
                <span className="text-red-500">{errorCount} errors</span>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ModernOutputPanel;