import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CheckCircle, X, Clock, Users, Calendar as CalendarIcon, TrendingUp } from 'lucide-react';
import { getCurrentUser } from '@/lib/auth';
import { getDataFromStorage, saveDataToStorage, mockStudents, mockClasses, Attendance as AttendanceType } from '@/lib/data';
import RoleBasedLayout from '@/components/RoleBasedLayout';
import CalendarAlt from '@/components/ui/calendar-alt';

export default function Attendance() {
  const [user] = useState(getCurrentUser());
  const [students] = useState(getDataFromStorage('students', mockStudents));
  const [classes] = useState(getDataFromStorage('classes', mockClasses));
  const [attendance, setAttendance] = useState<AttendanceType[]>(getDataFromStorage('attendance', []));
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedClass, setSelectedClass] = useState<string>('all');

  const markAttendance = (studentId: string, status: 'present' | 'absent' | 'late') => {
    const dateStr = selectedDate.toISOString().split('T')[0];
    const existingAttendance = attendance.find(a => a.studentId === studentId && a.date === dateStr);
    
    let updatedAttendance;
    if (existingAttendance) {
      updatedAttendance = attendance.map(a => 
        a.id === existingAttendance.id ? { ...a, status } : a
      );
    } else {
      const newAttendance: AttendanceType = {
        id: `att-${Date.now()}-${studentId}`,
        studentId,
        date: dateStr,
        status,
        markedBy: user?.id || ''
      };
      updatedAttendance = [...attendance, newAttendance];
    }
    
    setAttendance(updatedAttendance);
    saveDataToStorage('attendance', updatedAttendance);
  };

  const getAttendanceForDate = (studentId: string, date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    return attendance.find(a => a.studentId === studentId && a.date === dateStr);
  };

  const getAttendanceStats = () => {
    const today = new Date().toISOString().split('T')[0];
    const todayAttendance = attendance.filter(a => a.date === today);
    const totalStudents = students.length;
    const presentStudents = todayAttendance.filter(a => a.status === 'present').length;
    const absentStudents = todayAttendance.filter(a => a.status === 'absent').length;
    const lateStudents = todayAttendance.filter(a => a.status === 'late').length;
    const unmarkedStudents = totalStudents - todayAttendance.length;

    return {
      total: totalStudents,
      present: presentStudents,
      absent: absentStudents,
      late: lateStudents,
      unmarked: unmarkedStudents,
      attendanceRate: totalStudents > 0 ? ((presentStudents + lateStudents) / totalStudents) * 100 : 0
    };
  };

  const getFilteredStudents = () => {
    if (selectedClass === 'all') return students;
    return students.filter(s => s.classId === selectedClass);
  };

  const getClassName = (classId: string) => {
    return classes.find(c => c.id === classId)?.name || 'Unknown Class';
  };

  const stats = getAttendanceStats();

  const renderDailyAttendance = () => {
    const filteredStudents = getFilteredStudents();

    return (
      <div className="space-y-6">
        {/* Date and Class Selection */}
        <div className="flex gap-6">
          <div className="w-2/1">
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="text-lg">Select Date</CardTitle>
              </CardHeader>
              <CardContent>
                <CalendarAlt
                  value={selectedDate}
                  onChange={setSelectedDate}
                  className="rounded-md border"
                />
              </CardContent>
            </Card>
          </div>
          <div className="w-1/2 flex flex-col justify-between space-y-4">
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
            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="text-2xl font-bold text-green-600">{stats.present}</div>
                  <div className="text-sm text-gray-600">Present</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="text-2xl font-bold text-red-600">{stats.absent}</div>
                  <div className="text-sm text-gray-600">Absent</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="text-2xl font-bold text-yellow-600">{stats.late}</div>
                  <div className="text-sm text-gray-600">Late</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="text-2xl font-bold text-blue-600">{stats.attendanceRate.toFixed(1)}%</div>
                  <div className="text-sm text-gray-600">Rate</div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Attendance Table */}
        <Card>
          <CardHeader>
            <CardTitle>Mark Attendance - {selectedDate.toLocaleDateString()}</CardTitle>
            <CardDescription>
              {selectedClass === 'all' ? 'All Classes' : getClassName(selectedClass)}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student Name</TableHead>
                  <TableHead>Admission No</TableHead>
                  <TableHead>Class</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStudents.map((student) => {
                  const studentAttendance = getAttendanceForDate(student.id, selectedDate);
                  return (
                    <TableRow key={student.id}>
                      <TableCell className="font-medium">{student.name}</TableCell>
                      <TableCell>{student.admissionNo}</TableCell>
                      <TableCell>{getClassName(student.classId)}</TableCell>
                      <TableCell>
                        {studentAttendance ? (
                          <Badge className={
                            studentAttendance.status === 'present' ? 'bg-green-100 text-green-800' :
                            studentAttendance.status === 'late' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }>
                            {studentAttendance.status.toUpperCase()}
                          </Badge>
                        ) : (
                          <Badge variant="outline">Not Marked</Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-1">
                          <Button
                            size="sm"
                            variant={studentAttendance?.status === 'present' ? 'default' : 'outline'}
                            onClick={() => markAttendance(student.id, 'present')}
                          >
                            <CheckCircle className="h-3 w-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant={studentAttendance?.status === 'late' ? 'default' : 'outline'}
                            onClick={() => markAttendance(student.id, 'late')}
                          >
                            <Clock className="h-3 w-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant={studentAttendance?.status === 'absent' ? 'default' : 'outline'}
                            onClick={() => markAttendance(student.id, 'absent')}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    );
  };

  const renderAttendanceReports = () => {
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - i);
      return date;
    }).reverse();

    return (
      <div className="space-y-6">
        {/* Overall Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Students</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Today's Attendance</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.attendanceRate.toFixed(1)}%</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Present Today</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.present}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Absent Today</CardTitle>
              <X className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{stats.absent}</div>
            </CardContent>
          </Card>
        </div>

        {/* Weekly Attendance Trend */}
        <Card>
          <CardHeader>
            <CardTitle>Weekly Attendance Trend</CardTitle>
            <CardDescription>Attendance rates for the last 7 days</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {last7Days.map((date) => {
                const dateStr = date.toISOString().split('T')[0];
                const dayAttendance = attendance.filter(a => a.date === dateStr);
                const presentCount = dayAttendance.filter(a => a.status === 'present' || a.status === 'late').length;
                const rate = students.length > 0 ? (presentCount / students.length) * 100 : 0;

                return (
                  <div key={dateStr} className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
                    <div>
                      <div className="font-medium">{date.toLocaleDateString('en-US', { weekday: 'long' })}</div>
                      <div className="text-sm text-gray-600">{date.toLocaleDateString()}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold">{rate.toFixed(1)}%</div>
                      <div className="text-sm text-gray-600">{presentCount}/{students.length}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Class-wise Attendance */}
        <Card>
          <CardHeader>
            <CardTitle>Class-wise Attendance</CardTitle>
            <CardDescription>Today's attendance by class</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {classes.map((cls) => {
                const classStudents = students.filter(s => s.classId === cls.id);
                const today = new Date().toISOString().split('T')[0];
                const classAttendance = attendance.filter(a => 
                  a.date === today && classStudents.some(s => s.id === a.studentId)
                );
                const presentCount = classAttendance.filter(a => a.status === 'present' || a.status === 'late').length;
                const rate = classStudents.length > 0 ? (presentCount / classStudents.length) * 100 : 0;

                return (
                  <div key={cls.id} className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
                    <div>
                      <div className="font-medium">{cls.name}</div>
                      <div className="text-sm text-gray-600">{classStudents.length} students</div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold">{rate.toFixed(1)}%</div>
                      <div className="text-sm text-gray-600">{presentCount}/{classStudents.length}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  return (
    <RoleBasedLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Attendance Management</h1>
          <p className="text-gray-600">Track and manage student attendance</p>
        </div>

        <Tabs defaultValue="daily" className="space-y-6">
          <TabsList>
            <TabsTrigger value="daily">Daily Attendance</TabsTrigger>
            <TabsTrigger value="reports">Reports & Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="daily">
            {renderDailyAttendance()}
          </TabsContent>

          <TabsContent value="reports">
            {renderAttendanceReports()}
          </TabsContent>
        </Tabs>
      </div>
    </RoleBasedLayout>
  );
}