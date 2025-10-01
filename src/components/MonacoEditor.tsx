import React, { useState, useRef, useEffect } from 'react';
import './MonacoEditor.css';

interface MonacoEditorProps {
  value: string;
  onChange: (value: string) => void;
  language?: string;
  height?: string;
  forceDarkMode?: boolean;
}

const MonacoEditor = ({
  value,
  onChange
}: MonacoEditorProps) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const highlightRef = useRef<HTMLPreElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [lineNumbers, setLineNumbers] = useState<string[]>([]);
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [matchingBrackets, setMatchingBrackets] = useState<{start: number, end: number} | null>(null);
  const [currentLine, setCurrentLine] = useState<number>(1);
  const [scrollInfo, setScrollInfo] = useState({
    scrollTop: 0,
    scrollLeft: 0,
    scrollHeight: 0,
    clientHeight: 0
  });
  const [selectionLines, setSelectionLines] = useState<{start: number, end: number} | null>(null);

  const LINE_HEIGHT = 20;
  const LINE_PADDING_TOP = 16;

  const getLineNumberFromPosition = (text: string, position: number) => {
    if (position <= 0) {
      return 1;
    }
    return text.slice(0, position).split(/\r?\n/).length;
  };

  const currentLineTop =
    LINE_PADDING_TOP + (currentLine - 1) * LINE_HEIGHT - scrollInfo.scrollTop;

  const showCustomScrollbar = scrollInfo.scrollHeight > scrollInfo.clientHeight + 1;
  const trackHeight = scrollInfo.clientHeight || 0;
  const maxScrollable = Math.max(scrollInfo.scrollHeight - scrollInfo.clientHeight, 1);
  const minThumbHeight = Math.min(72, Math.max(trackHeight * 0.1, 16));
  const thumbHeight = showCustomScrollbar
    ? Math.max((scrollInfo.clientHeight / scrollInfo.scrollHeight) * trackHeight, minThumbHeight)
    : trackHeight;
  const thumbTop = showCustomScrollbar
    ? (scrollInfo.scrollTop / maxScrollable) * Math.max(trackHeight - thumbHeight, 0)
    : 0;

  // Clean the incoming value to ensure it's always plain text
  const cleanValue = value
    .replace(/<[^>]*>/g, '')  // Remove any HTML tags
    .replace(/&lt;/g, '<')   // Decode HTML entities
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");

  useEffect(() => {
    const lines = cleanValue.split('\n');
    const numbers = lines.map((_, index) => (index + 1).toString());
    setLineNumbers(numbers);

    // Initialize current line if textarea is available
    if (textareaRef.current) {
      const cursorPos = textareaRef.current.selectionStart;
      const textareaValue = textareaRef.current.value;
      setCurrentLine(getLineNumberFromPosition(textareaValue, cursorPos));
    }
  }, [cleanValue]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    // Ensure we always pass clean plain text, no HTML
    const cleanValue = e.target.value
      .replace(/<[^>]*>/g, '')  // Remove any HTML tags
      .replace(/&lt;/g, '<')   // Decode HTML entities
      .replace(/&gt;/g, '>')
      .replace(/&amp;/g, '&')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'");
    
    onChange(cleanValue);
    updateBracketMatching(e.target);
  };

  const updateBracketMatching = (textarea: HTMLTextAreaElement) => {
    const cursorPos = textarea.selectionStart;
    
    // Update current line number
    const editorValue = textarea.value;
    setCurrentLine(getLineNumberFromPosition(editorValue, cursorPos));

    // Update bracket matching
    findMatchingBracket(cursorPos, editorValue);
  };

  const updateSelection = (textarea: HTMLTextAreaElement) => {
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const editorValue = textarea.value;
    if (start === end) {
      setSelectionLines(null);
    } else {
      const startLine =
        Math.max(0, getLineNumberFromPosition(editorValue, start) - 1);
      const endLine =
        Math.max(0, getLineNumberFromPosition(editorValue, end) - 1);
      setSelectionLines({ start: startLine, end: endLine });
    }
  };

  const findMatchingBracket = (cursorPos: number, text: string = cleanValue) => {
    const brackets = ['()', '[]', '{}'];
    const openBrackets = ['(', '[', '{'];
    const closeBrackets = [')', ']', '}'];

    const charAtCursor = text.charAt(cursorPos);
    const charBeforeCursor = text.charAt(cursorPos - 1);
    
    let searchChar = '';
    let searchPos = cursorPos;
    let isOpenBracket = false;
    
    // Check if cursor is on or after a bracket
    if (openBrackets.includes(charAtCursor)) {
      searchChar = charAtCursor;
      searchPos = cursorPos;
      isOpenBracket = true;
    } else if (closeBrackets.includes(charAtCursor)) {
      searchChar = charAtCursor;
      searchPos = cursorPos;
      isOpenBracket = false;
    } else if (openBrackets.includes(charBeforeCursor)) {
      searchChar = charBeforeCursor;
      searchPos = cursorPos - 1;
      isOpenBracket = true;
    } else if (closeBrackets.includes(charBeforeCursor)) {
      searchChar = charBeforeCursor;
      searchPos = cursorPos - 1;
      isOpenBracket = false;
    }
    
    if (!searchChar) {
      setMatchingBrackets(null);
      return;
    }
    
    const bracketPair = brackets.find(pair => pair.includes(searchChar));
    if (!bracketPair) {
      setMatchingBrackets(null);
      return;
    }
    
    const openChar = bracketPair[0];
    const closeChar = bracketPair[1];
    
    let matchPos = -1;
    let count = 1;
    
    if (isOpenBracket) {
      // Search forward for closing bracket
      for (let i = searchPos + 1; i < text.length; i++) {
        const char = text.charAt(i);
        if (char === openChar) count++;
        else if (char === closeChar) {
          count--;
          if (count === 0) {
            matchPos = i;
            break;
          }
        }
      }
    } else {
      // Search backward for opening bracket
      for (let i = searchPos - 1; i >= 0; i--) {
        const char = text.charAt(i);
        if (char === closeChar) count++;
        else if (char === openChar) {
          count--;
          if (count === 0) {
            matchPos = i;
            break;
          }
        }
      }
    }
    
    if (matchPos !== -1) {
      setMatchingBrackets({ start: Math.min(searchPos, matchPos), end: Math.max(searchPos, matchPos) });
    } else {
      setMatchingBrackets(null);
    }
  };

  const handleCursorMove = (e: React.MouseEvent<HTMLTextAreaElement> | React.KeyboardEvent<HTMLTextAreaElement>) => {
    const textarea = e.currentTarget;
    // Small delay to ensure cursor position is updated
    setTimeout(() => {
      updateBracketMatching(textarea);
      updateSelection(textarea);
    }, 0);
  };

  const handleSelectionChange = (e: React.SyntheticEvent<HTMLTextAreaElement>) => {
    const textarea = e.currentTarget;
    updateSelection(textarea);
  };

  const toggleComment = () => {
    if (!textareaRef.current) return;
    
    const textarea = textareaRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    
    // Get selected lines
    const lines = value.split('\n');
    const startLineIndex = value.substring(0, start).split('\n').length - 1;
    const endLineIndex = value.substring(0, end).split('\n').length - 1;
    
    // Check if all selected lines are commented
    const selectedLines = lines.slice(startLineIndex, endLineIndex + 1);
    const allCommented = selectedLines.every(line => line.trim().startsWith('//'));
    
    // Toggle comments
    for (let i = startLineIndex; i <= endLineIndex; i++) {
      if (allCommented) {
        // Remove comments
        lines[i] = lines[i].replace(/^(\s*)\/\/\s?/, '$1');
      } else {
        // Add comments
        const match = lines[i].match(/^(\s*)/);
        const indent = match ? match[1] : '';
        lines[i] = lines[i].replace(/^(\s*)/, '$1// ');
      }
    }
    
    const newValue = lines.join('\n');
    onChange(newValue);
  };

  const duplicateSelection = () => {
    if (!textareaRef.current) return;
    
    const textarea = textareaRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    
    if (start === end) {
      // No selection - duplicate current line
      const lines = value.split('\n');
      const lineIndex = value.substring(0, start).split('\n').length - 1;
      const currentLine = lines[lineIndex];
      
      lines.splice(lineIndex + 1, 0, currentLine);
      const newValue = lines.join('\n');
      onChange(newValue);
      
      // Move cursor to the duplicated line
      const newPos = start + currentLine.length + 1;
      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = newPos;
      }, 0);
    } else {
      // Duplicate selection
      const selectedText = value.substring(start, end);
      const newValue = value.substring(0, end) + selectedText + value.substring(end);
      onChange(newValue);
      
      // Select the duplicated text
      setTimeout(() => {
        textarea.selectionStart = end;
        textarea.selectionEnd = end + selectedText.length;
      }, 0);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    const textarea = e.currentTarget;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;

    // Handle escape key
    if (e.key === 'Escape' && isSearchOpen) {
      setIsSearchOpen(false);
      setSearchTerm('');
      return;
    }

    // Handle keyboard shortcuts
    if (e.ctrlKey || e.metaKey) {
      switch (e.key) {
        case 'f':
          e.preventDefault();
          setIsSearchOpen(true);
          return;
        case '/':
          e.preventDefault();
          toggleComment();
          return;
        case 'd':
          e.preventDefault();
          duplicateSelection();
          return;
      }
    }

    // Update bracket matching for navigation keys
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(e.key)) {
      setTimeout(() => updateBracketMatching(textarea), 0);
    }

    // Tab handling
    if (e.key === 'Tab') {
      e.preventDefault();
      const newValue = value.substring(0, start) + '    ' + value.substring(end);
      onChange(newValue);

      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = start + 4;
      }, 0);
      return;
    }

    // Enter key for auto-indentation
    if (e.key === 'Enter') {
      e.preventDefault();
      
      // Get current line
      const lines = value.substring(0, start).split('\n');
      const currentLine = lines[lines.length - 1];
      
      // Calculate indentation
      const indentMatch = currentLine.match(/^(\s*)/);
      const currentIndent = indentMatch ? indentMatch[1] : '';
      
      // Check if we need extra indentation (after opening brackets)
      const needsExtraIndent = /[{[(]\s*$/.test(currentLine.trim());
      const extraIndent = needsExtraIndent ? '    ' : '';
      
      // Check if next character is a closing bracket
      const nextChar = cleanValue.charAt(start);
      const isClosingBracket = /[}\])]/.test(nextChar);
      
      let newValue: string;
      let newCursorPos: number;
      
      if (needsExtraIndent && isClosingBracket) {
        // Add two lines: one indented, one with current indentation
        newValue = value.substring(0, start) + 
                  '\n' + currentIndent + extraIndent + 
                  '\n' + currentIndent + 
                  value.substring(end);
        newCursorPos = start + 1 + currentIndent.length + extraIndent.length;
      } else {
        // Normal enter with indentation
        newValue = value.substring(0, start) + 
                  '\n' + currentIndent + extraIndent + 
                  value.substring(end);
        newCursorPos = start + 1 + currentIndent.length + extraIndent.length;
      }
      
      onChange(newValue);
      
      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = newCursorPos;
      }, 0);
      return;
    }

    // Auto-closing brackets, parentheses, and quotes
    const pairs: Record<string, string> = {
      '(': ')',
      '[': ']',
      '{': '}',
      '"': '"',
      "'": "'"
    };

    if (pairs[e.key]) {
      // For quotes, check if we're inside a string
      const beforeCursor = value.substring(0, start);
      const isInsideString = (char: string) => {
        const matches = beforeCursor.match(new RegExp(`[^\\\\]${char}`, 'g')) || [];
        return matches.length % 2 === 1;
      };

      // Skip auto-closing for quotes if already inside a string of the same type
      if ((e.key === '"' || e.key === "'") && isInsideString(e.key)) {
        return; // Let default behavior handle it
      }

      // Skip if next character is the same (for quotes)
      const nextChar = cleanValue.charAt(start);
      if ((e.key === '"' || e.key === "'") && nextChar === e.key) {
        e.preventDefault();
        // Move cursor past the existing quote
        onChange(value);
        setTimeout(() => {
          textarea.selectionStart = textarea.selectionEnd = start + 1;
        }, 0);
        return;
      }

      e.preventDefault();
      const closeChar = pairs[e.key];
      const newValue = value.substring(0, start) + e.key + closeChar + value.substring(end);
      onChange(newValue);

      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = start + 1;
      }, 0);
      return;
    }

    // Handle closing brackets - skip if next character matches
    if (/[}\])]/.test(e.key)) {
      const nextChar = cleanValue.charAt(start);
      if (nextChar === e.key) {
        e.preventDefault();
        setTimeout(() => {
          textarea.selectionStart = textarea.selectionEnd = start + 1;
        }, 0);
        return;
      }
    }

    // Handle Backspace for bracket pairs
    if (e.key === 'Backspace') {
      const prevChar = cleanValue.charAt(start - 1);
      const nextChar = cleanValue.charAt(start);
      
      // Check if we're deleting an opening bracket with its matching closing bracket
      const isPair = (
        (prevChar === '(' && nextChar === ')') ||
        (prevChar === '[' && nextChar === ']') ||
        (prevChar === '{' && nextChar === '}') ||
        (prevChar === '"' && nextChar === '"') ||
        (prevChar === "'" && nextChar === "'")
      );
      
      if (isPair && start === end) {
        e.preventDefault();
        const newValue = value.substring(0, start - 1) + value.substring(start + 1);
        onChange(newValue);
        
        setTimeout(() => {
          textarea.selectionStart = textarea.selectionEnd = start - 1;
        }, 0);
        return;
      }
    }
  };

  const handleScroll = (e: React.UIEvent<HTMLTextAreaElement>) => {
    const target = e.currentTarget;

    if (highlightRef.current) {
      highlightRef.current.scrollTop = target.scrollTop;
      highlightRef.current.scrollLeft = target.scrollLeft;
    }

    // Update scroll info for custom scrollbar
    setScrollInfo({
      scrollTop: target.scrollTop,
      scrollLeft: target.scrollLeft,
      scrollHeight: target.scrollHeight,
      clientHeight: target.clientHeight
    });
  };

  const handleScrollbarMouseDown = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!textareaRef.current || trackHeight === 0) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();

    const startY = event.clientY;
    const startScrollTop = textareaRef.current.scrollTop;
    const scrollRange = textareaRef.current.scrollHeight - textareaRef.current.clientHeight;
    const trackScrollable = Math.max(trackHeight - thumbHeight, 1);
    const previousUserSelect = document.body.style.userSelect;
    const previousCursor = document.body.style.cursor;

    document.body.style.userSelect = 'none';
    document.body.style.cursor = 'grabbing';

    const handleMouseMove = (moveEvent: MouseEvent) => {
      if (!textareaRef.current) {
        return;
      }
      const deltaY = moveEvent.clientY - startY;
      const scrollDelta = (deltaY / trackScrollable) * scrollRange;
      const nextScroll = Math.min(scrollRange, Math.max(0, startScrollTop + scrollDelta));
      textareaRef.current.scrollTop = nextScroll;
    };

    const handleMouseUp = () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      document.body.style.userSelect = previousUserSelect;
      document.body.style.cursor = previousCursor;
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  };

  const handleScrollbarTrackClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!textareaRef.current || trackHeight === 0) {
      return;
    }
    event.preventDefault();
    event.stopPropagation();

    const trackRect = (event.currentTarget as HTMLDivElement).getBoundingClientRect();
    const clickY = event.clientY - trackRect.top;
    const scrollRange = textareaRef.current.scrollHeight - textareaRef.current.clientHeight;
    const trackScrollable = trackHeight - thumbHeight;

    const ratio = trackScrollable > 0
      ? (clickY - thumbHeight / 2) / trackScrollable
      : 0;
    const clampedRatio = Math.min(1, Math.max(0, ratio));
    textareaRef.current.scrollTop = clampedRatio * scrollRange;
  };

  const escapeHtml = (value: string) =>
    value
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');

  const highlightCodeSegment = (segment: string): string => {
    if (!segment) return '';

    interface Token {
      start: number;
      end: number;
      style: string;
    }

    const tokenPatterns = [
      { pattern: /"(?:[^"\\]|\\.)*"/g, style: '#ce9178' },
      { pattern: /'(?:[^'\\]|\\.)*'/g, style: '#ce9178' },
      { pattern: /\b\d+(?:\.\d+)?\b/g, style: '#b5cea8' },
      { pattern: /\b(fn|let|mut|const|static|struct|impl|if|elif|else|match|for|while|in|return|use|pub|try|catch|as|break|continue|true|false|nil)\b/g, style: '#c586c0' },
      { pattern: /\b(i32|i64|u32|u64|f64|bool|string|void|self)\b/g, style: '#4ec9b0' },
      { pattern: /\b(print|input|len|push|pop|reserve|type_of|timestamp|int|float)\b/g, style: '#4fc1ff' },
      { pattern: /\b([a-zA-Z_][a-zA-Z0-9_]*)\s*(?=\()/g, style: '#dcdcaa' },
    ];

    const tokens: Token[] = [];

    const addToken = (start: number, end: number, style: string) => {
      if (tokens.some(t => start < t.end && end > t.start)) {
        return;
      }
      tokens.push({ start, end, style });
    };

    tokenPatterns.forEach(({ pattern, style }) => {
      const regex = new RegExp(pattern.source, pattern.flags);
      let match: RegExpExecArray | null;
      while ((match = regex.exec(segment)) !== null) {
        addToken(match.index, match.index + match[0].length, style);
      }
    });

    tokens.sort((a, b) => a.start - b.start);

    let result = '';
    let cursor = 0;

    tokens.forEach(token => {
      if (cursor < token.start) {
        result += escapeHtml(segment.slice(cursor, token.start));
      }

      result += `<span style="color: ${token.style}">${escapeHtml(segment.slice(token.start, token.end))}</span>`;
      cursor = token.end;
    });

    if (cursor < segment.length) {
      result += escapeHtml(segment.slice(cursor));
    }

    return result;
  };

  const findCommentIndex = (line: string): number => {
    let inSingle = false;
    let inDouble = false;
    let escaped = false;

    for (let i = 0; i < line.length - 1; i++) {
      const char = line[i];

      if (escaped) {
        escaped = false;
        continue;
      }

      if (char === '\\') {
        escaped = true;
        continue;
      }

      if (!inSingle && char === '"') {
        inDouble = !inDouble;
        continue;
      }

      if (!inDouble && char === '\'') {
        inSingle = !inSingle;
        continue;
      }

      if (!inSingle && !inDouble && char === '/' && line[i + 1] === '/') {
        return i;
      }
    }

    return -1;
  };

  const highlightSyntax = (code: string): string => {
    if (!code) return '';

    return code.split('\n').map((line) => {
      const commentIndex = findCommentIndex(line);
      const codePart = commentIndex >= 0 ? line.slice(0, commentIndex) : line;
      const commentPart = commentIndex >= 0 ? line.slice(commentIndex) : '';

      const highlightedCode = highlightCodeSegment(codePart);
      const highlightedComment = commentPart
        ? `<span style="color: #6a9955">${escapeHtml(commentPart)}</span>`
        : '';

      return highlightedCode + highlightedComment;
    }).join('\n');
  };

  const highlightSearchTerms = (code: string): string => {
    const baseHighlight = highlightSyntax(code);

    const applySearchHighlight = (text: string): string => {
      if (!searchTerm) {
        return text;
      }

      const escapedTerm = searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const searchRegex = new RegExp(`(${escapedTerm})`, 'gi');
      return text.replace(searchRegex, '<mark class="bg-yellow-400 text-black">$1</mark>');
    };

    const applyBracketHighlight = (text: string): string => {
      if (!matchingBrackets) {
        return text;
      }

      const { start, end } = matchingBrackets;
      let currentPos = 0;
      let result = '';

      for (let i = 0; i < text.length; i++) {
        if (text[i] === '<') {
          const tagEnd = text.indexOf('>', i);
          if (tagEnd !== -1) {
            result += text.substring(i, tagEnd + 1);
            i = tagEnd;
            continue;
          }
        }

        if (text[i] === '&') {
          const entityEnd = text.indexOf(';', i);
          if (entityEnd !== -1) {
            result += text.substring(i, entityEnd + 1);
            i = entityEnd;
            currentPos++;
            continue;
          }
        }

        if (currentPos === start) {
          result += '<span style="background-color: rgba(100, 100, 255, 0.35); border-radius: 2px;">' + text[i];
          if (currentPos === end) {
            result += '</span>';
          }
        } else if (currentPos > start && currentPos <= end) {
          result += text[i];
          if (currentPos === end) {
            result += '</span>';
          }
        } else {
          result += text[i];
        }

        currentPos++;
      }

      return result;
    };

    return applyBracketHighlight(applySearchHighlight(baseHighlight));
  };

  return (
    <div 
      ref={containerRef}
      style={{
        height: '100%',
        backgroundColor: '#1e1e1e',
        fontFamily: '"SF Mono", Monaco, "Cascadia Code", "Roboto Mono", Consolas, "Courier New", monospace',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Search Bar */}
      {isSearchOpen && (
        <div 
          className="absolute top-0 left-0 right-0 z-50 flex items-center gap-2 p-2" 
          style={{ backgroundColor: '#1e1e1e', borderBottom: '1px solid #333' }}
        >
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search..."
            className="flex-1 px-3 py-1 rounded text-sm focus:outline-none"
            style={{ backgroundColor: '#2a2a2a', border: '1px solid #444', color: '#f8f8f2' }}
            autoFocus
          />
          <button
            onClick={() => {setIsSearchOpen(false); setSearchTerm('');}}
            className="px-2 py-1 text-gray-400 hover:text-white"
          >
            ✕
          </button>
        </div>
      )}
      
      {/* Editor container */}
      <div 
        style={{ 
          paddingTop: isSearchOpen ? '40px' : '0',
          display: 'flex',
          height: '100%',
          width: '100%',
          position: 'relative'
        }}
      >
        {/* Line numbers */}
        <div
          style={{
            width: '60px',
            backgroundColor: '#1e1e1e',
            borderRight: '1px solid #2d2d30',
            userSelect: 'none',
            flexShrink: 0,
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          {currentLine > 0 && (
            <div
              style={{
                position: 'absolute',
                top: currentLineTop,
                left: 0,
                right: 0,
                height: LINE_HEIGHT,
                background: 'rgba(255, 255, 255, 0.04)',
                borderTop: '1px solid rgba(255, 255, 255, 0.06)',
                borderBottom: '1px solid rgba(0, 0, 0, 0.4)',
                pointerEvents: 'none'
              }}
            />
          )}
          <div
            style={{
              position: 'absolute',
              top: '16px',
              right: '12px',
              transform: `translateY(-${scrollInfo.scrollTop}px)`,
              fontFamily: '"SF Mono", Monaco, "Cascadia Code", "Roboto Mono", Consolas, "Courier New", monospace',
              fontSize: '14px',
              lineHeight: `${LINE_HEIGHT}px`,
              textAlign: 'right'
            }}
          >
            {lineNumbers.map((num, index) => (
              <div
                key={index}
                style={{
                  height: `${LINE_HEIGHT}px`,
                  lineHeight: `${LINE_HEIGHT}px`,
                  color: (index + 1) === currentLine ? '#cccccc' : '#6e7681',
                  fontWeight: '400'
                }}
              >
                {num}
              </div>
            ))}
          </div>
        </div>

        {/* Editor content area */}
        <div 
          style={{ 
            backgroundColor: '#1e1e1e',
            flex: 1,
            position: 'relative',
            minWidth: 0
          }}
        >
          {/* Syntax highlighting layer */}
          <pre
            ref={highlightRef}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: 'auto',
              minHeight: '100%',
              margin: 0,
              padding: '16px 32px 16px 16px',
              fontFamily: '"SF Mono", Monaco, "Cascadia Code", "Roboto Mono", Consolas, "Courier New", monospace',
              fontSize: '14px',
              lineHeight: '20px',
              color: '#d4d4d4',
              whiteSpace: 'pre-wrap',
              wordWrap: 'break-word',
              overflow: 'hidden',
              pointerEvents: 'none',
              zIndex: 1,
              transform: `translate(${-scrollInfo.scrollLeft}px, ${-scrollInfo.scrollTop}px)`
            }}
            dangerouslySetInnerHTML={{
              __html: highlightSearchTerms(cleanValue) || '<span style="color: #6a9955">// Write your Orus code here...</span>'
            }}
          />

          {/* Selection highlight overlay */}
          {/* Current line highlight */}
          {currentLine > 0 && (
            <div
              style={{
                position: 'absolute',
                top: currentLineTop,
                left: 0,
                right: 32,
                height: LINE_HEIGHT,
                background: 'rgba(255, 255, 255, 0.05)',
                borderTop: '1px solid rgba(255, 255, 255, 0.08)',
                borderBottom: '1px solid rgba(0, 0, 0, 0.35)',
                transform: `translateX(-${scrollInfo.scrollLeft}px)`,
                pointerEvents: 'none',
                zIndex: 0
              }}
            />
          )}

          {selectionLines && (
            <>
              {Array.from({ length: selectionLines.end - selectionLines.start + 1 }).map((_, i) => {
                const line = selectionLines.start + i;
                return (
                  <div
                    key={line}
                    style={{
                      position: 'absolute',
                      top:
                        LINE_PADDING_TOP +
                        line * LINE_HEIGHT -
                        scrollInfo.scrollTop,
                      left: 0,
                      right: 32,
                      height: LINE_HEIGHT,
                      background: 'rgba(173, 214, 255, 0.3)',
                      transform: `translateX(-${scrollInfo.scrollLeft}px)`,
                      pointerEvents: 'none',
                      zIndex: 1
                    }}
                  />
                );
              })}
            </>
          )}

          {/* Input textarea */}
          <textarea
            ref={textareaRef}
            value={cleanValue}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            onKeyUp={handleCursorMove}
            onClick={handleCursorMove}
            onScroll={handleScroll}
            onSelect={handleSelectionChange}
            className="orus-editor-scrollbar"
            style={{
              width: '100%',
              height: '100%',
              margin: 0,
              padding: '16px 32px 16px 16px',
              fontFamily: '"SF Mono", Monaco, "Cascadia Code", "Roboto Mono", Consolas, "Courier New", monospace',
              fontSize: '14px',
              lineHeight: '20px',
              backgroundColor: 'transparent',
              color: 'transparent',
              border: 'none',
              outline: 'none',
              resize: 'none',
              whiteSpace: 'pre-wrap',
              wordWrap: 'break-word',
              caretColor: '#ffffff',
              position: 'absolute',
              top: 0,
              left: 0,
              zIndex: 2,
              overflow: 'auto'
            }}
            spellCheck={false}
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
          />

          {showCustomScrollbar && trackHeight > 0 && (
            <div
              onMouseDown={handleScrollbarTrackClick}
              style={{
                position: 'absolute',
                top: 0,
                right: 4,
                width: '14px',
                height: '100%',
                backgroundColor: '#252526',
                border: '1px solid #2f2f2f',
                boxShadow: 'inset 0 0 0 1px rgba(0, 0, 0, 0.45)',
                zIndex: 4,
                cursor: 'pointer'
              }}
            >
              <div
                onMouseDown={handleScrollbarMouseDown}
                style={{
                  position: 'absolute',
                  top: `${thumbTop}px`,
                  left: 1,
                  right: 1,
                  height: `${thumbHeight}px`,
                  backgroundColor: '#4d4d4d',
                  border: '1px solid #2a2a2a',
                  borderRadius: 0,
                  boxShadow: 'inset 0 0 0 1px rgba(255, 255, 255, 0.04)',
                  cursor: 'grab'
                }}
              >
                <div
                  style={{
                    position: 'absolute',
                    top: `${Math.max(2, thumbHeight * 0.12)}px`,
                    left: 0,
                    right: 0,
                    height: '2px',
                    backgroundColor: 'rgba(230, 230, 230, 0.35)'
                  }}
                />
              </div>
            </div>
          )}

        </div>
      </div>
      
    </div>
  );
};

export default MonacoEditor;
