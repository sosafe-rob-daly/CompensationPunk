import type { RoleCategory } from '../types/compensation';

export const ROLES: Record<string, RoleCategory> = {
  'Engineering': {
    base: 105, equity: 55, bonus: 18,
    subs: {
      'Backend Engineer': 1.00, 'Frontend Engineer': 0.95, 'Full-Stack Engineer': 0.98,
      'Mobile Engineer': 0.97, 'DevOps/SRE': 1.05, 'ML/AI Engineer': 1.15,
      'Security Engineer': 1.08, 'QA/Test Engineer': 0.82, 'Embedded Engineer': 0.93,
    },
  },
  'Product': {
    base: 100, equity: 50, bonus: 20,
    subs: { 'Product Manager': 1.00, 'Technical PM': 1.05, 'Product Analyst': 0.85 },
  },
  'Design': {
    base: 88, equity: 40, bonus: 14,
    subs: { 'UX Designer': 1.00, 'UI Designer': 0.95, 'UX Researcher': 0.98, 'Design Manager': 1.12 },
  },
  'Data & Analytics': {
    base: 100, equity: 50, bonus: 17,
    subs: {
      'Data Scientist': 1.05, 'Data Engineer': 1.00, 'Data Analyst': 0.82,
      'Analytics Engineer': 0.95, 'BI Analyst': 0.78,
    },
  },
  'Sales': {
    base: 78, equity: 22, bonus: 42,
    subs: {
      'Account Executive': 1.00, 'Sales Engineer': 1.10, 'SDR/BDR': 0.65,
      'Sales Manager': 1.20, 'VP Sales': 1.80,
    },
  },
  'Marketing': {
    base: 78, equity: 30, bonus: 14,
    subs: {
      'Growth Marketing': 1.00, 'Product Marketing': 1.05,
      'Content Marketing': 0.85, 'Marketing Manager': 1.12,
    },
  },
  'HR & People': {
    base: 72, equity: 25, bonus: 12,
    subs: {
      'HR Business Partner': 1.00, 'Recruiter': 0.85,
      'Comp & Benefits': 1.05, 'People Analytics': 0.95,
    },
  },
  'Finance': {
    base: 85, equity: 32, bonus: 18,
    subs: { 'FP&A Analyst': 0.90, 'Controller': 1.05, 'Finance Manager': 1.10 },
  },
  'Legal': {
    base: 95, equity: 35, bonus: 16,
    subs: { 'General Counsel': 1.15, 'Privacy/DPO': 1.00, 'Commercial Counsel': 0.95 },
  },
  'Operations & IT': {
    base: 75, equity: 25, bonus: 12,
    subs: {
      'IT Admin': 0.80, 'IT Manager': 1.05,
      'Program Manager': 1.10, 'Chief of Staff': 1.20,
    },
  },
};
