
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
import { Plus, Edit, Trash2, Trophy, Search } from 'lucide-react';
import axios from 'axios';

const API_BASE_URL = 'https://myschool-official-server-6t886153c.vercel.app';

interface Result {
  id: string;
  studentId: string;
  studentName: string;
  class: string;
  exam: string;
  subjects: Record<string, number>;
  total: string;
  rank: string;
}

const SchoolResult = () => {
  const [results, setResults] = useState<Result[]>([]);
  const [filteredResults, setFilteredResults] = useState<Result[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingResult, setEditingResult] = useState<Result | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [classFilter, setClassFilter] = useState('');
  const [examFilter, setExamFilter] = useState('');
  const [formData, setFormData] = useState({
    studentId: '',
    studentName: '',
    class: '',
    exam: '',
    subjects: {} as Record<string, number>,
    total: '',
    rank: ''
  });
  const { toast } = useToast();

  const classes = ['Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5', 'Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10'];
  const examTypes = ['First Term', 'Mid Term', 'Final Term', 'Unit Test'];
  const subjectsList = ['Mathematics', 'English', 'Science', 'Social Studies', 'Bangla', 'Religion'];

  useEffect(() => {
    fetchResults();
  }, []);

  useEffect(() => {
    filterResults();
  }, [results, searchTerm, classFilter, examFilter]);

  const fetchResults = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/results`);
      setResults(response.data.results || []);
    } catch (error) {
      console.error('Error fetching results:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch results"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const filterResults = () => {
    let filtered = results;

    if (searchTerm) {
      filtered = filtered.filter(result => 
        result.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        result.studentId.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (classFilter) {
      filtered = filtered.filter(result => result.class === classFilter);
    }

    if (examFilter) {
      filtered = filtered.filter(result => result.exam === examFilter);
    }

    setFilteredResults(filtered);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.studentId || !formData.studentName || !formData.class || !formData.exam) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please fill all required fields"
      });
      return;
    }

    try {
      if (editingResult) {
        await axios.put(`${API_BASE_URL}/results/${editingResult.id}`, formData);
        toast({
          title: "Success",
          description: "Result updated successfully"
        });
      } else {
        await axios.post(`${API_BASE_URL}/results`, formData);
        toast({
          title: "Success",
          description: "Result created successfully"
        });
      }
      
      await fetchResults();
      resetForm();
      setIsDialogOpen(false);
    } catch (error) {
      console.error('Error saving result:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save result"
      });
    }
  };

  const handleEdit = (result: Result) => {
    setEditingResult(result);
    setFormData({
      studentId: result.studentId,
      studentName: result.studentName,
      class: result.class,
      exam: result.exam,
      subjects: result.subjects,
      total: result.total,
      rank: result.rank
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this result?')) return;

    try {
      await axios.delete(`${API_BASE_URL}/results/${id}`);
      toast({
        title: "Success",
        description: "Result deleted successfully"
      });
      await fetchResults();
    } catch (error) {
      console.error('Error deleting result:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete result"
      });
    }
  };

  const resetForm = () => {
    setFormData({ 
      studentId: '', 
      studentName: '', 
      class: '', 
      exam: '', 
      subjects: {}, 
      total: '', 
      rank: '' 
    });
    setEditingResult(null);
  };

  const updateSubjectMark = (subject: string, mark: number) => {
    setFormData(prev => ({
      ...prev,
      subjects: { ...prev.subjects, [subject]: mark }
    }));
  };

  const calculateTotal = () => {
    const total = Object.values(formData.subjects).reduce((sum, mark) => sum + (mark || 0), 0);
    setFormData(prev => ({ ...prev, total: total.toString() }));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 space-y-6"
    >
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">School Results</h1>
          <p className="text-gray-600">Manage student exam results and rankings</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="h-4 w-4 mr-2" />
              Add Result
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>
                {editingResult ? 'Edit Result' : 'Add Result'}
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
                  />
                </div>
                
                <div>
                  <Label htmlFor="studentName">Student Name</Label>
                  <Input
                    id="studentName"
                    value={formData.studentName}
                    onChange={(e) => setFormData(prev => ({ ...prev, studentName: e.target.value }))}
                    placeholder="Enter student name"
                  />
                </div>
                
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
                  <Label htmlFor="exam">Exam</Label>
                  <Select value={formData.exam} onValueChange={(value) => setFormData(prev => ({ ...prev, exam: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select exam" />
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
                <Label>Subject Marks</Label>
                <div className="grid grid-cols-3 gap-4 mt-2">
                  {subjectsList.map(subject => (
                    <div key={subject}>
                      <Label className="text-sm">{subject}</Label>
                      <Input
                        type="number"
                        value={formData.subjects[subject] || ''}
                        onChange={(e) => updateSubjectMark(subject, parseFloat(e.target.value) || 0)}
                        placeholder="0"
                        min="0"
                        max="100"
                      />
                    </div>
                  ))}
                </div>
                <Button type="button" onClick={calculateTotal} className="mt-2" variant="outline">
                  Calculate Total
                </Button>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="total">Total Marks</Label>
                  <Input
                    id="total"
                    value={formData.total}
                    onChange={(e) => setFormData(prev => ({ ...prev, total: e.target.value }))}
                    placeholder="Total marks"
                  />
                </div>
                
                <div>
                  <Label htmlFor="rank">Rank</Label>
                  <Input
                    id="rank"
                    value={formData.rank}
                    onChange={(e) => setFormData(prev => ({ ...prev, rank: e.target.value }))}
                    placeholder="Student rank"
                  />
                </div>
              </div>
              
              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  {editingResult ? 'Update' : 'Create'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Trophy className="h-5 w-5 mr-2" />
            Results
          </CardTitle>
          <div className="flex space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search by name or ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={classFilter} onValueChange={setClassFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Filter by class" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Classes</SelectItem>
                {classes.map(cls => (
                  <SelectItem key={cls} value={cls}>{cls}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={examFilter} onValueChange={setExamFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Filter by exam" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Exams</SelectItem>
                {examTypes.map(exam => (
                  <SelectItem key={exam} value={exam}>{exam}</SelectItem>
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
                  <TableHead>Student ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Class</TableHead>
                  <TableHead>Exam</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Rank</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredResults.map((result) => (
                  <TableRow key={result.id}>
                    <TableCell className="font-medium">{result.studentId}</TableCell>
                    <TableCell>{result.studentName}</TableCell>
                    <TableCell>{result.class}</TableCell>
                    <TableCell>{result.exam}</TableCell>
                    <TableCell>{result.total}</TableCell>
                    <TableCell>{result.rank}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(result)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDelete(result.id)}
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

export default SchoolResult;
