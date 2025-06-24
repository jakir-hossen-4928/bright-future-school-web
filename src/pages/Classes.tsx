
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import Layout from '../components/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Search, Plus, Edit, Trash2, BookOpen, Clock, Users } from 'lucide-react';
import { apiClient } from '../utils/api';

const Classes = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const { data: classes, isLoading } = useQuery({
    queryKey: ['classes'],
    queryFn: () => apiClient.get('/api/classes'),
  });

  console.log('Classes data:', classes);

  // Mock data for demonstration
  const mockClasses = [
    {
      id: 1,
      name: "Advanced Mathematics",
      code: "MATH-401",
      teacher: "Dr. Sarah Wilson",
      schedule: "Mon, Wed, Fri - 10:00 AM",
      room: "Room 201",
      students: 28,
      capacity: 30,
      semester: "Fall 2024",
      status: "Active"
    },
    {
      id: 2,
      name: "English Literature",
      code: "ENG-301",
      teacher: "Mr. James Anderson",
      schedule: "Tue, Thu - 2:00 PM",
      room: "Room 105",
      students: 25,
      capacity: 25,
      semester: "Fall 2024",
      status: "Full"
    },
    {
      id: 3,
      name: "Organic Chemistry",
      code: "CHEM-302",
      teacher: "Ms. Lisa Chen",
      schedule: "Mon, Wed - 1:00 PM",
      room: "Lab 3",
      students: 20,
      capacity: 24,
      semester: "Fall 2024",
      status: "Active"
    },
  ];

  const classesData = classes || mockClasses;

  const filteredClasses = classesData.filter((classItem: any) =>
    classItem.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    classItem.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    classItem.teacher.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active':
        return 'default';
      case 'Full':
        return 'destructive';
      case 'Inactive':
        return 'secondary';
      default:
        return 'default';
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Classes</h1>
            <p className="text-gray-600">Manage class schedules and information</p>
          </div>
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Plus className="h-4 w-4 mr-2" />
            Add Class
          </Button>
        </div>

        {/* Search and Filters */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search classes by name, code, or teacher..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button variant="outline">Filter</Button>
            </div>
          </CardContent>
        </Card>

        {/* Classes List */}
        {isLoading ? (
          <div className="text-center py-8">Loading classes...</div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredClasses.map((classItem: any) => (
              <Card key={classItem.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="h-12 w-12 bg-purple-100 rounded-full flex items-center justify-center">
                        <BookOpen className="h-6 w-6 text-purple-600" />
                      </div>
                      <div>
                        <CardTitle className="text-xl">{classItem.name}</CardTitle>
                        <CardDescription className="text-base font-mono">
                          {classItem.code}
                        </CardDescription>
                      </div>
                    </div>
                    <Badge variant={getStatusColor(classItem.status)}>
                      {classItem.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Users className="h-4 w-4 text-gray-400" />
                      <span className="text-sm">
                        {classItem.students}/{classItem.capacity} students
                      </span>
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full"
                          style={{ width: `${(classItem.students / classItem.capacity) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4 text-gray-400" />
                      <span className="text-sm">{classItem.schedule}</span>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 mt-4">
                      <div>
                        <span className="text-sm text-gray-500">Teacher:</span>
                        <p className="text-sm font-medium">{classItem.teacher}</p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-500">Room:</span>
                        <p className="text-sm font-medium">{classItem.room}</p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-500">Semester:</span>
                        <p className="text-sm font-medium">{classItem.semester}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2 mt-6">
                    <Button size="sm" variant="outline" className="flex-1">
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                    <Button size="sm" variant="outline">
                      View Details
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

        {filteredClasses.length === 0 && !isLoading && (
          <Card>
            <CardContent className="text-center py-8">
              <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No classes found</h3>
              <p className="text-gray-600">Try adjusting your search criteria or add a new class.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
};

export default Classes;
