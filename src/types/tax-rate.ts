export interface TaxRate {
  id: string;
  name: string;
  rate: number; // percentage as decimal (e.g., 0.0825 for 8.25%)
  createdAt: Date;
  updatedAt: Date;
}

export interface TaxRateFormData {
  name: string;
  rate: number;
}

export interface AutoTaxRateSelection {
  enabled: boolean;
  criteria: {
    region?: string;
    category?: string;
    fallbackRate?: number;
  };
}