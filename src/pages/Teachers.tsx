
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import Layout from '../components/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Search, Plus, Edit, Trash2, GraduationCap, Mail, Phone } from 'lucide-react';
import { apiClient } from '../utils/api';

const Teachers = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const { data: teachers, isLoading } = useQuery({
    queryKey: ['teachers'],
    queryFn: () => apiClient.get('/api/teachers'),
  });

  console.log('Teachers data:', teachers);

  // Mock data for demonstration
  const mockTeachers = [
    {
      id: 1,
      name: "Dr. Sarah Wilson",
      email: "sarah.wilson@school.edu",
      subject: "Mathematics",
      department: "Science",
      experience: "10 years",
      phone: "(555) 123-4567",
      status: "Active",
      classes: ["10-A Math", "11-B Math", "12-A Advanced Math"]
    },
    {
      id: 2,
      name: "Mr. James Anderson",
      email: "james.anderson@school.edu",
      subject: "English Literature",
      department: "Language Arts",
      experience: "8 years",
      phone: "(555) 234-5678",
      status: "Active",
      classes: ["9-A English", "10-B English", "11-C English"]
    },
    {
      id: 3,
      name: "Ms. Lisa Chen",
      email: "lisa.chen@school.edu",
      subject: "Chemistry",
      department: "Science",
      experience: "12 years",
      phone: "(555) 345-6789",
      status: "On Leave",
      classes: ["11-A Chemistry", "12-B Chemistry"]
    },
  ];

  const teachersData = teachers || mockTeachers;

  const filteredTeachers = teachersData.filter((teacher: any) =>
    teacher.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    teacher.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
    teacher.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Teachers</h1>
            <p className="text-gray-600">Manage faculty members and their information</p>
          </div>
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Plus className="h-4 w-4 mr-2" />
            Add Teacher
          </Button>
        </div>

        {/* Search and Filters */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search teachers by name, subject, or department..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button variant="outline">Filter</Button>
            </div>
          </CardContent>
        </Card>

        {/* Teachers List */}
        {isLoading ? (
          <div className="text-center py-8">Loading teachers...</div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredTeachers.map((teacher: any) => (
              <Card key={teacher.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center">
                        <GraduationCap className="h-6 w-6 text-green-600" />
                      </div>
                      <div>
                        <CardTitle className="text-xl">{teacher.name}</CardTitle>
                        <CardDescription className="text-base">{teacher.subject}</CardDescription>
                        <Badge variant="outline" className="mt-1">
                          {teacher.department}
                        </Badge>
                      </div>
                    </div>
                    <Badge variant={teacher.status === 'Active' ? 'default' : 'secondary'}>
                      {teacher.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Mail className="h-4 w-4 text-gray-400" />
                      <span className="text-sm">{teacher.email}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Phone className="h-4 w-4 text-gray-400" />
                      <span className="text-sm">{teacher.phone}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Experience:</span>
                      <span className="text-sm font-medium">{teacher.experience}</span>
                    </div>
                    
                    <div className="mt-4">
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Classes:</h4>
                      <div className="flex flex-wrap gap-1">
                        {teacher.classes.map((className: string, index: number) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {className}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2 mt-6">
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

        {filteredTeachers.length === 0 && !isLoading && (
          <Card>
            <CardContent className="text-center py-8">
              <GraduationCap className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No teachers found</h3>
              <p className="text-gray-600">Try adjusting your search criteria or add a new teacher.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
};

export default Teachers;
