
// Security utility functions for input validation and sanitization

export const validateCodeInput = (code: string): boolean => {
  // Maximum code length to prevent DoS attacks
  const MAX_CODE_LENGTH = 100000; // 100KB
  
  if (code.length > MAX_CODE_LENGTH) {
    return false;
  }
  
  // Basic validation for suspicious patterns
  const suspiciousPatterns = [
    /<script/i,
    /javascript:/i,
    /data:text\/html/i,
    /vbscript:/i
  ];
  
  return !suspiciousPatterns.some(pattern => pattern.test(code));
};

export const sanitizeUrlParameter = (param: string): string | null => {
  if (!param) return null;
  
  try {
    const decoded = decodeURIComponent(param);
    
    // Validate the decoded content
    if (!validateCodeInput(decoded)) {
      console.warn('Invalid code parameter detected, ignoring');
      return null;
    }
    
    return decoded;
  } catch (error) {
    console.warn('Failed to decode URL parameter:', error);
    return null;
  }
};

export const secureClipboardWrite = async (text: string): Promise<boolean> => {
  try {
    if (!navigator.clipboard) {
      throw new Error('Clipboard API not available');
    }
    
    await navigator.clipboard.writeText(text);
    return true;
  } catch (error) {
    console.warn('Clipboard write failed:', error);
    return false;
  }
};
