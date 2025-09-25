
// WASM loader for Orus using the public/orus.js integration
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

export type OrusWasmErrorType = 'module_load' | 'initialization' | 'runtime';

export class OrusWasmError extends Error {
  type: OrusWasmErrorType;

  constructor(message: string, type: OrusWasmErrorType, cause?: unknown) {
    super(message);
    this.name = 'OrusWasmError';
    this.type = type;
    if (cause !== undefined) {
      (this as Error & { cause?: unknown }).cause = cause;
    }
  }
}

interface OrusModule extends Record<string, unknown> {
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

const resolveAssetUrl = (fileName: string): string => {
  if (typeof window === 'undefined') {
    return fileName;
  }

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

  const base = baseFromEnv ?? baseHref ?? '/';

  try {
    const baseUrl = new URL(base, window.location.origin);
    return new URL(fileName, baseUrl).toString();
  } catch {
    const sanitizedBase = base.endsWith('/') ? base : `${base}/`;
    return `${sanitizedBase}${fileName}`;
  }
};

// Initialize the Orus WASM module
const initializeOrus = async (): Promise<void> => {
  if (isInitialized) return;
  if (isLoading) return loadPromise!;

  isLoading = true;
  loadPromise = new Promise((resolve, reject) => {
    // Set up the Module configuration before loading the script
    const moduleConfig: OrusModule = window.Module ?? {};

    const previousRuntimeInitialized = moduleConfig.onRuntimeInitialized;

    moduleConfig.onRuntimeInitialized = function() {
      console.log('Orus WebAssembly loaded!');
      
      try {
        const moduleInstance = window.Module;
        if (!moduleInstance || typeof moduleInstance.ccall !== 'function') {
          throw new OrusWasmError('Orus Module unavailable', 'initialization');
        }

        // Initialize VM
        const initResult = moduleInstance.ccall('initWebVM', 'number', [], []);
        if (typeof initResult !== 'number') {
          throw new OrusWasmError('Unexpected initWebVM return value', 'initialization');
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
          reject(new OrusWasmError('Failed to initialize Orus VM', 'initialization'));
        }
      } catch (error) {
        reject(error instanceof OrusWasmError ? error : new OrusWasmError('Failed to initialize Orus VM', 'initialization', error));
      }

      if (typeof previousRuntimeInitialized === 'function') {
        try {
          previousRuntimeInitialized.call(window.Module);
        } catch (runtimeError) {
          console.error('Additional runtime initialization failed:', runtimeError);
        }
      }
    };

    moduleConfig.locateFile = (path: string) => resolveAssetUrl(path);
    moduleConfig.print = captureOutput;
    moduleConfig.printErr = captureError;

    window.orusReady = false;
    window.Module = moduleConfig;

    // Set up global runOrus function
    window.runOrus = function(code: string): boolean {
      if (!window.orusReady) {
        throw new OrusWasmError('Orus runtime not ready', 'initialization');
      }

      try {
        const moduleInstance = window.Module;
        if (!moduleInstance || typeof moduleInstance.ccall !== 'function') {
          throw new OrusWasmError('Orus Module unavailable', 'initialization');
        }

        const result = moduleInstance.ccall('runSource', 'number', ['string'], [code]);
        if (typeof result !== 'number') {
          throw new OrusWasmError('Unexpected runSource return value', 'runtime');
        }

        return result === 0; // true = success, false = error
      } catch (error) {
        console.error('Orus execution error:', error);
        captureError(`Execution error: ${error}`);
        throw error instanceof OrusWasmError
          ? error
          : new OrusWasmError('Orus execution error', 'runtime', error);
      }
    };

    const runtimeCandidates = Array.from(
      new Set(
        ['orus-simple.js', 'orus.js'].flatMap((file) => {
          const resolved = resolveAssetUrl(file);
          const rootPath = `/${file}`;
          return resolved === rootPath ? [resolved] : [resolved, rootPath];
        })
      )
    );

    const attemptedSources: string[] = [];

    const appendScript = (index: number) => {
      if (index >= runtimeCandidates.length) {
        isLoading = false;
        reject(
          new OrusWasmError(
            `Failed to load Orus runtime script from any known location. Attempted: ${attemptedSources.join(', ')}`,
            'module_load'
          )
        );
        return;
      }

      const src = runtimeCandidates[index];
      const script = document.createElement('script');
      script.src = src;
      script.onload = () => {
        console.log('Orus script loaded successfully from', src);
      };
      script.onerror = () => {
        attemptedSources.push(src);
        if (script.parentNode) {
          script.parentNode.removeChild(script);
        }
        console.warn(`Failed to load Orus script from ${src}, trying next fallback if available.`);
        appendScript(index + 1);
      };

      document.head.appendChild(script);
    };

    appendScript(0);
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
        throw new OrusWasmError('Execution failed - check console for details', 'runtime');
      }
    } else {
      throw new OrusWasmError('Orus runtime not available', 'module_load');
    }
    
    return currentOutput || 'Code executed successfully (no output)';
  } catch (error) {
    if (error instanceof OrusWasmError) {
      throw error;
    }
    throw new OrusWasmError('Failed to run Orus code', 'runtime', error);
  }
};
