import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog';
import { 
  GraduationCap, 
  Users, 
  BookOpen, 
  Award, 
  Phone, 
  Mail, 
  MapPin,
  Star,
  CheckCircle,
  ArrowRight
} from 'lucide-react';
import { getCurrentUser, login } from '@/lib/auth';
import { initializeMockData, saveDataToStorage, getDataFromStorage, Lead, mockLeads } from '@/lib/data';

export default function Index() {
  const [user, setUser] = useState(getCurrentUser());
  const [loginForm, setLoginForm] = useState({ username: '', password: '' });
  const [admissionForm, setAdmissionForm] = useState({
    name: '',
    email: '',
    phone: '',
    classApplied: '',
    message: ''
  });
  const [loginError, setLoginError] = useState('');
  const [admissionSuccess, setAdmissionSuccess] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    initializeMockData();
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const loggedInUser = login(loginForm.username, loginForm.password);
    if (loggedInUser) {
      setUser(loggedInUser);
      navigate('/dashboard');
    } else {
      setLoginError('Invalid credentials. Try: admin/password, teacher1/password, student1/password, parent1/password, accountant/password');
    }
  };

  const handleAdmissionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newLead: Lead = {
      id: `lead-${Date.now()}`,
      name: admissionForm.name,
      email: admissionForm.email,
      phone: admissionForm.phone,
      classApplied: admissionForm.classApplied,
      source: 'Website',
      status: 'new',
      notes: admissionForm.message,
      createdAt: new Date().toISOString()
    };

    const existingLeads = getDataFromStorage('leads', mockLeads);
    saveDataToStorage('leads', [...existingLeads, newLead]);
    
    setAdmissionSuccess(true);
    setAdmissionForm({ name: '', email: '', phone: '', classApplied: '', message: '' });
  };

  const features = [
    {
      icon: Users,
      title: 'Student Management',
      description: 'Comprehensive student profiles, admission tracking, and academic records management.'
    },
    {
      icon: BookOpen,
      title: 'Academic Excellence',
      description: 'Timetable management, attendance tracking, homework assignments, and grade management.'
    },
    {
      icon: Award,
      title: 'Performance Analytics',
      description: 'Detailed reports and analytics for student performance and institutional insights.'
    }
  ];

  const stats = [
    { label: 'Active Students', value: '1,200+' },
    { label: 'Expert Teachers', value: '80+' },
    { label: 'Success Rate', value: '98%' },
    { label: 'Years of Excellence', value: '25+' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <GraduationCap className="h-8 w-8 text-blue-600" />
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Excellence Academy
              </span>
            </div>
            
            <nav className="hidden md:flex items-center space-x-8">
              <a href="#about" className="text-gray-600 hover:text-blue-600 transition-colors">About</a>
              <a href="#courses" className="text-gray-600 hover:text-blue-600 transition-colors">Courses</a>
              <a href="#contact" className="text-gray-600 hover:text-blue-600 transition-colors">Contact</a>
              
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline">Login</Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Login to School Management System</DialogTitle>
                    <DialogDescription>
                      Enter your credentials to access the dashboard
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                      <Label htmlFor="username">Username</Label>
                      <Input
                        id="username"
                        value={loginForm.username}
                        onChange={(e) => setLoginForm({ ...loginForm, username: e.target.value })}
                        placeholder="Enter username"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="password">Password</Label>
                      <Input
                        id="password"
                        type="password"
                        value={loginForm.password}
                        onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                        placeholder="Enter password"
                        required
                      />
                    </div>
                    {loginError && (
                      <p className="text-sm text-red-600 bg-red-50 p-2 rounded">{loginError}</p>
                    )}
                    <Button type="submit" className="w-full">Login</Button>
                  </form>
                  <div className="mt-4 p-3 bg-gray-50 rounded text-sm">
                    <p className="font-medium mb-2">Demo Credentials:</p>
                    <p>Admin: admin / password</p>
                    <p>Teacher: teacher1 / password</p>
                    <p>Student: student1 / password</p>
                    <p>Parent: parent1 / password</p>
                    <p>Accountant: accountant / password</p>
                  </div>
                </DialogContent>
              </Dialog>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Badge className="mb-4 bg-blue-100 text-blue-800 hover:bg-blue-100">
              🎓 Shaping Future Leaders
            </Badge>
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              Excellence in{' '}
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Education
              </span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Empowering students with world-class education, innovative teaching methods, 
              and comprehensive school management system for the digital age.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Dialog>
                <DialogTrigger asChild>
                  <Button size="lg" className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
                    Apply Now <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Admission Enquiry</DialogTitle>
                    <DialogDescription>
                      Start your admission process by filling out this form
                    </DialogDescription>
                  </DialogHeader>
                  {admissionSuccess ? (
                    <div className="text-center py-6">
                      <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-green-800 mb-2">Application Submitted!</h3>
                      <p className="text-green-600">We'll contact you within 24 hours.</p>
                      <Button 
                        onClick={() => setAdmissionSuccess(false)} 
                        className="mt-4"
                        variant="outline"
                      >
                        Submit Another Application
                      </Button>
                    </div>
                  ) : (
                    <form onSubmit={handleAdmissionSubmit} className="space-y-4">
                      <div>
                        <Label htmlFor="name">Student Name</Label>
                        <Input
                          id="name"
                          value={admissionForm.name}
                          onChange={(e) => setAdmissionForm({ ...admissionForm, name: e.target.value })}
                          placeholder="Enter student name"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          value={admissionForm.email}
                          onChange={(e) => setAdmissionForm({ ...admissionForm, email: e.target.value })}
                          placeholder="Enter email address"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="phone">Phone</Label>
                        <Input
                          id="phone"
                          value={admissionForm.phone}
                          onChange={(e) => setAdmissionForm({ ...admissionForm, phone: e.target.value })}
                          placeholder="Enter phone number"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="class">Class Applied For</Label>
                        <Input
                          id="class"
                          value={admissionForm.classApplied}
                          onChange={(e) => setAdmissionForm({ ...admissionForm, classApplied: e.target.value })}
                          placeholder="e.g., Class 1, Class 2"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="message">Message (Optional)</Label>
                        <Textarea
                          id="message"
                          value={admissionForm.message}
                          onChange={(e) => setAdmissionForm({ ...admissionForm, message: e.target.value })}
                          placeholder="Any additional information..."
                          rows={3}
                        />
                      </div>
                      <Button type="submit" className="w-full">Submit Application</Button>
                    </form>
                  )}
                </DialogContent>
              </Dialog>
              
              <Button size="lg" variant="outline">
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-blue-600 mb-2">
                  {stat.value}
                </div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="about" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Why Choose Excellence Academy?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our comprehensive school management system ensures seamless education delivery 
              and administrative excellence.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="mx-auto w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                      <Icon className="h-6 w-6 text-blue-600" />
                    </div>
                    <CardTitle>{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Courses Section */}
      <section id="courses" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Courses</h2>
            <p className="text-xl text-gray-600">Comprehensive curriculum designed for holistic development</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { name: 'Primary Education', grades: 'Classes 1-5', subjects: 'English, Math, Science, Social Studies' },
              { name: 'Middle School', grades: 'Classes 6-8', subjects: 'Advanced Sciences, Languages, Arts' },
              { name: 'High School', grades: 'Classes 9-12', subjects: 'Specialized Streams, Career Preparation' }
            ].map((course, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle>{course.name}</CardTitle>
                  <CardDescription>{course.grades}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">{course.subjects}</p>
                  <div className="flex items-center mt-4">
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    <span className="ml-2 text-sm text-gray-500">Excellent</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Get In Touch</h2>
            <p className="text-xl text-gray-600">We're here to help you with any questions</p>
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h3 className="text-2xl font-semibold mb-6">Contact Information</h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <MapPin className="h-5 w-5 text-blue-600" />
                  <span>123 Education Street, Learning City, LC 12345</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone className="h-5 w-5 text-blue-600" />
                  <span>+1 (555) 123-4567</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Mail className="h-5 w-5 text-blue-600" />
                  <span>info@excellenceacademy.edu</span>
                </div>
              </div>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Send us a Message</CardTitle>
              </CardHeader>
              <CardContent>
                <form className="space-y-4">
                  <div>
                    <Label htmlFor="contact-name">Name</Label>
                    <Input id="contact-name" placeholder="Your name" />
                  </div>
                  <div>
                    <Label htmlFor="contact-email">Email</Label>
                    <Input id="contact-email" type="email" placeholder="Your email" />
                  </div>
                  <div>
                    <Label htmlFor="contact-message">Message</Label>
                    <Textarea id="contact-message" placeholder="Your message" rows={4} />
                  </div>
                  <Button type="submit" className="w-full">Send Message</Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <GraduationCap className="h-8 w-8 text-blue-400" />
              <span className="text-2xl font-bold">Excellence Academy</span>
            </div>
            <p className="text-gray-400 mb-4">Empowering minds, shaping futures</p>
            <p className="text-sm text-gray-500">
              © 2025 Excellence Academy. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}