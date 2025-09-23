
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Copy, Check } from 'lucide-react';

interface SyntaxHighlighterProps {
  code: string;
  language?: string;
  className?: string;
}

const SyntaxHighlighter = ({ code, language = 'orus', className = '' }: SyntaxHighlighterProps) => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy code:', err);
    }
  };

  const highlightSyntax = (code: string): string => {
    if (!code) return '';

    // Start with the original code
    let result = code;

    // First, escape HTML entities to prevent issues
    result = result
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');

    // Split by lines to process each line independently to avoid cross-line regex issues
    const lines = result.split('\n');
    const processedLines = lines.map(line => {
      let processedLine = line;
      
      // Comments first (to avoid interfering with other patterns)
      processedLine = processedLine.replace(/(\/\/[^\r\n]*)/g, '<span class="text-gray-500">$1</span>');
      processedLine = processedLine.replace(/(\/\*[\s\S]*?\*\/)/g, '<span class="text-gray-500">$1</span>');
      
      // Skip further processing if this line is entirely a comment
      if (processedLine.includes('<span class="text-gray-500">') && processedLine.indexOf('<span class="text-gray-500">') < processedLine.search(/\S/)) {
        return processedLine;
      }
      
      // Strings (both single and double quotes) - avoid processing inside comments
      if (!processedLine.includes('<span class="text-gray-500">')) {
        processedLine = processedLine.replace(/("(?:[^"\\]|\\.)*")/g, '<span class="text-green-400">$1</span>');
        processedLine = processedLine.replace(/('(?:[^'\\]|\\.)*')/g, '<span class="text-green-400">$1</span>');
      }
      
      // Numbers - avoid inside strings and comments
      processedLine = processedLine.replace(/\b(\d+(?:\.\d+)?)\b(?![^<]*<\/span>)/g, (match, number, offset, str) => {
        const beforeMatch = str.substring(0, offset);
        if (beforeMatch.includes('<span class="text-green-400">') || beforeMatch.includes('<span class="text-gray-500">')) {
          const lastSpanStart = Math.max(beforeMatch.lastIndexOf('<span class="text-green-400">'), beforeMatch.lastIndexOf('<span class="text-gray-500">'));
          const lastSpanEnd = beforeMatch.lastIndexOf('</span>');
          if (lastSpanStart > lastSpanEnd) {
            return match; // Inside a span, don't highlight
          }
        }
        return `<span class="text-orange-400">${number}</span>`;
      });
      
      // Keywords - avoid inside strings and comments
      processedLine = processedLine.replace(/\b(fn|let|mut|const|static|struct|impl|if|elif|else|match|for|while|in|return|use|pub|try|catch|as|break|continue|true|false|nil|loop|enum)\b(?![^<]*<\/span>)/g, (match, keyword, offset, str) => {
        const beforeMatch = str.substring(0, offset);
        if (beforeMatch.includes('<span class="text-green-400">') || beforeMatch.includes('<span class="text-gray-500">')) {
          const lastSpanStart = Math.max(beforeMatch.lastIndexOf('<span class="text-green-400">'), beforeMatch.lastIndexOf('<span class="text-gray-500">'));
          const lastSpanEnd = beforeMatch.lastIndexOf('</span>');
          if (lastSpanStart > lastSpanEnd) {
            return match;
          }
        }
        return `<span class="text-purple-400">${keyword}</span>`;
      });
      
      // Types - avoid inside strings and comments
      processedLine = processedLine.replace(/\b(i32|i64|u32|u64|f64|bool|string|void|self|Option|Result)\b(?![^<]*<\/span>)/g, (match, type, offset, str) => {
        const beforeMatch = str.substring(0, offset);
        if (beforeMatch.includes('<span class="text-green-400">') || beforeMatch.includes('<span class="text-gray-500">')) {
          const lastSpanStart = Math.max(beforeMatch.lastIndexOf('<span class="text-green-400">'), beforeMatch.lastIndexOf('<span class="text-gray-500">'));
          const lastSpanEnd = beforeMatch.lastIndexOf('</span>');
          if (lastSpanStart > lastSpanEnd) {
            return match;
          }
        }
        return `<span class="text-blue-400">${type}</span>`;
      });
      
      // Built-in functions (only when followed by parentheses)
      processedLine = processedLine.replace(/\b(print|println|input|len|push|pop|reserve|type_of|timestamp|int|float|read_file|write_file|split|join|trim|upper|lower|contains|starts_with|ends_with|abs|sqrt|pow|sin|cos|tan|floor|ceil|round|random|random_int|sleep|sort|reverse|insert|remove)(?=\s*\()/g, (match, func, offset, str) => {
        const beforeMatch = str.substring(0, offset);
        if (beforeMatch.includes('<span class="text-green-400">') || beforeMatch.includes('<span class="text-gray-500">')) {
          const lastSpanStart = Math.max(beforeMatch.lastIndexOf('<span class="text-green-400">'), beforeMatch.lastIndexOf('<span class="text-gray-500">'));
          const lastSpanEnd = beforeMatch.lastIndexOf('</span>');
          if (lastSpanStart > lastSpanEnd) {
            return match;
          }
        }
        return `<span class="text-yellow-400">${func}</span>`;
      });
      
      return processedLine;
    });

    return processedLines.join('\n');
  };

  const renderHighlightedCode = () => {
    if (language !== 'orus') {
      return <span className="text-charcoal-200">{code}</span>;
    }

    return (
      <span
        dangerouslySetInnerHTML={{
          __html: highlightSyntax(code)
        }}
      />
    );
  };

  return (
    <div className={`bg-charcoal-900 rounded-lg overflow-x-auto relative group ${className}`}>
      <div className="flex justify-between items-center px-4 py-2 border-b border-charcoal-700">
        <span className="text-charcoal-400 text-sm font-medium">
          {language === 'orus' ? 'Orus' : language}
        </span>
        <Button
          variant="ghost"
          size="sm"
          onClick={copyToClipboard}
          className="h-8 w-8 p-0 text-charcoal-400 hover:text-white hover:bg-charcoal-700"
        >
          {copied ? <Check size={16} /> : <Copy size={16} />}
        </Button>
      </div>
      <div className="p-4">
        <pre className="text-sm font-mono leading-6 text-left">
          <code className="text-charcoal-200">
            {renderHighlightedCode()}
          </code>
        </pre>
      </div>
    </div>
  );
};

export default SyntaxHighlighter;
