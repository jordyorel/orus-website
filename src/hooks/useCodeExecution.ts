
import { useState, useCallback } from 'react';
import { runOrusCode } from '@/utils/wasmLoader';

export const useCodeExecution = () => {
  const [output, setOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [executionTime, setExecutionTime] = useState<number>(0);
  const [memoryUsage, setMemoryUsage] = useState<number>(0);
  const [errorCount, setErrorCount] = useState<number>(0);

  const runCode = useCallback(async (code: string) => {
    setIsRunning(true);
    setOutput('');
    setExecutionTime(0);
    setMemoryUsage(0);
    setErrorCount(0);
    
    const startTime = performance.now();
    const startMemory = (performance as any).memory?.usedJSHeapSize || 0;
    
    try {
      // Use the real Orus WASM compiler
      const result = await runOrusCode(code);
      setOutput(result);
      
      // Calculate errors in output
      const errors = result.split('\n').filter(line => 
        line.toLowerCase().includes('error') || line.toLowerCase().includes('exception')
      ).length;
      setErrorCount(errors);
      
    } catch (error) {
      const errorMsg = `Error: ${error}`;
      setOutput(errorMsg);
      setErrorCount(1);
    } finally {
      const endTime = performance.now();
      const endMemory = (performance as any).memory?.usedJSHeapSize || 0;
      
      setExecutionTime(Math.round(endTime - startTime));
      setMemoryUsage(Math.max(0, endMemory - startMemory));
      setIsRunning(false);
    }
  }, []);

  const clearOutput = useCallback(() => {
    setOutput('');
    setExecutionTime(0);
    setMemoryUsage(0);
    setErrorCount(0);
  }, []);

  return {
    output,
    isRunning,
    executionTime,
    memoryUsage,
    errorCount,
    runCode,
    clearOutput
  };
};
