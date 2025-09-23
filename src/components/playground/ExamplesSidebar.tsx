
import { ExamplesSidebarProps } from '@/types/playground';

const ExamplesSidebar = ({ examples, onExampleSelect }: ExamplesSidebarProps) => {
  return (
    <div className="h-full">
      <div className="bg-charcoal-800 border border-charcoal-600 rounded-lg p-4 h-full flex flex-col">
        <h3 className="text-lg font-semibold text-charcoal-200 mb-4 border-b border-charcoal-600 pb-2">Examples</h3>
        <div className="space-y-2 flex-1 overflow-y-auto">
          {examples.map((example, index) => (
            <button
              key={index}
              onClick={() => onExampleSelect(example.code)}
              className="w-full text-left p-3 rounded-md bg-charcoal-800 hover:bg-charcoal-700 transition-colors group border border-charcoal-600 hover:border-gold-600"
            >
              <h4 className="text-charcoal-200 font-medium group-hover:text-gold-400 transition-colors mb-1 text-sm">
                {example.title}
              </h4>
              <p className="text-charcoal-400 text-xs leading-relaxed">
                {example.description}
              </p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ExamplesSidebar;
