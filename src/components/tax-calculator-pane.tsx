'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { TaxRate, TaxRateFormData } from '@/types/tax-rate';
import { taxRateService } from '@/lib/tax-rate-service';
import { Calculator, RefreshCw, Plus } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { TaxRateForm } from '@/components/tax-rate-form';

interface TaxCalculatorPaneProps {
  taxRates: TaxRate[];
  onCreateTaxRate: (data: TaxRateFormData) => TaxRate;
}

export function TaxCalculatorPane({ taxRates, onCreateTaxRate }: TaxCalculatorPaneProps) {
  const [selectedTaxRateId, setSelectedTaxRateId] = useState<string>('auto');
  const [amount, setAmount] = useState<number>(100);
  const [calculationResult, setCalculationResult] = useState<{
    taxAmount: number;
    totalAmount: number;
    appliedRate: TaxRate | null;
    isAutoSelected: boolean;
  } | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);

  const handleSelection = (value: string) => {
    if (value === 'create-new') {
      setShowCreateForm(true);
      return;
    }
    
    setSelectedTaxRateId(value);
    
    if (value === 'auto') {
      handleAutoSelect();
    } else if (value && value !== 'auto') {
      const selectedRate = taxRates.find(rate => rate.id === value);
      if (selectedRate) {
        calculateTax(amount, selectedRate, false);
      }
    } else {
      setCalculationResult(null);
    }
  };

  const handleAutoSelect = () => {
    // Simulate looking up tax rate based on invoice address
    const autoSelectedRate = taxRateService.autoSelectTaxRate();
    if (autoSelectedRate) {
      calculateTax(amount, autoSelectedRate, true);
    }
  };

  const calculateTax = (baseAmount: number, taxRate: TaxRate, isAutoSelected: boolean = false) => {
    const taxAmount = baseAmount * taxRate.rate;
    const totalAmount = baseAmount + taxAmount;
    
    setCalculationResult({
      taxAmount,
      totalAmount,
      appliedRate: taxRate,
      isAutoSelected,
    });
  };

  const handleAmountChange = (newAmount: number) => {
    setAmount(newAmount);
    if (selectedTaxRateId && selectedTaxRateId !== 'auto') {
      const selectedRate = taxRates.find(rate => rate.id === selectedTaxRateId);
      if (selectedRate) {
        calculateTax(newAmount, selectedRate, false);
      }
    } else if (selectedTaxRateId === 'auto' && calculationResult?.appliedRate) {
      calculateTax(newAmount, calculationResult.appliedRate, true);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatRate = (rate: number) => {
    const percentage = rate * 100;
    // Show up to 3 decimal places, but remove trailing zeros
    return `${parseFloat(percentage.toFixed(3))}%`;
  };

  const handleCreateNewTaxRate = (data: TaxRateFormData) => {
    const newRate = onCreateTaxRate(data);
    setShowCreateForm(false);
    // Auto-select the newly created rate
    setSelectedTaxRateId(newRate.id);
    if (amount > 0) {
      calculateTax(amount, newRate, false);
    }
  };

  // Auto-select when auto is selected
  useEffect(() => {
    if (selectedTaxRateId === 'auto') {
      handleAutoSelect();
    }
  }, [selectedTaxRateId]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Tax Calculator</h2>
          <p className="text-gray-600">Calculate taxes with your configured rates</p>
        </div>
      </div>

      {/* Amount Input */}
      <Card>
        <CardHeader>
          <CardTitle>Calculate Tax</CardTitle>
          <CardDescription>
            Enter an amount and select tax rate
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">
              Base Amount ($)
            </label>
            <Input
              type="number"
              step="0.01"
              placeholder="100.00"
              value={amount || ''}
              onChange={(e) => handleAmountChange(parseFloat(e.target.value) || 0)}
            />
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">
              Tax Rate
            </label>
            <Select value={selectedTaxRateId} onValueChange={handleSelection}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a tax rate..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="auto">
                  <div className="flex items-center">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Calculate Automatically
                  </div>
                </SelectItem>
                <SelectItem value="create-new">
                  <div className="flex items-center text-blue-600 font-medium">
                    <Plus className="h-4 w-4 mr-2" />
                    Add rate
                  </div>
                </SelectItem>
                {taxRates.length > 0 && (
                  <div className="px-2 py-1.5">
                    <div className="h-px bg-gray-200"></div>
                  </div>
                )}
                {taxRates.map((rate) => (
                  <SelectItem key={rate.id} value={rate.id}>
                    <div className="flex justify-between items-center w-full">
                      <span>{rate.name}</span>
                      <span className="text-gray-500 ml-2">{formatRate(rate.rate)}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>



          {calculationResult && calculationResult.appliedRate && (
            <div className="border rounded-lg p-4 bg-gray-50">
              <div className="flex items-center mb-4">
                <Calculator className="h-4 w-4 mr-2" />
                <span className="font-medium">Order Summary</span>
                {calculationResult.isAutoSelected && (
                  <span className="ml-2 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    <RefreshCw className="h-3 w-3 mr-1" />
                    Auto-Selected
                  </span>
                )}
              </div>

              {/* Customer Address */}
              <div className="mb-4 p-3 bg-white rounded border">
                <div className="text-xs font-medium text-gray-500 mb-1">CUSTOMER ADDRESS</div>
                <div className="text-sm">
                  <div>Acme Corp</div>
                  <div>1234 Pine Street</div>
                  <div>Seattle, WA 98101</div>
                </div>
              </div>
              
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Applied Tax Rate:</span>
                  <span className="font-medium">
                    {calculationResult.appliedRate.name} ({formatRate(calculationResult.appliedRate.rate)})
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>{formatCurrency(amount)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax:</span>
                  <span>{formatCurrency(calculationResult.taxAmount)}</span>
                </div>
                <div className="border-t pt-2 flex justify-between font-medium text-lg">
                  <span>Total:</span>
                  <span>{formatCurrency(calculationResult.totalAmount)}</span>
                </div>
              </div>
            </div>
          )}

          {!calculationResult && (
            <div className="text-center py-8 text-gray-500">
              Enter an amount to see calculation results
            </div>
          )}
        </CardContent>
      </Card>



      {/* Create Tax Rate Dialog */}
      <Dialog open={showCreateForm} onOpenChange={setShowCreateForm}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Create New Tax Rate</DialogTitle>
          </DialogHeader>
          <TaxRateForm
            onSubmit={handleCreateNewTaxRate}
            onCancel={() => setShowCreateForm(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}