
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Plus, Edit, Trash2, UserCheck, DollarSign } from 'lucide-react';
import axios from 'axios';

const API_BASE_URL = 'https://myschool-official-server-6t886153c.vercel.app';

interface CustomStudentFee {
  studentId: string;
  feeId: string;
  newAmount: number;
  effectiveFrom: string;
  active: boolean;
  reason: string;
}

const CustomStudentFees = () => {
  const [customFees, setCustomFees] = useState<CustomStudentFee[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingFee, setEditingFee] = useState<CustomStudentFee | null>(null);
  const [formData, setFormData] = useState({
    studentId: '',
    feeId: '',
    newAmount: 0,
    effectiveFrom: '',
    active: true,
    reason: ''
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchCustomFees();
  }, []);

  const fetchCustomFees = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/custom-student-fees`);
      setCustomFees(response.data.customFees || []);
    } catch (error) {
      console.error('Error fetching custom fees:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch custom student fees"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.studentId || !formData.feeId || !formData.newAmount || !formData.effectiveFrom) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please fill all required fields"
      });
      return;
    }

    try {
      if (editingFee) {
        await axios.put(`${API_BASE_URL}/custom-student-fees/${editingFee.studentId}/${editingFee.feeId}`, formData);
        toast({
          title: "Success",
          description: "Custom fee updated successfully"
        });
      } else {
        await axios.post(`${API_BASE_URL}/custom-student-fees`, formData);
        toast({
          title: "Success",
          description: "Custom fee created successfully"
        });
      }
      
      await fetchCustomFees();
      resetForm();
      setIsDialogOpen(false);
    } catch (error) {
      console.error('Error saving custom fee:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save custom fee"
      });
    }
  };

  const handleEdit = (fee: CustomStudentFee) => {
    setEditingFee(fee);
    setFormData({
      studentId: fee.studentId,
      feeId: fee.feeId,
      newAmount: fee.newAmount,
      effectiveFrom: fee.effectiveFrom,
      active: fee.active,
      reason: fee.reason
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (studentId: string, feeId: string) => {
    if (!confirm('Are you sure you want to delete this custom fee?')) return;

    try {
      await axios.delete(`${API_BASE_URL}/custom-student-fees/${studentId}/${feeId}`);
      toast({
        title: "Success",
        description: "Custom fee deleted successfully"
      });
      await fetchCustomFees();
    } catch (error) {
      console.error('Error deleting custom fee:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete custom fee"
      });
    }
  };

  const resetForm = () => {
    setFormData({
      studentId: '',
      feeId: '',
      newAmount: 0,
      effectiveFrom: '',
      active: true,
      reason: ''
    });
    setEditingFee(null);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 space-y-6"
    >
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Custom Student Fees</h1>
          <p className="text-gray-600">Manage custom fee overrides for individual students</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="h-4 w-4 mr-2" />
              Add Custom Fee
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingFee ? 'Edit Custom Fee' : 'Add Custom Fee'}
              </DialogTitle>
            </DialogHeader>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="studentId">Student ID</Label>
                  <Input
                    id="studentId"
                    value={formData.studentId}
                    onChange={(e) => setFormData(prev => ({ ...prev, studentId: e.target.value }))}
                    placeholder="Enter student ID"
                    disabled={!!editingFee}
                  />
                </div>
                
                <div>
                  <Label htmlFor="feeId">Fee ID</Label>
                  <Input
                    id="feeId"
                    value={formData.feeId}
                    onChange={(e) => setFormData(prev => ({ ...prev, feeId: e.target.value }))}
                    placeholder="Enter fee ID"
                    disabled={!!editingFee}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="newAmount">New Amount</Label>
                  <Input
                    id="newAmount"
                    type="number"
                    value={formData.newAmount}
                    onChange={(e) => setFormData(prev => ({ ...prev, newAmount: parseFloat(e.target.value) || 0 }))}
                    placeholder="Enter new amount"
                  />
                </div>
                
                <div>
                  <Label htmlFor="effectiveFrom">Effective From</Label>
                  <Input
                    id="effectiveFrom"
                    type="date"
                    value={formData.effectiveFrom}
                    onChange={(e) => setFormData(prev => ({ ...prev, effectiveFrom: e.target.value }))}
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="reason">Reason</Label>
                <Textarea
                  id="reason"
                  value={formData.reason}
                  onChange={(e) => setFormData(prev => ({ ...prev, reason: e.target.value }))}
                  placeholder="Enter reason for custom fee"
                  rows={3}
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="active"
                  checked={formData.active}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, active: !!checked }))}
                />
                <Label htmlFor="active">Active</Label>
              </div>
              
              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  {editingFee ? 'Update' : 'Create'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <UserCheck className="h-5 w-5 mr-2" />
            Custom Student Fees
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-4">Loading...</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student ID</TableHead>
                  <TableHead>Fee ID</TableHead>
                  <TableHead>New Amount</TableHead>
                  <TableHead>Effective From</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Reason</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {customFees.map((fee) => (
                  <TableRow key={`${fee.studentId}-${fee.feeId}`}>
                    <TableCell className="font-medium">{fee.studentId}</TableCell>
                    <TableCell>{fee.feeId}</TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <DollarSign className="h-4 w-4 mr-1" />
                        ৳{fee.newAmount}
                      </div>
                    </TableCell>
                    <TableCell>{fee.effectiveFrom}</TableCell>
                    <TableCell>
                      {fee.active ? (
                        <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">Active</span>
                      ) : (
                        <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-xs">Inactive</span>
                      )}
                    </TableCell>
                    <TableCell className="max-w-xs truncate">{fee.reason}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(fee)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDelete(fee.studentId, fee.feeId)}
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

export default CustomStudentFees;
