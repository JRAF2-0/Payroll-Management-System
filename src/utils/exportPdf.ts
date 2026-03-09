import { formatCurrency } from './formatters';

interface PdfData {
  employeeName: string;
  position: string;
  baseSalary: number;
  month: string;
  year: number;
  totalWorkingDays: number;
  daysWorked: number;
  netSalary: number;
  processedAt: string;
  reimbursements: { category: string; description?: string; amount: number; date: string }[];
}

export function exportSalarySlip(data: PdfData) {
  const totalReimb = data.reimbursements.reduce((s, r) => s + r.amount, 0);
  const grandTotal = data.netSalary + totalReimb;

  const reimbRows = data.reimbursements.length > 0
    ? data.reimbursements.map((r, i) => `
      <tr style="background:${i % 2 === 0 ? '#f8fafc' : '#fff'}">
        <td style="padding:8px 12px;font-size:12px">${r.category}</td>
        <td style="padding:8px 12px;font-size:12px">${r.description || '—'}</td>
        <td style="padding:8px 12px;font-size:12px">${r.date}</td>
        <td style="padding:8px 12px;font-size:12px;text-align:right;font-weight:600">${formatCurrency(r.amount)}</td>
      </tr>`).join('')
    : '';

  const html = `<!DOCTYPE html><html><head><title>Salary Slip - ${data.employeeName}</title>
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:'DM Mono','Fira Mono','Courier New',monospace;background:#fff;color:#334155}
</style></head><body>
<div style="max-width:700px;margin:0 auto;padding:20px">
  <div style="background:#0d1b2a;padding:20px 28px;border-radius:10px 10px 0 0;display:flex;justify-content:space-between;align-items:center">
    <div><div style="font-size:18px;font-weight:800;color:#dce8f5">Luna's Payroll</div>
    <div style="font-size:10px;color:#6b8499;text-transform:uppercase;letter-spacing:0.1em;margin-top:2px">SALARY SLIP</div></div>
    <div style="text-align:right"><div style="color:#4f8ef7;font-size:13px">${data.month} ${data.year}</div>
    <div style="font-size:10px;color:#4a6278;margin-top:2px">Processed: ${data.processedAt}</div></div>
  </div>
  <div style="background:#f1f5f9;padding:18px 28px;border:1px solid #e2e8f0;border-top:0">
    <div style="font-size:15px;font-weight:800;color:#0f172a">${data.employeeName}</div>
    <div style="font-size:12px;color:#64748b;margin-top:2px">${data.position}</div>
    <div style="font-size:11px;color:#94a3b8;margin-top:4px">Monthly Base Salary: ${formatCurrency(data.baseSalary)}</div>
  </div>
  <div style="padding:20px 28px;border:1px solid #e2e8f0;border-top:0">
    <div style="font-size:10px;color:#4f8ef7;text-transform:uppercase;letter-spacing:0.1em;font-weight:700;margin-bottom:12px">SALARY COMPUTATION</div>
    <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;padding:12px 16px;font-size:13px;margin-bottom:16px">
      ${formatCurrency(data.baseSalary)} / ${data.totalWorkingDays} × ${data.daysWorked} days
    </div>
    <table style="width:100%;border-collapse:collapse;margin-bottom:16px">
      <tr style="background:#f8fafc"><td style="padding:8px 12px;font-size:12px">Base Salary</td><td style="padding:8px 12px;font-size:12px;text-align:right">${formatCurrency(data.baseSalary)}</td></tr>
      <tr><td style="padding:8px 12px;font-size:12px">Total Working Days</td><td style="padding:8px 12px;font-size:12px;text-align:right">${data.totalWorkingDays}</td></tr>
      <tr style="background:#f8fafc"><td style="padding:8px 12px;font-size:12px">Days Worked</td><td style="padding:8px 12px;font-size:12px;text-align:right">${data.daysWorked}</td></tr>
    </table>
    <div style="background:#0d1b2a;border-radius:8px;padding:14px 20px;display:flex;justify-content:space-between;align-items:center">
      <span style="font-size:10px;color:#6b8499;text-transform:uppercase;letter-spacing:0.1em">NET SALARY</span>
      <span style="font-size:20px;font-weight:900;color:#1abc9c">${formatCurrency(data.netSalary)}</span>
    </div>
  </div>
  <div style="padding:20px 28px;border:1px solid #e2e8f0;border-top:0">
    <div style="font-size:10px;color:#f39c12;text-transform:uppercase;letter-spacing:0.1em;font-weight:700;margin-bottom:12px">REIMBURSEMENTS</div>
    ${data.reimbursements.length > 0 ? `
    <table style="width:100%;border-collapse:collapse;margin-bottom:12px">
      <tr><th style="text-align:left;padding:6px 12px;font-size:10px;color:#94a3b8;text-transform:uppercase;border-bottom:1px solid #e2e8f0">Category</th>
      <th style="text-align:left;padding:6px 12px;font-size:10px;color:#94a3b8;text-transform:uppercase;border-bottom:1px solid #e2e8f0">Description</th>
      <th style="text-align:left;padding:6px 12px;font-size:10px;color:#94a3b8;text-transform:uppercase;border-bottom:1px solid #e2e8f0">Date</th>
      <th style="text-align:right;padding:6px 12px;font-size:10px;color:#94a3b8;text-transform:uppercase;border-bottom:1px solid #e2e8f0">Amount</th></tr>
      ${reimbRows}
    </table>
    <div style="background:#fff8f0;border:1px solid #fde68a;border-radius:8px;padding:12px 20px;display:flex;justify-content:space-between;align-items:center">
      <span style="font-size:10px;color:#94a3b8;text-transform:uppercase">Total Reimbursements</span>
      <span style="font-size:16px;font-weight:700;color:#f39c12">${formatCurrency(totalReimb)}</span>
    </div>` : '<div style="font-style:italic;color:#94a3b8;font-size:12px">No reimbursements recorded.</div>'}
  </div>
  <div style="background:linear-gradient(135deg,#0d1b2a,#1a2f46);border-radius:0 0 10px 10px;padding:20px 28px;display:flex;justify-content:space-between;align-items:center">
    <div><div style="font-size:10px;color:#6b8499;text-transform:uppercase;letter-spacing:0.1em">GRAND TOTAL</div>
    <div style="font-size:10px;color:#4a6278;margin-top:2px">Net Salary + Reimbursements</div></div>
    <div style="font-size:24px;font-weight:900;color:#1abc9c">${formatCurrency(grandTotal)}</div>
  </div>
  <div style="background:#f8fafc;text-align:center;padding:16px;border-radius:0 0 10px 10px;margin-top:1px">
    <div style="font-size:10px;color:#94a3b8">This is a system-generated salary slip. | Luna's Payroll Suite v1.0</div>
    <div style="font-size:10px;color:#94a3b8;margin-top:4px">${data.employeeName} · ${data.month} ${data.year}</div>
  </div>
</div>
<script>window.onload=()=>window.print()</script>
</body></html>`;

  const w = window.open('', '_blank');
  if (w) { w.document.write(html); w.document.close(); }
}
