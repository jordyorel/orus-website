import React, { useState, useEffect } from 'react';
import {
  Play,
  Square,
  Settings,
  Plus,
  MoreHorizontal,
  Code,
  X,
  Columns,
  Rows,
  Copy,
  Clipboard,
  Trash2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/components/ui/resizable';
import CodeEditor from './CodeEditor';
import { usePlayground } from '@/hooks/usePlayground';

const DARK_PALETTE = {
  pageBackground: '#1e1e1e',
  primaryText: '#f8f8f2',
  mutedText: '#a8a8a8',
  headerBackground: '#1a1a1a',
  headerBorder: '#333333',
  controlButtonBorder: '#44475a',
  controlButtonText: '#f8f8f2',
  panelBackground: '#1e1e1e',
  panelHeaderBackground: '#1a1a1a',
  panelBorder: '#333333',
  resizer: '#333333',
  tabActiveBackground: '#1e1e1e',
  tabInactiveBackground: '#1a1a1a',
  tabActiveText: '#ffffff',
  tabInactiveText: '#a1a1aa',
  menuBackground: '#2a2a2a',
  menuBorder: '#404040',
  menuText: '#d1d1d1',
  terminalLabel: '#a8a8a8',
  statusText: '#f1fa8c',
  outputText: '#ffffff',
  promptText: '#ffffff',
  cursorColor: '#ffffff',
  settingsBackground: '#1e1e1e',
  settingsBorder: '#333333',
  dialogBackground: '#1e1e1e',
  dialogInputBackground: '#161616',
  dialogInputBorder: '#333333',
  dialogText: '#f8f8f2',
  dialogSubtext: '#c0c0c0',
} as const;

const CleanPlayground = () => {
  const {
    code,
    setCode,
    output,
    isRunning,
    executionTime,
    memoryUsage,
    errorCount,
    issueSource,
    runCode,
    resetCode,
    shareCode,
    exportCode,
    showHelp,
    clearOutput,
    handleExampleSelect,
    cancelExecution
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
  const [layout, setLayout] = useState<'horizontal' | 'vertical'>('horizontal');
  const [showTerminalMenu, setShowTerminalMenu] = useState(false);
  const [showNewFileDialog, setShowNewFileDialog] = useState(false);
  const [newFileName, setNewFileName] = useState('');
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [fileToDelete, setFileToDelete] = useState<string>('');
  const palette = DARK_PALETTE;

  const displayOutput = typeof output === 'string' ? output : String(output ?? '');
  const hasOutput = displayOutput.length > 0;

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
      cancelExecution();
      setShowOutput(true);
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
    if (hasOutput) {
      navigator.clipboard.writeText(displayOutput);
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
    <div
      className="h-screen flex flex-col"
      style={{ backgroundColor: palette.pageBackground, color: palette.primaryText }}
    >
      {/* Header - simplified to match the minimalist style of the example */}
      <header
        className="h-12 flex items-center justify-between px-4"
        style={{ backgroundColor: palette.headerBackground, borderBottom: `1px solid ${palette.headerBorder}` }}
      >
        {/* Left side - Logo and name as home button */}
        <button 
          onClick={() => window.location.href = '/'}
          className="flex items-center space-x-3 font-medium hover:opacity-80 transition-opacity duration-200"
          title="Go to Home"
          style={{ color: palette.primaryText }}
        >
          <div className="w-7 h-7 bg-blue-600 rounded flex items-center justify-center">
            <Code className="w-4 h-4 text-white" />
          </div>
          <span style={{ color: palette.primaryText }}>Orus</span>
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
            style={{ borderColor: palette.controlButtonBorder, color: palette.controlButtonText }}
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
            <div className="h-full flex flex-col overflow-hidden" style={{ backgroundColor: palette.panelBackground }}>
              {/* Editor Header - updated with tabs design */}
              <div className="flex flex-col" style={{ backgroundColor: palette.panelHeaderBackground }}>
                {/* File Tabs */}
                <div className="flex items-center h-9 overflow-x-auto hide-scrollbar" style={{ borderBottom: `1px solid ${palette.panelBorder}` }}>
                  {/* File Tabs */}
                  <div className="flex items-center">
                    {Object.keys(files).map((fileName) => (
                      <div 
                        key={fileName}
                        onClick={() => handleFileSwitch(fileName)}
                        className="group flex items-center px-3 h-9 cursor-pointer transition-all duration-200 relative"
                        style={{
                          backgroundColor: fileName === currentFile ? palette.tabActiveBackground : palette.tabInactiveBackground,
                          color: fileName === currentFile ? palette.tabActiveText : palette.tabInactiveText,
                        }}
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
                            className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 ml-1 p-0.5 rounded hover:text-red-500"
                            style={{ color: palette.mutedText }}
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
                    className="h-9 px-3 rounded-none"
                    style={{ color: palette.mutedText }}
                    title="New File"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </Button>
                  
                  {/* Run Button */}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleRunCode}
                    className="h-9 px-3 rounded-none"
                    style={{ color: palette.mutedText }}
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
          <ResizableHandle
            className={layout === 'horizontal' ? 'w-px' : 'h-px'}
            style={{ backgroundColor: palette.resizer }}
          />

          {/* Terminal/Output Panel */}
          <ResizablePanel defaultSize={40} minSize={30}>
            <div
              className="h-full flex flex-col"
              style={{ backgroundColor: palette.panelBackground, color: palette.primaryText }}
            >
              {/* Terminal Header - updated to match code editor style */}
              <div
                className="h-9 flex items-center justify-between px-2"
                style={{ backgroundColor: palette.panelHeaderBackground }}
              >
                <div className="flex items-center space-x-2">
                  <span
                    className="text-xs font-medium tracking-wider"
                    style={{ color: palette.terminalLabel, fontFamily: 'monospace' }}
                  >
                    TERMINAL
                  </span>
                  {issueSource !== 'none' && (
                    <span
                      className={`text-[10px] uppercase tracking-widest px-2 py-0.5 rounded-full ${
                        issueSource === 'wasm' ? 'bg-red-500/20 text-red-300' : 'bg-amber-500/20 text-amber-200'
                      }`}
                    >
                      {issueSource === 'wasm' ? 'WASM issue' : 'UI issue'}
                    </span>
                  )}
                </div>
                <div className="relative">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowTerminalMenu(!showTerminalMenu)}
                    className="h-7 w-7 p-0 transition-colors"
                    style={{ color: palette.mutedText }}
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
                        style={{
                          backgroundColor: palette.menuBackground,
                          border: `1px solid ${palette.menuBorder}`,
                          color: palette.menuText,
                        }}
                      >
                        <div className="py-1">
                          <button
                            onClick={handleCopyOutput}
                            className="w-full px-3 py-2 text-left text-sm flex items-center space-x-2 transition-colors hover:bg-gray-700 hover:text-white"
                            style={{ color: palette.menuText }}
                            disabled={!hasOutput}
                          >
                            <Copy className="w-4 h-4" />
                            <span>Copy Output</span>
                          </button>
                          
                          <button
                            onClick={handleCopySelected}
                            className="w-full px-3 py-2 text-left text-sm flex items-center space-x-2 transition-colors hover:bg-gray-700 hover:text-white"
                            style={{ color: palette.menuText }}
                          >
                            <Copy className="w-4 h-4" />
                            <span>Copy Selected</span>
                          </button>
                          
                          <button
                            onClick={handlePaste}
                            className="w-full px-3 py-2 text-left text-sm flex items-center space-x-2 transition-colors hover:bg-gray-700 hover:text-white"
                            style={{ color: palette.menuText }}
                          >
                            <Clipboard className="w-4 h-4" />
                            <span>Paste</span>
                          </button>
                          
                          <button
                            onClick={handleClearTerminal}
                            className="w-full px-3 py-2 text-left text-sm flex items-center space-x-2 transition-colors hover:bg-gray-700 hover:text-white"
                            style={{ color: palette.menuText }}
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
                    style={{ color: palette.statusText }}
                  >
                    Running your code...
                  </div>
                ) : hasOutput ? (
                  <div 
                    className={`transition-all duration-300 ${
                      showOutput ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-2'
                    }`}
                  >
                    {/* Output content - WHITE */}
                    <div 
                      className="whitespace-pre-wrap"
                      style={{ color: palette.outputText }}
                    >
                      {displayOutput}
                    </div>
                    {/* Cursor after output */}
                    <div className="flex items-center">
                      <span style={{ color: palette.promptText }}>$ </span>
                      <div 
                        className="w-2 h-4 ml-1 animate-pulse"
                        style={{
                          animation: 'blink 1s infinite',
                          backgroundColor: palette.cursorColor,
                        }}
                      />
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center">
                    <span style={{ color: palette.promptText }}>$ </span>
                    <div 
                      className="w-2 h-4 ml-1"
                      style={{
                        animation: 'blink 1s infinite',
                        backgroundColor: palette.cursorColor,
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
            className={`fixed inset-0 bg-black z-40 transition-opacity [transition-duration:350ms] ease-out ${
              isSettingsClosing ? 'opacity-0' : 'opacity-50'
            }`}
            onClick={handleSettingsClose}
          />
          
          {/* Settings Panel */}
          <div 
            className={`fixed top-0 right-0 h-full w-80 z-50 transition-transform [transition-duration:350ms] [transition-timing-function:cubic-bezier(0.25,0.46,0.45,0.94)] ${
              isSettingsClosing 
                ? 'transform translate-x-full' 
                : isSettingsAnimating
                ? 'transform translate-x-full'
                : 'transform translate-x-0'
            }`}
            style={{
              backgroundColor: palette.settingsBackground,
              borderLeft: `1px solid ${palette.settingsBorder}`,
              color: palette.primaryText,
            }}
          >
            <div className="p-5 h-full overflow-y-auto">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-medium" style={{ color: palette.primaryText }}>Settings</h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleSettingsClose}
                  className="p-1 transition-colors"
                  style={{ color: palette.mutedText }}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>

              {/* Layout Section */}
              <div className="mb-6">
                <h3 className="text-sm font-normal mb-3" style={{ color: palette.primaryText }}>Layout</h3>
                <div
                  className="flex rounded-lg p-1 w-fit border gap-1"
                  style={{
                    backgroundColor: palette.panelHeaderBackground,
                    borderColor: palette.panelBorder,
                  }}
                >
                  <button
                    onClick={() => setLayout('horizontal')}
                    className="flex items-center justify-center p-2 rounded-md transition-all"
                    style={{
                      backgroundColor: layout === 'horizontal' ? palette.panelBackground : 'transparent',
                      color: layout === 'horizontal' ? palette.primaryText : palette.mutedText,
                      boxShadow: layout === 'horizontal' ? '0 0 0 1px rgba(59,130,246,0.35)' : 'none',
                    }}
                    title="Side by side"
                  >
                    <Columns className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setLayout('vertical')}
                    className="flex items-center justify-center p-2 rounded-md transition-all"
                    style={{
                      backgroundColor: layout === 'vertical' ? palette.panelBackground : 'transparent',
                      color: layout === 'vertical' ? palette.primaryText : palette.mutedText,
                      boxShadow: layout === 'vertical' ? '0 0 0 1px rgba(59,130,246,0.35)' : 'none',
                    }}
                    title="Top and bottom"
                  >
                    <Rows className="w-4 h-4" />
                  </button>
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
            className="fixed inset-0 bg-black z-40 transition-opacity [transition-duration:250ms]"
            style={{ opacity: 0.5 }}
            onClick={() => setShowNewFileDialog(false)}
          />
          
          {/* Dialog */}
          <div 
            className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 rounded-lg z-50 animate-scale-in"
            style={{
              backgroundColor: palette.dialogBackground,
              border: `1px solid ${palette.dialogInputBorder}`,
              color: palette.dialogText,
            }}
          >
            {/* Dialog Header */}
            <div
              className="flex items-center justify-between px-6 py-5"
              style={{ borderBottom: `1px solid ${palette.dialogInputBorder}` }}
            >
              <h2 className="text-xl font-medium" style={{ color: palette.dialogText }}>Create New File</h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowNewFileDialog(false)}
                className="p-1 transition-colors"
                style={{ color: palette.mutedText }}
              >
                <X className="w-5 h-5" />
              </Button>
            </div>
            
            {/* Dialog Content */}
            <div className="px-6 py-5">
              <label className="block text-sm mb-3" style={{ color: palette.dialogSubtext }}>
                New File Name
              </label>
              <input
                type="text"
                value={newFileName}
                onChange={(e) => setNewFileName(e.target.value)}
                placeholder="filename.orus"
                className="w-full px-4 py-3 rounded-lg text-sm focus:outline-none"
                style={{
                  color: palette.dialogText,
                  backgroundColor: palette.dialogInputBackground,
                  border: `1px solid ${palette.dialogInputBorder}`,
                }}
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleCreateNewFile();
                  }
                }}
              />
            </div>
            
            {/* Dialog Footer */}
            <div
              className="flex justify-end px-6 py-4 space-x-3"
              style={{ borderTop: `1px solid ${palette.dialogInputBorder}` }}
            >
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowNewFileDialog(false)}
                className="px-4 py-2"
                style={{
                  color: palette.mutedText,
                  borderColor: palette.dialogInputBorder,
                }}
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
            className="fixed inset-0 bg-black z-40 transition-opacity [transition-duration:250ms]"
            style={{ opacity: 0.5 }}
            onClick={cancelDeleteFile}
          />
          
          {/* Dialog */}
          <div 
            className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 rounded-lg z-50 animate-scale-in"
            style={{
              backgroundColor: palette.dialogBackground,
              border: `1px solid ${palette.dialogInputBorder}`,
              color: palette.dialogText,
            }}
          >
            {/* Dialog Header */}
            <div
              className="flex items-center justify-between px-6 py-5"
              style={{ borderBottom: `1px solid ${palette.dialogInputBorder}` }}
            >
              <h2 className="text-xl font-medium" style={{ color: palette.dialogText }}>Delete File</h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={cancelDeleteFile}
                className="p-1 transition-colors"
                style={{ color: palette.mutedText }}
              >
                <X className="w-5 h-5" />
              </Button>
            </div>
            
            {/* Dialog Content */}
            <div className="px-6 py-5">
              <p className="text-sm" style={{ color: palette.dialogSubtext }}>
                Are you sure you want to delete <span className="font-semibold" style={{ color: palette.dialogText }}>&quot;{fileToDelete}&quot;</span>? 
                This action cannot be undone.
              </p>
            </div>
            
            {/* Dialog Footer */}
            <div
              className="flex justify-end px-6 py-4 space-x-3"
              style={{ borderTop: `1px solid ${palette.dialogInputBorder}` }}
            >
              <Button
                variant="outline"
                size="sm"
                onClick={cancelDeleteFile}
                className="px-4 py-2"
                style={{
                  color: palette.mutedText,
                  borderColor: palette.dialogInputBorder,
                }}
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
