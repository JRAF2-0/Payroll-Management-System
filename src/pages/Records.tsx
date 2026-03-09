import { useState } from 'react';
import { useData } from '@/context/DataContext';
import { formatCurrency } from '@/utils/formatters';
import { exportSalarySlip } from '@/utils/exportPdf';
import { showToast } from '@/components/Toast';
import logo from '@/assets/logo.png';

export default function Records() {
  const { employees, payrollRuns, reimbursements } = useData();
  const [search, setSearch] = useState('');

  const filtered = employees.filter(e => e.name.toLowerCase().includes(search.toLowerCase()));

  const inputStyle: React.CSSProperties = {
    maxWidth: 280, width: '100%', background: 'var(--luna-input-bg)', border: '1px solid var(--luna-border)',
    borderRadius: 7, padding: '8px 11px', fontSize: 13, fontFamily: 'var(--font-mono)',
    color: 'var(--luna-body)', outline: 'none',
  };

  return (
    <div>
      <input type="text" placeholder="Search employees…" value={search} onChange={e => setSearch(e.target.value)} style={inputStyle} className="mb-6" />

      <div className="space-y-6">
        {filtered.map(emp => {
          const runs = payrollRuns.filter(r => r.employeeId === emp.id);
          const empReimbs = reimbursements.filter(r => r.employeeId === emp.id);
          const grandTotal = runs.reduce((s, r) => s + r.netSalary, 0) + empReimbs.reduce((s, r) => s + r.amount, 0);

          return (
            <div key={emp.id} className="rounded-xl p-5" style={{ background: 'var(--luna-panel-bg)', border: '1px solid var(--luna-border)', boxShadow: 'var(--luna-shadow)' }}>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
                <div>
                  <div className="text-[17px] font-[800]" style={{ color: 'var(--luna-strong)' }}>{emp.name}</div>
                  <div className="text-[11px]" style={{ color: 'var(--luna-faint)' }}>{emp.position} · {formatCurrency(emp.baseSalary)}/mo</div>
                </div>
                <div className="text-right">
                  <div className="text-[20px] font-[900]" style={{ color: '#1abc9c' }}>{formatCurrency(grandTotal)}</div>
                  <div className="text-[10px] uppercase tracking-[0.08em]" style={{ color: 'var(--luna-faint)' }}>Total Released</div>
                </div>
              </div>

              {runs.length === 0 ? (
                <div className="text-[13px] py-4 text-center" style={{ color: 'var(--luna-faint)' }}>No payroll runs recorded.</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse min-w-[600px]">
                    <thead>
                      <tr>
                        {['Period', 'Days', 'Base', 'Net Salary', 'Reimb', 'Grand Total', ''].map(h => (
                          <th key={h} className="text-left text-[10px] uppercase tracking-[0.08em] pb-2 border-b" style={{ color: 'var(--luna-faint)', borderColor: 'var(--luna-border)' }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {runs.map(r => {
                        const runReimbs = empReimbs.filter(re => {
                          const rd = new Date(re.date);
                          const monthIdx = new Date(`${r.month} 1, ${r.year}`).getMonth();
                          return rd.getMonth() === monthIdx && rd.getFullYear() === r.year;
                        });
                        const reimbTotal = runReimbs.reduce((s, x) => s + x.amount, 0);
                        const rowGrand = r.netSalary + reimbTotal;

                        return (
                          <tr key={r.id} style={{ borderBottom: '1px solid var(--luna-tr-border)' }}>
                            <td className="py-2.5 text-[13px]">{r.month.slice(0, 3)} {r.year}</td>
                            <td className="py-2.5 text-[13px]">{r.daysWorked}/{r.totalWorkingDays}</td>
                            <td className="py-2.5 text-[13px]">{formatCurrency(r.baseSalary)}</td>
                            <td className="py-2.5 text-[13px] font-bold" style={{ color: '#4f8ef7' }}>{formatCurrency(r.netSalary)}</td>
                            <td className="py-2.5 text-[13px]" style={{ color: '#f39c12' }}>{formatCurrency(reimbTotal)}</td>
                            <td className="py-2.5 text-[13px] font-[800]" style={{ color: '#1abc9c' }}>{formatCurrency(rowGrand)}</td>
                            <td className="py-2.5">
                               <button
                                 onClick={() => {
                                   exportSalarySlip({
                                     employeeName: emp.name, position: emp.position, baseSalary: r.baseSalary,
                                     month: r.month, year: r.year, totalWorkingDays: r.totalWorkingDays,
                                     daysWorked: r.daysWorked, netSalary: r.netSalary, processedAt: r.processedAt,
                                     reimbursements: runReimbs.map(x => ({ category: x.category, description: x.description, amount: x.amount, date: x.date })),
                                   });
                                   showToast('PDF exported');
                                 }}
                                 className="text-[11px] px-3.5 py-1.5 rounded-lg font-bold whitespace-nowrap"
                                 style={{ background: 'linear-gradient(0deg, #5F5AD1 0%, #C9C7F8 100%)', color: '#fff' }}
                               >
                                 Export PDF
                               </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
