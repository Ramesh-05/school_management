import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, BookOpen, Calendar, Edit, Trash2, Clock } from 'lucide-react';
import { getCurrentUser } from '@/lib/auth';
import { getDataFromStorage, saveDataToStorage, mockClasses, mockSubjects, Homework } from '@/lib/data';
import RoleBasedLayout from '@/components/RoleBasedLayout';

export default function HomeworkPage() {
  const [user] = useState(getCurrentUser());
  const [classes] = useState(getDataFromStorage('classes', mockClasses));
  const [subjects] = useState(getDataFromStorage('subjects', mockSubjects));
  const [homework, setHomework] = useState<Homework[]>(getDataFromStorage('homework', []));
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingHomework, setEditingHomework] = useState<Homework | null>(null);
  const [formData, setFormData] = useState({
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
      classId: formData.classId,
      sectionId: formData.sectionId,
      subjectId: formData.subjectId,
      title: formData.title,
      description: formData.description,
      dueDate: formData.dueDate,
      assignedBy: user?.id || '',
      createdAt: new Date().toISOString()
    };

    const updatedHomework = [...homework, newHomework];
    setHomework(updatedHomework);
    saveDataToStorage('homework', updatedHomework);
    
    setFormData({ classId: '', sectionId: '', subjectId: '', title: '', description: '', dueDate: '' });
    setIsDialogOpen(false);
  };

  const handleEditHomework = (hw: Homework) => {
    setEditingHomework(hw);
    setFormData({
      classId: hw.classId,
      sectionId: hw.sectionId,
      subjectId: hw.subjectId,
      title: hw.title,
      description: hw.description,
      dueDate: hw.dueDate
    });
    setIsDialogOpen(true);
  };

  const handleUpdateHomework = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingHomework) return;

    const updatedHomework = homework.map(hw =>
      hw.id === editingHomework.id
        ? { ...hw, ...formData }
        : hw
    );
    setHomework(updatedHomework);
    saveDataToStorage('homework', updatedHomework);
    
    setEditingHomework(null);
    setFormData({ classId: '', sectionId: '', subjectId: '', title: '', description: '', dueDate: '' });
    setIsDialogOpen(false);
  };

  const handleDeleteHomework = (homeworkId: string) => {
    const updatedHomework = homework.filter(hw => hw.id !== homeworkId);
    setHomework(updatedHomework);
    saveDataToStorage('homework', updatedHomework);
  };

  const getSubjectName = (subjectId: string) => {
    return subjects.find(s => s.id === subjectId)?.name || 'Unknown Subject';
  };

  const getClassName = (classId: string) => {
    return classes.find(c => c.id === classId)?.name || 'Unknown Class';
  };

  const getDaysUntilDue = (dueDate: string) => {
    const due = new Date(dueDate);
    const today = new Date();
    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getDueBadge = (dueDate: string) => {
    const days = getDaysUntilDue(dueDate);
    if (days < 0) {
      return <Badge className="bg-red-100 text-red-800">Overdue</Badge>;
    } else if (days === 0) {
      return <Badge className="bg-orange-100 text-orange-800">Due Today</Badge>;
    } else if (days <= 2) {
      return <Badge className="bg-yellow-100 text-yellow-800">Due Soon</Badge>;
    } else {
      return <Badge className="bg-green-100 text-green-800">{days} days left</Badge>;
    }
  };

  const stats = [
    { label: 'Total Assignments', value: homework.length, color: 'text-blue-600' },
    { label: 'Due Today', value: homework.filter(hw => getDaysUntilDue(hw.dueDate) === 0).length, color: 'text-orange-600' },
    { label: 'Due This Week', value: homework.filter(hw => getDaysUntilDue(hw.dueDate) <= 7 && getDaysUntilDue(hw.dueDate) > 0).length, color: 'text-yellow-600' },
    { label: 'Overdue', value: homework.filter(hw => getDaysUntilDue(hw.dueDate) < 0).length, color: 'text-red-600' }
  ];

  const renderHomeworkList = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">Homework Assignments</h3>
          <p className="text-gray-600">Manage and track homework assignments</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditingHomework(null)}>
              <Plus className="mr-2 h-4 w-4" />
              Assign Homework
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>{editingHomework ? 'Edit Homework' : 'Assign Homework'}</DialogTitle>
              <DialogDescription>
                {editingHomework ? 'Update homework assignment' : 'Create a new homework assignment'}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={editingHomework ? handleUpdateHomework : handleCreateHomework} className="space-y-4">
              <div>
                <Label htmlFor="class">Class</Label>
                <Select value={formData.classId} onValueChange={(value) => setFormData({ ...formData, classId: value })}>
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
                <Select value={formData.subjectId} onValueChange={(value) => setFormData({ ...formData, subjectId: value })}>
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
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Homework title"
                  required
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
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
                  value={formData.dueDate}
                  onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                  required
                />
              </div>
              <Button type="submit" className="w-full">
                {editingHomework ? 'Update Homework' : 'Assign Homework'}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.label}</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Homework Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Homework Assignments</CardTitle>
          <CardDescription>View and manage all homework assignments</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Subject</TableHead>
                <TableHead>Class</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Assigned</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {homework.map((hw) => (
                <TableRow key={hw.id}>
                  <TableCell className="font-medium">{hw.title}</TableCell>
                  <TableCell>{getSubjectName(hw.subjectId)}</TableCell>
                  <TableCell>{getClassName(hw.classId)}</TableCell>
                  <TableCell>{new Date(hw.dueDate).toLocaleDateString()}</TableCell>
                  <TableCell>{getDueBadge(hw.dueDate)}</TableCell>
                  <TableCell>{new Date(hw.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditHomework(hw)}
                      >
                        <Edit className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteHomework(hw.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {homework.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-gray-500">
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

  const renderUpcomingHomework = () => {
    const upcomingHomework = homework
      .filter(hw => getDaysUntilDue(hw.dueDate) >= 0)
      .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());

    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Clock className="mr-2 h-5 w-5" />
              Upcoming Deadlines
            </CardTitle>
            <CardDescription>Homework assignments due soon</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingHomework.slice(0, 10).map((hw) => (
                <div key={hw.id} className="flex items-center justify-between p-4 rounded-lg border">
                  <div className="flex-1">
                    <h4 className="font-medium">{hw.title}</h4>
                    <p className="text-sm text-gray-600">{getSubjectName(hw.subjectId)} • {getClassName(hw.classId)}</p>
                    <p className="text-sm text-gray-500 mt-1">{hw.description}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium">{new Date(hw.dueDate).toLocaleDateString()}</div>
                    {getDueBadge(hw.dueDate)}
                  </div>
                </div>
              ))}
              {upcomingHomework.length === 0 && (
                <div className="text-center text-gray-500 py-8">
                  No upcoming homework assignments
                </div>
              )}
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
          <h1 className="text-3xl font-bold text-gray-900">Homework Management</h1>
          <p className="text-gray-600">Assign and track homework assignments</p>
        </div>

        <Tabs defaultValue="all" className="space-y-6">
          <TabsList>
            <TabsTrigger value="all">All Homework</TabsTrigger>
            <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
          </TabsList>

          <TabsContent value="all">
            {renderHomeworkList()}
          </TabsContent>

          <TabsContent value="upcoming">
            {renderUpcomingHomework()}
          </TabsContent>
        </Tabs>
      </div>
    </RoleBasedLayout>
  );
}