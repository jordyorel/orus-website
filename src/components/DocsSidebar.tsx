import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { 
  Book, Code, Hash, Zap, GitBranch, Search, List, Package, 
  Play, Triangle, FolderOpen, AlertTriangle, Wrench, CheckCircle,
  Lightbulb, Layers, ChevronDown, ChevronRight
} from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ScrollArea } from '@/components/ui/scroll-area';

const DocsSidebar = () => {
  const location = useLocation();
  const [openCategories, setOpenCategories] = useState<Set<string>>(new Set(['getting-started']));
  
  const categories = [
    {
      id: 'getting-started',
      title: 'Getting Started',
      sections: [
        { id: 'hello-world', title: 'Hello World', icon: Play },
        { id: 'syntax', title: 'Basic Syntax', icon: Code },
      ]
    },
    {
      id: 'fundamentals',
      title: 'Fundamentals',
      sections: [
        { id: 'variables', title: 'Variables & Types', icon: Hash },
        { id: 'functions', title: 'Functions', icon: Zap },
        { id: 'control-flow', title: 'Control Flow', icon: GitBranch },
        { id: 'pattern-matching', title: 'Pattern Matching', icon: Search },
      ]
    },
    {
      id: 'data-structures',
      title: 'Data Structures',
      sections: [
        { id: 'arrays', title: 'Arrays & Slicing', icon: List },
        { id: 'structs', title: 'Structs & Methods', icon: Package },
        { id: 'enums', title: 'Enums & Options', icon: Layers },
      ]
    },
    {
      id: 'advanced',
      title: 'Advanced Concepts',
      sections: [
        { id: 'generics', title: 'Generics', icon: Triangle },
        { id: 'modules', title: 'Modules', icon: FolderOpen },
        { id: 'error-handling', title: 'Error Handling', icon: AlertTriangle },
      ]
    },
    {
      id: 'reference',
      title: 'Reference',
      sections: [
        { id: 'builtins', title: 'Built-in Functions', icon: Wrench },
        { id: 'best-practices', title: 'Best Practices', icon: CheckCircle },
        { id: 'examples', title: 'Practical Examples', icon: Lightbulb },
      ]
    }
  ];

  useEffect(() => {
    const currentSection = location.pathname.split('/').pop();
    const categoryWithSection = categories.find(category => 
      category.sections.some(section => section.id === currentSection)
    );
    
    if (categoryWithSection) {
      setOpenCategories(prev => new Set([...prev, categoryWithSection.id]));
    }
  }, [location.pathname]);

  const toggleCategory = (categoryId: string) => {
    setOpenCategories(prev => {
      const newSet = new Set(prev);
      if (newSet.has(categoryId)) {
        newSet.delete(categoryId);
      } else {
        newSet.add(categoryId);
      }
      return newSet;
    });
  };

  return (
    <div className="sticky top-0 h-screen">
      <ScrollArea className="h-full">
        <div className="bg-charcoal-800 rounded-lg p-4 space-y-2 min-h-full">
          {categories.map((category) => (
            <Collapsible
              key={category.id}
              open={openCategories.has(category.id)}
              onOpenChange={() => toggleCategory(category.id)}
            >
              <CollapsibleTrigger className="flex items-center justify-between w-full p-2 text-left text-charcoal-300 hover:text-charcoal-200 hover:bg-charcoal-700 rounded-md transition-colors">
                <span className="font-medium">{category.title}</span>
                {openCategories.has(category.id) ? (
                  <ChevronDown size={16} />
                ) : (
                  <ChevronRight size={16} />
                )}
              </CollapsibleTrigger>
              
              <CollapsibleContent className="space-y-1 ml-2">
                {category.sections.map((section) => {
                  const Icon = section.icon;
                  const isActive = location.pathname === `/docs/${section.id}`;

                  return (
                    <Link 
                      to={`/docs/${section.id}`} 
                      key={section.id}
                      className={`flex items-center space-x-3 py-2 px-3 rounded-md transition-colors duration-200
                        ${isActive 
                          ? 'bg-gold-500 text-charcoal-900 font-semibold' 
                          : 'text-charcoal-400 hover:text-charcoal-200 hover:bg-charcoal-700'}`}
                    >
                      <Icon size={16} />
                      <span>{section.title}</span>
                    </Link>
                  );
                })}
              </CollapsibleContent>
            </Collapsible>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

export default DocsSidebar;
