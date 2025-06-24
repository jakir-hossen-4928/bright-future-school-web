
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Plus, Edit, Trash2, Receipt, Search, Filter } from 'lucide-react';
import axios from 'axios';

const API_BASE_URL = 'https://myschool-official-server-6t886153c.vercel.app';

interface FeeCollection {
  collectionId: string;
  date: string;
  studentId: string;
  feeId: string;
  month: string;
  year: string;
  quantity: number;
  amountPaid: number;
  paymentMethod: string;
  description: string;
}

const FeeCollection = () => {
  const [collections, setCollections] = useState<FeeCollection[]>([]);
  const [filteredCollections, setFilteredCollections] = useState<FeeCollection[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCollection, setEditingCollection] = useState<FeeCollection | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [monthFilter, setMonthFilter] = useState('');
  const [yearFilter, setYearFilter] = useState('');
  const [paymentMethodFilter, setPaymentMethodFilter] = useState('');
  const [formData, setFormData] = useState({
    date: '',
    studentId: '',
    feeId: '',
    month: '',
    year: new Date().getFullYear().toString(),
    quantity: 1,
    amountPaid: 0,
    paymentMethod: '',
    description: ''
  });
  const { toast } = useToast();

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  const paymentMethods = ['Cash', 'Bank Transfer', 'Mobile Banking', 'Card Payment', 'Cheque'];
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => (currentYear - 2 + i).toString());

  useEffect(() => {
    fetchCollections();
  }, []);

  useEffect(() => {
    filterCollections();
  }, [collections, searchTerm, monthFilter, yearFilter, paymentMethodFilter]);

  const fetchCollections = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/fee-collections`);
      setCollections(response.data.collections || []);
    } catch (error) {
      console.error('Error fetching collections:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch fee collections"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const filterCollections = () => {
    let filtered = collections;

    if (searchTerm) {
      filtered = filtered.filter(collection => 
        collection.studentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        collection.feeId.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (monthFilter) {
      filtered = filtered.filter(collection => collection.month === monthFilter);
    }

    if (yearFilter) {
      filtered = filtered.filter(collection => collection.year === yearFilter);
    }

    if (paymentMethodFilter) {
      filtered = filtered.filter(collection => collection.paymentMethod === paymentMethodFilter);
    }

    setFilteredCollections(filtered);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.date || !formData.studentId || !formData.feeId || !formData.amountPaid || !formData.paymentMethod) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please fill all required fields"
      });
      return;
    }

    try {
      if (editingCollection) {
        await axios.put(`${API_BASE_URL}/fee-collections/${editingCollection.collectionId}`, formData);
        toast({
          title: "Success",
          description: "Fee collection updated successfully"
        });
      } else {
        await axios.post(`${API_BASE_URL}/fee-collections`, formData);
        toast({
          title: "Success",
          description: "Fee collection created successfully"
        });
      }
      
      await fetchCollections();
      resetForm();
      setIsDialogOpen(false);
    } catch (error) {
      console.error('Error saving collection:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save fee collection"
      });
    }
  };

  const handleEdit = (collection: FeeCollection) => {
    setEditingCollection(collection);
    setFormData({
      date: collection.date,
      studentId: collection.studentId,
      feeId: collection.feeId,
      month: collection.month,
      year: collection.year,
      quantity: collection.quantity,
      amountPaid: collection.amountPaid,
      paymentMethod: collection.paymentMethod,
      description: collection.description
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (collectionId: string) => {
    if (!confirm('Are you sure you want to delete this fee collection?')) return;

    try {
      await axios.delete(`${API_BASE_URL}/fee-collections/${collectionId}`);
      toast({
        title: "Success",
        description: "Fee collection deleted successfully"
      });
      await fetchCollections();
    } catch (error) {
      console.error('Error deleting collection:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete fee collection"
      });
    }
  };

  const resetForm = () => {
    setFormData({
      date: '',
      studentId: '',
      feeId: '',
      month: '',
      year: new Date().getFullYear().toString(),
      quantity: 1,
      amountPaid: 0,
      paymentMethod: '',
      description: ''
    });
    setEditingCollection(null);
  };

  const getTotalAmount = () => {
    return filteredCollections.reduce((sum, collection) => sum + collection.amountPaid, 0);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 space-y-6"
    >
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Fee Collection</h1>
          <p className="text-gray-600">Manage student fee payments and records</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="h-4 w-4 mr-2" />
              Add Collection
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingCollection ? 'Edit Fee Collection' : 'Add Fee Collection'}
              </DialogTitle>
            </DialogHeader>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="date">Date</Label>
                  <Input
                    id="date"
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                  />
                </div>
                
                <div>
                  <Label htmlFor="studentId">Student ID</Label>
                  <Input
                    id="studentId"
                    value={formData.studentId}
                    onChange={(e) => setFormData(prev => ({ ...prev, studentId: e.target.value }))}
                    placeholder="Enter student ID"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="feeId">Fee ID</Label>
                  <Input
                    id="feeId"
                    value={formData.feeId}
                    onChange={(e) => setFormData(prev => ({ ...prev, feeId: e.target.value }))}
                    placeholder="Enter fee ID"
                  />
                </div>
                
                <div>
                  <Label htmlFor="paymentMethod">Payment Method</Label>
                  <Select value={formData.paymentMethod} onValueChange={(value) => setFormData(prev => ({ ...prev, paymentMethod: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select payment method" />
                    </SelectTrigger>
                    <SelectContent>
                      {paymentMethods.map(method => (
                        <SelectItem key={method} value={method}>{method}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="month">Month</Label>
                  <Select value={formData.month} onValueChange={(value) => setFormData(prev => ({ ...prev, month: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select month" />
                    </SelectTrigger>
                    <SelectContent>
                      {months.map(month => (
                        <SelectItem key={month} value={month}>{month}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="year">Year</Label>
                  <Select value={formData.year} onValueChange={(value) => setFormData(prev => ({ ...prev, year: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select year" />
                    </SelectTrigger>
                    <SelectContent>
                      {years.map(year => (
                        <SelectItem key={year} value={year}>{year}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="quantity">Quantity</Label>
                  <Input
                    id="quantity"
                    type="number"
                    value={formData.quantity}
                    onChange={(e) => setFormData(prev => ({ ...prev, quantity: parseInt(e.target.value) || 1 }))}
                    min="1"
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="amountPaid">Amount Paid</Label>
                <Input
                  id="amountPaid"
                  type="number"
                  value={formData.amountPaid}
                  onChange={(e) => setFormData(prev => ({ ...prev, amountPaid: parseFloat(e.target.value) || 0 }))}
                  placeholder="Enter amount paid"
                />
              </div>
              
              <div>
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Enter description (optional)"
                />
              </div>
              
              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  {editingCollection ? 'Update' : 'Create'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <Receipt className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Collections</p>
                <p className="text-2xl font-bold">{filteredCollections.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <Receipt className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Amount</p>
                <p className="text-2xl font-bold">৳{getTotalAmount().toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Receipt className="h-5 w-5 mr-2" />
            Fee Collections
          </CardTitle>
          <div className="flex flex-wrap gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search by student/fee ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-64"
              />
            </div>
            <Select value={monthFilter} onValueChange={setMonthFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Filter by month" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Months</SelectItem>
                {months.map(month => (
                  <SelectItem key={month} value={month}>{month}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={yearFilter} onValueChange={setYearFilter}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Filter by year" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Years</SelectItem>
                {years.map(year => (
                  <SelectItem key={year} value={year}>{year}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={paymentMethodFilter} onValueChange={setPaymentMethodFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Payment method" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Methods</SelectItem>
                {paymentMethods.map(method => (
                  <SelectItem key={method} value={method}>{method}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-4">Loading...</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Student ID</TableHead>
                  <TableHead>Fee ID</TableHead>
                  <TableHead>Month/Year</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Payment Method</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCollections.map((collection) => (
                  <TableRow key={collection.collectionId}>
                    <TableCell>{collection.date}</TableCell>
                    <TableCell className="font-medium">{collection.studentId}</TableCell>
                    <TableCell>{collection.feeId}</TableCell>
                    <TableCell>{collection.month} {collection.year}</TableCell>
                    <TableCell>৳{collection.amountPaid}</TableCell>
                    <TableCell>{collection.paymentMethod}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(collection)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDelete(collection.collectionId)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default FeeCollection;
