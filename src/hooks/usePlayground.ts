
import { useState } from 'react';
import { useUrlCodeLoader } from './useUrlCodeLoader';
import { useCodeExecution } from './useCodeExecution';
import { usePlaygroundActions } from './usePlaygroundActions';

const DEFAULT_CODE = `fn main() {
    print("Hello")
}`;

export const usePlayground = () => {
  const [code, setCode] = useState(DEFAULT_CODE);

  // Load code from URL parameter on mount
  useUrlCodeLoader(setCode);

  const { output, isRunning, executionTime, memoryUsage, errorCount, runCode: executeCode, clearOutput } = useCodeExecution();

  const runCode = () => {
    // Clean the code of any HTML tags before execution
    const cleanCode = code.replace(/<[^>]*>/g, '').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&');
    executeCode(cleanCode);
  };

  const {
    resetCode,
    shareCode,
    exportCode,
    showHelp,
    handleExampleSelect
  } = usePlaygroundActions(code, setCode, () => clearOutput());

  return {
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
  };
};
