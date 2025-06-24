
import { useQuery } from '@tanstack/react-query';
import Layout from '../components/Layout';
import DashboardCard from '../components/DashboardCard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, GraduationCap, BookOpen, Calendar, TrendingUp, Award } from 'lucide-react';
import { apiClient } from '../utils/api';

const Index = () => {
  const { data: dashboardData, isLoading } = useQuery({
    queryKey: ['dashboard'],
    queryFn: () => apiClient.get('/api/dashboard'),
  });

  console.log('Dashboard data:', dashboardData);

  const mockData = {
    totalStudents: 1247,
    totalTeachers: 89,
    totalClasses: 42,
    attendanceRate: 94.2,
    averageGrade: 87.5,
    upcomingEvents: 8,
  };

  const stats = dashboardData || mockData;

  return (
    <Layout>
      <div className="space-y-8">
        {/* Hero Section */}
        <div className="text-center py-12 bg-white rounded-lg shadow-sm">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Welcome to SchoolHub
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Your comprehensive school management system for streamlined administration, 
            enhanced learning, and better communication.
          </p>
        </div>

        {/* Dashboard Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <DashboardCard
            title="Total Students"
            description="Enrolled students"
            value={stats.totalStudents}
            icon={<Users />}
            trend={{ value: "12% from last month", isPositive: true }}
          />
          <DashboardCard
            title="Total Teachers"
            description="Active faculty members"
            value={stats.totalTeachers}
            icon={<GraduationCap />}
            trend={{ value: "3 new this month", isPositive: true }}
          />
          <DashboardCard
            title="Active Classes"
            description="Current semester"
            value={stats.totalClasses}
            icon={<BookOpen />}
          />
          <DashboardCard
            title="Attendance Rate"
            description="This week"
            value={`${stats.attendanceRate}%`}
            icon={<Calendar />}
            trend={{ value: "2.1% from last week", isPositive: true }}
          />
          <DashboardCard
            title="Average Grade"
            description="School-wide average"
            value={`${stats.averageGrade}/100`}
            icon={<Award />}
            trend={{ value: "1.5 points improvement", isPositive: true }}
          />
          <DashboardCard
            title="Upcoming Events"
            description="This month"
            value={stats.upcomingEvents}
            icon={<TrendingUp />}
          />
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activities</CardTitle>
              <CardDescription>Latest updates from your school</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { activity: "New student enrollment", time: "2 hours ago", type: "enrollment" },
                  { activity: "Math exam results published", time: "4 hours ago", type: "grades" },
                  { activity: "Parent-teacher meeting scheduled", time: "1 day ago", type: "meeting" },
                  { activity: "New teacher joined Science dept", time: "2 days ago", type: "staff" },
                ].map((item, index) => (
                  <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <p className="text-sm font-medium">{item.activity}</p>
                      <p className="text-xs text-gray-500">{item.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Common tasks and shortcuts</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: "Add Student", href: "/students" },
                  { label: "Schedule Class", href: "/classes" },
                  { label: "Take Attendance", href: "/attendance" },
                  { label: "Enter Grades", href: "/grades" },
                  { label: "View Teachers", href: "/teachers" },
                  { label: "Generate Report", href: "/" },
                ].map((action, index) => (
                  <a
                    key={index}
                    href={action.href}
                    className="p-4 bg-blue-50 hover:bg-blue-100 rounded-lg text-center transition-colors group"
                  >
                    <p className="text-sm font-medium text-blue-800 group-hover:text-blue-900">
                      {action.label}
                    </p>
                  </a>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Index;
