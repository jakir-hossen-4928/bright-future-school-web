
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import Layout from '../components/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Calendar as CalendarIcon, Check, X, Clock } from 'lucide-react';
import { apiClient } from '../utils/api';

const Attendance = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedClass, setSelectedClass] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');

  const { data: attendance, isLoading } = useQuery({
    queryKey: ['attendance', selectedDate, selectedClass],
    queryFn: () => apiClient.get(`/api/attendance?date=${selectedDate.toISOString()}&class=${selectedClass}`),
  });

  console.log('Attendance data:', attendance);

  // Mock data for demonstration
  const mockAttendance = [
    {
      id: 1,
      studentName: "Alice Johnson",
      studentId: "STU001",
      class: "10-A",
      subject: "Mathematics",
      status: "Present",
      time: "09:00 AM",
      date: new Date().toISOString().split('T')[0]
    },
    {
      id: 2,
      studentName: "Bob Smith",
      studentId: "STU002",
      class: "10-A",
      subject: "Mathematics",
      status: "Absent",
      time: "09:00 AM",
      date: new Date().toISOString().split('T')[0]
    },
    {
      id: 3,
      studentName: "Carol Brown",
      studentId: "STU003",
      class: "10-A",
      subject: "Mathematics",
      status: "Late",
      time: "09:15 AM",
      date: new Date().toISOString().split('T')[0]
    },
  ];

  const attendanceData = attendance || mockAttendance;

  const filteredAttendance = attendanceData.filter((record: any) =>
    record.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    record.studentId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Present':
        return <Check className="h-4 w-4 text-green-600" />;
      case 'Absent':
        return <X className="h-4 w-4 text-red-600" />;
      case 'Late':
        return <Clock className="h-4 w-4 text-yellow-600" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Present':
        return 'bg-green-100 text-green-800';
      case 'Absent':
        return 'bg-red-100 text-red-800';
      case 'Late':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const attendanceStats = {
    present: filteredAttendance.filter((r: any) => r.status === 'Present').length,
    absent: filteredAttendance.filter((r: any) => r.status === 'Absent').length,
    late: filteredAttendance.filter((r: any) => r.status === 'Late').length,
    total: filteredAttendance.length
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Attendance</h1>
            <p className="text-gray-600">Track and manage student attendance</p>
          </div>
          <Button className="bg-blue-600 hover:bg-blue-700">
            Take Attendance
          </Button>
        </div>

        {/* Controls and Filters */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="text-lg">Select Date</CardTitle>
            </CardHeader>
            <CardContent>
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={(date) => date && setSelectedDate(date)}
                className="rounded-md border"
              />
            </CardContent>
          </Card>

          <div className="lg:col-span-3 space-y-6">
            {/* Filters */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="Search students..."
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
                </div>
              </CardContent>
            </Card>

            {/* Attendance Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="text-2xl font-bold text-green-600">{attendanceStats.present}</div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide">Present</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-2xl font-bold text-red-600">{attendanceStats.absent}</div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide">Absent</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-2xl font-bold text-yellow-600">{attendanceStats.late}</div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide">Late</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-2xl font-bold text-blue-600">{attendanceStats.total}</div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide">Total</p>
                </CardContent>
              </Card>
            </div>

            {/* Attendance Records */}
            <Card>
              <CardHeader>
                <CardTitle>Attendance Records</CardTitle>
                <CardDescription>
                  {selectedDate.toLocaleDateString()} - {selectedClass || 'All Classes'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="text-center py-8">Loading attendance...</div>
                ) : filteredAttendance.length > 0 ? (
                  <div className="space-y-3">
                    {filteredAttendance.map((record: any) => (
                      <div
                        key={record.id}
                        className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                      >
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center space-x-2">
                            {getStatusIcon(record.status)}
                            <div>
                              <p className="font-medium">{record.studentName}</p>
                              <p className="text-sm text-gray-500">{record.studentId}</p>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-4">
                          <div className="text-right">
                            <p className="text-sm font-medium">{record.class}</p>
                            <p className="text-sm text-gray-500">{record.subject}</p>
                          </div>
                          <Badge className={getStatusColor(record.status)}>
                            {record.status}
                          </Badge>
                          <div className="text-right">
                            <p className="text-sm text-gray-500">{record.time}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <CalendarIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No attendance records</h3>
                    <p className="text-gray-600">No attendance records found for the selected date and filters.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Attendance;
