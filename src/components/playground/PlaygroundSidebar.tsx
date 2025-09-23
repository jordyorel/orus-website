
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CodeExample } from '@/types/playground';

interface PlaygroundSidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  examples: CodeExample[];
  onExampleSelect: (code: string) => void;
}

const PlaygroundSidebar = ({ 
  sidebarOpen, 
  setSidebarOpen, 
  examples, 
  onExampleSelect 
}: PlaygroundSidebarProps) => {
  // Don't render sidebar if no examples
  if (!examples || examples.length === 0) {
    return null;
  }

  return (
    <>
      {/* Sidebar - Always dark */}
      <div className={`${sidebarOpen ? 'w-80' : 'w-0'} transition-all duration-300 overflow-hidden border-r border-charcoal-600 flex-shrink-0 bg-charcoal-900`}>
        <div className="h-full p-4">
          {/* Content removed since we're not showing examples */}
        </div>
      </div>

      {/* Sidebar Toggle - Always dark */}
      <div className="flex flex-col justify-center flex-shrink-0 bg-charcoal-800">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="h-12 w-8 rounded-none border-y border-r border-charcoal-600 text-charcoal-400 hover:text-charcoal-200 hover:bg-charcoal-700"
        >
          {sidebarOpen ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
        </Button>
      </div>
    </>
  );
};

export default PlaygroundSidebar;
