'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { TaxRate, TaxRateFormData } from '@/types/tax-rate';

const taxRateSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  rate: z.number().min(0, 'Rate must be positive').max(1, 'Rate must be less than 100%'),
});

interface TaxRateFormProps {
  taxRate?: TaxRate;
  onSubmit: (data: TaxRateFormData) => void;
  onCancel: () => void;
}

export function TaxRateForm({ taxRate, onSubmit, onCancel }: TaxRateFormProps) {
  const [loading, setLoading] = useState(false);

  const form = useForm<TaxRateFormData>({
    resolver: zodResolver(taxRateSchema),
    defaultValues: taxRate ? {
      name: taxRate.name,
      rate: taxRate.rate,
    } : {
      name: '',
      rate: 0.0825, // Default to 8.25%
    },
  });

  const handleSubmit = async (data: TaxRateFormData) => {
    setLoading(true);
    try {
      // Convert percentage to decimal if user entered percentage
      if (data.rate > 1) {
        data.rate = data.rate / 100;
      }
      onSubmit(data);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      <div className="mb-6">
        <p className="text-gray-600">
          {taxRate ? 'Update the tax rate information below.' : 'Enter the details for the new tax rate.'}
        </p>
      </div>
      <div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tax Rate Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., California Sales Tax" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="rate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tax Rate (%)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.001"
                      placeholder="8.25"
                      value={parseFloat((field.value * 100).toFixed(3))}
                      onChange={(e) => {
                        const value = parseFloat(e.target.value) || 0;
                        // Limit to 3 decimal places
                        const limitedValue = Math.round(value * 1000) / 1000;
                        field.onChange(limitedValue / 100);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex gap-4">
              <Button type="submit" disabled={loading}>
                {loading ? 'Saving...' : (taxRate ? 'Update' : 'Create')} Tax Rate
              </Button>
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancel
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}