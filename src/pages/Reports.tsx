import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  BarChart3, 
  Download, 
  TrendingUp, 
  Users, 
  DollarSign, 
  Calendar,
  FileText,
  PieChart,
  Activity
} from 'lucide-react';
import { getCurrentUser } from '@/lib/auth';
import { getDataFromStorage, mockStudents, mockClasses, mockLeads } from '@/lib/data';
import RoleBasedLayout from '@/components/RoleBasedLayout';

export default function Reports() {
  const [user] = useState(getCurrentUser());
  const [students] = useState(getDataFromStorage('students', mockStudents));
  const [classes] = useState(getDataFromStorage('classes', mockClasses));
  const [leads] = useState(getDataFromStorage('leads', mockLeads));
  const [selectedPeriod, setSelectedPeriod] = useState('monthly');
  const [selectedClass, setSelectedClass] = useState('all');

  // Calculate financial metrics
  const totalFees = students.reduce((sum, s) => sum + s.totalFees, 0);
  const collectedFees = students.reduce((sum, s) => sum + s.paidFees, 0);
  const outstandingFees = totalFees - collectedFees;
  const collectionRate = totalFees > 0 ? (collectedFees / totalFees) * 100 : 0;

  // Calculate admission metrics
  const totalLeads = leads.length;
  const convertedLeads = leads.filter(l => l.status === 'admitted').length;
  const conversionRate = totalLeads > 0 ? (convertedLeads / totalLeads) * 100 : 0;

  // Calculate attendance metrics (mock data)
  const averageAttendance = 87.5;
  const attendanceByClass = classes.map(cls => ({
    name: cls.name,
    rate: Math.floor(Math.random() * 20) + 80 // Mock data between 80-100%
  }));

  const reportCategories = [
    {
      title: 'Financial Reports',
      icon: DollarSign,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
      reports: [
        'Fee Collection Summary',
        'Outstanding Payments',
        'Monthly Revenue Report',
        'Class-wise Fee Analysis',
        'Payment Method Analysis'
      ]
    },
    {
      title: 'Academic Reports',
      icon: BarChart3,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
      reports: [
        'Attendance Summary',
        'Class Performance',
        'Subject-wise Analysis',
        'Homework Completion',
        'Exam Results'
      ]
    },
    {
      title: 'Admission Reports',
      icon: Users,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
      reports: [
        'Lead Generation Report',
        'Conversion Funnel',
        'Source Analysis',
        'Monthly Admissions',
        'Application Status'
      ]
    },
    {
      title: 'Administrative Reports',
      icon: FileText,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
      reports: [
        'Student Directory',
        'Staff Directory',
        'Communication Logs',
        'System Usage',
        'Audit Trail'
      ]
    }
  ];

  const renderFinancialReports = () => (
    <div className="space-y-6">
      {/* Financial Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">${collectedFees.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              +12% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Collection Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{collectionRate.toFixed(1)}%</div>
            <Progress value={collectionRate} className="mt-2" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Outstanding</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">${outstandingFees.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              {students.filter(s => s.feeStatus === 'overdue').length} overdue accounts
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Fee per Student</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              ${students.length > 0 ? Math.round(totalFees / students.length).toLocaleString() : 0}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Fee Status Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Fee Payment Status</CardTitle>
          <CardDescription>Distribution of payment statuses</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { status: 'Paid', count: students.filter(s => s.feeStatus === 'paid').length, color: 'bg-green-500' },
              { status: 'Pending', count: students.filter(s => s.feeStatus === 'pending').length, color: 'bg-yellow-500' },
              { status: 'Overdue', count: students.filter(s => s.feeStatus === 'overdue').length, color: 'bg-red-500' }
            ].map((item) => {
              const percentage = students.length > 0 ? (item.count / students.length) * 100 : 0;
              return (
                <div key={item.status} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${item.color}`} />
                    <span className="font-medium">{item.status}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-32">
                      <Progress value={percentage} className="h-2" />
                    </div>
                    <span className="text-sm font-medium">{item.count} ({percentage.toFixed(1)}%)</span>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderAcademicReports = () => (
    <div className="space-y-6">
      {/* Academic Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{students.length}</div>
            <p className="text-xs text-muted-foreground">
              Across {classes.length} classes
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Attendance</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{averageAttendance}%</div>
            <Progress value={averageAttendance} className="mt-2" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Classes</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{classes.length}</div>
            <p className="text-xs text-muted-foreground">
              With {classes.reduce((sum, c) => sum + c.sections.length, 0)} sections
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Homework Completion</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">92%</div>
            <p className="text-xs text-muted-foreground">
              Above target (85%)
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Class-wise Attendance */}
      <Card>
        <CardHeader>
          <CardTitle>Class-wise Attendance</CardTitle>
          <CardDescription>Attendance rates by class</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {attendanceByClass.map((cls) => (
              <div key={cls.name} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <span className="font-medium">{cls.name}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-32">
                    <Progress value={cls.rate} className="h-2" />
                  </div>
                  <span className="text-sm font-medium">{cls.rate}%</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderAdmissionReports = () => (
    <div className="space-y-6">
      {/* Admission Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Leads</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{totalLeads}</div>
            <p className="text-xs text-muted-foreground">
              This academic year
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{conversionRate.toFixed(1)}%</div>
            <Progress value={conversionRate} className="mt-2" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Admitted</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{convertedLeads}</div>
            <p className="text-xs text-muted-foreground">
              Students enrolled
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Applications</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {leads.filter(l => ['contacted', 'application'].includes(l.status)).length}
            </div>
            <p className="text-xs text-muted-foreground">
              In progress
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Admission Funnel */}
      <Card>
        <CardHeader>
          <CardTitle>Admission Funnel</CardTitle>
          <CardDescription>Lead progression through admission stages</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { stage: 'New Leads', count: leads.filter(l => l.status === 'new').length, color: 'bg-blue-500' },
              { stage: 'Contacted', count: leads.filter(l => l.status === 'contacted').length, color: 'bg-yellow-500' },
              { stage: 'Applications', count: leads.filter(l => l.status === 'application').length, color: 'bg-orange-500' },
              { stage: 'Admitted', count: leads.filter(l => l.status === 'admitted').length, color: 'bg-green-500' },
              { stage: 'Rejected', count: leads.filter(l => l.status === 'rejected').length, color: 'bg-red-500' }
            ].map((stage) => {
              const percentage = totalLeads > 0 ? (stage.count / totalLeads) * 100 : 0;
              return (
                <div key={stage.stage} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${stage.color}`} />
                    <span className="font-medium">{stage.stage}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-32">
                      <Progress value={percentage} className="h-2" />
                    </div>
                    <span className="text-sm font-medium">{stage.count} ({percentage.toFixed(1)}%)</span>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderReportGenerator = () => (
    <div className="space-y-6">
      {/* Report Generation Options */}
      <Card>
        <CardHeader>
          <CardTitle>Generate Custom Reports</CardTitle>
          <CardDescription>Create and download detailed reports</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium mb-2">Report Period</label>
              <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                <SelectTrigger>
                  <SelectValue placeholder="Select period" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="weekly">This Week</SelectItem>
                  <SelectItem value="monthly">This Month</SelectItem>
                  <SelectItem value="quarterly">This Quarter</SelectItem>
                  <SelectItem value="yearly">This Year</SelectItem>
                  <SelectItem value="custom">Custom Range</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Filter by Class</label>
              <Select value={selectedClass} onValueChange={setSelectedClass}>
                <SelectTrigger>
                  <SelectValue placeholder="Select class" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Classes</SelectItem>
                  {classes.map((cls) => (
                    <SelectItem key={cls.id} value={cls.id}>{cls.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Report Categories */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {reportCategories.map((category, index) => {
          const Icon = category.icon;
          return (
            <Card key={index}>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <div className={`p-2 rounded-full ${category.bgColor} mr-3`}>
                    <Icon className={`h-5 w-5 ${category.color}`} />
                  </div>
                  {category.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {category.reports.map((report, reportIndex) => (
                    <div key={reportIndex} className="flex items-center justify-between p-2 rounded hover:bg-gray-50">
                      <span className="text-sm">{report}</span>
                      <Button variant="outline" size="sm">
                        <Download className="h-3 w-3 mr-1" />
                        Export
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );

  return (
    <RoleBasedLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Reports & Analytics</h1>
          <p className="text-gray-600">Comprehensive reports and data insights</p>
        </div>

        <Tabs defaultValue="financial" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="financial">Financial</TabsTrigger>
            <TabsTrigger value="academic">Academic</TabsTrigger>
            <TabsTrigger value="admission">Admissions</TabsTrigger>
            <TabsTrigger value="generator">Report Generator</TabsTrigger>
          </TabsList>

          <TabsContent value="financial">
            {renderFinancialReports()}
          </TabsContent>

          <TabsContent value="academic">
            {renderAcademicReports()}
          </TabsContent>

          <TabsContent value="admission">
            {renderAdmissionReports()}
          </TabsContent>

          <TabsContent value="generator">
            {renderReportGenerator()}
          </TabsContent>
        </Tabs>
      </div>
    </RoleBasedLayout>
  );
}