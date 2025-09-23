
import { toast } from '@/components/ui/use-toast';
import { secureClipboardWrite } from '@/utils/security';

export const shareCode = async (code: string) => {
  try {
    const shareUrl = `${window.location.origin}${window.location.pathname}?code=${encodeURIComponent(code)}`;
    const success = await secureClipboardWrite(shareUrl);
    
    if (success) {
      toast({
        title: "Share Link Created",
        description: "The playground URL has been copied to your clipboard.",
      });
    } else {
      throw new Error('Clipboard write failed');
    }
  } catch (error) {
    toast({
      title: "Share Failed",
      description: "Failed to create share link. Please try copying the URL manually.",
      variant: "destructive",
    });
  }
};

export const exportCode = async (code: string) => {
  try {
    const success = await secureClipboardWrite(code);
    
    if (success) {
      toast({
        title: "Code Copied",
        description: "The code has been copied to your clipboard.",
      });
    } else {
      // Fallback: create downloadable file
      const blob = new Blob([code], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'main.rs';
      a.style.display = 'none';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast({
        title: "Code Downloaded",
        description: "The code has been downloaded as main.rs file.",
      });
    }
  } catch (error) {
    toast({
      title: "Export Failed",
      description: "Failed to export code. Please try again.",
      variant: "destructive",
    });
  }
};

export const showHelp = () => {
  toast({
    title: "Orus Playground Help",
    description: "Use the examples on the left to get started. Click Run to execute your code. Use Share to copy a link or Copy URL to copy just the code.",
  });
};
