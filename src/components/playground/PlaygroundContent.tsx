
import PlaygroundToolbar from './PlaygroundToolbar';
import CodeEditor from './CodeEditor';
import OutputPanel from './OutputPanel';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/components/ui/resizable';

interface PlaygroundContentProps {
  code: string;
  onChange: (code: string) => void;
  output: string;
  isRunning: boolean;
  executionTime?: number;
  memoryUsage?: number;
  errorCount?: number;
  onRun: () => void;
  onReset: () => void;
  onShare: () => void;
  onExport: () => void;
  onHelp: () => void;
  onClearOutput: () => void;
}

const PlaygroundContent = ({
  code,
  onChange,
  output,
  isRunning,
  executionTime,
  memoryUsage,
  errorCount,
  onRun,
  onReset,
  onShare,
  onExport,
  onHelp,
  onClearOutput
}: PlaygroundContentProps) => {
  return (
    <>
      {/* Toolbar */}
      <div className="bg-charcoal-800 border-b border-charcoal-600 px-4 py-2">
        <PlaygroundToolbar
          isRunning={isRunning}
          onRun={onRun}
          onReset={onReset}
          onShare={onShare}
          onExport={onExport}
          onHelp={onHelp}
        />
      </div>

      {/* Editor and Output Area */}
      <div className="flex-1 min-w-0">
        <ResizablePanelGroup direction="horizontal" className="h-full">
          {/* Code Editor */}
          <ResizablePanel defaultSize={60} minSize={30}>
            <CodeEditor code={code} onChange={onChange} />
          </ResizablePanel>

          <ResizableHandle withHandle className="bg-charcoal-600 hover:bg-gold-500 transition-colors" />

          {/* Output Panel */}
          <ResizablePanel defaultSize={40} minSize={30}>
            <OutputPanel 
              output={output} 
              isRunning={isRunning} 
              onClear={onClearOutput}
              executionTime={executionTime}
              memoryUsage={memoryUsage}
              errorCount={errorCount}
            />
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </>
  );
};

export default PlaygroundContent;
