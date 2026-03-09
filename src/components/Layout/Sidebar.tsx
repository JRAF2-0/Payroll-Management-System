import { Menu, X } from 'lucide-react';
import { useState } from 'react';
import sidebarLogo from '@/assets/sidebar-logo.png';

interface SidebarProps {
  activePage: string;
  onNavigate: (page: string) => void;
}

const navItems = [
  { label: 'Dashboard', key: 'dashboard' },
  { label: 'Employees', key: 'employees' },
  { label: 'Payroll', key: 'payroll' },
  { label: 'Reimbursements', key: 'reimbursements' },
  { label: 'Records', key: 'records' },
];

export default function Sidebar({ activePage, onNavigate }: SidebarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const sidebarContent = (
    <>
      <div className="p-5 border-b" style={{ borderColor: 'var(--luna-border)' }}>
        <img src={sidebarLogo} alt="Luna's Payroll Logo" className="w-full h-auto" />
      </div>

      <nav className="flex flex-col gap-1 px-2.5 py-4">
        {navItems.map(item => (
           <button
             key={item.key}
             onClick={() => { onNavigate(item.key); setMobileOpen(false); }}
             className="w-full text-left px-3.5 py-2.5 rounded-lg text-[13px] transition-all duration-200"
             style={{
               background: activePage === item.key ? 'var(--luna-nav-active-bg)' : 'transparent',
               color: activePage === item.key ? 'var(--luna-nav-active-text)' : 'var(--luna-muted)',
               fontWeight: activePage === item.key ? 700 : 400,
             }}
           >
             {item.label}
           </button>
        ))}
      </nav>

      <div className="mt-auto p-4 border-t" style={{ borderColor: 'var(--luna-border)' }}>
        <div className="flex items-center gap-2 text-[11px]" style={{ color: 'var(--luna-muted)' }}>
          <span className="w-1.5 h-1.5 rounded-full bg-[#1abc9c] inline-block" />
          v1.0 · {new Date().getFullYear()}
        </div>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile hamburger */}
      <button
        className="lg:hidden fixed top-3 left-3 z-50 p-2 rounded-lg"
        style={{ background: 'var(--luna-panel-bg)', border: '1px solid var(--luna-border)' }}
        onClick={() => setMobileOpen(!mobileOpen)}
      >
        {mobileOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-40 bg-black/50" onClick={() => setMobileOpen(false)} />
      )}

      {/* Mobile sidebar */}
      <aside
        className={`lg:hidden fixed top-0 left-0 z-40 h-full w-[210px] flex flex-col transition-transform duration-300 ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}`}
        style={{ background: 'var(--luna-sidebar-bg)', borderRight: '1px solid var(--luna-border)' }}
      >
        {sidebarContent}
      </aside>

      {/* Desktop sidebar */}
      <aside
        className="hidden lg:flex flex-col fixed top-0 left-0 h-full w-[210px]"
        style={{ background: 'var(--luna-sidebar-bg)', borderRight: '1px solid var(--luna-border)' }}
      >
        {sidebarContent}
      </aside>
    </>
  );
}
