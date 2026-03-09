import { useData } from '@/context/DataContext';
import { formatCurrency } from '@/utils/formatters';
import logo from '@/assets/logo.png';

export default function Dashboard() {
  const { employees, payrollRuns, reimbursements } = useData();

  const totalPayroll = payrollRuns.reduce((s, p) => s + p.netSalary, 0);
  const totalReimb = reimbursements.reduce((s, r) => s + r.amount, 0);

  const cards = [
    { label: 'Employees', value: employees.length.toString(), unit: 'active', color: '#4f8ef7' },
    { label: 'Total Payroll', value: formatCurrency(totalPayroll), unit: 'disbursed', color: '#1abc9c' },
    { label: 'Reimbursements', value: formatCurrency(totalReimb), unit: 'submitted', color: '#f39c12' },
    { label: 'Payroll Runs', value: payrollRuns.length.toString(), unit: 'processed', color: '#9b59b6' },
  ];

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {cards.map(c => (
          <div
            key={c.label}
            className="rounded-xl p-5 transition-all duration-300"
            style={{
              background: 'var(--luna-panel-bg)',
              border: '1px solid var(--luna-border)',
              borderTop: `3px solid ${c.color}`,
              boxShadow: 'var(--luna-shadow)',
            }}
          >
            <div className="text-[22px] font-[900] tracking-tight" style={{ color: c.color }}>{c.value}</div>
            <div className="text-[13px] mt-1" style={{ color: 'var(--luna-muted)' }}>{c.label}</div>
            <div className="text-[10px] uppercase tracking-[0.08em] mt-1" style={{ color: 'var(--luna-faint)' }}>{c.unit}</div>
          </div>
        ))}
      </div>

      <div
        className="mt-6 rounded-xl p-5 transition-all duration-300"
        style={{ background: 'var(--luna-panel-bg)', border: '1px solid var(--luna-border)', boxShadow: 'var(--luna-shadow)' }}
      >
        <div className="text-xs font-bold uppercase tracking-[0.1em] mb-4" style={{ color: 'var(--luna-muted)' }}>
          EMPLOYEE ROSTER
        </div>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                {['Name', 'Position', 'Base Salary'].map(h => (
                  <th key={h} className="text-left text-[10px] uppercase tracking-[0.08em] pb-2 border-b" style={{ color: 'var(--luna-faint)', borderColor: 'var(--luna-border)' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {employees.map(e => (
                <tr key={e.id} style={{ borderBottom: '1px solid var(--luna-tr-border)' }}>
                  <td className="py-2.5 text-[13px]" style={{ color: 'var(--luna-body)' }}>{e.name}</td>
                  <td className="py-2.5">
                    <span className="text-[11px] px-2.5 py-0.5 rounded-[20px]" style={{ background: 'rgba(79,142,247,0.1)', color: '#4f8ef7', border: '1px solid rgba(79,142,247,0.25)' }}>
                      {e.position}
                    </span>
                  </td>
                  <td className="py-2.5 text-[13px]" style={{ color: 'var(--luna-body)' }}>{formatCurrency(e.baseSalary)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
