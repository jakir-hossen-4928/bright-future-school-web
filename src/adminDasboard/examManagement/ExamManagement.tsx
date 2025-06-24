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
import { Plus, Edit, Trash2, BookOpen } from 'lucide-react';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || 'https://myschool-official-server-6t886153c.vercel.app';

interface ExamConfig {
  id: string;
  class: string;
  exam: string;
  subjects: string[];
}

const ExamManagement = () => {
  const [examConfigs, setExamConfigs] = useState<ExamConfig[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingConfig, setEditingConfig] = useState<ExamConfig | null>(null);
  const [formData, setFormData] = useState({
    class: '',
    exam: '',
    subjects: [] as string[]
  });
  const { toast } = useToast();

  const classes = ['Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5', 'Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10'];
  const examTypes = ['First Term', 'Mid Term', 'Final Term', 'Unit Test'];
  const subjectsList = ['Mathematics', 'English', 'Science', 'Social Studies', 'Bangla', 'Religion', 'Physical Education'];

  useEffect(() => {
    fetchExamConfigs();
  }, []);

  const fetchExamConfigs = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/exam-configs`);
      setExamConfigs(response.data.configs || []);
    } catch (error) {
      console.error('Error fetching exam configs:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch exam configurations"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.class || !formData.exam || formData.subjects.length === 0) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please fill all required fields"
      });
      return;
    }

    try {
      if (editingConfig) {
        await axios.put(`${API_BASE_URL}/exam-configs/${editingConfig.id}`, formData);
        toast({
          title: "Success",
          description: "Exam configuration updated successfully"
        });
      } else {
        await axios.post(`${API_BASE_URL}/exam-configs`, formData);
        toast({
          title: "Success",
          description: "Exam configuration created successfully"
        });
      }
      
      await fetchExamConfigs();
      resetForm();
      setIsDialogOpen(false);
    } catch (error) {
      console.error('Error saving exam config:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save exam configuration"
      });
    }
  };

  const handleEdit = (config: ExamConfig) => {
    setEditingConfig(config);
    setFormData({
      class: config.class,
      exam: config.exam,
      subjects: config.subjects
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this exam configuration?')) return;

    try {
      await axios.delete(`${API_BASE_URL}/exam-configs/${id}`);
      toast({
        title: "Success",
        description: "Exam configuration deleted successfully"
      });
      await fetchExamConfigs();
    } catch (error) {
      console.error('Error deleting exam config:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete exam configuration"
      });
    }
  };

  const resetForm = () => {
    setFormData({ class: '', exam: '', subjects: [] });
    setEditingConfig(null);
  };

  const toggleSubject = (subject: string) => {
    setFormData(prev => ({
      ...prev,
      subjects: prev.subjects.includes(subject)
        ? prev.subjects.filter(s => s !== subject)
        : [...prev.subjects, subject]
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
          <h1 className="text-2xl font-bold text-gray-900">Exam Management</h1>
          <p className="text-gray-600">Configure exams and subjects for different classes</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="h-4 w-4 mr-2" />
              Add Exam Config
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingConfig ? 'Edit Exam Configuration' : 'Add Exam Configuration'}
              </DialogTitle>
            </DialogHeader>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="class">Class</Label>
                  <Select value={formData.class} onValueChange={(value) => setFormData(prev => ({ ...prev, class: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select class" />
                    </SelectTrigger>
                    <SelectContent>
                      {classes.map(cls => (
                        <SelectItem key={cls} value={cls}>{cls}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="exam">Exam Type</Label>
                  <Select value={formData.exam} onValueChange={(value) => setFormData(prev => ({ ...prev, exam: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select exam type" />
                    </SelectTrigger>
                    <SelectContent>
                      {examTypes.map(exam => (
                        <SelectItem key={exam} value={exam}>{exam}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div>
                <Label>Subjects</Label>
                <div className="grid grid-cols-3 gap-2 mt-2">
                  {subjectsList.map(subject => (
                    <label key={subject} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={formData.subjects.includes(subject)}
                        onChange={() => toggleSubject(subject)}
                        className="rounded"
                      />
                      <span className="text-sm">{subject}</span>
                    </label>
                  ))}
                </div>
              </div>
              
              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  {editingConfig ? 'Update' : 'Create'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <BookOpen className="h-5 w-5 mr-2" />
            Exam Configurations
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-4">Loading...</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Class</TableHead>
                  <TableHead>Exam</TableHead>
                  <TableHead>Subjects</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {examConfigs.map((config) => (
                  <TableRow key={config.id}>
                    <TableCell className="font-medium">{config.class}</TableCell>
                    <TableCell>{config.exam}</TableCell>
                    <TableCell>{config.subjects.join(', ')}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(config)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDelete(config.id)}
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

export default ExamManagement;
