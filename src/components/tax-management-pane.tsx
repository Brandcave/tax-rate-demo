'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { TaxRateForm } from '@/components/tax-rate-form';
import { TaxRate, TaxRateFormData } from '@/types/tax-rate';
import { Plus, Edit, Trash2 } from 'lucide-react';

interface TaxManagementPaneProps {
  taxRates: TaxRate[];
  onCreateTaxRate: (data: TaxRateFormData) => void;
  onUpdateTaxRate: (id: string, data: TaxRateFormData) => void;
  onDeleteTaxRate: (id: string) => void;
}

export function TaxManagementPane({
  taxRates,
  onCreateTaxRate,
  onUpdateTaxRate,
  onDeleteTaxRate,
}: TaxManagementPaneProps) {
  const [selectedTaxRate, setSelectedTaxRate] = useState<TaxRate | undefined>();
  const [showForm, setShowForm] = useState(false);

  const handleCreateTaxRate = (data: TaxRateFormData) => {
    onCreateTaxRate(data);
    setShowForm(false);
  };

  const handleUpdateTaxRate = (data: TaxRateFormData) => {
    if (!selectedTaxRate) return;
    onUpdateTaxRate(selectedTaxRate.id, data);
    setShowForm(false);
    setSelectedTaxRate(undefined);
  };

  const handleEditTaxRate = (taxRate: TaxRate) => {
    setSelectedTaxRate(taxRate);
    setShowForm(true);
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setSelectedTaxRate(undefined);
  };

  const handleOpenCreateForm = () => {
    setSelectedTaxRate(undefined);
    setShowForm(true);
  };

  const formatRate = (rate: number) => {
    return `${(rate * 100).toFixed(2)}%`;
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(new Date(date));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Manage Tax Rates</h2>
          <p className="text-gray-600">Create and organize your tax rates</p>
        </div>
        <Button onClick={handleOpenCreateForm}>
          <Plus className="h-4 w-4 mr-2" />
          Add Tax Rate
        </Button>
      </div>

      {/* Tax Rates Table */}
      <Card>
        <CardHeader>
          <CardTitle>Tax Rates ({taxRates.length})</CardTitle>
          <CardDescription>
            All your configured tax rates
          </CardDescription>
        </CardHeader>
        <CardContent>
          {taxRates.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <Plus className="h-12 w-12 mx-auto mb-4 opacity-50" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No tax rates yet</h3>
              <p className="text-gray-500 mb-4">Create your first tax rate to get started.</p>
              <Button onClick={handleOpenCreateForm}>
                <Plus className="h-4 w-4 mr-2" />
                Create Tax Rate
              </Button>
            </div>
          ) : (
            <div className="overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Rate</TableHead>
                    <TableHead>Region</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {taxRates.map((taxRate) => (
                    <TableRow key={taxRate.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{taxRate.name}</div>
                          {taxRate.description && (
                            <div className="text-sm text-gray-500">{taxRate.description}</div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="font-mono">{formatRate(taxRate.rate)}</TableCell>
                      <TableCell>{taxRate.region}</TableCell>
                      <TableCell className="capitalize">{taxRate.category}</TableCell>
                      <TableCell>
                        <span
                          className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            taxRate.isActive
                              ? 'bg-green-100 text-green-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {taxRate.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEditTaxRate(taxRate)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="outline" size="sm">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Delete Tax Rate</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to delete &quot;{taxRate.name}&quot;? This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={() => onDeleteTaxRate(taxRate.id)}>
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>



      {/* Form Dialog */}
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {selectedTaxRate ? 'Edit Tax Rate' : 'Create New Tax Rate'}
            </DialogTitle>
          </DialogHeader>
          <TaxRateForm
            taxRate={selectedTaxRate}
            onSubmit={selectedTaxRate ? handleUpdateTaxRate : handleCreateTaxRate}
            onCancel={handleCancelForm}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}