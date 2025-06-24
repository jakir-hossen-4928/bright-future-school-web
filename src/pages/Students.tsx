
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import Layout from '../components/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Search, Plus, Edit, Trash2, User } from 'lucide-react';
import { apiClient } from '../utils/api';

const Students = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const { data: students, isLoading } = useQuery({
    queryKey: ['students'],
    queryFn: () => apiClient.get('/api/students'),
  });

  console.log('Students data:', students);

  // Mock data for demonstration
  const mockStudents = [
    {
      id: 1,
      name: "Alice Johnson",
      email: "alice@email.com",
      grade: "10th Grade",
      class: "10-A",
      status: "Active",
      phone: "(555) 123-4567",
      enrollmentDate: "2024-01-15"
    },
    {
      id: 2,
      name: "Bob Smith",
      email: "bob@email.com",
      grade: "11th Grade",
      class: "11-B",
      status: "Active",
      phone: "(555) 234-5678",
      enrollmentDate: "2024-01-20"
    },
    {
      id: 3,
      name: "Carol Brown",
      email: "carol@email.com",
      grade: "9th Grade",
      class: "9-C",
      status: "Inactive",
      phone: "(555) 345-6789",
      enrollmentDate: "2023-09-10"
    },
  ];

  const studentsData = students || mockStudents;

  const filteredStudents = studentsData.filter((student: any) =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.class.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Students</h1>
            <p className="text-gray-600">Manage student information and records</p>
          </div>
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Plus className="h-4 w-4 mr-2" />
            Add Student
          </Button>
        </div>

        {/* Search and Filters */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search students by name, email, or class..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button variant="outline">Filter</Button>
            </div>
          </CardContent>
        </Card>

        {/* Students List */}
        {isLoading ? (
          <div className="text-center py-8">Loading students...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredStudents.map((student: any) => (
              <Card key={student.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <User className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{student.name}</CardTitle>
                        <CardDescription>{student.email}</CardDescription>
                      </div>
                    </div>
                    <Badge variant={student.status === 'Active' ? 'default' : 'secondary'}>
                      {student.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Grade:</span>
                      <span className="text-sm font-medium">{student.grade}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Class:</span>
                      <span className="text-sm font-medium">{student.class}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Phone:</span>
                      <span className="text-sm font-medium">{student.phone}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Enrolled:</span>
                      <span className="text-sm font-medium">{student.enrollmentDate}</span>
                    </div>
                  </div>
                  <div className="flex space-x-2 mt-4">
                    <Button size="sm" variant="outline" className="flex-1">
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                    <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {filteredStudents.length === 0 && !isLoading && (
          <Card>
            <CardContent className="text-center py-8">
              <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No students found</h3>
              <p className="text-gray-600">Try adjusting your search criteria or add a new student.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
};

export default Students;
