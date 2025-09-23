import React, { useState, useEffect } from 'react';
import { 
  Play, 
  Square, 
  Settings, 
  Share2, 
  Download,
  ChevronDown,
  FileText,
  Plus,
  MoreHorizontal,
  Star,
  User,
  Code,
  X,
  Sun,
  Moon,
  RectangleHorizontal,
  RectangleVertical,
  Copy,
  Clipboard,
  Trash2,
  FilePlus
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/components/ui/resizable';
import CodeEditor from './CodeEditor';
import { usePlayground } from '@/hooks/usePlayground';

const CleanPlayground = () => {
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

  const [currentFile, setCurrentFile] = useState('main.orus');
  const [files, setFiles] = useState<{[key: string]: string}>({
    'main.orus': code // Initialize with the current code
  });

  const [isPressed, setIsPressed] = useState(false);
  const [showOutput, setShowOutput] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [isSettingsClosing, setIsSettingsClosing] = useState(false);
  const [isSettingsAnimating, setIsSettingsAnimating] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [layout, setLayout] = useState<'horizontal' | 'vertical'>('horizontal');
  const [fontFamily, setFontFamily] = useState('Fira Code');
  const [fontSize, setFontSize] = useState(15);
  const [showTerminalMenu, setShowTerminalMenu] = useState(false);
  const [showNewFileDialog, setShowNewFileDialog] = useState(false);
  const [newFileName, setNewFileName] = useState('');
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [fileToDelete, setFileToDelete] = useState<string>('');

  // Initialize main.orus with the code from the playground hook
  useEffect(() => {
    setFiles(prevFiles => ({
      ...prevFiles,
      'main.orus': code
    }));
  }, []);

  // Update files state when code changes
  useEffect(() => {
    if (currentFile) {
      setFiles(prev => ({
        ...prev,
        [currentFile]: code
      }));
    }
  }, [code, currentFile]);

  // Show output when new content arrives
  useEffect(() => {
    if (output && !isRunning) {
      // Slight delay for smooth appearance
      setTimeout(() => {
        setShowOutput(true);
      }, 100);
    }
  }, [output, isRunning]);

  const handleRunCode = () => {
    if (isRunning) {
      // Stop the program - this should stop execution and set isRunning to false
      clearOutput();
    } else {
      // Make sure we're using the most current version of code for the current file
      const codeToRun = files[currentFile] || code;
      
      // Animate output disappearing
      setShowOutput(false);
      
      // Clear terminal before running new program
      clearOutput();
      
      // Animate button press
      setIsPressed(true);
      setTimeout(() => setIsPressed(false), 150);
      
      // Wait for fade out animation, then run code
      setTimeout(() => {
        // Update code in the playground hook if needed
        if (code !== codeToRun) {
          setCode(codeToRun);
          // Give a small delay for the code to update
          setTimeout(() => {
            runCode();
          }, 50);
        } else {
          runCode();
        }
      }, 200);
    }
  };

  const formatOutput = (text: string) => {
    if (!text) return '';
    
    // Simple ANSI color code handling for terminal-like output
    const ansiColors: Record<string, string> = {
      '[31m': '<span style="color: #ff5555;">',      // red
      '[32m': '<span style="color: #50fa7b;">',      // green  
      '[33m': '<span style="color: #f1fa8c;">',      // yellow
      '[34m': '<span style="color: #8be9fd;">',      // blue
      '[35m': '<span style="color: #bd93f9;">',      // purple
      '[36m': '<span style="color: #8be9fd;">',      // cyan
      '[0m': '</span>',                              // reset
    };
    
    let result = text;
    Object.entries(ansiColors).forEach(([ansiCode, replacement]) => {
      result = result.replace(new RegExp(ansiCode.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), replacement);
    });
    
    return result;
  };

  const handleSettingsToggle = () => {
    if (showSettings) {
      // Start closing animation
      setIsSettingsClosing(true);
      setTimeout(() => {
        setShowSettings(false);
        setIsSettingsClosing(false);
        setIsSettingsAnimating(false);
      }, 350);
    } else {
      // Open - start off-screen, then animate in
      setShowSettings(true);
      setIsSettingsAnimating(true);
      // Let the panel render off-screen first, then animate in
      requestAnimationFrame(() => {
        setTimeout(() => {
          setIsSettingsAnimating(false);
        }, 50);
      });
    }
  };

  const handleSettingsClose = () => {
    setIsSettingsClosing(true);
    setTimeout(() => {
      setShowSettings(false);
      setIsSettingsClosing(false);
      setIsSettingsAnimating(false);
    }, 350);
  };

  const handleCopyOutput = () => {
    if (output) {
      navigator.clipboard.writeText(output);
    }
    setShowTerminalMenu(false);
  };

  const handleCopySelected = () => {
    const selection = window.getSelection()?.toString();
    if (selection) {
      navigator.clipboard.writeText(selection);
    }
    setShowTerminalMenu(false);
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      // Handle paste logic here if needed
      console.log('Pasted:', text);
    } catch (err) {
      console.error('Failed to read clipboard contents: ', err);
    }
    setShowTerminalMenu(false);
  };

  const handleClearTerminal = () => {
    clearOutput();
    setShowTerminalMenu(false);
  };

  const handleFileSwitch = (fileName: string) => {
    // Save current content before switching
    setFiles(prev => ({
      ...prev,
      [currentFile]: code
    }));
    
    // Switch to selected file
    setCurrentFile(fileName);
    
    // Update editor content
    setCode(files[fileName] || '');
  };

  const handleNewFile = () => {
    setNewFileName('');
    setShowNewFileDialog(true);
  };

  const handleCreateNewFile = () => {
    if (newFileName.trim()) {
      // Add .orus extension if not already present
      let fileName = newFileName.trim();
      if (!fileName.endsWith('.orus')) {
        fileName += '.orus';
      }
      
      // Check if file already exists
      if (files[fileName]) {
        // If it exists, just switch to it
        handleFileSwitch(fileName);
      } else {
        // Save current file content before creating a new one
        setFiles(prev => ({
          ...prev,
          [currentFile]: code, // Save current file content
          [fileName]: '// New Orus file\n\n' // Add new file with template content
        }));
        
        // Switch to new file
        setCurrentFile(fileName);
        
        // Update editor with the new file's content
        setCode('// New Orus file\n\n');
      }
      
      // Close dialog
      setShowNewFileDialog(false);
      setNewFileName('');
    }
  };

  const handleDeleteFile = (fileName: string, event: React.MouseEvent) => {
    event.stopPropagation(); // Prevent file switching when clicking delete
    setFileToDelete(fileName);
    setShowDeleteDialog(true);
  };

  const confirmDeleteFile = () => {
    if (fileToDelete && Object.keys(files).length > 1) {
      // Remove file from files
      const newFiles = { ...files };
      delete newFiles[fileToDelete];
      setFiles(newFiles);
      
      // If deleting current file, switch to first available file
      if (fileToDelete === currentFile) {
        const remainingFiles = Object.keys(newFiles);
        if (remainingFiles.length > 0) {
          setCurrentFile(remainingFiles[0]);
          setCode(newFiles[remainingFiles[0]]);
        }
      }
    }
    
    setShowDeleteDialog(false);
    setFileToDelete('');
  };

  const cancelDeleteFile = () => {
    setShowDeleteDialog(false);
    setFileToDelete('');
  };

  return (
    <div className="h-screen text-white flex flex-col" style={{ backgroundColor: '#1e1e1e' }}>
      {/* Header - simplified to match the minimalist style of the example */}
      <header className="h-12 flex items-center justify-between px-4" style={{ backgroundColor: '#1a1a1a', borderBottom: '1px solid #333' }}>
        {/* Left side - Logo and name as home button */}
        <button 
          onClick={() => window.location.href = '/'}
          className="flex items-center space-x-3 text-white font-medium hover:opacity-80 transition-opacity duration-200"
          title="Go to Home"
        >
          <div className="w-7 h-7 bg-blue-600 rounded flex items-center justify-center">
            <Code className="w-4 h-4 text-white" />
          </div>
          <span>Orus</span>
        </button>

        {/* Center buttons - core functionality only */}
        <div className="flex items-center space-x-2">
          <Button
            onClick={handleRunCode}
            className={`text-white px-6 py-2 h-8 font-medium transition-all duration-150 transform ${
              isRunning 
                ? 'bg-red-600 hover:bg-red-700 active:bg-red-800' 
                : 'bg-green-600 hover:bg-green-700 active:bg-green-800'
            } ${
              isPressed ? 'scale-95 shadow-inner' : 'scale-100 shadow-md hover:shadow-lg'
            }`}
            style={{
              boxShadow: isPressed 
                ? 'inset 0 2px 4px rgba(0,0,0,0.3)' 
                : '0 2px 4px rgba(0,0,0,0.2)'
            }}
          >
            {isRunning ? (
              <>
                <Square className="w-4 h-4 mr-2" />
                Stop
              </>
            ) : (
              <>
                <Play className="w-4 h-4 mr-2" />
                Run
              </>
            )}
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={handleSettingsToggle}
            className="h-8 px-3"
            style={{ borderColor: '#44475a', color: '#f8f8f2' }}
          >
            <Settings className="w-4 h-4" />
          </Button>
        </div>

        {/* Right side - empty for minimalism */}
        <div></div>
      </header>

      {/* Main Content */}
      <div className="flex-1 min-h-0">
        <ResizablePanelGroup direction={layout === 'horizontal' ? 'horizontal' : 'vertical'} className="h-full">
          {/* Code Editor */}
          <ResizablePanel defaultSize={60} minSize={30}>
            <div className="h-full flex flex-col overflow-hidden" style={{ backgroundColor: '#1e1e1e' }}>
              {/* Editor Header - updated with tabs design */}
              <div className="flex flex-col" style={{ backgroundColor: '#1a1a1a' }}>
                {/* File Tabs */}
                <div className="flex items-center h-9 overflow-x-auto hide-scrollbar" style={{ borderBottom: '1px solid #333' }}>
                  {/* File Tabs */}
                  <div className="flex items-center">
                    {Object.keys(files).map((fileName) => (
                      <div 
                        key={fileName}
                        onClick={() => handleFileSwitch(fileName)}
                        className={`group flex items-center px-3 h-9 cursor-pointer transition-all duration-200 relative ${
                          fileName === currentFile 
                          ? 'bg-[#1e1e1e] text-white' 
                          : 'bg-[#1a1a1a] text-gray-400 hover:text-gray-200'
                        }`}
                      >
                        <img 
                          src="/orus.png" 
                          alt="Orus icon" 
                          className="w-4 h-4 mr-2" 
                        />
                        <span className="text-sm whitespace-nowrap pr-1">{fileName}</span>
                        
                        {/* X Button - only show if more than one file */}
                        {Object.keys(files).length > 1 && (
                          <button
                            onClick={(e) => handleDeleteFile(fileName, e)}
                            className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 ml-1 p-0.5 rounded text-gray-400 hover:text-red-400 hover:bg-red-500/10"
                            title="Delete file"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Right side spacer */}
                  <div className="flex-1"></div>
                  
                  {/* Add New Button - moved back to right side */}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleNewFile}
                    className="h-9 px-3 text-gray-400 hover:text-gray-200 rounded-none"
                    title="New File"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </Button>
                  
                  {/* Run Button */}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleRunCode}
                    className="h-9 px-3 text-gray-400 hover:text-gray-200 rounded-none"
                    title="Run Code"
                  >
                    <Play className="w-3.5 h-3.5" />
                  </Button>
                </div>
                
                {/* Style for hiding scrollbar but allowing scroll */}
                <style dangerouslySetInnerHTML={{
                  __html: `
                    .hide-scrollbar::-webkit-scrollbar {
                      height: 0;
                      width: 0;
                      display: none;
                    }
                    .hide-scrollbar {
                      -ms-overflow-style: none;
                      scrollbar-width: none;
                    }
                  `
                }} />
              </div>
              
              {/* Editor Content */}
              <div style={{ flex: 1, height: 0, minHeight: 0 }}>
                <CodeEditor 
                  code={code} 
                  onChange={setCode} 
                />
              </div>
            </div>
          </ResizablePanel>

          {/* Resizable Handle - Thin separator line */}
          <ResizableHandle className={layout === 'horizontal' ? 'w-px' : 'h-px'} style={{ backgroundColor: '#333' }} />

          {/* Terminal/Output Panel */}
          <ResizablePanel defaultSize={40} minSize={30}>
            <div className="h-full flex flex-col" style={{ backgroundColor: '#1e1e1e' }}>
              {/* Terminal Header - updated to match code editor style */}
              <div className="h-9 flex items-center justify-between px-2" style={{ backgroundColor: '#1e1e1e' }}>
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-medium tracking-wider" style={{ color: '#a8a8a8', fontFamily: 'monospace' }}>TERMINAL</span>
                </div>
                <div className="relative">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowTerminalMenu(!showTerminalMenu)}
                    className="h-7 w-7 p-0 text-gray-400 hover:text-gray-300"
                  >
                    <MoreHorizontal className="w-3.5 h-3.5" />
                  </Button>
                  
                  {/* Terminal Context Menu */}
                  {showTerminalMenu && (
                    <>
                      {/* Backdrop to close menu */}
                      <div 
                        className="fixed inset-0 z-10"
                        onClick={() => setShowTerminalMenu(false)}
                      />
                      
                      {/* Menu */}
                      <div 
                        className="absolute right-0 top-full mt-1 w-48 rounded-lg shadow-lg z-20"
                        style={{ backgroundColor: '#2a2a2a', border: '1px solid #404040' }}
                      >
                        <div className="py-1">
                          <button
                            onClick={handleCopyOutput}
                            className="w-full px-3 py-2 text-left text-sm text-gray-300 hover:bg-gray-700 hover:text-white flex items-center space-x-2"
                            disabled={!output}
                          >
                            <Copy className="w-4 h-4" />
                            <span>Copy Output</span>
                          </button>
                          
                          <button
                            onClick={handleCopySelected}
                            className="w-full px-3 py-2 text-left text-sm text-gray-300 hover:bg-gray-700 hover:text-white flex items-center space-x-2"
                          >
                            <Copy className="w-4 h-4" />
                            <span>Copy Selected</span>
                          </button>
                          
                          <button
                            onClick={handlePaste}
                            className="w-full px-3 py-2 text-left text-sm text-gray-300 hover:bg-gray-700 hover:text-white flex items-center space-x-2"
                          >
                            <Clipboard className="w-4 h-4" />
                            <span>Paste</span>
                          </button>
                          
                          <button
                            onClick={handleClearTerminal}
                            className="w-full px-3 py-2 text-left text-sm text-gray-300 hover:bg-gray-700 hover:text-white flex items-center space-x-2"
                          >
                            <Trash2 className="w-4 h-4" />
                            <span>Clear Terminal</span>
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Terminal Content */}
              <div className="flex-1 p-4 overflow-y-auto font-mono text-sm">
                {isRunning ? (
                  <div 
                    className="animate-fade-in"
                    style={{ color: '#f1fa8c' }}
                  >
                    Running your code...
                  </div>
                ) : output ? (
                  <div 
                    className={`transition-all duration-300 ${
                      showOutput ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-2'
                    }`}
                  >
                    {/* Output content - WHITE */}
                    <div 
                      className="whitespace-pre-wrap"
                      style={{ color: '#ffffff' }}
                    >
                      {/* Comprehensive text cleaning for output */}
                      {typeof output === 'string' 
                        ? output
                            .replace(/<[^>]*>/g, '') // Remove HTML tags
                            .replace(/&lt;/g, '<')    // Decode HTML entities
                            .replace(/&gt;/g, '>')
                            .replace(/&amp;/g, '&')
                            .replace(/&quot;/g, '"')
                            .replace(/&#39;/g, "'")
                            .replace(/#[0-9a-fA-F]{6}/g, '') // Remove any hex color codes
                            .replace(/color:\s*[^;]+;?/gi, '') // Remove any CSS color properties
                        : output
                      }
                    </div>
                    {/* Cursor after output */}
                    <div className="flex items-center">
                      <span style={{ color: '#ffffff' }}>$ </span>
                      <div 
                        className="w-2 h-4 bg-white ml-1 animate-pulse"
                        style={{
                          animation: 'blink 1s infinite'
                        }}
                      />
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center">
                    <span style={{ color: '#ffffff' }}>$ </span>
                    <div 
                      className="w-2 h-4 bg-white ml-1"
                      style={{
                        animation: 'blink 1s infinite'
                      }}
                    />
                  </div>
                )}
                <style dangerouslySetInnerHTML={{
                  __html: `
                    @keyframes blink {
                      0%, 50% { opacity: 1; }
                      51%, 100% { opacity: 0; }
                    }
                  `
                }} />
              </div>
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>

      {/* Settings Panel */}
      {showSettings && (
        <>
          {/* Backdrop */}
          <div 
            className={`fixed inset-0 bg-black z-40 transition-opacity duration-[350ms] ease-out ${
              isSettingsClosing ? 'opacity-0' : 'opacity-50'
            }`}
            onClick={handleSettingsClose}
          />
          
          {/* Settings Panel */}
          <div 
            className={`fixed top-0 right-0 h-full w-80 z-50 transition-transform duration-[350ms] ease-[cubic-bezier(0.25,0.46,0.45,0.94)] ${
              isSettingsClosing 
                ? 'transform translate-x-full' 
                : isSettingsAnimating
                ? 'transform translate-x-full'
                : 'transform translate-x-0'
            }`}
            style={{ backgroundColor: '#1e1e1e' }}
          >
            <div className="p-5 h-full overflow-y-auto">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-medium text-white">Settings</h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleSettingsClose}
                  className="p-1 text-gray-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>

              {/* Theme Section */}
              <div className="mb-6">
                <h3 className="text-white text-sm font-normal mb-3">Theme</h3>
                <div className="inline-flex bg-black rounded-lg p-1">
                  <button
                    onClick={() => setTheme('light')}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm transition-all ${
                      theme === 'light' 
                        ? 'bg-gray-700 text-white' 
                        : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    <Sun className="w-3.5 h-3.5" />
                    <span>Light</span>
                  </button>
                  <button
                    onClick={() => setTheme('dark')}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm transition-all ${
                      theme === 'dark' 
                        ? 'bg-gray-700 text-white' 
                        : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    <Moon className="w-3.5 h-3.5" />
                    <span>Dark</span>
                  </button>
                </div>
              </div>

              {/* Layout Section */}
              <div className="mb-6">
                <h3 className="text-white text-sm font-normal mb-3">Layout</h3>
                <div className="flex bg-black rounded-lg p-1 w-fit">
                  <button
                    onClick={() => setLayout('horizontal')}
                    className={`flex items-center justify-center p-2 rounded-md transition-all ${
                      layout === 'horizontal' 
                        ? 'bg-gray-700 text-white' 
                        : 'text-gray-400 hover:text-white'
                    }`}
                    title="Side by side"
                  >
                    <RectangleHorizontal className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setLayout('vertical')}
                    className={`flex items-center justify-center p-2 rounded-md transition-all ${
                      layout === 'vertical' 
                        ? 'bg-gray-700 text-white' 
                        : 'text-gray-400 hover:text-white'
                    }`}
                    title="Top and bottom"
                  >
                    <RectangleVertical className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Font Family Section */}
              <div className="mb-6">
                <h3 className="text-white text-sm font-normal mb-3">Font Family</h3>
                <div className="relative">
                  <select
                    value={fontFamily}
                    onChange={(e) => setFontFamily(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-lg text-sm text-white appearance-none cursor-pointer focus:outline-none focus:ring-1 focus:ring-gray-500"
                    style={{ backgroundColor: '#2a2a2a', border: '1px solid #404040' }}
                  >
                    <option value="Fira Code">Fira Code</option>
                    <option value="JetBrains Mono">JetBrains Mono</option>
                    <option value="Monaco">Monaco</option>
                    <option value="Menlo">Menlo</option>
                    <option value="Ubuntu Mono">Ubuntu Mono</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>
              </div>

              {/* Font Size Section */}
              <div className="mb-6">
                <h3 className="text-white text-sm font-normal mb-4">Font Size: {fontSize}px</h3>
                <div className="relative">
                  <input
                    type="range"
                    min="10"
                    max="24"
                    step="0.5"
                    value={fontSize}
                    onChange={(e) => setFontSize(parseFloat(e.target.value))}
                    className="w-full h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer"
                    style={{
                      background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${((fontSize - 10) / (24 - 10)) * 100}%, #4a5568 ${((fontSize - 10) / (24 - 10)) * 100}%, #4a5568 100%)`
                    }}
                  />
                  <style dangerouslySetInnerHTML={{
                    __html: `
                      input[type="range"]::-webkit-slider-thumb {
                        appearance: none;
                        width: 16px;
                        height: 16px;
                        border-radius: 50%;
                        background: #3b82f6;
                        cursor: pointer;
                        border: 2px solid #1e1e1e;
                        box-shadow: 0 0 0 1px rgba(59, 130, 246, 0.3);
                      }
                      input[type="range"]::-moz-range-thumb {
                        width: 16px;
                        height: 16px;
                        border-radius: 50%;
                        background: #3b82f6;
                        cursor: pointer;
                        border: 2px solid #1e1e1e;
                        box-shadow: 0 0 0 1px rgba(59, 130, 246, 0.3);
                      }
                    `
                  }} />
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* New File Dialog */}
      {showNewFileDialog && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black z-40 transition-opacity duration-[250ms]"
            style={{ opacity: 0.5 }}
            onClick={() => setShowNewFileDialog(false)}
          />
          
          {/* Dialog */}
          <div 
            className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 rounded-lg z-50 animate-scale-in"
            style={{ backgroundColor: '#1e1e1e', border: '1px solid #333' }}
          >
            {/* Dialog Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-700">
              <h2 className="text-xl font-medium text-white">Create New File</h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowNewFileDialog(false)}
                className="p-1 text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>
            
            {/* Dialog Content */}
            <div className="px-6 py-5">
              <label className="block text-gray-300 text-sm mb-3">New File Name</label>
              <input
                type="text"
                value={newFileName}
                onChange={(e) => setNewFileName(e.target.value)}
                placeholder="filename.orus"
                className="w-full px-4 py-3 rounded-lg text-sm text-white bg-gray-900 border border-gray-700 focus:outline-none focus:border-blue-500"
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleCreateNewFile();
                  }
                }}
              />
            </div>
            
            {/* Dialog Footer */}
            <div className="flex justify-end px-6 py-4 border-t border-gray-700 space-x-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowNewFileDialog(false)}
                className="px-4 py-2 text-gray-300 border-gray-600"
              >
                <X className="w-4 h-4 mr-2" />
                Cancel
              </Button>
              
              <Button
                onClick={handleCreateNewFile}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white"
                disabled={!newFileName.trim()}
              >
                <Plus className="w-4 h-4 mr-2" />
                Create
              </Button>
            </div>
          </div>
        </>
      )}

      {/* Delete File Dialog */}
      {showDeleteDialog && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black z-40 transition-opacity duration-[250ms]"
            style={{ opacity: 0.5 }}
            onClick={cancelDeleteFile}
          />
          
          {/* Dialog */}
          <div 
            className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 rounded-lg z-50 animate-scale-in"
            style={{ backgroundColor: '#1e1e1e', border: '1px solid #333' }}
          >
            {/* Dialog Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-700">
              <h2 className="text-xl font-medium text-white">Delete File</h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={cancelDeleteFile}
                className="p-1 text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>
            
            {/* Dialog Content */}
            <div className="px-6 py-5">
              <p className="text-gray-300 text-sm">
                Are you sure you want to delete <span className="font-semibold text-white">"{fileToDelete}"</span>? 
                This action cannot be undone.
              </p>
            </div>
            
            {/* Dialog Footer */}
            <div className="flex justify-end px-6 py-4 border-t border-gray-700 space-x-3">
              <Button
                variant="outline"
                size="sm"
                onClick={cancelDeleteFile}
                className="px-4 py-2 text-gray-300 border-gray-600"
              >
                Cancel
              </Button>
              
              <Button
                onClick={confirmDeleteFile}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </Button>
            </div>
          </div>
          
          {/* Add smooth scale animation */}
          <style dangerouslySetInnerHTML={{
            __html: `
              @keyframes scale-in {
                0% { transform: translate(-50%, -50%) scale(0.95); opacity: 0; }
                100% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
              }
              @keyframes fade-in {
                0% { opacity: 0; }
                100% { opacity: 1; }
              }
              .animate-scale-in {
                animation: scale-in 0.2s ease-out;
              }
              .animate-fade-in {
                animation: fade-in 0.25s ease-out;
              }
            `
          }} />
        </>
      )}
    </div>
  );
};

export default CleanPlayground;