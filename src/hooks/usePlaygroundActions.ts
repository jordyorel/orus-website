import { useCallback } from 'react';
import { toast } from '@/components/ui/use-toast';
import { shareCode, exportCode, showHelp } from '@/utils/playgroundActions';

export const usePlaygroundActions = (code: string, setCode: (code: string) => void, setOutput: (output: string) => void) => {
  const resetCode = useCallback(() => {
    setCode(`fn main() {
    print("Hello")
}`);
    setOutput('');
    toast({
      title: "Code Reset",
      description: "The playground has been reset to the default code.",
    });
  }, [setCode, setOutput]);

  const handleShareCode = useCallback(async () => {
    await shareCode(code);
  }, [code]);

  const handleExportCode = useCallback(async () => {
    await exportCode(code);
  }, [code]);

  const handleShowHelp = useCallback(() => {
    showHelp();
  }, []);

  const handleExampleSelect = useCallback((exampleCode: string) => {
    setCode(exampleCode);
    setOutput('');
    toast({
      title: "Example Loaded",
      description: "The example code has been loaded into the editor.",
    });
  }, [setCode, setOutput]);

  return {
    resetCode,
    shareCode: handleShareCode,
    exportCode: handleExportCode,
    showHelp: handleShowHelp,
    handleExampleSelect
  };
};
