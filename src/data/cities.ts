import type { CityData } from '../types/compensation';

export const CITIES: Record<string, CityData> = {
  'London':      { country: 'UK',       mult: 1.00, col: 100, cur: 'GBP' },
  'Cambridge':   { country: 'UK',       mult: 0.92, col: 85,  cur: 'GBP' },
  'Edinburgh':   { country: 'UK',       mult: 0.83, col: 76,  cur: 'GBP' },
  'Bristol':     { country: 'UK',       mult: 0.83, col: 78,  cur: 'GBP' },
  'Manchester':  { country: 'UK',       mult: 0.80, col: 74,  cur: 'GBP' },
  'Dublin':      { country: 'Ireland',  mult: 0.93, col: 89,  cur: 'EUR' },
  'Cork':        { country: 'Ireland',  mult: 0.78, col: 75,  cur: 'EUR' },
  'Munich':      { country: 'Germany',  mult: 0.92, col: 90,  cur: 'EUR' },
  'Berlin':      { country: 'Germany',  mult: 0.82, col: 72,  cur: 'EUR' },
  'Frankfurt':   { country: 'Germany',  mult: 0.85, col: 82,  cur: 'EUR' },
  'Hamburg':     { country: 'Germany',  mult: 0.78, col: 75,  cur: 'EUR' },
  'Sofia':       { country: 'Bulgaria', mult: 0.45, col: 42,  cur: 'EUR' },
  'Bucharest':   { country: 'Romania',  mult: 0.42, col: 40,  cur: 'EUR' },
  'Cluj-Napoca': { country: 'Romania',  mult: 0.40, col: 36,  cur: 'EUR' },
  'Lisbon':      { country: 'Portugal', mult: 0.55, col: 52,  cur: 'EUR' },
  'Porto':       { country: 'Portugal', mult: 0.48, col: 45,  cur: 'EUR' },
};
