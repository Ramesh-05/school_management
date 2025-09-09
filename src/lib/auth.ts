export interface User {
  id: string;
  username: string;
  email: string;
  role: 'admin' | 'teacher' | 'student' | 'parent' | 'accountant';
  name: string;
  phone?: string;
  classId?: string; // For students
  studentIds?: string[]; // For parents
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}

// Mock users for demo
const mockUsers: User[] = [
  {
    id: '1',
    username: 'admin',
    email: 'admin@school.com',
    role: 'admin',
    name: 'School Administrator',
    phone: '+1234567890'
  },
  {
    id: '2',
    username: 'teacher1',
    email: 'teacher@school.com',
    role: 'teacher',
    name: 'John Teacher',
    phone: '+1234567891'
  },
  {
    id: '3',
    username: 'student1',
    email: 'student@school.com',
    role: 'student',
    name: 'Alice Student',
    classId: 'class-1',
    phone: '+1234567892'
  },
  {
    id: '4',
    username: 'parent1',
    email: 'parent@school.com',
    role: 'parent',
    name: 'Bob Parent',
    studentIds: ['3'],
    phone: '+1234567893'
  },
  {
    id: '5',
    username: 'accountant',
    email: 'accountant@school.com',
    role: 'accountant',
    name: 'Carol Accountant',
    phone: '+1234567894'
  }
];

export const login = (username: string, password: string): User | null => {
  // Simple demo login - in real app, this would be API call
  const user = mockUsers.find(u => u.username === username);
  if (user && password === 'password') {
    localStorage.setItem('currentUser', JSON.stringify(user));
    return user;
  }
  return null;
};

export const logout = (): void => {
  localStorage.removeItem('currentUser');
};

export const getCurrentUser = (): User | null => {
  const userStr = localStorage.getItem('currentUser');
  return userStr ? JSON.parse(userStr) : null;
};

export const hasRole = (user: User | null, roles: string[]): boolean => {
  return user ? roles.includes(user.role) : false;
};

export const canAccess = (user: User | null, requiredRoles: string[]): boolean => {
  return hasRole(user, requiredRoles);
};