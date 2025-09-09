import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarInitials } from '@/components/ui/avatar';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { 
  BookOpen, 
  Users, 
  DollarSign, 
  Calendar, 
  MessageSquare, 
  Settings, 
  LogOut,
  Home,
  UserPlus,
  GraduationCap,
  Calculator,
  FileText,
  ClipboardCheck
} from 'lucide-react';
import { User, getCurrentUser, logout } from '@/lib/auth';

interface RoleBasedLayoutProps {
  children: React.ReactNode;
}

export default function RoleBasedLayout({ children }: RoleBasedLayoutProps) {
  const [user, setUser] = useState<User | null>(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const currentUser = getCurrentUser();
    setUser(currentUser);
    
    // Redirect to login if not authenticated and not on public pages
    if (!currentUser && !['/'].includes(location.pathname)) {
      navigate('/');
    }
  }, [location.pathname, navigate]);

  const handleLogout = () => {
    logout();
    setUser(null);
    navigate('/');
  };

  const getNavigationItems = () => {
    if (!user) return [];

    const commonItems = [
      { path: '/dashboard', label: 'Dashboard', icon: Home }
    ];

    switch (user.role) {
      case 'admin':
        // Admin has access to ALL modules
        return [
          ...commonItems,
          { path: '/admissions', label: 'Admissions', icon: UserPlus },
          { path: '/academics', label: 'Academics', icon: BookOpen },
          { path: '/attendance', label: 'Attendance', icon: Calendar },
          { path: '/homework', label: 'Homework', icon: GraduationCap },
          { path: '/finance', label: 'Finance', icon: DollarSign },
          { path: '/users', label: 'Users', icon: Users },
          { path: '/announcements', label: 'Announcements', icon: MessageSquare },
          { path: '/reports', label: 'Reports', icon: FileText },
          { path: '/settings', label: 'Settings', icon: Settings }
        ];
      
      case 'teacher':
        // Teachers can access: academics, attendance, homework, announcements
        return [
          ...commonItems,
          { path: '/academics', label: 'My Classes', icon: BookOpen },
          { path: '/attendance', label: 'Attendance', icon: Calendar },
          { path: '/homework', label: 'Homework', icon: GraduationCap },
          { path: '/announcements', label: 'Announcements', icon: MessageSquare }
        ];
      
      case 'student':
        // Students can access: academics, homework, announcements
        return [
          ...commonItems,
          { path: '/academics', label: 'My Subjects', icon: BookOpen },
          { path: '/homework', label: 'Homework', icon: GraduationCap },
          { path: '/announcements', label: 'Announcements', icon: MessageSquare }
        ];
      
      case 'parent':
        // Parents can access: academics (child's), finance (fees), announcements
        return [
          ...commonItems,
          { path: '/academics', label: 'Child\'s Progress', icon: BookOpen },
          { path: '/finance', label: 'Fee Status', icon: DollarSign },
          { path: '/announcements', label: 'Announcements', icon: MessageSquare }
        ];
      
      case 'accountant':
        // Accountants can access: finance, reports, announcements
        return [
          ...commonItems,
          { path: '/finance', label: 'Finance', icon: Calculator },
          { path: '/reports', label: 'Financial Reports', icon: FileText },
          { path: '/announcements', label: 'Announcements', icon: MessageSquare }
        ];
      
      default:
        return commonItems;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-red-100 text-red-800';
      case 'teacher': return 'bg-blue-100 text-blue-800';
      case 'student': return 'bg-green-100 text-green-800';
      case 'parent': return 'bg-purple-100 text-purple-800';
      case 'accountant': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Check if current user has access to the current route
  const hasAccessToCurrentRoute = () => {
    if (!user) return false;
    
    const allowedPaths = getNavigationItems().map(item => item.path);
    return allowedPaths.includes(location.pathname) || location.pathname === '/dashboard';
  };

  // Redirect if user doesn't have access to current route
  useEffect(() => {
    if (user && !hasAccessToCurrentRoute() && location.pathname !== '/') {
      navigate('/dashboard');
    }
  }, [user, location.pathname, navigate]);

  // Public layout (no user logged in)
  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        {children}
      </div>
    );
  }

  const navigationItems = getNavigationItems();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Link to="/dashboard" className="flex items-center space-x-2">
                <GraduationCap className="h-8 w-8 text-blue-600" />
                <span className="text-xl font-bold text-gray-900">SchoolMS</span>
              </Link>
            </div>

            <div className="flex items-center space-x-4">
              <Badge className={getRoleColor(user.role)}>
                {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
              </Badge>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>
                        {user.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <div className="flex items-center justify-start gap-2 p-2">
                    <div className="flex flex-col space-y-1 leading-none">
                      <p className="font-medium">{user.name}</p>
                      <p className="w-[200px] truncate text-sm text-muted-foreground">
                        {user.email}
                      </p>
                    </div>
                  </div>
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <nav className="w-64 bg-white shadow-sm min-h-screen border-r">
          <div className="p-4">
            <div className="space-y-2">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>

            {/* Role-specific info card */}
            <div className="mt-8">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Access Level</CardTitle>
                </CardHeader>
                <CardContent className="pb-3">
                  <Badge className={getRoleColor(user.role)} variant="outline">
                    {user.role.toUpperCase()}
                  </Badge>
                  <p className="text-xs text-gray-600 mt-2">
                    {user.role === 'admin' && 'Full system access'}
                    {user.role === 'teacher' && 'Teaching & class management'}
                    {user.role === 'student' && 'Academic resources'}
                    {user.role === 'parent' && 'Child progress tracking'}
                    {user.role === 'accountant' && 'Financial management'}
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <main className="flex-1 p-6">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}