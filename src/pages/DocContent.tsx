
import { useParams } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import DocsSidebar from '@/components/DocsSidebar';
import DocHeader from '@/components/docs/DocHeader';
import DocNavigation from '@/components/docs/DocNavigation';
import DocFooter from '@/components/docs/DocFooter';
import { getDocContent } from '@/components/docs/DocContentData';

const DocContent = () => {
  const { section } = useParams();
  const docData = getDocContent(section || '');

  return (
    <div className="min-h-screen bg-gradient-to-br from-charcoal-950 via-charcoal-900 to-charcoal-950">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex gap-8">
          {/* Sidebar */}
          <div className="w-80 flex-shrink-0 hidden lg:block">
            <DocsSidebar />
          </div>
          
          {/* Main Content */}
          <div className="flex-1 max-w-4xl min-w-0">
            <DocNavigation />
            
            {/* Content */}
            <div className="animate-fade-in">
              <DocHeader title={docData.title} />
              
              <Card className="bg-charcoal-800/50 border-charcoal-700 p-8">
                {docData.content}
              </Card>
              
              <DocFooter nextSection={docData.nextSection} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocContent;
