import { TaxRate, TaxRateFormData, AutoTaxRateSelection } from '@/types/tax-rate';

// Mock data storage - in a real app, this would be a database
let taxRates: TaxRate[] = [
  {
    id: '1',
    name: 'California Sales Tax',
    rate: 0.0725,
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z'),
  },
  {
    id: '2',
    name: 'New York Income Tax',
    rate: 0.04,
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z'),
  },
  {
    id: '3',
    name: 'Texas Property Tax',
    rate: 0.0183,
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z'),
  },
];

let autoSelectionSettings: AutoTaxRateSelection = {
  enabled: false,
  criteria: {
    region: '',
    category: 'sales',
    fallbackRate: 0.05,
  },
};

// Generate a simple ID
function generateId(): string {
  return Date.now().toString() + Math.random().toString(36).substr(2, 9);
}

export const taxRateService = {
  // Get all tax rates
  getAllTaxRates: (): TaxRate[] => {
    return [...taxRates];
  },

  // Get active tax rates only (all rates are now considered active)
  getActiveTaxRates: (): TaxRate[] => {
    return [...taxRates];
  },

  // Get tax rate by ID
  getTaxRateById: (id: string): TaxRate | undefined => {
    return taxRates.find(rate => rate.id === id);
  },

  // Create new tax rate
  createTaxRate: (data: TaxRateFormData): TaxRate => {
    const newTaxRate: TaxRate = {
      id: generateId(),
      ...data,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    taxRates.push(newTaxRate);
    return newTaxRate;
  },

  // Update existing tax rate
  updateTaxRate: (id: string, data: Partial<TaxRateFormData>): TaxRate | null => {
    const index = taxRates.findIndex(rate => rate.id === id);
    if (index === -1) return null;

    taxRates[index] = {
      ...taxRates[index],
      ...data,
      updatedAt: new Date(),
    };
    return taxRates[index];
  },

  // Delete tax rate
  deleteTaxRate: (id: string): boolean => {
    const index = taxRates.findIndex(rate => rate.id === id);
    if (index === -1) return false;

    taxRates.splice(index, 1);
    return true;
  },

  // Auto-selection functionality
  getAutoSelectionSettings: (): AutoTaxRateSelection => {
    return { ...autoSelectionSettings };
  },

  updateAutoSelectionSettings: (settings: AutoTaxRateSelection): void => {
    autoSelectionSettings = { ...settings };
  },

  // Auto-select tax rate based on invoice address (simulation)
  autoSelectTaxRate: (invoiceRegion?: string, taxType?: string): TaxRate | null => {
    // Simulate looking up tax rate based on invoice address
    // In real implementation, this would call a tax service API
    
    // For now, just return the first available tax rate as a simple simulation
    // In a real app, this would use the invoice address to determine the correct rate
    return taxRates.length > 0 ? taxRates[0] : null;
  },
};