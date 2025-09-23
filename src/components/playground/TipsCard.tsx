
import { Card } from '@/components/ui/card';

const TipsCard = () => {
  return (
    <Card className="bg-gradient-to-r from-gold-500/10 to-gold-600/10 border-gold-500/30 p-4">
      <h3 className="text-base font-semibold text-white mb-2">💡 Tips</h3>
      <div className="grid grid-cols-2 gap-3 text-charcoal-300 text-xs">
        <div>• Use <code className="text-gold-400 font-fira text-xs">println!</code> for debug output</div>
        <div>• Try examples on the left to explore features</div>
        <div>• Editor supports syntax highlighting</div>
        <div>• Share your code using the Share button</div>
      </div>
    </Card>
  );
};

export default TipsCard;
