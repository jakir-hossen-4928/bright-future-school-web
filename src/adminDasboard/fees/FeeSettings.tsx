
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { Plus, Edit, Trash2, Settings, Calendar } from 'lucide-react';
import axios from 'axios';

const API_BASE_URL = 'https://myschool-official-server-6t886153c.vercel.app';

interface FeeSetting {
  feeId: string;
  feeType: string;
  classes: string[];
  description: string;
  amount: number;
  activeFrom: string;
  activeTo: string;
  canOverride: boolean;
}

const FeeSettings = () => {
  const [feeSettings, setFeeSettings] = useState<FeeSetting[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingSetting, setEditingSetting] = useState<FeeSetting | null>(null);
  const [formData, setFormData] = useState({
    feeType: '',
    classes: [] as string[],
    description: '',
    amount: 0,
    activeFrom: '',
    activeTo: '',
    canOverride: false
  });
  const { toast } = useToast();

  const classes = ['Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5', 'Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10'];
  const feeTypes = ['Monthly Fee', 'Admission Fee', 'Exam Fee', 'Sports Fee', 'Library Fee', 'Transport Fee'];

  useEffect(() => {
    fetchFeeSettings();
  }, []);

  const fetchFeeSettings = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/fee-settings`);
      setFeeSettings(response.data.feeSettings || []);
    } catch (error) {
      console.error('Error fetching fee settings:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch fee settings"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.feeType || !formData.description || !formData.amount || formData.classes.length === 0) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please fill all required fields"
      });
      return;
    }

    try {
      if (editingSetting) {
        await axios.put(`${API_BASE_URL}/fee-settings/${editingSetting.feeId}`, formData);
        toast({
          title: "Success",
          description: "Fee setting updated successfully"
        });
      } else {
        await axios.post(`${API_BASE_URL}/fee-settings`, formData);
        toast({
          title: "Success",
          description: "Fee setting created successfully"
        });
      }
      
      await fetchFeeSettings();
      resetForm();
      setIsDialogOpen(false);
    } catch (error) {
      console.error('Error saving fee setting:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save fee setting"
      });
    }
  };

  const handleEdit = (setting: FeeSetting) => {
    setEditingSetting(setting);
    setFormData({
      feeType: setting.feeType,
      classes: setting.classes,
      description: setting.description,
      amount: setting.amount,
      activeFrom: setting.activeFrom,
      activeTo: setting.activeTo,
      canOverride: setting.canOverride
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (feeId: string) => {
    if (!confirm('Are you sure you want to delete this fee setting?')) return;

    try {
      await axios.delete(`${API_BASE_URL}/fee-settings/${feeId}`);
      toast({
        title: "Success",
        description: "Fee setting deleted successfully"
      });
      await fetchFeeSettings();
    } catch (error) {
      console.error('Error deleting fee setting:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete fee setting"
      });
    }
  };

  const resetForm = () => {
    setFormData({
      feeType: '',
      classes: [],
      description: '',
      amount: 0,
      activeFrom: '',
      activeTo: '',
      canOverride: false
    });
    setEditingSetting(null);
  };

  const toggleClass = (className: string) => {
    setFormData(prev => ({
      ...prev,
      classes: prev.classes.includes(className)
        ? prev.classes.filter(c => c !== className)
        : [...prev.classes, className]
    }));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 space-y-6"
    >
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Fee Settings</h1>
          <p className="text-gray-600">Configure fee structures for different classes</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="h-4 w-4 mr-2" />
              Add Fee Setting
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingSetting ? 'Edit Fee Setting' : 'Add Fee Setting'}
              </DialogTitle>
            </DialogHeader>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="feeType">Fee Type</Label>
                  <Select value={formData.feeType} onValueChange={(value) => setFormData(prev => ({ ...prev, feeType: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select fee type" />
                    </SelectTrigger>
                    <SelectContent>
                      {feeTypes.map(type => (
                        <SelectItem key={type} value={type}>{type}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="amount">Amount</Label>
                  <Input
                    id="amount"
                    type="number"
                    value={formData.amount}
                    onChange={(e) => setFormData(prev => ({ ...prev, amount: parseFloat(e.target.value) || 0 }))}
                    placeholder="Enter amount"
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Enter description"
                />
              </div>
              
              <div>
                <Label>Applicable Classes</Label>
                <div className="grid grid-cols-5 gap-2 mt-2">
                  {classes.map(className => (
                    <label key={className} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={formData.classes.includes(className)}
                        onChange={() => toggleClass(className)}
                        className="rounded"
                      />
                      <span className="text-sm">{className}</span>
                    </label>
                  ))}
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="activeFrom">Active From</Label>
                  <Input
                    id="activeFrom"
                    type="date"
                    value={formData.activeFrom}
                    onChange={(e) => setFormData(prev => ({ ...prev, activeFrom: e.target.value }))}
                  />
                </div>
                
                <div>
                  <Label htmlFor="activeTo">Active To</Label>
                  <Input
                    id="activeTo"
                    type="date"
                    value={formData.activeTo}
                    onChange={(e) => setFormData(prev => ({ ...prev, activeTo: e.target.value }))}
                  />
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="canOverride"
                  checked={formData.canOverride}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, canOverride: !!checked }))}
                />
                <Label htmlFor="canOverride">Can be overridden for individual students</Label>
              </div>
              
              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  {editingSetting ? 'Update' : 'Create'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Settings className="h-5 w-5 mr-2" />
            Fee Settings
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-4">Loading...</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Fee Type</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Classes</TableHead>
                  <TableHead>Active Period</TableHead>
                  <TableHead>Override</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {feeSettings.map((setting) => (
                  <TableRow key={setting.feeId}>
                    <TableCell className="font-medium">{setting.feeType}</TableCell>
                    <TableCell>{setting.description}</TableCell>
                    <TableCell>৳{setting.amount}</TableCell>
                    <TableCell>{setting.classes.join(', ')}</TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        {setting.activeFrom} - {setting.activeTo}
                      </div>
                    </TableCell>
                    <TableCell>
                      {setting.canOverride ? (
                        <span className="text-green-600">Yes</span>
                      ) : (
                        <span className="text-red-600">No</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(setting)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDelete(setting.feeId)}
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

export default FeeSettings;
