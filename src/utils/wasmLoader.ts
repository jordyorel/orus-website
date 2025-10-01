
// WASM loader for Orus using the public/orus.js integration
let isInitialized = false;
let isLoading = false;
let loadPromise: Promise<void> | null = null;

// Global output capture for the playground
let currentOutput = '';

const appendWithTrailingNewline = (value: string) => {
  if (!value) {
    return;
  }

  currentOutput += value.endsWith('\n') ? value : `${value}\n`;
};

const captureOutput = (text: string) => {
  appendWithTrailingNewline(text);
};

const captureError = (text: string) => {
  appendWithTrailingNewline(`Error: ${text}`);
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
  onAbort?: (details: unknown) => void;
  locateFile?: (path: string) => string;
  print?: (text: string) => void;
  printErr?: (text: string) => void;
  stdin?: () => number | null;
}

type OrusModuleFactory = (moduleConfig: OrusModuleConfig) => Promise<OrusModule>;

type OrusModuleConfig = Partial<OrusModule> & {
  locateFile: (path: string) => string;
  print: (text: string) => void;
  printErr: (text: string) => void;
  stdin: () => number | null;
};

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

  const runtimeCandidates = Array.from(
    new Set(
      ['orus.js'].flatMap((file) => {
        const resolved = resolveAssetUrl(file);
        const absoluteFromLocation = typeof window !== 'undefined'
          ? new URL(file, window.location.href).toString()
          : resolved;
        const rootPath = `/${file}`;
        return [resolved, absoluteFromLocation, rootPath];
      })
    )
  );

  loadPromise = (async () => {
    const moduleConfig: OrusModuleConfig = {
      locateFile: (path: string) => resolveAssetUrl(path),
      print: captureOutput,
      printErr: captureError,
      stdin: () => null,
    };

    window.orusReady = false;

    const attemptedSources: string[] = [];
    let lastError: unknown;

    for (const src of runtimeCandidates) {
      try {
        const response = await fetch(src, { credentials: 'same-origin' });
        if (!response.ok) {
          throw new OrusWasmError(
            `Failed to fetch Orus runtime from ${src} (status ${response.status})`,
            'module_load'
          );
        }

        const scriptText = await response.text();
        const blob = new Blob([scriptText], { type: 'text/javascript' });
        const blobUrl = URL.createObjectURL(blob);

        try {
          const moduleExports: unknown = await import(/* @vite-ignore */ blobUrl);
          const factoryCandidate =
            (moduleExports as { default?: unknown })?.default ?? moduleExports;

          if (typeof factoryCandidate !== 'function') {
            throw new OrusWasmError(
              `Orus runtime at ${src} does not export a module factory`,
              'module_load'
            );
          }

          const moduleInstance = (await (factoryCandidate as OrusModuleFactory)(
            moduleConfig
          )) as OrusModule;

          if (!moduleInstance || typeof moduleInstance.ccall !== 'function') {
            throw new OrusWasmError('Orus Module unavailable', 'initialization');
          }

          moduleInstance.print = captureOutput;
          moduleInstance.printErr = captureError;
          moduleInstance.stdin = moduleConfig.stdin;

          const initResult = moduleInstance.ccall('initWebVM', 'number', [], []);
          if (typeof initResult !== 'number') {
            throw new OrusWasmError('Unexpected initWebVM return value', 'initialization');
          }

          if (initResult !== 0) {
            throw new OrusWasmError('Failed to initialize Orus VM', 'initialization');
          }

          const versionResult = moduleInstance.ccall('getVersion', 'string', [], []);
          const version = typeof versionResult === 'string' ? versionResult : 'unknown';
          console.log('Orus WebAssembly loaded from', src);
          console.log('Orus VM ready, version:', version);

          window.Module = moduleInstance;
          window.orusReady = true;

          window.runOrus = function(code: string): boolean {
            if (!window.orusReady) {
              throw new OrusWasmError('Orus runtime not ready', 'initialization');
            }

            try {
              const module = window.Module;
              if (!module || typeof module.ccall !== 'function') {
                throw new OrusWasmError('Orus Module unavailable', 'initialization');
              }

              const result = module.ccall('runSource', 'number', ['string'], [code]);
              if (typeof result !== 'number') {
                throw new OrusWasmError('Unexpected runSource return value', 'runtime');
              }

              return result === 0;
            } catch (error) {
              console.error('Orus execution error:', error);
              captureError(`Execution error: ${error}`);
              throw error instanceof OrusWasmError
                ? error
                : new OrusWasmError('Orus execution error', 'runtime', error);
            }
          };

          moduleInstance.onAbort = (details: unknown) => {
            console.error('Orus runtime aborted:', details);
            window.orusReady = false;
          };

          isInitialized = true;
          return;
        } finally {
          URL.revokeObjectURL(blobUrl);
        }
      } catch (error) {
        attemptedSources.push(src);
        lastError = error;
        console.warn(`Failed to load Orus runtime from ${src}`, error);
      }
    }

    const detailedMessage = lastError instanceof Error
      ? lastError.message
      : lastError !== undefined
        ? String(lastError)
        : 'unknown error';

    throw new OrusWasmError(
      `Failed to load Orus runtime module from any known location. Attempted: ${attemptedSources.join(', ')}. Last error: ${detailedMessage}`,
      'module_load',
      lastError
    );
  })().finally(() => {
    isLoading = false;
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
    
    const normalizedOutput = currentOutput.replace(/\r\n/g, '\n');
    return normalizedOutput || 'Code executed successfully (no output)';
  } catch (error) {
    if (error instanceof OrusWasmError) {
      throw error;
    }
    throw new OrusWasmError('Failed to run Orus code', 'runtime', error);
  }
};
