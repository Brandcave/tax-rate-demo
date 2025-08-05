'use client';

import { TaxRate } from '@/types/tax-rate';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Edit, Trash2 } from 'lucide-react';

interface TaxRateTableProps {
  taxRates: TaxRate[];
  onEdit: (taxRate: TaxRate) => void;
  onDelete: (id: string) => void;
}

export function TaxRateTable({ taxRates, onEdit, onDelete }: TaxRateTableProps) {
  const formatRate = (rate: number) => {
    const percentage = rate * 100;
    // Show up to 3 decimal places, but remove trailing zeros
    return `${parseFloat(percentage.toFixed(3))}%`;
  };



  return (
    <Card>
      <CardHeader>
        <CardTitle>Tax Rates</CardTitle>
        <CardDescription>
          Manage your tax rates. You can create, edit, and delete tax rates as needed.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {taxRates.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No tax rates found. Create your first tax rate to get started.
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Rate</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
              {taxRates.map((taxRate) => (
                <TableRow key={taxRate.id}>
                  <TableCell className="font-medium">
                    {taxRate.name}
                  </TableCell>
                  <TableCell className="font-mono text-lg">{formatRate(taxRate.rate)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onEdit(taxRate)}
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
                            <AlertDialogAction onClick={() => onDelete(taxRate.id)}>
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
        )}
      </CardContent>
    </Card>
  );
}