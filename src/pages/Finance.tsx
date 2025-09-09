import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DollarSign, TrendingUp, AlertTriangle, Users, CreditCard, Receipt } from 'lucide-react';
import { getCurrentUser } from '@/lib/auth';
import { getDataFromStorage, mockStudents } from '@/lib/data';
import RoleBasedLayout from '@/components/RoleBasedLayout';

export default function Finance() {
  const [user] = useState(getCurrentUser());
  const [students] = useState(getDataFromStorage('students', mockStudents));

  const totalFees = students.reduce((sum, s) => sum + s.totalFees, 0);
  const collectedFees = students.reduce((sum, s) => sum + s.paidFees, 0);
  const outstandingFees = totalFees - collectedFees;
  const collectionRate = totalFees > 0 ? (collectedFees / totalFees) * 100 : 0;

  const paidStudents = students.filter(s => s.feeStatus === 'paid').length;
  const pendingStudents = students.filter(s => s.feeStatus === 'pending').length;
  const overdueStudents = students.filter(s => s.feeStatus === 'overdue').length;

  const stats = [
    {
      title: 'Total Collections',
      value: `$${collectedFees.toLocaleString()}`,
      icon: DollarSign,
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      title: 'Outstanding Amount',
      value: `$${outstandingFees.toLocaleString()}`,
      icon: AlertTriangle,
      color: 'text-red-600',
      bgColor: 'bg-red-100'
    },
    {
      title: 'Collection Rate',
      value: `${collectionRate.toFixed(1)}%`,
      icon: TrendingUp,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      title: 'Overdue Accounts',
      value: overdueStudents.toString(),
      icon: Users,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'overdue': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <div className={`p-2 rounded-full ${stat.bgColor}`}>
                  <Icon className={`h-4 w-4 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Collection Progress */}
      <Card>
        <CardHeader>
          <CardTitle>Fee Collection Progress</CardTitle>
          <CardDescription>Overall collection status for current academic year</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Collection Progress</span>
              <span className="text-sm text-gray-600">{collectionRate.toFixed(1)}%</span>
            </div>
            <Progress value={collectionRate} className="h-3" />
            <div className="flex justify-between text-sm text-gray-600">
              <span>Collected: ${collectedFees.toLocaleString()}</span>
              <span>Outstanding: ${outstandingFees.toLocaleString()}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Payment Status Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Payment Status Breakdown</CardTitle>
          <CardDescription>Distribution of payment statuses across all students</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">{paidStudents}</div>
              <div className="text-sm text-gray-600">Paid in Full</div>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                <div 
                  className="bg-green-500 h-2 rounded-full" 
                  style={{ width: `${(paidStudents / students.length) * 100}%` }}
                ></div>
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-yellow-600">{pendingStudents}</div>
              <div className="text-sm text-gray-600">Pending Payment</div>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                <div 
                  className="bg-yellow-500 h-2 rounded-full" 
                  style={{ width: `${(pendingStudents / students.length) * 100}%` }}
                ></div>
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-red-600">{overdueStudents}</div>
              <div className="text-sm text-gray-600">Overdue</div>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                <div 
                  className="bg-red-500 h-2 rounded-full" 
                  style={{ width: `${(overdueStudents / students.length) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderStudentFees = () => (
    <Card>
      <CardHeader>
        <CardTitle>Student Fee Details</CardTitle>
        <CardDescription>Individual fee status and payment details</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Student Name</TableHead>
              <TableHead>Admission No</TableHead>
              <TableHead>Class</TableHead>
              <TableHead>Total Fees</TableHead>
              <TableHead>Paid Amount</TableHead>
              <TableHead>Outstanding</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {students.map((student) => {
              const outstanding = student.totalFees - student.paidFees;
              return (
                <TableRow key={student.id}>
                  <TableCell className="font-medium">{student.name}</TableCell>
                  <TableCell>{student.admissionNo}</TableCell>
                  <TableCell>{student.classId}</TableCell>
                  <TableCell>${student.totalFees.toLocaleString()}</TableCell>
                  <TableCell>${student.paidFees.toLocaleString()}</TableCell>
                  <TableCell className={outstanding > 0 ? 'text-red-600 font-medium' : 'text-green-600'}>
                    ${outstanding.toLocaleString()}
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(student.feeStatus)}>
                      {student.feeStatus.toUpperCase()}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        <Receipt className="h-3 w-3 mr-1" />
                        Receipt
                      </Button>
                      {outstanding > 0 && (
                        <Button variant="outline" size="sm">
                          <CreditCard className="h-3 w-3 mr-1" />
                          Pay
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );

  const renderReports = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Financial Reports</CardTitle>
          <CardDescription>Generate and download financial reports</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
              <Receipt className="h-6 w-6 mb-2" />
              <span>Collection Report</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
              <AlertTriangle className="h-6 w-6 mb-2" />
              <span>Outstanding Report</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
              <TrendingUp className="h-6 w-6 mb-2" />
              <span>Monthly Summary</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
              <Users className="h-6 w-6 mb-2" />
              <span>Student Wise Report</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
          <CardDescription>Latest fee payments and transactions</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Student</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Method</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {/* Mock transaction data */}
              <TableRow>
                <TableCell>2025-09-04</TableCell>
                <TableCell>Alice Student</TableCell>
                <TableCell>$2,500</TableCell>
                <TableCell>Online Payment</TableCell>
                <TableCell>
                  <Badge className="bg-green-100 text-green-800">Completed</Badge>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>2025-09-03</TableCell>
                <TableCell>Charlie Student</TableCell>
                <TableCell>$1,000</TableCell>
                <TableCell>Bank Transfer</TableCell>
                <TableCell>
                  <Badge className="bg-green-100 text-green-800">Completed</Badge>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>2025-09-02</TableCell>
                <TableCell>Eve Student</TableCell>
                <TableCell>$500</TableCell>
                <TableCell>Cash</TableCell>
                <TableCell>
                  <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <RoleBasedLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Finance Management</h1>
          <p className="text-gray-600">Track fees, payments, and financial reports</p>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="students">Student Fees</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            {renderOverview()}
          </TabsContent>

          <TabsContent value="students">
            {renderStudentFees()}
          </TabsContent>

          <TabsContent value="reports">
            {renderReports()}
          </TabsContent>
        </Tabs>
      </div>
    </RoleBasedLayout>
  );
}