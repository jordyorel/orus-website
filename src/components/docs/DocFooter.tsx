
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight } from 'lucide-react';

interface DocFooterProps {
  nextSection: string | null;
}

const DocFooter = ({ nextSection }: DocFooterProps) => {
  // Define the order of sections for proper navigation
  const sectionOrder = [
    'hello-world', 'syntax', 'variables', 'functions', 'control-flow', 
    'pattern-matching', 'arrays', 'structs', 'enums', 'generics', 
    'modules', 'error-handling', 'builtins', 'best-practices', 'examples'
  ];

  const getCurrentSectionIndex = () => {
    const currentPath = window.location.pathname;
    const currentSection = currentPath.split('/').pop();
    return sectionOrder.findIndex(section => section === currentSection);
  };

  const getPreviousSection = () => {
    const currentIndex = getCurrentSectionIndex();
    return currentIndex > 0 ? sectionOrder[currentIndex - 1] : null;
  };

  const getNextSection = () => {
    const currentIndex = getCurrentSectionIndex();
    return currentIndex < sectionOrder.length - 1 ? sectionOrder[currentIndex + 1] : null;
  };

  const handleNextClick = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePreviousClick = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const previousSection = getPreviousSection();
  const actualNextSection = getNextSection();

  return (
    <div className="flex justify-between items-center mt-8 pt-8 border-t border-charcoal-700">
      {previousSection ? (
        <Link to={`/docs/${previousSection}`} onClick={handlePreviousClick}>
          <Button variant="outline" className="border-gold-500/50 text-gold-400">
            <ArrowLeft size={16} className="mr-2" />
            Previous
          </Button>
        </Link>
      ) : (
        <Link to="/docs" onClick={handlePreviousClick}>
          <Button variant="outline" className="border-gold-500/50 text-gold-400">
            <ArrowLeft size={16} className="mr-2" />
            Back to Docs
          </Button>
        </Link>
      )}
      
      {actualNextSection && (
        <Link to={`/docs/${actualNextSection}`} onClick={handleNextClick}>
          <Button className="bg-gold-500 hover:bg-gold-600 text-charcoal-950">
            Next
            <ArrowRight size={16} className="ml-2" />
          </Button>
        </Link>
      )}
    </div>
  );
};

export default DocFooter;
