import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, BookOpen, Users, CheckCircle, X, Plus } from 'lucide-react';
import { getCurrentUser } from '@/lib/auth';
import { getDataFromStorage, saveDataToStorage, mockStudents, mockClasses, mockSubjects, mockTimetable, Homework, Attendance } from '@/lib/data';
import RoleBasedLayout from '@/components/RoleBasedLayout';

export default function Academics() {
  const [user] = useState(getCurrentUser());
  const [students] = useState(getDataFromStorage('students', mockStudents));
  const [classes] = useState(getDataFromStorage('classes', mockClasses));
  const [subjects] = useState(getDataFromStorage('subjects', mockSubjects));
  const [timetable] = useState(getDataFromStorage('timetable', mockTimetable));
  const [homework, setHomework] = useState<Homework[]>(getDataFromStorage('homework', []));
  const [attendance, setAttendance] = useState<Attendance[]>(getDataFromStorage('attendance', []));
  const [isHomeworkDialogOpen, setIsHomeworkDialogOpen] = useState(false);
  const [homeworkForm, setHomeworkForm] = useState({
    classId: '',
    sectionId: '',
    subjectId: '',
    title: '',
    description: '',
    dueDate: ''
  });

  const handleCreateHomework = (e: React.FormEvent) => {
    e.preventDefault();
    const newHomework: Homework = {
      id: `hw-${Date.now()}`,
      classId: homeworkForm.classId,
      sectionId: homeworkForm.sectionId,
      subjectId: homeworkForm.subjectId,
      title: homeworkForm.title,
      description: homeworkForm.description,
      dueDate: homeworkForm.dueDate,
      assignedBy: user?.id || '',
      createdAt: new Date().toISOString()
    };

    const updatedHomework = [...homework, newHomework];
    setHomework(updatedHomework);
    saveDataToStorage('homework', updatedHomework);
    
    setHomeworkForm({ classId: '', sectionId: '', subjectId: '', title: '', description: '', dueDate: '' });
    setIsHomeworkDialogOpen(false);
  };

  const markAttendance = (studentId: string, status: 'present' | 'absent' | 'late') => {
    const today = new Date().toISOString().split('T')[0];
    const existingAttendance = attendance.find(a => a.studentId === studentId && a.date === today);
    
    let updatedAttendance;
    if (existingAttendance) {
      updatedAttendance = attendance.map(a => 
        a.id === existingAttendance.id ? { ...a, status } : a
      );
    } else {
      const newAttendance: Attendance = {
        id: `att-${Date.now()}-${studentId}`,
        studentId,
        date: today,
        status,
        markedBy: user?.id || ''
      };
      updatedAttendance = [...attendance, newAttendance];
    }
    
    setAttendance(updatedAttendance);
    saveDataToStorage('attendance', updatedAttendance);
  };

  const getTodayAttendance = (studentId: string) => {
    const today = new Date().toISOString().split('T')[0];
    return attendance.find(a => a.studentId === studentId && a.date === today);
  };

  const getSubjectName = (subjectId: string) => {
    return subjects.find(s => s.id === subjectId)?.name || 'Unknown Subject';
  };

  const getClassName = (classId: string) => {
    return classes.find(c => c.id === classId)?.name || 'Unknown Class';
  };

  const renderTimetable = () => {
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
    const periods = [1, 2, 3, 4, 5, 6];

    return (
      <Card>
        <CardHeader>
          <CardTitle>Weekly Timetable</CardTitle>
          <CardDescription>Class schedule overview</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className="border p-2 bg-gray-50">Period</th>
                  {days.map(day => (
                    <th key={day} className="border p-2 bg-gray-50">{day}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {periods.map(period => (
                  <tr key={period}>
                    <td className="border p-2 font-medium">Period {period}</td>
                    {days.map(day => {
                      const slot = timetable.find(t => t.day === day && t.period === period);
                      return (
                        <td key={`${day}-${period}`} className="border p-2">
                          {slot ? (
                            <div className="text-sm">
                              <div className="font-medium">{getSubjectName(slot.subjectId)}</div>
                              <div className="text-gray-500">{slot.room}</div>
                            </div>
                          ) : (
                            <div className="text-gray-400">-</div>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    );
  };

  const renderAttendance = () => {
    const today = new Date().toISOString().split('T')[0];
    
    return (
      <Card>
        <CardHeader>
          <CardTitle>Today's Attendance</CardTitle>
          <CardDescription>Mark attendance for students</CardDescription>
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
              {students.map((student) => {
                const todayAttendance = getTodayAttendance(student.id);
                return (
                  <TableRow key={student.id}>
                    <TableCell className="font-medium">{student.name}</TableCell>
                    <TableCell>{student.admissionNo}</TableCell>
                    <TableCell>{getClassName(student.classId)}</TableCell>
                    <TableCell>
                      {todayAttendance ? (
                        <Badge className={
                          todayAttendance.status === 'present' ? 'bg-green-100 text-green-800' :
                          todayAttendance.status === 'late' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }>
                          {todayAttendance.status.toUpperCase()}
                        </Badge>
                      ) : (
                        <Badge variant="outline">Not Marked</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-1">
                        <Button
                          size="sm"
                          variant={todayAttendance?.status === 'present' ? 'default' : 'outline'}
                          onClick={() => markAttendance(student.id, 'present')}
                        >
                          <CheckCircle className="h-3 w-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant={todayAttendance?.status === 'late' ? 'default' : 'outline'}
                          onClick={() => markAttendance(student.id, 'late')}
                        >
                          <Calendar className="h-3 w-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant={todayAttendance?.status === 'absent' ? 'default' : 'outline'}
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
    );
  };

  const renderHomework = () => {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-lg font-semibold">Homework Management</h3>
            <p className="text-gray-600">Assign and track homework</p>
          </div>
          
          {user?.role === 'teacher' && (
            <Dialog open={isHomeworkDialogOpen} onOpenChange={setIsHomeworkDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Assign Homework
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Assign Homework</DialogTitle>
                  <DialogDescription>
                    Create a new homework assignment
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleCreateHomework} className="space-y-4">
                  <div>
                    <Label htmlFor="class">Class</Label>
                    <Select value={homeworkForm.classId} onValueChange={(value) => setHomeworkForm({ ...homeworkForm, classId: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select class" />
                      </SelectTrigger>
                      <SelectContent>
                        {classes.map((cls) => (
                          <SelectItem key={cls.id} value={cls.id}>{cls.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="subject">Subject</Label>
                    <Select value={homeworkForm.subjectId} onValueChange={(value) => setHomeworkForm({ ...homeworkForm, subjectId: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select subject" />
                      </SelectTrigger>
                      <SelectContent>
                        {subjects.map((subject) => (
                          <SelectItem key={subject.id} value={subject.id}>{subject.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="title">Title</Label>
                    <Input
                      id="title"
                      value={homeworkForm.title}
                      onChange={(e) => setHomeworkForm({ ...homeworkForm, title: e.target.value })}
                      placeholder="Homework title"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={homeworkForm.description}
                      onChange={(e) => setHomeworkForm({ ...homeworkForm, description: e.target.value })}
                      placeholder="Homework description and instructions"
                      rows={3}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="dueDate">Due Date</Label>
                    <Input
                      id="dueDate"
                      type="date"
                      value={homeworkForm.dueDate}
                      onChange={(e) => setHomeworkForm({ ...homeworkForm, dueDate: e.target.value })}
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full">Assign Homework</Button>
                </form>
              </DialogContent>
            </Dialog>
          )}
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Recent Homework</CardTitle>
            <CardDescription>Latest homework assignments</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Subject</TableHead>
                  <TableHead>Class</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead>Assigned</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {homework.slice(0, 10).map((hw) => (
                  <TableRow key={hw.id}>
                    <TableCell className="font-medium">{hw.title}</TableCell>
                    <TableCell>{getSubjectName(hw.subjectId)}</TableCell>
                    <TableCell>{getClassName(hw.classId)}</TableCell>
                    <TableCell>{new Date(hw.dueDate).toLocaleDateString()}</TableCell>
                    <TableCell>{new Date(hw.createdAt).toLocaleDateString()}</TableCell>
                  </TableRow>
                ))}
                {homework.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-gray-500">
                      No homework assignments yet
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    );
  };

  return (
    <RoleBasedLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Academic Management</h1>
          <p className="text-gray-600">Manage timetables, attendance, and homework</p>
        </div>

        <Tabs defaultValue="timetable" className="space-y-6">
          <TabsList>
            <TabsTrigger value="timetable">Timetable</TabsTrigger>
            <TabsTrigger value="attendance">Attendance</TabsTrigger>
            <TabsTrigger value="homework">Homework</TabsTrigger>
          </TabsList>

          <TabsContent value="timetable">
            {renderTimetable()}
          </TabsContent>

          <TabsContent value="attendance">
            {renderAttendance()}
          </TabsContent>

          <TabsContent value="homework">
            {renderHomework()}
          </TabsContent>
        </Tabs>
      </div>
    </RoleBasedLayout>
  );
}