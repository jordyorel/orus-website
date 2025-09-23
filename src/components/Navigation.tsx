
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Menu, X, Home, Download, BookOpen, Code, MapPin } from 'lucide-react';

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [logoError, setLogoError] = useState(false);
  const location = useLocation();

  const navItems = [
    { name: 'Home', path: '/', icon: Home },
    { name: 'Install', path: '/install', icon: Download },
    { name: 'Docs', path: '/docs', icon: BookOpen },
    { name: 'Playground', path: '/play', icon: Code },
    { name: 'Roadmap', path: '/roadmap', icon: MapPin },
  ];

  const isActive = (path: string) => location.pathname === path;

  const handleLogoError = () => {
    console.log('Logo failed to load from /lovable-uploads/1325edf9-761a-404c-90e2-d2263793a65f.png');
    setLogoError(true);
  };

  const handleLogoLoad = () => {
    console.log('Logo loaded successfully from /lovable-uploads/1325edf9-761a-404c-90e2-d2263793a65f.png');
    setLogoError(false);
  };

  return (
    <nav className="bg-charcoal-950/95 backdrop-blur-sm border-b border-charcoal-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3">
            {!logoError ? (
              <img 
                src="/lovable-uploads/1325edf9-761a-404c-90e2-d2263793a65f.png" 
                alt="Orus" 
                className="w-12 h-12 object-contain"
                onError={handleLogoError}
                onLoad={handleLogoLoad}
              />
            ) : (
              <div className="w-12 h-12 bg-gold-400 rounded flex items-center justify-center text-charcoal-950 font-bold text-sm">
                O
              </div>
            )}
            <span className="text-xl font-bold text-gold-400">Orus</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`flex items-center space-x-2 text-sm font-medium transition-colors ${
                    isActive(item.path)
                      ? 'text-gold-400'
                      : 'text-charcoal-300 hover:text-gold-400'
                  }`}
                >
                  <Icon size={16} />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-charcoal-300 hover:text-gold-400"
            >
              {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-charcoal-800">
            <div className="flex flex-col space-y-4">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    to={item.path}
                    onClick={() => setIsMenuOpen(false)}
                    className={`flex items-center space-x-2 text-sm font-medium transition-colors ${
                      isActive(item.path)
                        ? 'text-gold-400'
                        : 'text-charcoal-300 hover:text-gold-400'
                    }`}
                  >
                    <Icon size={16} />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
