
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import Layout from '../components/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Plus, Edit, Award, TrendingUp, TrendingDown } from 'lucide-react';
import { apiClient } from '../utils/api';

const Grades = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClass, setSelectedClass] = useState<string>('');
  const [selectedSubject, setSelectedSubject] = useState<string>('');

  const { data: grades, isLoading } = useQuery({
    queryKey: ['grades', selectedClass, selectedSubject],
    queryFn: () => apiClient.get(`/api/grades?class=${selectedClass}&subject=${selectedSubject}`),
  });

  console.log('Grades data:', grades);

  // Mock data for demonstration
  const mockGrades = [
    {
      id: 1,
      studentName: "Alice Johnson",
      studentId: "STU001",
      class: "10-A",
      subject: "Mathematics",
      assignment: "Midterm Exam",
      grade: 92,
      maxGrade: 100,
      percentage: 92,
      letterGrade: "A",
      date: "2024-01-15",
      trend: "up"
    },
    {
      id: 2,
      studentName: "Bob Smith",
      studentId: "STU002",
      class: "10-A",
      subject: "Mathematics",
      assignment: "Midterm Exam",
      grade: 78,
      maxGrade: 100,
      percentage: 78,
      letterGrade: "B+",
      date: "2024-01-15",
      trend: "stable"
    },
    {
      id: 3,
      studentName: "Carol Brown",
      studentId: "STU003",
      class: "10-A",
      subject: "Mathematics",
      assignment: "Midterm Exam",
      grade: 85,
      maxGrade: 100,
      percentage: 85,
      letterGrade: "B",
      date: "2024-01-15",
      trend: "up"
    },
  ];

  const gradesData = grades || mockGrades;

  const filteredGrades = gradesData.filter((grade: any) =>
    grade.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    grade.studentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    grade.subject.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getGradeColor = (percentage: number) => {
    if (percentage >= 90) return 'bg-green-100 text-green-800';
    if (percentage >= 80) return 'bg-blue-100 text-blue-800';
    if (percentage >= 70) return 'bg-yellow-100 text-yellow-800';
    if (percentage >= 60) return 'bg-orange-100 text-orange-800';
    return 'bg-red-100 text-red-800';
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="h-4 w-4 text-green-600" />;
      case 'down':
        return <TrendingDown className="h-4 w-4 text-red-600" />;
      default:
        return null;
    }
  };

  const gradeStats = {
    average: Math.round(filteredGrades.reduce((sum: number, grade: any) => sum + grade.percentage, 0) / filteredGrades.length || 0),
    highest: Math.max(...filteredGrades.map((grade: any) => grade.percentage), 0),
    lowest: Math.min(...filteredGrades.map((grade: any) => grade.percentage), 0),
    total: filteredGrades.length
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Grades</h1>
            <p className="text-gray-600">Manage student grades and assessments</p>
          </div>
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Plus className="h-4 w-4 mr-2" />
            Add Grade
          </Button>
        </div>

        {/* Search and Filters */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search by student name, ID, or subject..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={selectedClass} onValueChange={setSelectedClass}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Select Class" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10-A">Class 10-A</SelectItem>
                  <SelectItem value="10-B">Class 10-B</SelectItem>
                  <SelectItem value="11-A">Class 11-A</SelectItem>
                  <SelectItem value="11-B">Class 11-B</SelectItem>
                </SelectContent>
              </Select>
              <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Select Subject" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Mathematics">Mathematics</SelectItem>
                  <SelectItem value="English">English</SelectItem>
                  <SelectItem value="Science">Science</SelectItem>
                  <SelectItem value="History">History</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Grade Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-blue-600">{gradeStats.average}%</div>
              <p className="text-xs text-gray-500 uppercase tracking-wide">Class Average</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-green-600">{gradeStats.highest}%</div>
              <p className="text-xs text-gray-500 uppercase tracking-wide">Highest Grade</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-red-600">{gradeStats.lowest}%</div>
              <p className="text-xs text-gray-500 uppercase tracking-wide">Lowest Grade</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-purple-600">{gradeStats.total}</div>
              <p className="text-xs text-gray-500 uppercase tracking-wide">Total Grades</p>
            </CardContent>
          </Card>
        </div>

        {/* Grades List */}
        <Card>
          <CardHeader>
            <CardTitle>Grade Records</CardTitle>
            <CardDescription>
              Recent grades and assessments
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8">Loading grades...</div>
            ) : filteredGrades.length > 0 ? (
              <div className="space-y-4">
                {filteredGrades.map((grade: any) => (
                  <div
                    key={grade.id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <Award className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium">{grade.studentName}</p>
                        <p className="text-sm text-gray-500">{grade.studentId} • {grade.class}</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-6">
                      <div>
                        <p className="text-sm font-medium">{grade.subject}</p>
                        <p className="text-sm text-gray-500">{grade.assignment}</p>
                      </div>

                      <div className="text-center">
                        <div className="flex items-center space-x-2">
                          <Badge className={getGradeColor(grade.percentage)}>
                            {grade.letterGrade}
                          </Badge>
                          {getTrendIcon(grade.trend)}
                        </div>
                        <p className="text-sm text-gray-500 mt-1">
                          {grade.grade}/{grade.maxGrade} ({grade.percentage}%)
                        </p>
                      </div>

                      <div className="text-right">
                        <p className="text-sm text-gray-500">{grade.date}</p>
                        <Button size="sm" variant="outline" className="mt-2">
                          <Edit className="h-4 w-4 mr-1" />
                          Edit
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Award className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No grades found</h3>
                <p className="text-gray-600">No grade records found for the selected filters.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Grades;
