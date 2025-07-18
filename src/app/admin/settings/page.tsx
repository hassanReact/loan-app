"use client"

import type React from "react"
import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Label } from "@/components/ui/label"
import {
  Settings,
  Building,
  CreditCard,
  Users,
  Mail,
  Shield,
  Server,
  Save,
  CheckCircle,
  AlertCircle,
  Loader2,
  Bell,
  Database,
  Key,
  Clock,
  FileText,
  Zap,
} from "lucide-react"
import { isAxiosError } from "axios" // Import isAxiosError

export default function AdminSettingsPage() {
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")

  // General Settings State
  const [generalSettings, setGeneralSettings] = useState({
    siteName: "SwiftLoan",
    siteDescription: "Fast and simple loan application system",
    supportEmail: "support@swiftloan.com",
    companyAddress: "123 Finance Street, Business City, BC 12345",
    timezone: "UTC",
    currency: "USD",
    maintenanceMode: false,
  })
  // Loan Settings State
  const [loanSettings, setLoanSettings] = useState({
    minLoanAmount: 1000,
    maxLoanAmount: 50000,
    defaultInterestRate: 12.5,
    maxLoanTerm: 60,
    processingFee: 2.5,
    autoApprovalLimit: 5000,
    requireDocuments: 5,
    approvalTimeframe: 24,
  })
  // User Settings State
  const [userSettings, setUserSettings] = useState({
    allowRegistration: true,
    requireEmailVerification: true,
    passwordMinLength: 8,
    sessionTimeout: 30,
    maxLoginAttempts: 5,
    accountLockoutTime: 15,
  })
  // Notification Settings State
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
    adminAlerts: true,
    loanStatusUpdates: true,
    paymentReminders: true,
    marketingEmails: false,
  })
  // Security Settings State
  const [securitySettings, setSecuritySettings] = useState({
    twoFactorAuth: false,
    ipWhitelist: "",
    encryptionLevel: "AES-256",
    auditLogging: true,
    dataRetention: 7,
    backupFrequency: "daily",
  })
  // System Settings State
  const [systemSettings, setSystemSettings] = useState({
    apiRateLimit: 1000,
    maxFileSize: 10,
    allowedFileTypes: "jpg,png,pdf,doc,docx",
    cacheExpiry: 3600,
    debugMode: false,
    logLevel: "info",
  })

  const handleSaveSettings = async (section: string) => {
    setLoading(true)
    setMessage("")
    setError("")
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))
      // Here you would make actual API calls to save settings
      // await axios.put(`/api/admin/settings/${section}`, settingsData)
      setMessage(`${section} settings saved successfully!`)
    } catch (err: unknown) {
      // Type 'unknown' is safer than 'any'
      if (isAxiosError(err)) {
        setError(err.response?.data?.message || `Failed to save ${section} settings`)
      } else if (err instanceof Error) {
        setError(err.message || `Failed to save ${section} settings`)
      } else {
        setError(`An unexpected error occurred while saving ${section} settings`)
      }
    } finally {
      setLoading(false)
    }
  }

  const SettingsCard = ({
    title,
    description,
    icon: Icon, // Renamed to Icon to follow React component naming convention
    children,
    onSave,
  }: {
    title: string
    description: string
    icon: React.ElementType // Use React.ElementType for component type
    children: React.ReactNode
    onSave: () => void
  }) => (
    <Card className="border-0 shadow-lg bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Icon className="h-5 w-5 text-blue-600" />
          <span>{title}</span>
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {children}
        <div className="flex justify-end pt-4 border-t">
          <Button onClick={onSave} disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  )

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Settings</h1>
          <p className="text-gray-600 dark:text-gray-400">Configure your SwiftLoan platform</p>
        </div>
        <Badge variant="secondary" className="text-lg px-4 py-2">
          <Settings className="mr-2 h-4 w-4" />
          Admin Configuration
        </Badge>
      </div>

      {/* Status Messages */}
      {message && (
        <Alert className="border-green-200 bg-green-50 dark:bg-green-900/20">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800 dark:text-green-200">{message}</AlertDescription>
        </Alert>
      )}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 lg:grid-cols-6">
          <TabsTrigger value="general" className="flex items-center space-x-2">
            <Building className="h-4 w-4" />
            <span className="hidden sm:inline">General</span>
          </TabsTrigger>
          <TabsTrigger value="loans" className="flex items-center space-x-2">
            <CreditCard className="h-4 w-4" />
            <span className="hidden sm:inline">Loans</span>
          </TabsTrigger>
          <TabsTrigger value="users" className="flex items-center space-x-2">
            <Users className="h-4 w-4" />
            <span className="hidden sm:inline">Users</span>
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center space-x-2">
            <Bell className="h-4 w-4" />
            <span className="hidden sm:inline">Notifications</span>
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center space-x-2">
            <Shield className="h-4 w-4" />
            <span className="hidden sm:inline">Security</span>
          </TabsTrigger>
          <TabsTrigger value="system" className="flex items-center space-x-2">
            <Server className="h-4 w-4" />
            <span className="hidden sm:inline">System</span>
          </TabsTrigger>
        </TabsList>

        {/* General Settings */}
        <TabsContent value="general">
          <SettingsCard
            title="General Settings"
            description="Basic platform configuration and company information"
            icon={Building}
            onSave={() => handleSaveSettings("general")}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="siteName">Site Name</Label>
                <Input
                  id="siteName"
                  value={generalSettings.siteName}
                  onChange={(e) => setGeneralSettings({ ...generalSettings, siteName: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="supportEmail">Support Email</Label>
                <Input
                  id="supportEmail"
                  type="email"
                  value={generalSettings.supportEmail}
                  onChange={(e) => setGeneralSettings({ ...generalSettings, supportEmail: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="timezone">Timezone</Label>
                <Select
                  value={generalSettings.timezone}
                  onValueChange={(value) => setGeneralSettings({ ...generalSettings, timezone: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="UTC">UTC</SelectItem>
                    <SelectItem value="EST">Eastern Time</SelectItem>
                    <SelectItem value="PST">Pacific Time</SelectItem>
                    <SelectItem value="CST">Central Time</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="currency">Default Currency</Label>
                <Select
                  value={generalSettings.currency}
                  onValueChange={(value) => setGeneralSettings({ ...generalSettings, currency: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="USD">USD - US Dollar</SelectItem>
                    <SelectItem value="EUR">EUR - Euro</SelectItem>
                    <SelectItem value="GBP">GBP - British Pound</SelectItem>
                    <SelectItem value="CAD">CAD - Canadian Dollar</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="siteDescription">Site Description</Label>
              <Textarea
                id="siteDescription"
                value={generalSettings.siteDescription}
                onChange={(e) => setGeneralSettings({ ...generalSettings, siteDescription: e.target.value })}
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="companyAddress">Company Address</Label>
              <Textarea
                id="companyAddress"
                value={generalSettings.companyAddress}
                onChange={(e) => setGeneralSettings({ ...generalSettings, companyAddress: e.target.value })}
                rows={2}
              />
            </div>
            <div className="flex items-center justify-between p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
              <div className="flex items-center space-x-3">
                <Zap className="h-5 w-5 text-yellow-600" />
                <div>
                  <Label htmlFor="maintenanceMode">Maintenance Mode</Label>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Enable to temporarily disable user access</p>
                </div>
              </div>
              <Switch
                id="maintenanceMode"
                checked={generalSettings.maintenanceMode}
                onCheckedChange={(checked) => setGeneralSettings({ ...generalSettings, maintenanceMode: checked })}
              />
            </div>
          </SettingsCard>
        </TabsContent>

        {/* Loan Settings */}
        <TabsContent value="loans">
          <SettingsCard
            title="Loan Configuration"
            description="Configure loan parameters, limits, and processing rules"
            icon={CreditCard}
            onSave={() => handleSaveSettings("loans")}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="minLoanAmount">Minimum Loan Amount ($)</Label>
                <Input
                  id="minLoanAmount"
                  type="number"
                  value={loanSettings.minLoanAmount}
                  onChange={(e) => setLoanSettings({ ...loanSettings, minLoanAmount: Number(e.target.value) })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="maxLoanAmount">Maximum Loan Amount ($)</Label>
                <Input
                  id="maxLoanAmount"
                  type="number"
                  value={loanSettings.maxLoanAmount}
                  onChange={(e) => setLoanSettings({ ...loanSettings, maxLoanAmount: Number(e.target.value) })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="defaultInterestRate">Default Interest Rate (%)</Label>
                <Input
                  id="defaultInterestRate"
                  type="number"
                  step="0.1"
                  value={loanSettings.defaultInterestRate}
                  onChange={(e) => setLoanSettings({ ...loanSettings, defaultInterestRate: Number(e.target.value) })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="maxLoanTerm">Maximum Loan Term (months)</Label>
                <Input
                  id="maxLoanTerm"
                  type="number"
                  value={loanSettings.maxLoanTerm}
                  onChange={(e) => setLoanSettings({ ...loanSettings, maxLoanTerm: Number(e.target.value) })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="processingFee">Processing Fee (%)</Label>
                <Input
                  id="processingFee"
                  type="number"
                  step="0.1"
                  value={loanSettings.processingFee}
                  onChange={(e) => setLoanSettings({ ...loanSettings, processingFee: Number(e.target.value) })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="autoApprovalLimit">Auto-Approval Limit ($)</Label>
                <Input
                  id="autoApprovalLimit"
                  type="number"
                  value={loanSettings.autoApprovalLimit}
                  onChange={(e) => setLoanSettings({ ...loanSettings, autoApprovalLimit: Number(e.target.value) })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="requireDocuments">Required Documents Count</Label>
                <Input
                  id="requireDocuments"
                  type="number"
                  value={loanSettings.requireDocuments}
                  onChange={(e) => setLoanSettings({ ...loanSettings, requireDocuments: Number(e.target.value) })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="approvalTimeframe">Approval Timeframe (hours)</Label>
                <Input
                  id="approvalTimeframe"
                  type="number"
                  value={loanSettings.approvalTimeframe}
                  onChange={(e) => setLoanSettings({ ...loanSettings, approvalTimeframe: Number(e.target.value) })}
                />
              </div>
            </div>
          </SettingsCard>
        </TabsContent>

        {/* User Settings */}
        <TabsContent value="users">
          <SettingsCard
            title="User Management"
            description="Configure user registration, authentication, and security policies"
            icon={Users}
            onSave={() => handleSaveSettings("users")}
          >
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="passwordMinLength">Minimum Password Length</Label>
                  <Input
                    id="passwordMinLength"
                    type="number"
                    value={userSettings.passwordMinLength}
                    onChange={(e) => setUserSettings({ ...userSettings, passwordMinLength: Number(e.target.value) })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sessionTimeout">Session Timeout (minutes)</Label>
                  <Input
                    id="sessionTimeout"
                    type="number"
                    value={userSettings.sessionTimeout}
                    onChange={(e) => setUserSettings({ ...userSettings, sessionTimeout: Number(e.target.value) })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="maxLoginAttempts">Max Login Attempts</Label>
                  <Input
                    id="maxLoginAttempts"
                    type="number"
                    value={userSettings.maxLoginAttempts}
                    onChange={(e) => setUserSettings({ ...userSettings, maxLoginAttempts: Number(e.target.value) })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="accountLockoutTime">Account Lockout Time (minutes)</Label>
                  <Input
                    id="accountLockoutTime"
                    type="number"
                    value={userSettings.accountLockoutTime}
                    onChange={(e) => setUserSettings({ ...userSettings, accountLockoutTime: Number(e.target.value) })}
                  />
                </div>
              </div>
              <Separator />
              <div className="space-y-4">
                <h4 className="text-lg font-medium">User Registration Settings</h4>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Users className="h-5 w-5 text-blue-600" />
                      <div>
                        <Label htmlFor="allowRegistration">Allow New Registrations</Label>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Enable new users to create accounts</p>
                      </div>
                    </div>
                    <Switch
                      id="allowRegistration"
                      checked={userSettings.allowRegistration}
                      onCheckedChange={(checked) => setUserSettings({ ...userSettings, allowRegistration: checked })}
                    />
                  </div>
                  <div className="flex items-center justify-between p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Mail className="h-5 w-5 text-green-600" />
                      <div>
                        <Label htmlFor="requireEmailVerification">Require Email Verification</Label>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Users must verify their email before accessing the platform
                        </p>
                      </div>
                    </div>
                    <Switch
                      id="requireEmailVerification"
                      checked={userSettings.requireEmailVerification}
                      onCheckedChange={(checked) =>
                        setUserSettings({ ...userSettings, requireEmailVerification: checked })
                      }
                    />
                  </div>
                </div>
              </div>
            </div>
          </SettingsCard>
        </TabsContent>

        {/* Notification Settings */}
        <TabsContent value="notifications">
          <SettingsCard
            title="Notification Settings"
            description="Configure email, SMS, and push notification preferences"
            icon={Bell}
            onSave={() => handleSaveSettings("notifications")}
          >
            <div className="space-y-6">
              <div className="space-y-4">
                <h4 className="text-lg font-medium">Communication Channels</h4>
                <div className="grid gap-4">
                  <div className="flex items-center justify-between p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Mail className="h-5 w-5 text-blue-600" />
                      <div>
                        <Label htmlFor="emailNotifications">Email Notifications</Label>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Send notifications via email</p>
                      </div>
                    </div>
                    <Switch
                      id="emailNotifications"
                      checked={notificationSettings.emailNotifications}
                      onCheckedChange={(checked) =>
                        setNotificationSettings({ ...notificationSettings, emailNotifications: checked })
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Bell className="h-5 w-5 text-green-600" />
                      <div>
                        <Label htmlFor="pushNotifications">Push Notifications</Label>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Browser and mobile push notifications
                        </p>
                      </div>
                    </div>
                    <Switch
                      id="pushNotifications"
                      checked={notificationSettings.pushNotifications}
                      onCheckedChange={(checked) =>
                        setNotificationSettings({ ...notificationSettings, pushNotifications: checked })
                      }
                    />
                  </div>
                </div>
              </div>
              <Separator />
              <div className="space-y-4">
                <h4 className="text-lg font-medium">Notification Types</h4>
                <div className="grid gap-4">
                  <div className="flex items-center justify-between p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Shield className="h-5 w-5 text-purple-600" />
                      <div>
                        <Label htmlFor="adminAlerts">Admin Alerts</Label>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Critical system and security alerts</p>
                      </div>
                    </div>
                    <Switch
                      id="adminAlerts"
                      checked={notificationSettings.adminAlerts}
                      onCheckedChange={(checked) =>
                        setNotificationSettings({ ...notificationSettings, adminAlerts: checked })
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <FileText className="h-5 w-5 text-yellow-600" />
                      <div>
                        <Label htmlFor="loanStatusUpdates">Loan Status Updates</Label>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Notify users about loan application changes
                        </p>
                      </div>
                    </div>
                    <Switch
                      id="loanStatusUpdates"
                      checked={notificationSettings.loanStatusUpdates}
                      onCheckedChange={(checked) =>
                        setNotificationSettings({ ...notificationSettings, loanStatusUpdates: checked })
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Clock className="h-5 w-5 text-orange-600" />
                      <div>
                        <Label htmlFor="paymentReminders">Payment Reminders</Label>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Remind users about upcoming payments</p>
                      </div>
                    </div>
                    <Switch
                      id="paymentReminders"
                      checked={notificationSettings.paymentReminders}
                      onCheckedChange={(checked) =>
                        setNotificationSettings({ ...notificationSettings, paymentReminders: checked })
                      }
                    />
                  </div>
                </div>
              </div>
            </div>
          </SettingsCard>
        </TabsContent>

        {/* Security Settings */}
        <TabsContent value="security">
          <SettingsCard
            title="Security Configuration"
            description="Configure security policies, encryption, and audit settings"
            icon={Shield}
            onSave={() => handleSaveSettings("security")}
          >
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="encryptionLevel">Encryption Level</Label>
                  <Select
                    value={securitySettings.encryptionLevel}
                    onValueChange={(value) => setSecuritySettings({ ...securitySettings, encryptionLevel: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="AES-128">AES-128</SelectItem>
                      <SelectItem value="AES-256">AES-256</SelectItem>
                      <SelectItem value="RSA-2048">RSA-2048</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dataRetention">Data Retention (years)</Label>
                  <Input
                    id="dataRetention"
                    type="number"
                    value={securitySettings.dataRetention}
                    onChange={(e) =>
                      setSecuritySettings({ ...securitySettings, dataRetention: Number(e.target.value) })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="backupFrequency">Backup Frequency</Label>
                  <Select
                    value={securitySettings.backupFrequency}
                    onValueChange={(value) => setSecuritySettings({ ...securitySettings, backupFrequency: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hourly">Hourly</SelectItem>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="ipWhitelist">IP Whitelist (comma-separated)</Label>
                <Textarea
                  id="ipWhitelist"
                  placeholder="192.168.1.1, 10.0.0.1, ..."
                  value={securitySettings.ipWhitelist}
                  onChange={(e) => setSecuritySettings({ ...securitySettings, ipWhitelist: e.target.value })}
                  rows={3}
                />
              </div>
              <Separator />
              <div className="space-y-4">
                <h4 className="text-lg font-medium">Security Features</h4>
                <div className="grid gap-4">
                  <div className="flex items-center justify-between p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Key className="h-5 w-5 text-red-600" />
                      <div>
                        <Label htmlFor="twoFactorAuth">Two-Factor Authentication</Label>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Require 2FA for admin accounts</p>
                      </div>
                    </div>
                    <Switch
                      id="twoFactorAuth"
                      checked={securitySettings.twoFactorAuth}
                      onCheckedChange={(checked) =>
                        setSecuritySettings({ ...securitySettings, twoFactorAuth: checked })
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Database className="h-5 w-5 text-blue-600" />
                      <div>
                        <Label htmlFor="auditLogging">Audit Logging</Label>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Log all administrative actions</p>
                      </div>
                    </div>
                    <Switch
                      id="auditLogging"
                      checked={securitySettings.auditLogging}
                      onCheckedChange={(checked) => setSecuritySettings({ ...securitySettings, auditLogging: checked })}
                    />
                  </div>
                </div>
              </div>
            </div>
          </SettingsCard>
        </TabsContent>

        {/* System Settings */}
        <TabsContent value="system">
          <SettingsCard
            title="System Configuration"
            description="Configure system performance, API limits, and technical settings"
            icon={Server}
            onSave={() => handleSaveSettings("system")}
          >
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="apiRateLimit">API Rate Limit (requests/hour)</Label>
                  <Input
                    id="apiRateLimit"
                    type="number"
                    value={systemSettings.apiRateLimit}
                    onChange={(e) => setSystemSettings({ ...systemSettings, apiRateLimit: Number(e.target.value) })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="maxFileSize">Max File Size (MB)</Label>
                  <Input
                    id="maxFileSize"
                    type="number"
                    value={systemSettings.maxFileSize}
                    onChange={(e) => setSystemSettings({ ...systemSettings, maxFileSize: Number(e.target.value) })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cacheExpiry">Cache Expiry (seconds)</Label>
                  <Input
                    id="cacheExpiry"
                    type="number"
                    value={systemSettings.cacheExpiry}
                    onChange={(e) => setSystemSettings({ ...systemSettings, cacheExpiry: Number(e.target.value) })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="logLevel">Log Level</Label>
                  <Select
                    value={systemSettings.logLevel}
                    onValueChange={(value) => setSystemSettings({ ...systemSettings, logLevel: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="error">Error</SelectItem>
                      <SelectItem value="warn">Warning</SelectItem>
                      <SelectItem value="info">Info</SelectItem>
                      <SelectItem value="debug">Debug</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="allowedFileTypes">Allowed File Types (comma-separated)</Label>
                <Input
                  id="allowedFileTypes"
                  placeholder="jpg,png,pdf,doc,docx"
                  value={systemSettings.allowedFileTypes}
                  onChange={(e) => setSystemSettings({ ...systemSettings, allowedFileTypes: e.target.value })}
                />
              </div>
              <Separator />
              <div className="space-y-4">
                <h4 className="text-lg font-medium">Development Settings</h4>
                <div className="flex items-center justify-between p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <AlertCircle className="h-5 w-5 text-yellow-600" />
                    <div>
                      <Label htmlFor="debugMode">Debug Mode</Label>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Enable detailed error messages and logging
                      </p>
                    </div>
                  </div>
                  <Switch
                    id="debugMode"
                    checked={systemSettings.debugMode}
                    onCheckedChange={(checked) => setSystemSettings({ ...systemSettings, debugMode: checked })}
                  />
                </div>
              </div>
            </div>
          </SettingsCard>
        </TabsContent>
      </Tabs>
    </div>
  )
}
