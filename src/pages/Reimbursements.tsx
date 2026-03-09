import { useState } from 'react';
import { useData } from '@/context/DataContext';
import { formatCurrency, formatDate } from '@/utils/formatters';
import { showToast } from '@/components/Toast';
import logo from '@/assets/logo.png';

const CATEGORY_COLORS: Record<string, string> = {
  Transportation: '#4f8ef7', Food: '#f39c12', Others: '#9b59b6',
};

export default function Reimbursements() {
  const { employees, reimbursements, addReimbursement } = useData();
  const [employeeId, setEmployeeId] = useState('');
  const [category, setCategory] = useState<'Transportation' | 'Food' | 'Others'>('Transportation');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  const inputStyle: React.CSSProperties = {
    width: '100%', background: 'var(--luna-input-bg)', border: '1px solid var(--luna-border)',
    borderRadius: 7, padding: '8px 11px', fontSize: 13, fontFamily: 'var(--font-mono)',
    color: 'var(--luna-body)', outline: 'none', transition: 'all 0.3s',
  };

  const handleSubmit = () => {
    if (!employeeId) { showToast('Select an employee', 'error'); return; }
    if (!amount || Number(amount) <= 0) { showToast('Amount must be greater than 0', 'error'); return; }
    addReimbursement({ employeeId, category, amount: Number(amount), description: description || undefined, date });
    showToast('Reimbursement recorded');
    setAmount(''); setDescription('');
  };

  // Group by employee
  const grouped = employees.map(emp => ({
    employee: emp,
    items: reimbursements.filter(r => r.employeeId === emp.id),
    total: reimbursements.filter(r => r.employeeId === emp.id).reduce((s, r) => s + r.amount, 0),
  })).filter(g => g.items.length > 0);

  return (
    <div>
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.5fr] gap-6">
        <div className="rounded-xl p-5" style={{ background: 'var(--luna-panel-bg)', border: '1px solid var(--luna-border)', boxShadow: 'var(--luna-shadow)' }}>
          <div className="text-xs font-bold uppercase tracking-[0.1em] mb-4" style={{ color: 'var(--luna-muted)' }}>ADD REIMBURSEMENT</div>

        <div className="mb-3">
          <label className="text-[11px] uppercase tracking-[0.06em] block mb-1" style={{ color: 'var(--luna-muted)' }}>EMPLOYEE</label>
          <select value={employeeId} onChange={e => setEmployeeId(e.target.value)} style={inputStyle}>
            <option value="">Select employee</option>
            {employees.map(e => <option key={e.id} value={e.id}>{e.name}</option>)}
          </select>
        </div>

        <div className="mb-3">
          <label className="text-[11px] uppercase tracking-[0.06em] block mb-1" style={{ color: 'var(--luna-muted)' }}>CATEGORY</label>
          <select value={category} onChange={e => setCategory(e.target.value as typeof category)} style={inputStyle}>
            <option>Transportation</option><option>Food</option><option>Others</option>
          </select>
        </div>

        <div className="mb-3">
          <label className="text-[11px] uppercase tracking-[0.06em] block mb-1" style={{ color: 'var(--luna-muted)' }}>AMOUNT (₱)</label>
          <input type="number" value={amount} onChange={e => setAmount(e.target.value)} style={inputStyle} />
        </div>

        <div className="mb-3">
          <label className="text-[11px] uppercase tracking-[0.06em] block mb-1" style={{ color: 'var(--luna-muted)' }}>DESCRIPTION (OPTIONAL)</label>
          <input type="text" value={description} onChange={e => setDescription(e.target.value)} style={inputStyle} />
        </div>

        <div className="mb-3">
          <label className="text-[11px] uppercase tracking-[0.06em] block mb-1" style={{ color: 'var(--luna-muted)' }}>DATE</label>
          <input type="date" value={date} onChange={e => setDate(e.target.value)} style={inputStyle} />
        </div>

         <button onClick={handleSubmit} className="w-full mt-2 py-2.5 rounded-lg text-[13px] font-bold" style={{ background: 'linear-gradient(0deg, #5F5AD1 0%, #C9C7F8 100%)', color: '#fff' }}>
           Add Reimbursement
         </button>
      </div>

      <div className="rounded-xl p-5" style={{ background: 'var(--luna-panel-bg)', border: '1px solid var(--luna-border)', boxShadow: 'var(--luna-shadow)' }}>
        <div className="text-xs font-bold uppercase tracking-[0.1em] mb-4" style={{ color: 'var(--luna-muted)' }}>SUBMITTED REIMBURSEMENTS</div>
        {grouped.length === 0 ? (
          <div className="text-center py-8 text-[13px]" style={{ color: 'var(--luna-faint)' }}>No reimbursements yet.</div>
        ) : (
          <div className="space-y-5">
            {grouped.map(g => (
              <div key={g.employee.id}>
                <div className="flex justify-between items-center mb-2">
                  <span className="font-bold text-[13px]" style={{ color: 'var(--luna-strong)' }}>{g.employee.name}</span>
                  <span className="font-bold text-[13px]" style={{ color: '#f39c12' }}>{formatCurrency(g.total)}</span>
                </div>
                {g.items.map(r => (
                  <div key={r.id} className="flex items-center gap-2 py-2 border-b text-[13px]" style={{ borderColor: 'var(--luna-tr-border)' }}>
                    <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: CATEGORY_COLORS[r.category] }} />
                    <span className="flex-1 min-w-0 truncate">
                      {r.category}{r.description ? ` — ${r.description}` : ''}
                    </span>
                    <span className="font-semibold flex-shrink-0" style={{ color: '#8fbc8b' }}>{formatCurrency(r.amount)}</span>
                    <span className="text-[11px] flex-shrink-0" style={{ color: 'var(--luna-faint)' }}>{formatDate(r.date)}</span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
    </div>
  );
}
