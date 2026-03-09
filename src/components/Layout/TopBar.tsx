import { useTheme } from '@/context/ThemeContext';

interface TopBarProps {
  title: string;
}

export default function TopBar({ title }: TopBarProps) {
  const { theme, toggleTheme } = useTheme();
  const now = new Date();
  const monthYear = now.toLocaleDateString('en-PH', { month: 'short', year: 'numeric' }).toUpperCase();

  return (
    <div
      className="h-[50px] flex items-center justify-between px-5 lg:px-7 border-b transition-all duration-300"
      style={{ background: 'var(--luna-topbar-bg)', borderColor: 'var(--luna-border)' }}
    >
      {/* Spacer for mobile hamburger */}
      <div className="lg:hidden w-10" />
      <h1 className="text-[17px] font-[800]" style={{ color: 'var(--luna-strong)' }}>{title}</h1>

      <span
        className="text-[11px] tracking-[0.05em] px-3 py-1 rounded-[20px]"
        style={{
          color: 'var(--luna-accent)',
          background: 'var(--luna-badge-bg)',
          border: '1px solid var(--luna-badge-border)',
        }}
      >
        {monthYear}
      </span>
    </div>
  );
}
