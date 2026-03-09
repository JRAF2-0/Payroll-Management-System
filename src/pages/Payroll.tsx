import { useState, useMemo } from 'react';
import { useData } from '@/context/DataContext';
import { formatCurrency, MONTHS, WORKING_DAYS } from '@/utils/formatters';
import { showToast } from '@/components/Toast';
import logo from '@/assets/logo.png';

export default function Payroll() {
  const { employees, payrollRuns, addPayrollRun } = useData();
  const [employeeId, setEmployeeId] = useState('');
  const [month, setMonth] = useState(MONTHS[new Date().getMonth()]);
  const [year, setYear] = useState(new Date().getFullYear());
  const [totalDays, setTotalDays] = useState(WORKING_DAYS[MONTHS[new Date().getMonth()]]);
  const [daysWorked, setDaysWorked] = useState<number | ''>('');

  const selectedEmp = employees.find(e => e.id === employeeId);
  const netSalary = selectedEmp && typeof daysWorked === 'number' && daysWorked > 0
    ? (selectedEmp.baseSalary / totalDays) * daysWorked : 0;

  const handleMonthChange = (m: string) => { setMonth(m); setTotalDays(WORKING_DAYS[m]); };

  const handleProcess = () => {
    if (!employeeId) { showToast('Select an employee', 'error'); return; }
    if (!daysWorked) { showToast('Enter days worked', 'error'); return; }
    if (daysWorked > totalDays) { showToast('Days worked cannot exceed total working days', 'error'); return; }
    if (payrollRuns.some(p => p.employeeId === employeeId && p.month === month && p.year === year)) {
      showToast('Payroll already processed for this period', 'error'); return;
    }
    addPayrollRun({
      employeeId, month, year, totalWorkingDays: totalDays,
      daysWorked: daysWorked as number, baseSalary: selectedEmp!.baseSalary,
      netSalary, processedAt: new Date().toLocaleDateString('en-PH'),
    });
    showToast('Payroll processed');
    setDaysWorked(''); setEmployeeId('');
  };

  const sortedRuns = useMemo(() => [...payrollRuns].reverse(), [payrollRuns]);

  const inputStyle: React.CSSProperties = {
    width: '100%', background: 'var(--luna-input-bg)', border: '1px solid var(--luna-border)',
    borderRadius: 7, padding: '8px 11px', fontSize: 13, fontFamily: 'var(--font-mono)',
    color: 'var(--luna-body)', outline: 'none', transition: 'all 0.3s',
  };

  return (
    <div>
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.5fr] gap-6">
        <div className="rounded-xl p-5" style={{ background: 'var(--luna-panel-bg)', border: '1px solid var(--luna-border)', boxShadow: 'var(--luna-shadow)' }}>
          <div className="text-xs font-bold uppercase tracking-[0.1em] mb-4" style={{ color: 'var(--luna-muted)' }}>PROCESS PAYROLL</div>

        <div className="mb-3">
          <label className="text-[11px] uppercase tracking-[0.06em] block mb-1" style={{ color: 'var(--luna-muted)' }}>EMPLOYEE</label>
          <select value={employeeId} onChange={e => setEmployeeId(e.target.value)} style={inputStyle}>
            <option value="">Select employee</option>
            {employees.map(e => <option key={e.id} value={e.id}>{e.name}</option>)}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-3">
          <div>
            <label className="text-[11px] uppercase tracking-[0.06em] block mb-1" style={{ color: 'var(--luna-muted)' }}>MONTH</label>
            <select value={month} onChange={e => handleMonthChange(e.target.value)} style={inputStyle}>
              {MONTHS.map(m => <option key={m} value={m}>{m}</option>)}
            </select>
          </div>
          <div>
            <label className="text-[11px] uppercase tracking-[0.06em] block mb-1" style={{ color: 'var(--luna-muted)' }}>YEAR</label>
            <input type="number" value={year} onChange={e => setYear(Number(e.target.value))} style={inputStyle} />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-3">
          <div>
            <label className="text-[11px] uppercase tracking-[0.06em] block mb-1" style={{ color: 'var(--luna-muted)' }}>TOTAL WORKING DAYS</label>
            <input type="number" value={totalDays} onChange={e => setTotalDays(Number(e.target.value))} style={inputStyle} />
          </div>
          <div>
            <label className="text-[11px] uppercase tracking-[0.06em] block mb-1" style={{ color: 'var(--luna-muted)' }}>DAYS WORKED</label>
            <input type="number" value={daysWorked} onChange={e => setDaysWorked(e.target.value ? Number(e.target.value) : '')} style={inputStyle} />
          </div>
        </div>

        {selectedEmp && typeof daysWorked === 'number' && daysWorked > 0 && (
          <div className="rounded-[10px] p-4 mt-3" style={{ background: 'var(--luna-compute-bg)', border: '1px solid rgba(26,188,156,0.3)' }}>
            <div className="text-[10px] uppercase tracking-[0.1em] mb-2" style={{ color: 'var(--luna-muted)' }}>COMPUTATION PREVIEW</div>
            <div className="text-[13px]" style={{ color: 'var(--luna-muted)' }}>
              {formatCurrency(selectedEmp.baseSalary)} / {totalDays} × {daysWorked}
            </div>
            <div className="text-[26px] font-[900] mt-1" style={{ color: '#1abc9c' }}>{formatCurrency(netSalary)}</div>
            <div className="text-[11px] mt-1" style={{ color: 'var(--luna-faint)' }}>{selectedEmp.name} · {month} {year}</div>
          </div>
        )}

         <button onClick={handleProcess} className="w-full mt-4 py-2.5 rounded-lg text-[13px] font-bold" style={{ background: 'linear-gradient(0deg, #5F5AD1 0%, #C9C7F8 100%)', color: '#fff' }}>
           Process Payroll
         </button>
      </div>

      <div className="rounded-xl p-5" style={{ background: 'var(--luna-panel-bg)', border: '1px solid var(--luna-border)', boxShadow: 'var(--luna-shadow)' }}>
        <div className="text-xs font-bold uppercase tracking-[0.1em] mb-4" style={{ color: 'var(--luna-muted)' }}>RECENT PAYROLL RUNS</div>
        {sortedRuns.length === 0 ? (
          <div className="text-center py-8 text-[13px]" style={{ color: 'var(--luna-faint)' }}>No payroll runs yet.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse min-w-[400px]">
              <thead>
                <tr>
                  {['Employee', 'Period', 'Days', 'Net Salary'].map(h => (
                    <th key={h} className="text-left text-[10px] uppercase tracking-[0.08em] pb-2 border-b" style={{ color: 'var(--luna-faint)', borderColor: 'var(--luna-border)' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {sortedRuns.map(r => {
                  const emp = employees.find(e => e.id === r.employeeId);
                  return (
                    <tr key={r.id} style={{ borderBottom: '1px solid var(--luna-tr-border)' }}>
                      <td className="py-2.5">
                        <div className="text-[13px]">{emp?.name || 'Unknown'}</div>
                        <div className="text-[10px]" style={{ color: 'var(--luna-faint)' }}>{emp?.position}</div>
                      </td>
                      <td className="py-2.5 text-[13px]">{r.month.slice(0, 3)} {r.year.toString().slice(-2)}</td>
                      <td className="py-2.5 text-[13px]">{r.daysWorked}/{r.totalWorkingDays}</td>
                      <td className="py-2.5 text-[13px] font-bold" style={{ color: '#1abc9c' }}>{formatCurrency(r.netSalary)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
    </div>
  );
}
