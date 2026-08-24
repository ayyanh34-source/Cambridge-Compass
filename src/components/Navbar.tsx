import React from 'react';
import { Search, Compass, Menu, X, Sun, Moon } from 'lucide-react';
import { ScreenTab, ThemeMode } from '../types';

interface NavbarProps {
  currentTab?: ScreenTab;
  currentView?: string;
  onNavigate?: (tab: ScreenTab) => void;
  setCurrentView?: (view: any) => void;
  onOpenSearch?: () => void;
  theme?: ThemeMode;
  onToggleTheme?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  currentView,
  onNavigate,
  setCurrentView,
  onOpenSearch = () => { },
  theme = 'light',
  onToggleTheme = () => {
    const isDark = document.documentElement.classList.toggle('dark')
    localStorage.setItem('theme', isDark ? 'dark' : 'light')
  },
}) => {
  const activeTab = (currentView || currentTab || 'home') as ScreenTab;
  const handleNavigate = (tab: any) => {
    if (setCurrentView) setCurrentView(tab);
    if (onNavigate) onNavigate(tab);
  };
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const navLinks: { id: ScreenTab; label: string }[] = [
    { id: 'resources', label: 'Resources' },
    { id: 'whats-new', label: "What's New" },
    { id: 'request', label: 'Request Resource' },
    { id: 'about', label: 'About' },
  ];

  return (
    <header
      id="main-top-navbar"
      className="bg-[#FDFCF9]/95 backdrop-blur-md sticky top-0 border-b border-[#EBE8E1] z-50 transition-colors duration-300"
    >
      {/* Editorial Top Micro Status Line */}
      <div className="border-b border-[#EBE8E1]/60 px-4 sm:px-8 md:px-16 max-w-[1200px] mx-auto py-1.5 hidden sm:flex justify-between items-center text-[10px] uppercase font-mono tracking-[0.2em] text-[#71717A]">
        <div className="flex items-center gap-3">
          <span>Archive Vol. 01 — Cambridge International Navigation</span>
          <span className="text-[#C4A678]">●</span>
          <span className="text-[9px] px-1.5 py-0.2 rounded border border-[#EBE8E1] bg-white text-[#71717A]">
            {theme === 'dark' ? 'Night Study Mode' : 'Warm Editorial'}
          </span>
        </div>
        <div className="flex items-center gap-4">
          <span>O-Level Curricula</span>
          <span className="text-[#C4A678]">●</span>
          <span>52.2053° N, 0.1191° E</span>
        </div>
      </div>

      <div className="flex justify-between items-center w-full px-4 sm:px-8 md:px-16 max-w-[1200px] mx-auto h-16">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <button
            id="nav-brand-logo-btn"
            onClick={() => handleNavigate('home')}
            className="flex items-center gap-3 text-left group"
          >
            <div className="w-8 h-8 rounded-full border border-[#EBE8E1] flex items-center justify-center bg-[#FDFCF9] group-hover:border-[#1A1A1A] group-hover:bg-[#1A1A1A] transition-all duration-300 shadow-2xs">
              <Compass className="w-4 h-4 text-[#1A1A1A] group-hover:text-[#FDFCF9] group-hover:rotate-90 transition-all duration-500" />
            </div>
            <div className="flex flex-col">
              <span className="font-serif text-xl md:text-2xl font-bold tracking-tight text-[#1A1A1A]">
                Cambridge Compass
              </span>
            </div>
          </button>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => {
            const isActive = activeTab === link.id;
            return (
              <button
                key={link.id}
                id={`nav-link-${link.id}`}
                onClick={() => handleNavigate(link.id)}
                className={`text-xs uppercase font-mono tracking-[0.18em] transition-all py-1 relative duration-150 ${isActive
                    ? 'text-[#1A1A1A] font-bold after:content-[""] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-[#C4A678]'
                    : 'text-[#71717A] hover:text-[#1A1A1A]'
                  }`}
              >
                {link.label}
              </button>
            );
          })}
        </nav>

        {/* Right Trailing Action Buttons */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          {/* Theme Switcher Toggle */}
          <button
            id="nav-theme-switcher-btn"
            onClick={onToggleTheme}
            aria-label={theme === 'dark' ? 'Switch to warm editorial theme' : 'Switch to late-night study dark mode'}
            className="h-9 px-3 flex items-center gap-2 text-[#71717A] hover:text-[#1A1A1A] border border-[#EBE8E1] rounded-full hover:border-[#1A1A1A] transition-all active:scale-95 bg-white text-xs font-mono shadow-2xs group"
            title={theme === 'dark' ? 'Switch to Warm Editorial Mode' : 'Switch to High-Contrast Night Mode'}
          >
            {theme === 'dark' ? (
              <>
                <Sun className="w-3.5 h-3.5 text-[#D4B988] group-hover:rotate-45 transition-transform duration-300" />
                <span className="hidden sm:inline text-[10px] uppercase tracking-wider font-semibold text-[#D4B988]">
                  Day
                </span>
              </>
            ) : (
              <>
                <Moon className="w-3.5 h-3.5 text-[#1A1A1A] group-hover:-rotate-12 transition-transform duration-300" />
                <span className="hidden sm:inline text-[10px] uppercase tracking-wider text-[#71717A]">
                  Night
                </span>
              </>
            )}
          </button>

          {/* Quick Search Button */}
          <button
            id="nav-search-trigger-btn"
            onClick={onOpenSearch}
            aria-label="Open search dialog"
            className="h-9 px-3 flex items-center gap-2 text-[#71717A] hover:text-[#1A1A1A] border border-[#EBE8E1] rounded-full hover:border-[#1A1A1A] transition-all active:scale-95 bg-white text-xs font-mono shadow-2xs"
            title="Search resources (Cmd+K)"
          >
            <Search className="w-3.5 h-3.5 text-[#1A1A1A]" />
            <span className="hidden lg:inline text-[10px] uppercase tracking-wider text-[#A1A1AA]">⌘K</span>
          </button>

          {/* Mobile Menu Toggle */}
          <button
            id="nav-mobile-menu-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden w-9 h-9 flex items-center justify-center text-[#1A1A1A] hover:bg-[#EBE8E1]/50 rounded-full"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-[#EBE8E1] bg-[#FDFCF9] px-6 py-5 space-y-3 animate-fade-in shadow-lg">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => {
                handleNavigate(link.id);
                setMobileMenuOpen(false);
              }}
              className={`w-full text-left py-2.5 px-3 rounded-lg text-xs font-mono uppercase tracking-[0.18em] transition-colors ${activeTab === link.id
                  ? 'bg-[#1A1A1A] text-white font-bold'
                  : 'text-[#52525B] hover:bg-[#EBE8E1]/40'
                }`}
            >
              {link.label}
            </button>
          ))}

          {/* Mobile theme toggle item */}
          <button
            onClick={() => {
              onToggleTheme();
            }}
            className="w-full flex items-center justify-between py-2.5 px-3 rounded-lg text-xs font-mono uppercase tracking-[0.18em] border border-[#EBE8E1] bg-white text-[#1A1A1A]"
          >
            <span className="flex items-center gap-2">
              {theme === 'dark' ? <Sun className="w-4 h-4 text-[#D4B988]" /> : <Moon className="w-4 h-4 text-[#1A1A1A]" />}
              <span>{theme === 'dark' ? 'Switch to Warm Editorial' : 'Switch to Night Study'}</span>
            </span>
            <span className="text-[10px] text-[#C4A678] font-bold">
              {theme.toUpperCase()}
            </span>
          </button>
        </div>
      )}
    </header>
  );
};

export default Navbar;
