import { useState } from 'react';
import { useData, Employee } from '@/context/DataContext';
import { formatCurrency } from '@/utils/formatters';
import { showToast } from '@/components/Toast';
import logo from '@/assets/logo.png';

export default function Employees() {
  const { employees, addEmployee, updateEmployee, removeEmployee } = useData();
  const [editing, setEditing] = useState<Employee | null>(null);
  const [name, setName] = useState('');
  const [position, setPosition] = useState('');
  const [baseSalary, setBaseSalary] = useState('');

  const inputStyle: React.CSSProperties = {
    width: '100%', background: 'var(--luna-input-bg)', border: '1px solid var(--luna-border)',
    borderRadius: 7, padding: '8px 11px', fontSize: 13, fontFamily: 'var(--font-mono)',
    color: 'var(--luna-body)', outline: 'none', transition: 'all 0.3s',
  };

  const resetForm = () => { setName(''); setPosition(''); setBaseSalary(''); setEditing(null); };

  const handleEdit = (e: Employee) => {
    setEditing(e); setName(e.name); setPosition(e.position); setBaseSalary(e.baseSalary.toString());
  };

  const handleSubmit = () => {
    if (!name || !position || !baseSalary) { showToast('All fields are required', 'error'); return; }
    if (editing) {
      updateEmployee({ ...editing, name, position, baseSalary: Number(baseSalary) });
      showToast('Employee updated');
    } else {
      addEmployee({ name, position, baseSalary: Number(baseSalary) });
      showToast('Employee added');
    }
    resetForm();
  };

  return (
    <div>
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.6fr] gap-6">
        <div className="rounded-xl p-5" style={{ background: 'var(--luna-panel-bg)', border: '1px solid var(--luna-border)', boxShadow: 'var(--luna-shadow)' }}>
          <div className="text-xs font-bold uppercase tracking-[0.1em] mb-4" style={{ color: 'var(--luna-muted)' }}>
          {editing ? 'EDIT EMPLOYEE' : 'ADD EMPLOYEE'}
        </div>
        {[
          { label: 'FULL NAME', value: name, onChange: setName, type: 'text' },
          { label: 'POSITION', value: position, onChange: setPosition, type: 'text' },
          { label: 'BASE SALARY (₱)', value: baseSalary, onChange: setBaseSalary, type: 'number' },
        ].map(f => (
          <div key={f.label} className="mb-3">
            <label className="text-[11px] uppercase tracking-[0.06em] block mb-1" style={{ color: 'var(--luna-muted)' }}>{f.label}</label>
            <input type={f.type} value={f.value} onChange={e => f.onChange(e.target.value)} style={inputStyle} />
          </div>
        ))}
         <div className="flex gap-2 mt-4">
           <button onClick={handleSubmit} className="px-4 py-2.5 rounded-lg text-[13px] font-bold" style={{ background: 'linear-gradient(0deg, #5F5AD1 0%, #C9C7F8 100%)', color: '#fff' }}>
             {editing ? 'Update' : 'Add Employee'}
           </button>
          {editing && (
            <button onClick={resetForm} className="px-4 py-2.5 rounded-lg text-[13px]" style={{ color: 'var(--luna-muted)', border: '1px solid var(--luna-border)' }}>
              Cancel
            </button>
          )}
        </div>
      </div>

      <div className="rounded-xl p-5" style={{ background: 'var(--luna-panel-bg)', border: '1px solid var(--luna-border)', boxShadow: 'var(--luna-shadow)' }}>
        <div className="text-xs font-bold uppercase tracking-[0.1em] mb-4" style={{ color: 'var(--luna-muted)' }}>
          ALL EMPLOYEES ({employees.length})
        </div>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse min-w-[400px]">
            <thead>
              <tr>
                {['Name', 'Position', 'Base Salary', 'Actions'].map(h => (
                  <th key={h} className="text-left text-[10px] uppercase tracking-[0.08em] pb-2 border-b" style={{ color: 'var(--luna-faint)', borderColor: 'var(--luna-border)' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {employees.map(e => (
                <tr key={e.id} style={{ borderBottom: '1px solid var(--luna-tr-border)' }}>
                  <td className="py-2.5 text-[13px]">{e.name}</td>
                  <td className="py-2.5">
                    <span className="text-[11px] px-2.5 py-0.5 rounded-[20px]" style={{ background: 'rgba(79,142,247,0.1)', color: '#4f8ef7', border: '1px solid rgba(79,142,247,0.25)' }}>{e.position}</span>
                  </td>
                  <td className="py-2.5 text-[13px]">{formatCurrency(e.baseSalary)}</td>
                  <td className="py-2.5 flex gap-2">
                    <button onClick={() => handleEdit(e)} className="text-[15px] opacity-60 hover:opacity-100" title="Edit">✎</button>
                    <button onClick={() => { removeEmployee(e.id); showToast('Employee removed'); }} className="text-[15px] hover:opacity-100" style={{ color: '#e74c3c', opacity: 0.6 }} title="Remove">✕</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
    </div>
  );
}
