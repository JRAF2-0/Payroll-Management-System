import React, { createContext, useContext, useState, useEffect } from 'react';

export interface Employee {
  id: string;
  name: string;
  position: string;
  baseSalary: number;
}

export interface PayrollRun {
  id: string;
  employeeId: string;
  month: string;
  year: number;
  totalWorkingDays: number;
  daysWorked: number;
  baseSalary: number;
  netSalary: number;
  processedAt: string;
}

export interface Reimbursement {
  id: string;
  employeeId: string;
  category: 'Transportation' | 'Food' | 'Others';
  amount: number;
  description?: string;
  date: string;
}

interface DataContextType {
  employees: Employee[];
  payrollRuns: PayrollRun[];
  reimbursements: Reimbursement[];
  addEmployee: (e: Omit<Employee, 'id'>) => void;
  updateEmployee: (e: Employee) => void;
  removeEmployee: (id: string) => void;
  addPayrollRun: (p: Omit<PayrollRun, 'id'>) => void;
  addReimbursement: (r: Omit<Reimbursement, 'id'>) => void;
  loading: boolean;
}

const DataContext = createContext<DataContextType>({} as DataContextType);
export const useData = () => useContext(DataContext);

const uid = () => crypto.randomUUID();

const SEED_EMPLOYEES: Employee[] = [];

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [payrollRuns, setPayrollRuns] = useState<PayrollRun[]>([]);
  const [reimbursements, setReimbursements] = useState<Reimbursement[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem('luna-employees');
    if (stored) {
      setEmployees(JSON.parse(stored));
    } else {
      setEmployees(SEED_EMPLOYEES);
      localStorage.setItem('luna-employees', JSON.stringify(SEED_EMPLOYEES));
    }
    setPayrollRuns(JSON.parse(localStorage.getItem('luna-payroll') || '[]'));
    setReimbursements(JSON.parse(localStorage.getItem('luna-reimb') || '[]'));
    setTimeout(() => setLoading(false), 800);
  }, []);

  const save = (key: string, data: unknown) => localStorage.setItem(key, JSON.stringify(data));

  const addEmployee = (e: Omit<Employee, 'id'>) => {
    const next = [...employees, { ...e, id: uid() }];
    setEmployees(next); save('luna-employees', next);
  };
  const updateEmployee = (e: Employee) => {
    const next = employees.map(x => x.id === e.id ? e : x);
    setEmployees(next); save('luna-employees', next);
  };
  const removeEmployee = (id: string) => {
    const next = employees.filter(x => x.id !== id);
    setEmployees(next); save('luna-employees', next);
  };
  const addPayrollRun = (p: Omit<PayrollRun, 'id'>) => {
    const next = [...payrollRuns, { ...p, id: uid() }];
    setPayrollRuns(next); save('luna-payroll', next);
  };
  const addReimbursement = (r: Omit<Reimbursement, 'id'>) => {
    const next = [...reimbursements, { ...r, id: uid() }];
    setReimbursements(next); save('luna-reimb', next);
  };

  return (
    <DataContext.Provider value={{ employees, payrollRuns, reimbursements, addEmployee, updateEmployee, removeEmployee, addPayrollRun, addReimbursement, loading }}>
      {children}
    </DataContext.Provider>
  );
};
