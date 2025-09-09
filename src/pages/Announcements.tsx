import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { MessageSquare, Plus, Edit, Trash2, Users, Bell, AlertCircle } from 'lucide-react';
import { getCurrentUser } from '@/lib/auth';
import { getDataFromStorage, saveDataToStorage, mockAnnouncements, Announcement } from '@/lib/data';
import RoleBasedLayout from '@/components/RoleBasedLayout';

export default function Announcements() {
  const [user] = useState(getCurrentUser());
  const [announcements, setAnnouncements] = useState<Announcement[]>(getDataFromStorage('announcements', mockAnnouncements));
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingAnnouncement, setEditingAnnouncement] = useState<Announcement | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    priority: 'medium' as Announcement['priority'],
    targetAudience: [] as string[]
  });

  const audienceOptions = [
    { id: 'student', label: 'Students' },
    { id: 'parent', label: 'Parents' },
    { id: 'teacher', label: 'Teachers' },
    { id: 'admin', label: 'Administrators' },
    { id: 'accountant', label: 'Accountants' }
  ];

  const handleCreateAnnouncement = (e: React.FormEvent) => {
    e.preventDefault();
    const newAnnouncement: Announcement = {
      id: `ann-${Date.now()}`,
      title: formData.title,
      content: formData.content,
      priority: formData.priority,
      targetAudience: formData.targetAudience,
      createdBy: user?.id || '',
      createdAt: new Date().toISOString()
    };

    const updatedAnnouncements = [newAnnouncement, ...announcements];
    setAnnouncements(updatedAnnouncements);
    saveDataToStorage('announcements', updatedAnnouncements);
    
    setFormData({ title: '', content: '', priority: 'medium', targetAudience: [] });
    setIsDialogOpen(false);
  };

  const handleEditAnnouncement = (announcement: Announcement) => {
    setEditingAnnouncement(announcement);
    setFormData({
      title: announcement.title,
      content: announcement.content,
      priority: announcement.priority,
      targetAudience: announcement.targetAudience
    });
    setIsDialogOpen(true);
  };

  const handleUpdateAnnouncement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingAnnouncement) return;

    const updatedAnnouncements = announcements.map(ann =>
      ann.id === editingAnnouncement.id
        ? { ...ann, ...formData }
        : ann
    );
    setAnnouncements(updatedAnnouncements);
    saveDataToStorage('announcements', updatedAnnouncements);
    
    setEditingAnnouncement(null);
    setFormData({ title: '', content: '', priority: 'medium', targetAudience: [] });
    setIsDialogOpen(false);
  };

  const handleDeleteAnnouncement = (announcementId: string) => {
    const updatedAnnouncements = announcements.filter(ann => ann.id !== announcementId);
    setAnnouncements(updatedAnnouncements);
    saveDataToStorage('announcements', updatedAnnouncements);
  };

  const handleAudienceChange = (audienceId: string, checked: boolean) => {
    if (checked) {
      setFormData({ ...formData, targetAudience: [...formData.targetAudience, audienceId] });
    } else {
      setFormData({ ...formData, targetAudience: formData.targetAudience.filter(id => id !== audienceId) });
    }
  };

  const getPriorityColor = (priority: Announcement['priority']) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityIcon = (priority: Announcement['priority']) => {
    switch (priority) {
      case 'high': return <AlertCircle className="h-4 w-4" />;
      case 'medium': return <Bell className="h-4 w-4" />;
      case 'low': return <MessageSquare className="h-4 w-4" />;
      default: return <MessageSquare className="h-4 w-4" />;
    }
  };

  const getAudienceLabel = (audiences: string[]) => {
    return audiences.map(id => audienceOptions.find(opt => opt.id === id)?.label).join(', ');
  };

  const filteredAnnouncements = user?.role === 'admin' 
    ? announcements 
    : announcements.filter(ann => ann.targetAudience.includes(user?.role || ''));

  const stats = [
    { label: 'Total Announcements', value: announcements.length, color: 'text-blue-600' },
    { label: 'High Priority', value: announcements.filter(a => a.priority === 'high').length, color: 'text-red-600' },
    { label: 'This Week', value: announcements.filter(a => {
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return new Date(a.createdAt) > weekAgo;
    }).length, color: 'text-green-600' },
    { label: 'For My Role', value: filteredAnnouncements.length, color: 'text-purple-600' }
  ];

  return (
    <RoleBasedLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Announcements</h1>
            <p className="text-gray-600">School announcements and important notices</p>
          </div>
          
          {user?.role === 'admin' && (
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={() => setEditingAnnouncement(null)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Create Announcement
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                  <DialogTitle>{editingAnnouncement ? 'Edit Announcement' : 'Create Announcement'}</DialogTitle>
                  <DialogDescription>
                    {editingAnnouncement ? 'Update announcement details' : 'Create a new school announcement'}
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={editingAnnouncement ? handleUpdateAnnouncement : handleCreateAnnouncement} className="space-y-4">
                  <div>
                    <Label htmlFor="title">Title</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder="Announcement title"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="content">Content</Label>
                    <Textarea
                      id="content"
                      value={formData.content}
                      onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                      placeholder="Announcement content and details"
                      rows={4}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="priority">Priority</Label>
                    <Select value={formData.priority} onValueChange={(value) => setFormData({ ...formData, priority: value as Announcement['priority'] })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select priority" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low Priority</SelectItem>
                        <SelectItem value="medium">Medium Priority</SelectItem>
                        <SelectItem value="high">High Priority</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Target Audience</Label>
                    <div className="grid grid-cols-2 gap-3 mt-2">
                      {audienceOptions.map((option) => (
                        <div key={option.id} className="flex items-center space-x-2">
                          <Checkbox
                            id={option.id}
                            checked={formData.targetAudience.includes(option.id)}
                            onCheckedChange={(checked) => handleAudienceChange(option.id, checked as boolean)}
                          />
                          <Label htmlFor={option.id} className="text-sm">{option.label}</Label>
                        </div>
                      ))}
                    </div>
                  </div>
                  <Button type="submit" className="w-full">
                    {editingAnnouncement ? 'Update Announcement' : 'Create Announcement'}
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          )}
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.label}</CardTitle>
                <MessageSquare className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Announcements List */}
        <div className="space-y-4">
          {filteredAnnouncements.map((announcement) => (
            <Card key={announcement.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      {getPriorityIcon(announcement.priority)}
                      <CardTitle className="text-lg">{announcement.title}</CardTitle>
                      <Badge className={getPriorityColor(announcement.priority)}>
                        {announcement.priority.toUpperCase()}
                      </Badge>
                    </div>
                    <CardDescription className="flex items-center space-x-4">
                      <span>{new Date(announcement.createdAt).toLocaleDateString()}</span>
                      <span>•</span>
                      <span className="flex items-center">
                        <Users className="h-3 w-3 mr-1" />
                        {getAudienceLabel(announcement.targetAudience)}
                      </span>
                    </CardDescription>
                  </div>
                  {user?.role === 'admin' && (
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditAnnouncement(announcement)}
                      >
                        <Edit className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteAnnouncement(announcement.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 whitespace-pre-wrap">{announcement.content}</p>
              </CardContent>
            </Card>
          ))}
          {filteredAnnouncements.length === 0 && (
            <Card>
              <CardContent className="text-center py-12">
                <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No announcements</h3>
                <p className="text-gray-600">
                  {user?.role === 'admin' 
                    ? 'Create your first announcement to keep everyone informed.'
                    : 'No announcements available for your role at the moment.'
                  }
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </RoleBasedLayout>
  );
}