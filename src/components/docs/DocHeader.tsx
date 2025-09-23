
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Play } from 'lucide-react';

interface DocHeaderProps {
  title: string;
}

const DocHeader = ({ title }: DocHeaderProps) => {
  return (
    <div className="flex items-center justify-between mb-8">
      <h1 className="text-4xl font-bold text-white">{title}</h1>
      
      {/* Try in Playground Button */}
      <Link to="/play">
        <Button className="bg-gold-500 hover:bg-gold-600 text-charcoal-950">
          <Play size={16} className="mr-2" />
          Try in Playground
        </Button>
      </Link>
    </div>
  );
};

export default DocHeader;
