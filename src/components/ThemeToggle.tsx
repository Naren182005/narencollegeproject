
import { Moon, Sun } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export function ThemeToggle() {
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    if (typeof window !== 'undefined') {
      return document.documentElement.classList.contains('dark') ? 'dark' : 'light';
    }
    return 'dark';
  });
  
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  function toggleTheme() {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      className="rounded-full transition-all duration-300"
    >
      <Sun className={cn(
        "h-[1.2rem] w-[1.2rem] transition-all",
        theme === 'light' ? 'opacity-100 rotate-0' : 'opacity-0 -rotate-90 absolute'
      )} />
      <Moon className={cn(
        "h-[1.2rem] w-[1.2rem] transition-all",
        theme === 'dark' ? 'opacity-100 rotate-0' : 'opacity-0 rotate-90 absolute'
      )} />
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
