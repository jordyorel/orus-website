
import MonacoEditor from '@/components/MonacoEditor';
import ErrorBoundary from '@/components/ErrorBoundary';
import { CodeEditorProps } from '@/types/playground';

const CodeEditor = ({ code, onChange }: CodeEditorProps) => {
  return (
    <div style={{ height: '100%', backgroundColor: '#1e1e1e', overflow: 'hidden' }}>
      <ErrorBoundary>
        <MonacoEditor
          value={code}
          onChange={onChange}
          language="orus"
          height="100%"
          forceDarkMode={true}
        />
      </ErrorBoundary>
    </div>
  );
};

export default CodeEditor;
