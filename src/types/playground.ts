
export interface CodeExample {
  title: string;
  description: string;
  code: string;
}

export interface PlaygroundToolbarProps {
  isRunning: boolean;
  onRun: () => void;
  onReset: () => void;
  onShare: () => void;
  onExport: () => void;
  onHelp: () => void;
}

export interface CodeEditorProps {
  code: string;
  onChange: (code: string) => void;
}

export type ExecutionIssueSource = 'none' | 'wasm' | 'ui';

export interface OutputPanelProps {
  output: string;
  isRunning: boolean;
  onClear: () => void;
  executionTime?: number;
  memoryUsage?: number;
  errorCount?: number;
  issueSource?: ExecutionIssueSource;
}

export type OutputFilterLevel = 'all' | 'info' | 'warning' | 'error';

export interface ExamplesSidebarProps {
  examples: CodeExample[];
  onExampleSelect: (code: string) => void;
}
