'use client';

import { useState, useEffect } from 'react';
import { TaxManagementPane } from '@/components/tax-management-pane';
import { TaxCalculatorPane } from '@/components/tax-calculator-pane';
import { TaxRate, TaxRateFormData } from '@/types/tax-rate';
import { taxRateService } from '@/lib/tax-rate-service';


export default function Home() {
  const [taxRates, setTaxRates] = useState<TaxRate[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setLoading(true);
    try {
      const rates = taxRateService.getAllTaxRates();
      setTaxRates(rates);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTaxRate = (data: TaxRateFormData): TaxRate => {
    const newTaxRate = taxRateService.createTaxRate(data);
    setTaxRates([...taxRates, newTaxRate]);
    return newTaxRate;
  };

  const handleUpdateTaxRate = (id: string, data: TaxRateFormData) => {
    const updatedTaxRate = taxRateService.updateTaxRate(id, data);
    if (updatedTaxRate) {
      setTaxRates(taxRates.map(rate => 
        rate.id === id ? updatedTaxRate : rate
      ));
    }
  };

  const handleDeleteTaxRate = (id: string) => {
    const success = taxRateService.deleteTaxRate(id);
    if (success) {
      setTaxRates(taxRates.filter(rate => rate.id !== id));
    }
  };



  const activeTaxRates = taxRates; // All tax rates are now considered active

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading tax rates...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex overflow-hidden">
        {/* Left Pane - Tax Rate Management */}
        <div className="w-1/2 border-r bg-white overflow-y-auto">
          <div className="p-6">
            <TaxManagementPane
              taxRates={taxRates}
              onCreateTaxRate={handleCreateTaxRate}
              onUpdateTaxRate={handleUpdateTaxRate}
              onDeleteTaxRate={handleDeleteTaxRate}
            />
          </div>
        </div>

        {/* Right Pane - Tax Calculator */}
        <div className="w-1/2 bg-gray-50 overflow-y-auto">
          <div className="p-6">
            <TaxCalculatorPane
              taxRates={activeTaxRates}
              onCreateTaxRate={handleCreateTaxRate}
            />
          </div>
        </div>
    </div>
  );
}