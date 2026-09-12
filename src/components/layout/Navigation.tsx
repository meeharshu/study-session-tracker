import React from 'react';
import { Home, List, BarChart3, Settings2 } from 'lucide-react';
import ThemeToggle from './ThemeToggle';
import { Page } from '../../types';

interface NavigationProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
}

export default function Navigation({ currentPage, onNavigate }: NavigationProps) {
  const navItems = [
    { id: 'today', label: 'Today', icon: Home },
    { id: 'sessions', label: 'Sessions', icon: List },
    { id: 'insights', label: 'Insights', icon: BarChart3 },
    { id: 'settings', label: 'Settings', icon: Settings2 },
  ] as const;

  return (
    <>
      {/* Top Navigation */}
      <header className="fixed top-0 left-0 right-0 h-16 bg-[color:var(--bg-primary)]/85 backdrop-blur-[16px] border-b border-[color:var(--border-light)] z-40 transition-colors">
        <div className="w-full h-full px-6 sm:px-10 lg:px-16 xl:px-20 flex items-center justify-between">
          <div className="font-medium tracking-tight text-base text-[color:var(--text-primary)]">
            Study
          </div>
          
          <nav className="hidden md:flex">
            <ul className="flex items-center space-x-2">
              {navItems.map((item) => (
                <li key={item.id}>
                  <button
                    onClick={() => onNavigate(item.id)}
                    className={`nav-link px-3 py-1.5 rounded-md text-sm transition-colors ${
                      currentPage === item.id 
                        ? 'text-[color:var(--text-primary)] bg-[color:var(--bg-secondary)] font-medium' 
                        : 'text-[color:var(--text-secondary)] hover:text-[color:var(--text-primary)] hover:bg-[color:var(--bg-secondary)]/50'
                    }`}
                  >
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
          
          <div>
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-[color:var(--bg-primary)]/80 backdrop-blur-[12px] border-t border-[color:var(--border-light)] z-40 pb-safe">
        <ul className="flex items-center justify-around h-16 px-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            
            return (
              <li key={item.id} className="flex-1 flex justify-center">
                <button
                  onClick={() => onNavigate(item.id)}
                  className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${
                    isActive 
                      ? 'text-[color:var(--accent)]' 
                      : 'text-[color:var(--text-tertiary)] hover:text-[color:var(--text-secondary)]'
                  }`}
                >
                  <Icon size={20} strokeWidth={isActive ? 2 : 1.5} />
                  <span className="text-[10px] font-medium">{item.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>
    </>
  );
}
