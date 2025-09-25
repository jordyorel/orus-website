
import { useState, useCallback, useRef } from 'react';
import { runOrusCode, OrusWasmError } from '@/utils/wasmLoader';

interface PerformanceMemory {
  usedJSHeapSize: number;
}

interface PerformanceWithMemory extends Performance {
  memory?: PerformanceMemory;
}

const getUsedHeapSize = (): number => {
  if (typeof performance === 'undefined') {
    return 0;
  }

  const perfWithMemory = performance as PerformanceWithMemory;
  return perfWithMemory.memory?.usedJSHeapSize ?? 0;
};

export type ExecutionIssueSource = 'none' | 'wasm' | 'ui';

export const useCodeExecution = () => {
  const [output, setOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [executionTime, setExecutionTime] = useState<number>(0);
  const [memoryUsage, setMemoryUsage] = useState<number>(0);
  const [errorCount, setErrorCount] = useState<number>(0);
  const [issueSource, setIssueSource] = useState<ExecutionIssueSource>('none');
  const executionIdRef = useRef(0);

  const runCode = useCallback(async (code: string) => {
    const executionId = executionIdRef.current + 1;
    executionIdRef.current = executionId;

    setIsRunning(true);
    setOutput('');
    setExecutionTime(0);
    setMemoryUsage(0);
    setErrorCount(0);
    setIssueSource('none');
    
    const startTime = performance.now();
    const startMemory = getUsedHeapSize();
    
    try {
      // Use the real Orus WASM compiler
      const result = await runOrusCode(code);
      if (executionId !== executionIdRef.current) {
        return;
      }

      setOutput(result);
      setIssueSource('none');
      
      // Calculate errors in output
      const errors = result.split('\n').filter(line => 
        line.toLowerCase().includes('error') || line.toLowerCase().includes('exception')
      ).length;
      setErrorCount(errors);
      
    } catch (error) {
      if (executionId === executionIdRef.current) {
        if (error instanceof OrusWasmError) {
          setIssueSource('wasm');
          setOutput(error.message);
        } else {
          setIssueSource('ui');
          const message = error instanceof Error ? error.message : String(error);
          setOutput(`Error: ${message}`);
        }
        setErrorCount(1);
      }
    } finally {
      if (executionId === executionIdRef.current) {
        const endTime = performance.now();
        const endMemory = getUsedHeapSize();
        
        setExecutionTime(Math.round(endTime - startTime));
        setMemoryUsage(Math.max(0, endMemory - startMemory));
        setIsRunning(false);
      }
    }
  }, []);

  const clearOutput = useCallback(() => {
    executionIdRef.current += 1;
    setOutput('');
    setExecutionTime(0);
    setMemoryUsage(0);
    setErrorCount(0);
    setIssueSource('none');
  }, []);

  const cancelExecution = useCallback(() => {
    executionIdRef.current += 1;
    setIsRunning(false);
    setExecutionTime(0);
    setMemoryUsage(0);
    setErrorCount(0);
    setIssueSource('none');
  }, []);

  return {
    output,
    isRunning,
    executionTime,
    memoryUsage,
    errorCount,
    issueSource,
    runCode,
    clearOutput,
    cancelExecution
  };
};
