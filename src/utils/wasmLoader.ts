
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

type ModuleReturnType = number | string | undefined;

interface OrusModule {
  ccall?: (
    ident: string,
    returnType: 'number' | 'string',
    argTypes: string[],
    args: unknown[]
  ) => ModuleReturnType;
  onRuntimeInitialized?: () => void;
  locateFile?: (path: string) => string;
  print?: (text: string) => void;
  printErr?: (text: string) => void;
}

declare global {
  interface Window {
    Module?: OrusModule;
    orusReady?: boolean;
    runOrus?: (code: string) => boolean;
  }
}

const hasProtocol = (value: string) => /^(?:[a-z]+:)?\/\//i.test(value);

const normalizeBase = (rawBase: string): string => {
  if (!rawBase) return '/';

  const baseWithTrailingSlash = rawBase.endsWith('/') ? rawBase : `${rawBase}/`;

  if (hasProtocol(baseWithTrailingSlash)) {
    return baseWithTrailingSlash;
  }

  if (baseWithTrailingSlash.startsWith('/')) {
    return baseWithTrailingSlash;
  }

  return `/${baseWithTrailingSlash}`;
};

const resolveAssetUrl = (fileName: string): string => {
  const baseFromEnv = (() => {
    try {
      return import.meta.env.BASE_URL;
    } catch {
      return undefined;
    }
  })();

  const baseHref = typeof document !== 'undefined'
    ? document.querySelector('base')?.getAttribute('href') ?? undefined
    : undefined;

  const normalizedBase = normalizeBase(baseFromEnv ?? baseHref ?? '/');

  if (hasProtocol(normalizedBase)) {
    return `${normalizedBase}${fileName}`;
  }

  const origin = typeof window !== 'undefined' ? window.location.origin : '';
  const absoluteBase = origin ? new URL(normalizedBase, origin).toString() : normalizedBase;

  return `${absoluteBase}${fileName}`;
};

// Initialize the Orus WASM module
const initializeOrus = async (): Promise<void> => {
  if (isInitialized) return;
  if (isLoading) return loadPromise!;

  isLoading = true;
  loadPromise = new Promise((resolve, reject) => {
    // Set up the Module configuration before loading the script
    window.Module = {
      onRuntimeInitialized: function() {
        console.log('Orus WebAssembly loaded!');
        
        try {
          const moduleInstance = window.Module;
          if (!moduleInstance || typeof moduleInstance.ccall !== 'function') {
            throw new Error('Orus Module unavailable');
          }

          // Initialize VM
          const initResult = moduleInstance.ccall('initWebVM', 'number', [], []);
          if (typeof initResult !== 'number') {
            throw new Error('Unexpected initWebVM return value');
          }

          if (initResult === 0) {
            const versionResult = moduleInstance.ccall('getVersion', 'string', [], []);
            const version = typeof versionResult === 'string' ? versionResult : 'unknown';
            console.log('Orus VM ready, version:', version);
            window.orusReady = true;
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

      locateFile: (path: string) => resolveAssetUrl(path),
      print: captureOutput,
      printErr: captureError
    };

    // Set up global runOrus function
    window.runOrus = function(code: string): boolean {
      if (!window.orusReady) return false;

      try {
        const moduleInstance = window.Module;
        if (!moduleInstance || typeof moduleInstance.ccall !== 'function') {
          throw new Error('Orus Module unavailable');
        }

        const result = moduleInstance.ccall('runSource', 'number', ['string'], [code]);
        if (typeof result !== 'number') {
          throw new Error('Unexpected runSource return value');
        }

        return result === 0; // true = success, false = error
      } catch (error) {
        console.error('Orus execution error:', error);
        captureError(`Execution error: ${error}`);
        return false;
      }
    };

    // Load the working orus-simple.js script
    const script = document.createElement('script');
    script.src = resolveAssetUrl('orus-simple.js');
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
    if (typeof window.runOrus === 'function') {
      const success = window.runOrus(code);
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
