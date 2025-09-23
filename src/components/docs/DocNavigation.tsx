
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const DocNavigation = () => {
  return (
    <div className="mb-6">
      <Link to="/docs" className="inline-flex items-center text-gold-400 hover:text-gold-300 transition-colors">
        <ArrowLeft size={16} className="mr-2" />
        Back to Documentation
      </Link>
    </div>
  );
};

export default DocNavigation;
