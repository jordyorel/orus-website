
import { useEffect } from 'react';
import { toast } from '@/components/ui/use-toast';
import { sanitizeUrlParameter } from '@/utils/security';

export const useUrlCodeLoader = (setCode: (code: string) => void) => {
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const codeParam = urlParams.get('code');
    if (codeParam) {
      const sanitizedCode = sanitizeUrlParameter(codeParam);
      if (sanitizedCode) {
        setCode(sanitizedCode);
        toast({
          title: "Code Loaded",
          description: "Code has been loaded from the URL.",
        });
      } else {
        toast({
          title: "Invalid URL Parameter",
          description: "The code parameter in the URL is invalid and was ignored.",
          variant: "destructive",
        });
      }
    }
  }, [setCode]);
};
