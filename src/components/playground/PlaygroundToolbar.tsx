
import { Button } from '@/components/ui/button';
import { Play, Download, Share, RotateCcw, Copy, BookOpen, Settings, ChevronDown } from 'lucide-react';
import { PlaygroundToolbarProps } from '@/types/playground';

const PlaygroundToolbar = ({ 
  isRunning, 
  onRun, 
  onReset, 
  onShare, 
  onExport,
  onHelp
}: PlaygroundToolbarProps) => {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-2">
        <Button
          onClick={onRun}
          disabled={isRunning}
          className="bg-red-700 hover:bg-red-800 text-white font-medium px-4 py-1.5 text-sm"
        >
          <Play size={14} className="mr-1.5 fill-current" />
          {isRunning ? 'RUNNING' : 'RUN'}
        </Button>
        
        <div className="text-charcoal-500 text-sm">...</div>
        
        <Button
          variant="ghost"
          size="sm"
          className="text-charcoal-300 hover:text-charcoal-100 hover:bg-charcoal-700 text-sm px-3 py-1.5"
        >
          DEBUG
          <ChevronDown size={14} className="ml-1" />
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          className="text-charcoal-300 hover:text-charcoal-100 hover:bg-charcoal-700 text-sm px-3 py-1.5"
        >
          STABLE
          <ChevronDown size={14} className="ml-1" />
        </Button>
        
        <div className="text-charcoal-500 text-sm">...</div>
      </div>
      
      <div className="flex items-center space-x-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={onShare}
          className="text-charcoal-300 hover:text-charcoal-100 hover:bg-charcoal-700 text-sm px-3 py-1.5"
        >
          SHARE
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          className="text-charcoal-300 hover:text-charcoal-100 hover:bg-charcoal-700 text-sm px-3 py-1.5"
        >
          TOOLS
          <ChevronDown size={14} className="ml-1" />
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          className="text-charcoal-300 hover:text-charcoal-100 hover:bg-charcoal-700 text-sm px-3 py-1.5"
        >
          <Settings size={14} className="mr-1" />
          CONFIG
          <ChevronDown size={14} className="ml-1" />
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={onHelp}
          className="text-charcoal-300 hover:text-charcoal-100 hover:bg-charcoal-700 text-sm px-3 py-1.5"
        >
          ?
        </Button>
      </div>
    </div>
  );
};

export default PlaygroundToolbar;
