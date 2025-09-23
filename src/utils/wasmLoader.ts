
// WASM loader for Orus using the working orus-simple.js integration
let isInitialized = false;
let isLoading = false;
let loadPromise: Promise<void> | null = null;

// Global output capture for the playground
let currentOutput = '';

const captureOutput = (text: string) => {
  currentOutput += text + '\n';
};

const captureError = (text: string) => {
  currentOutput += `Error: ${text}\n`;
};

// Initialize the Orus WASM module
const initializeOrus = async (): Promise<void> => {
  if (isInitialized) return;
  if (isLoading) return loadPromise!;

  isLoading = true;
  loadPromise = new Promise((resolve, reject) => {
    // Set up the Module configuration before loading the script
    (window as any).Module = {
      onRuntimeInitialized: function() {
        console.log('Orus WebAssembly loaded!');
        
        try {
          // Initialize VM
          const initResult = (window as any).Module.ccall('initWebVM', 'number', [], []);
          if (initResult === 0) {
            const version = (window as any).Module.ccall('getVersion', 'string', [], []);
            console.log('Orus VM ready, version:', version);
            (window as any).orusReady = true;
            isInitialized = true;
            isLoading = false;
            resolve();
          } else {
            reject(new Error('Failed to initialize Orus VM'));
          }
        } catch (error) {
          reject(error);
        }
      },

      print: captureOutput,
      printErr: captureError
    };

    // Set up global runOrus function
    (window as any).runOrus = function(code: string): boolean {
      if (!(window as any).orusReady) return false;

      try {
        const result = (window as any).Module.ccall('runSource', 'number', ['string'], [code]);
        return result === 0; // true = success, false = error
      } catch (error) {
        console.error('Orus execution error:', error);
        captureError(`Execution error: ${error}`);
        return false;
      }
    };

    // Load the working orus-simple.js script
    const script = document.createElement('script');
    script.src = '/orus-simple.js';
    script.onload = () => {
      console.log('Orus script loaded successfully');
    };
    script.onerror = () => {
      isLoading = false;
      reject(new Error('Failed to load orus-simple.js'));
    };
    
    document.head.appendChild(script);
  });

  return loadPromise;
};

// Main function to run Orus code
export const runOrusCode = async (code: string): Promise<string> => {
  currentOutput = '';
  
  try {
    // Ensure WASM is initialized
    await initializeOrus();
    
    // Run the code using the global runOrus function
    if ((window as any).runOrus) {
      const success = (window as any).runOrus(code);
      if (!success && !currentOutput) {
        return 'Execution failed - check console for details';
      }
    } else {
      return 'Orus runtime not available';
    }
    
    return currentOutput || 'Code executed successfully (no output)';
  } catch (error) {
    console.error('Failed to run Orus code:', error);
    return `Error: ${error}`;
  }
};
