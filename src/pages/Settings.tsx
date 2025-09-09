import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { 
  Settings as SettingsIcon, 
  School, 
  Bell, 
  Shield, 
  Database, 
  Mail,
  Smartphone,
  CreditCard,
  Save
} from 'lucide-react';
import RoleBasedLayout from '@/components/RoleBasedLayout';

export default function Settings() {
  const [schoolSettings, setSchoolSettings] = useState({
    name: 'Excellence Academy',
    address: '123 Education Street, Learning City, LC 12345',
    phone: '+1 (555) 123-4567',
    email: 'info@excellenceacademy.edu',
    website: 'www.excellenceacademy.edu',
    principalName: 'Dr. Sarah Johnson',
    establishedYear: '1998',
    affiliation: 'State Education Board'
  });

  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    smsNotifications: true,
    pushNotifications: true,
    feeReminders: true,
    attendanceAlerts: true,
    examNotifications: true,
    announcementAlerts: true
  });

  const [systemSettings, setSystemSettings] = useState({
    maintenanceMode: false,
    autoBackup: true,
    sessionTimeout: '30',
    maxLoginAttempts: '3',
    passwordExpiry: '90',
    twoFactorAuth: false
  });

  const [integrationSettings, setIntegrationSettings] = useState({
    smsProvider: 'Twilio',
    smsApiKey: '••••••••••••',
    emailProvider: 'SendGrid',
    emailApiKey: '••••••••••••',
    paymentGateway: 'Razorpay',
    paymentApiKey: '••••••••••••'
  });

  const handleSaveSchoolSettings = () => {
    // Save school settings logic
    console.log('School settings saved:', schoolSettings);
  };

  const handleSaveNotificationSettings = () => {
    // Save notification settings logic
    console.log('Notification settings saved:', notificationSettings);
  };

  const handleSaveSystemSettings = () => {
    // Save system settings logic
    console.log('System settings saved:', systemSettings);
  };

  const handleSaveIntegrationSettings = () => {
    // Save integration settings logic
    console.log('Integration settings saved:', integrationSettings);
  };

  const renderSchoolSettings = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <School className="mr-2 h-5 w-5" />
            School Information
          </CardTitle>
          <CardDescription>Basic information about your school</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="schoolName">School Name</Label>
              <Input
                id="schoolName"
                value={schoolSettings.name}
                onChange={(e) => setSchoolSettings({ ...schoolSettings, name: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="principalName">Principal Name</Label>
              <Input
                id="principalName"
                value={schoolSettings.principalName}
                onChange={(e) => setSchoolSettings({ ...schoolSettings, principalName: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                value={schoolSettings.phone}
                onChange={(e) => setSchoolSettings({ ...schoolSettings, phone: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={schoolSettings.email}
                onChange={(e) => setSchoolSettings({ ...schoolSettings, email: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="website">Website</Label>
              <Input
                id="website"
                value={schoolSettings.website}
                onChange={(e) => setSchoolSettings({ ...schoolSettings, website: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="establishedYear">Established Year</Label>
              <Input
                id="establishedYear"
                value={schoolSettings.establishedYear}
                onChange={(e) => setSchoolSettings({ ...schoolSettings, establishedYear: e.target.value })}
              />
            </div>
          </div>
          <div>
            <Label htmlFor="address">Address</Label>
            <Textarea
              id="address"
              value={schoolSettings.address}
              onChange={(e) => setSchoolSettings({ ...schoolSettings, address: e.target.value })}
              rows={3}
            />
          </div>
          <div>
            <Label htmlFor="affiliation">Board Affiliation</Label>
            <Input
              id="affiliation"
              value={schoolSettings.affiliation}
              onChange={(e) => setSchoolSettings({ ...schoolSettings, affiliation: e.target.value })}
            />
          </div>
          <Button onClick={handleSaveSchoolSettings} className="w-full">
            <Save className="mr-2 h-4 w-4" />
            Save School Settings
          </Button>
        </CardContent>
      </Card>
    </div>
  );

  const renderNotificationSettings = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Bell className="mr-2 h-5 w-5" />
            Notification Preferences
          </CardTitle>
          <CardDescription>Configure how and when notifications are sent</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Email Notifications</Label>
                <p className="text-sm text-gray-600">Receive notifications via email</p>
              </div>
              <Switch
                checked={notificationSettings.emailNotifications}
                onCheckedChange={(checked) => 
                  setNotificationSettings({ ...notificationSettings, emailNotifications: checked })
                }
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>SMS Notifications</Label>
                <p className="text-sm text-gray-600">Receive notifications via SMS</p>
              </div>
              <Switch
                checked={notificationSettings.smsNotifications}
                onCheckedChange={(checked) => 
                  setNotificationSettings({ ...notificationSettings, smsNotifications: checked })
                }
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Push Notifications</Label>
                <p className="text-sm text-gray-600">Receive browser push notifications</p>
              </div>
              <Switch
                checked={notificationSettings.pushNotifications}
                onCheckedChange={(checked) => 
                  setNotificationSettings({ ...notificationSettings, pushNotifications: checked })
                }
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Fee Reminders</Label>
                <p className="text-sm text-gray-600">Automatic fee payment reminders</p>
              </div>
              <Switch
                checked={notificationSettings.feeReminders}
                onCheckedChange={(checked) => 
                  setNotificationSettings({ ...notificationSettings, feeReminders: checked })
                }
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Attendance Alerts</Label>
                <p className="text-sm text-gray-600">Alerts for attendance issues</p>
              </div>
              <Switch
                checked={notificationSettings.attendanceAlerts}
                onCheckedChange={(checked) => 
                  setNotificationSettings({ ...notificationSettings, attendanceAlerts: checked })
                }
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Exam Notifications</Label>
                <p className="text-sm text-gray-600">Exam schedules and results</p>
              </div>
              <Switch
                checked={notificationSettings.examNotifications}
                onCheckedChange={(checked) => 
                  setNotificationSettings({ ...notificationSettings, examNotifications: checked })
                }
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Announcement Alerts</Label>
                <p className="text-sm text-gray-600">School announcements and circulars</p>
              </div>
              <Switch
                checked={notificationSettings.announcementAlerts}
                onCheckedChange={(checked) => 
                  setNotificationSettings({ ...notificationSettings, announcementAlerts: checked })
                }
              />
            </div>
          </div>
          <Button onClick={handleSaveNotificationSettings} className="w-full">
            <Save className="mr-2 h-4 w-4" />
            Save Notification Settings
          </Button>
        </CardContent>
      </Card>
    </div>
  );

  const renderSystemSettings = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Shield className="mr-2 h-5 w-5" />
            Security & System Settings
          </CardTitle>
          <CardDescription>Configure system security and performance settings</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Maintenance Mode</Label>
                <p className="text-sm text-gray-600">Enable maintenance mode for system updates</p>
              </div>
              <Switch
                checked={systemSettings.maintenanceMode}
                onCheckedChange={(checked) => 
                  setSystemSettings({ ...systemSettings, maintenanceMode: checked })
                }
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Auto Backup</Label>
                <p className="text-sm text-gray-600">Automatic daily database backups</p>
              </div>
              <Switch
                checked={systemSettings.autoBackup}
                onCheckedChange={(checked) => 
                  setSystemSettings({ ...systemSettings, autoBackup: checked })
                }
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Two-Factor Authentication</Label>
                <p className="text-sm text-gray-600">Require 2FA for admin accounts</p>
              </div>
              <Switch
                checked={systemSettings.twoFactorAuth}
                onCheckedChange={(checked) => 
                  setSystemSettings({ ...systemSettings, twoFactorAuth: checked })
                }
              />
            </div>
          </div>
          <Separator />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="sessionTimeout">Session Timeout (minutes)</Label>
              <Input
                id="sessionTimeout"
                value={systemSettings.sessionTimeout}
                onChange={(e) => setSystemSettings({ ...systemSettings, sessionTimeout: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="maxLoginAttempts">Max Login Attempts</Label>
              <Input
                id="maxLoginAttempts"
                value={systemSettings.maxLoginAttempts}
                onChange={(e) => setSystemSettings({ ...systemSettings, maxLoginAttempts: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="passwordExpiry">Password Expiry (days)</Label>
              <Input
                id="passwordExpiry"
                value={systemSettings.passwordExpiry}
                onChange={(e) => setSystemSettings({ ...systemSettings, passwordExpiry: e.target.value })}
              />
            </div>
          </div>
          <Button onClick={handleSaveSystemSettings} className="w-full">
            <Save className="mr-2 h-4 w-4" />
            Save System Settings
          </Button>
        </CardContent>
      </Card>
    </div>
  );

  const renderIntegrationSettings = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Database className="mr-2 h-5 w-5" />
            Third-Party Integrations
          </CardTitle>
          <CardDescription>Configure external service integrations</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center space-x-3">
                <Smartphone className="h-5 w-5 text-blue-600" />
                <div>
                  <Label>SMS Provider</Label>
                  <p className="text-sm text-gray-600">Current: {integrationSettings.smsProvider}</p>
                </div>
              </div>
              <Badge className="bg-green-100 text-green-800">Connected</Badge>
            </div>
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-red-600" />
                <div>
                  <Label>Email Provider</Label>
                  <p className="text-sm text-gray-600">Current: {integrationSettings.emailProvider}</p>
                </div>
              </div>
              <Badge className="bg-green-100 text-green-800">Connected</Badge>
            </div>
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center space-x-3">
                <CreditCard className="h-5 w-5 text-purple-600" />
                <div>
                  <Label>Payment Gateway</Label>
                  <p className="text-sm text-gray-600">Current: {integrationSettings.paymentGateway}</p>
                </div>
              </div>
              <Badge className="bg-green-100 text-green-800">Connected</Badge>
            </div>
          </div>
          <Separator />
          <div className="space-y-4">
            <div>
              <Label htmlFor="smsApiKey">SMS API Key</Label>
              <Input
                id="smsApiKey"
                type="password"
                value={integrationSettings.smsApiKey}
                onChange={(e) => setIntegrationSettings({ ...integrationSettings, smsApiKey: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="emailApiKey">Email API Key</Label>
              <Input
                id="emailApiKey"
                type="password"
                value={integrationSettings.emailApiKey}
                onChange={(e) => setIntegrationSettings({ ...integrationSettings, emailApiKey: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="paymentApiKey">Payment Gateway API Key</Label>
              <Input
                id="paymentApiKey"
                type="password"
                value={integrationSettings.paymentApiKey}
                onChange={(e) => setIntegrationSettings({ ...integrationSettings, paymentApiKey: e.target.value })}
              />
            </div>
          </div>
          <Button onClick={handleSaveIntegrationSettings} className="w-full">
            <Save className="mr-2 h-4 w-4" />
            Save Integration Settings
          </Button>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <RoleBasedLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">System Settings</h1>
          <p className="text-gray-600">Configure school and system settings</p>
        </div>

        <Tabs defaultValue="school" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="school">School Info</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="system">Security</TabsTrigger>
            <TabsTrigger value="integrations">Integrations</TabsTrigger>
          </TabsList>

          <TabsContent value="school">
            {renderSchoolSettings()}
          </TabsContent>

          <TabsContent value="notifications">
            {renderNotificationSettings()}
          </TabsContent>

          <TabsContent value="system">
            {renderSystemSettings()}
          </TabsContent>

          <TabsContent value="integrations">
            {renderIntegrationSettings()}
          </TabsContent>
        </Tabs>
      </div>
    </RoleBasedLayout>
  );
}