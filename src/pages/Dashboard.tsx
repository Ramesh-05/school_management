import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Users, 
  GraduationCap, 
  DollarSign, 
  Calendar, 
  TrendingUp, 
  AlertTriangle,
  CheckCircle,
  Clock,
  BookOpen,
  UserCheck
} from 'lucide-react';
import { getCurrentUser } from '@/lib/auth';
import { getDataFromStorage, mockStudents, mockAnnouncements, mockLeads } from '@/lib/data';
import RoleBasedLayout from '@/components/RoleBasedLayout';

export default function Dashboard() {
  const [user] = useState(getCurrentUser());
  const [students] = useState(getDataFromStorage('students', mockStudents));
  const [announcements] = useState(getDataFromStorage('announcements', mockAnnouncements));
  const [leads] = useState(getDataFromStorage('leads', mockLeads));

  if (!user) return null;

  const renderAdminDashboard = () => {
    const totalStudents = students.length;
    const totalFees = students.reduce((sum, s) => sum + s.totalFees, 0);
    const collectedFees = students.reduce((sum, s) => sum + s.paidFees, 0);
    const feeCollectionRate = totalFees > 0 ? (collectedFees / totalFees) * 100 : 0;
    
    const attendanceRate = 85; // Mock data
    const newLeads = leads.filter(l => l.status === 'new').length;
    const activeApplications = leads.filter(l => l.status === 'application').length;

    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600">Welcome back, {user.name}</p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Students</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalStudents}</div>
              <p className="text-xs text-muted-foreground">
                +2 from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Fee Collection</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{feeCollectionRate.toFixed(1)}%</div>
              <Progress value={feeCollectionRate} className="mt-2" />
              <p className="text-xs text-muted-foreground mt-2">
                ${collectedFees.toLocaleString()} of ${totalFees.toLocaleString()}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Attendance Rate</CardTitle>
              <UserCheck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{attendanceRate}%</div>
              <Progress value={attendanceRate} className="mt-2" />
              <p className="text-xs text-muted-foreground mt-2">
                Above target (80%)
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">New Admissions</CardTitle>
              <GraduationCap className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{newLeads}</div>
              <p className="text-xs text-muted-foreground">
                {activeApplications} in progress
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Admissions Funnel */}
        <Card>
          <CardHeader>
            <CardTitle>Admissions Funnel</CardTitle>
            <CardDescription>Current admission pipeline status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { stage: 'New Leads', count: leads.filter(l => l.status === 'new').length, color: 'bg-blue-500' },
                { stage: 'Contacted', count: leads.filter(l => l.status === 'contacted').length, color: 'bg-yellow-500' },
                { stage: 'Applications', count: leads.filter(l => l.status === 'application').length, color: 'bg-orange-500' },
                { stage: 'Admitted', count: leads.filter(l => l.status === 'admitted').length, color: 'bg-green-500' }
              ].map((stage) => (
                <div key={stage.stage} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${stage.color}`} />
                    <span className="font-medium">{stage.stage}</span>
                  </div>
                  <Badge variant="secondary">{stage.count}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Announcements */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Announcements</CardTitle>
            <CardDescription>Latest school updates and notices</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {announcements.slice(0, 3).map((announcement) => (
                <div key={announcement.id} className="flex items-start space-x-3 p-3 rounded-lg bg-gray-50">
                  <div className={`w-2 h-2 rounded-full mt-2 ${
                    announcement.priority === 'high' ? 'bg-red-500' :
                    announcement.priority === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                  }`} />
                  <div className="flex-1">
                    <h4 className="font-medium">{announcement.title}</h4>
                    <p className="text-sm text-gray-600 mt-1">{announcement.content}</p>
                    <p className="text-xs text-gray-500 mt-2">
                      {new Date(announcement.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  const renderTeacherDashboard = () => {
    const todayClasses = 5; // Mock data
    const pendingHomework = 3;
    const attendanceToMark = 2;

    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Teacher Dashboard</h1>
          <p className="text-gray-600">Welcome back, {user.name}</p>
        </div>

        {/* Today's Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Today's Classes</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{todayClasses}</div>
              <p className="text-xs text-muted-foreground">
                Next class at 10:00 AM
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Homework</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pendingHomework}</div>
              <p className="text-xs text-muted-foreground">
                To be assigned
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Attendance</CardTitle>
              <UserCheck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{attendanceToMark}</div>
              <p className="text-xs text-muted-foreground">
                Classes to mark
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Today's Timetable */}
        <Card>
          <CardHeader>
            <CardTitle>Today's Timetable</CardTitle>
            <CardDescription>Your schedule for today</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { time: '09:00 - 09:45', subject: 'Mathematics', class: 'Class 1A', room: 'Room 101' },
                { time: '10:00 - 10:45', subject: 'English', class: 'Class 1A', room: 'Room 101' },
                { time: '11:15 - 12:00', subject: 'Mathematics', class: 'Class 1B', room: 'Room 102' },
                { time: '14:00 - 14:45', subject: 'English', class: 'Class 2A', room: 'Room 201' }
              ].map((period, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
                  <div>
                    <div className="font-medium">{period.subject}</div>
                    <div className="text-sm text-gray-600">{period.class} • {period.room}</div>
                  </div>
                  <div className="text-sm font-medium text-blue-600">{period.time}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  const renderStudentDashboard = () => {
    const student = students.find(s => s.id === user.id);
    const upcomingHomework = 4; // Mock data
    const nextClass = 'Mathematics at 10:00 AM';

    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Student Dashboard</h1>
          <p className="text-gray-600">Welcome back, {user.name}</p>
        </div>

        {/* Student Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Next Class</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-lg font-bold">{nextClass}</div>
              <p className="text-xs text-muted-foreground">
                Room 101
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Homework Due</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{upcomingHomework}</div>
              <p className="text-xs text-muted-foreground">
                This week
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Fee Status</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-lg font-bold">
                <Badge className={student?.feeStatus === 'paid' ? 'bg-green-100 text-green-800' : 
                  student?.feeStatus === 'pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}>
                  {student?.feeStatus?.toUpperCase() || 'UNKNOWN'}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                ${student?.paidFees || 0} of ${student?.totalFees || 0}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Announcements */}
        <Card>
          <CardHeader>
            <CardTitle>School Announcements</CardTitle>
            <CardDescription>Important updates and notices</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {announcements.filter(a => a.targetAudience.includes('student')).slice(0, 3).map((announcement) => (
                <div key={announcement.id} className="flex items-start space-x-3 p-3 rounded-lg bg-gray-50">
                  <div className={`w-2 h-2 rounded-full mt-2 ${
                    announcement.priority === 'high' ? 'bg-red-500' :
                    announcement.priority === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                  }`} />
                  <div className="flex-1">
                    <h4 className="font-medium">{announcement.title}</h4>
                    <p className="text-sm text-gray-600 mt-1">{announcement.content}</p>
                    <p className="text-xs text-gray-500 mt-2">
                      {new Date(announcement.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  const renderParentDashboard = () => {
    const childrenIds = user.studentIds || [];
    const children = students.filter(s => childrenIds.includes(s.id));

    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Parent Dashboard</h1>
          <p className="text-gray-600">Welcome back, {user.name}</p>
        </div>

        {/* Children Overview */}
        <div className="grid gap-6">
          {children.map((child) => (
            <Card key={child.id}>
              <CardHeader>
                <CardTitle>{child.name}</CardTitle>
                <CardDescription>Class {child.classId} • Admission No: {child.admissionNo}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <h4 className="font-medium text-sm text-gray-600">Fee Status</h4>
                    <Badge className={child.feeStatus === 'paid' ? 'bg-green-100 text-green-800' : 
                      child.feeStatus === 'pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}>
                      {child.feeStatus.toUpperCase()}
                    </Badge>
                    <p className="text-xs text-gray-500 mt-1">
                      ${child.paidFees} of ${child.totalFees}
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium text-sm text-gray-600">Attendance</h4>
                    <div className="text-lg font-bold">92%</div>
                    <p className="text-xs text-gray-500">This month</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-sm text-gray-600">Next Class</h4>
                    <div className="text-sm font-medium">Mathematics</div>
                    <p className="text-xs text-gray-500">10:00 AM</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Announcements */}
        <Card>
          <CardHeader>
            <CardTitle>School Announcements</CardTitle>
            <CardDescription>Important updates for parents</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {announcements.filter(a => a.targetAudience.includes('parent')).slice(0, 3).map((announcement) => (
                <div key={announcement.id} className="flex items-start space-x-3 p-3 rounded-lg bg-gray-50">
                  <div className={`w-2 h-2 rounded-full mt-2 ${
                    announcement.priority === 'high' ? 'bg-red-500' :
                    announcement.priority === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                  }`} />
                  <div className="flex-1">
                    <h4 className="font-medium">{announcement.title}</h4>
                    <p className="text-sm text-gray-600 mt-1">{announcement.content}</p>
                    <p className="text-xs text-gray-500 mt-2">
                      {new Date(announcement.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  const renderAccountantDashboard = () => {
    const totalFees = students.reduce((sum, s) => sum + s.totalFees, 0);
    const collectedFees = students.reduce((sum, s) => sum + s.paidFees, 0);
    const outstandingFees = totalFees - collectedFees;
    const overdueStudents = students.filter(s => s.feeStatus === 'overdue').length;

    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Accountant Dashboard</h1>
          <p className="text-gray-600">Welcome back, {user.name}</p>
        </div>

        {/* Financial Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Collections</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${collectedFees.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                This academic year
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Outstanding</CardTitle>
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${outstandingFees.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                Pending collection
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Collection Rate</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{((collectedFees / totalFees) * 100).toFixed(1)}%</div>
              <Progress value={(collectedFees / totalFees) * 100} className="mt-2" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Overdue Accounts</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{overdueStudents}</div>
              <p className="text-xs text-muted-foreground">
                Require follow-up
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Fee Status Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle>Fee Status Overview</CardTitle>
            <CardDescription>Current payment status across all students</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { status: 'Paid', count: students.filter(s => s.feeStatus === 'paid').length, color: 'bg-green-500' },
                { status: 'Pending', count: students.filter(s => s.feeStatus === 'pending').length, color: 'bg-yellow-500' },
                { status: 'Overdue', count: students.filter(s => s.feeStatus === 'overdue').length, color: 'bg-red-500' }
              ].map((status) => (
                <div key={status.status} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${status.color}`} />
                    <span className="font-medium">{status.status}</span>
                  </div>
                  <Badge variant="secondary">{status.count} students</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  const renderDashboardContent = () => {
    switch (user.role) {
      case 'admin':
        return renderAdminDashboard();
      case 'teacher':
        return renderTeacherDashboard();
      case 'student':
        return renderStudentDashboard();
      case 'parent':
        return renderParentDashboard();
      case 'accountant':
        return renderAccountantDashboard();
      default:
        return <div>Dashboard not available for this role.</div>;
    }
  };

  return (
    <RoleBasedLayout>
      {renderDashboardContent()}
    </RoleBasedLayout>
  );
}