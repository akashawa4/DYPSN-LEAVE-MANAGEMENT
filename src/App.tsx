import React, { useState, useRef } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import LoginForm from './components/Auth/LoginForm';
import Sidebar from './components/Layout/Sidebar';
import Header from './components/Layout/Header';
import Dashboard from './components/Dashboard/Dashboard';
import LeaveRequestForm from './components/Leave/LeaveRequestForm';
import LeaveApprovalPanel from './components/Leave/LeaveApprovalPanel';
import MyLeaves from './components/Leave/MyLeaves';
import MyAttendance from './components/Attendance/MyAttendance';
import Notifications from './components/Notifications/Notifications';
import { Upload, BarChart3, Users, Calendar, FileText } from 'lucide-react';
import { saveAllDemoUsersToFirebase } from './contexts/AuthContext';

const ProfilePage: React.FC<{ user: any }> = ({ user }) => (
  <div className="max-w-md mx-auto bg-white rounded-xl shadow-md p-6 border border-gray-200 mt-8">
    <div className="flex flex-col items-center">
      <img
        src={user?.avatar || 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150'}
        alt={user?.name}
        className="w-24 h-24 rounded-full object-cover mb-4 border-4 border-blue-100"
      />
      <h2 className="text-2xl font-bold text-gray-900 mb-1">{user?.name}</h2>
      <p className="text-gray-600 mb-2">{user?.email}</p>
      <p className="text-blue-600 capitalize font-medium mb-4">{user?.role}</p>
      <div className="w-full border-t border-gray-200 pt-4">
        <p className="text-sm text-gray-500 mb-1"><span className="font-semibold text-gray-700">Department:</span> {user?.department}</p>
        <p className="text-sm text-gray-500 mb-1"><span className="font-semibold text-gray-700">Access Level:</span> {user?.accessLevel}</p>
        <p className="text-sm text-gray-500 mb-1"><span className="font-semibold text-gray-700">Status:</span> {user?.isActive ? 'Active' : 'Inactive'}</p>
      </div>
    </div>
  </div>
);

const initialMockUsers = [
  {
    id: 'teacher001',
    name: 'Dr. Sarah Johnson',
    email: 'sarah.johnson@dypsn.edu',
    phone: '+91 98765 43210',
    role: 'teacher',
    department: 'Computer Science',
    status: 'Active',
  },
  {
    id: 'hod001',
    name: 'Dr. Michael Chen',
    email: 'michael.chen@dypsn.edu',
    phone: '+91 98765 43211',
    role: 'hod',
    department: 'Computer Science',
    status: 'Active',
  },
  {
    id: 'principal001',
    name: 'Dr. Priya Sharma',
    email: 'priya.sharma@dypsn.edu',
    phone: '+91 98765 43212',
    role: 'principal',
    department: 'Administration',
    status: 'Active',
  },
  {
    id: 'registrar001',
    name: 'Ms. Anjali Desai',
    email: 'anjali.desai@dypsn.edu',
    phone: '+91 98765 43213',
    role: 'registrar',
    department: 'Administration',
    status: 'Active',
  },
];

const UserManagementPage: React.FC = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [users, setUsers] = React.useState(initialMockUsers);
  const [form, setForm] = React.useState({
    name: '',
    email: '',
    phone: '',
    role: '',
    department: '',
  });
  const [selectedUser, setSelectedUser] = React.useState<any | null>(null);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.phone || !form.role) return;
    setUsers([
      ...users,
      {
        id: `user${Date.now()}`,
        name: form.name,
        email: form.email,
        phone: form.phone,
        role: form.role,
        department: form.department || '-',
        status: 'Active',
      },
    ]);
    setForm({ name: '', email: '', phone: '', role: '', department: '' });
  };
  return (
    <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-md p-6 border border-gray-200 mt-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">User Management</h2>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <input name="name" value={form.name} onChange={handleChange} type="text" className="w-full border border-gray-300 rounded-lg p-2" placeholder="Full Name" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input name="email" value={form.email} onChange={handleChange} type="email" className="w-full border border-gray-300 rounded-lg p-2" placeholder="Email Address" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
            <input name="phone" value={form.phone} onChange={handleChange} type="tel" className="w-full border border-gray-300 rounded-lg p-2" placeholder="Phone Number" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
            <select name="role" value={form.role} onChange={handleChange} className="w-full border border-gray-300 rounded-lg p-2">
              <option value="">Select Role</option>
              <option value="teacher">Teacher</option>
              <option value="hod">HOD</option>
              <option value="principal">Principal</option>
              <option value="director">Director</option>
              <option value="registrar">Registrar</option>
              <option value="hr">HR</option>
            </select>
          </div>
        </div>
        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition">Add Member</button>
      </form>
      <div className="my-6 border-t border-gray-200"></div>
      <div className="flex flex-col items-center space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Bulk Add via Excel</label>
          <input
            type="file"
            accept=".xlsx,.xls"
            ref={fileInputRef}
            className="hidden"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-700 transition"
          >
            <Upload className="w-5 h-5" />
            <span>Upload Excel Sheet</span>
          </button>
          <p className="text-xs text-gray-500 mt-2">Accepted formats: .xlsx, .xls</p>
        </div>
        
        <div>
          <button
            type="button"
            onClick={saveAllDemoUsersToFirebase}
            className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            <Users className="w-5 h-5" />
            <span>Save Demo Users to Firebase</span>
          </button>
          <p className="text-xs text-gray-500 mt-2">Upload all demo accounts to Firebase Realtime Database</p>
        </div>
      </div>
      <div className="my-6 border-t border-gray-200"></div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">All Users</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-sm border border-gray-200 rounded-lg">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-3 py-2 text-left font-medium text-gray-600">Name</th>
              <th className="px-3 py-2 text-left font-medium text-gray-600">Email</th>
              <th className="px-3 py-2 text-left font-medium text-gray-600">Phone</th>
              <th className="px-3 py-2 text-left font-medium text-gray-600">Role</th>
              <th className="px-3 py-2 text-left font-medium text-gray-600">Department</th>
              <th className="px-3 py-2 text-left font-medium text-gray-600">Status</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr
                key={user.id}
                className="border-t border-gray-100 hover:bg-blue-50 cursor-pointer"
                onClick={() => setSelectedUser(user)}
              >
                <td className="px-3 py-2 font-medium text-gray-900">{user.name}</td>
                <td className="px-3 py-2 text-gray-700">{user.email}</td>
                <td className="px-3 py-2 text-gray-700">{user.phone}</td>
                <td className="px-3 py-2 text-gray-700 capitalize">{user.role}</td>
                <td className="px-3 py-2 text-gray-700">{user.department}</td>
                <td className="px-3 py-2">
                  <span className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${user.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>{user.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* User Info Modal */}
      {selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-xl shadow-xl max-w-sm w-full p-6 relative">
            <button
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 text-xl font-bold"
              onClick={() => setSelectedUser(null)}
            >
              &times;
            </button>
            <div className="flex flex-col items-center">
              <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                <span className="text-3xl font-bold text-blue-600">{selectedUser.name?.charAt(0)}</span>
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-1">{selectedUser.name}</h2>
              <p className="text-gray-600 mb-1">{selectedUser.email}</p>
              <p className="text-gray-600 mb-1">{selectedUser.phone}</p>
              <p className="text-blue-600 capitalize font-medium mb-2">{selectedUser.role}</p>
              <div className="w-full border-t border-gray-200 pt-3 mt-2">
                <p className="text-sm text-gray-500 mb-1"><span className="font-semibold text-gray-700">Department:</span> {selectedUser.department}</p>
                <p className="text-sm text-gray-500 mb-1"><span className="font-semibold text-gray-700">Status:</span> {selectedUser.status}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const ReportsPage: React.FC = () => (
  <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md p-6 border border-gray-200 mt-8">
    <h2 className="text-2xl font-bold text-gray-900 mb-6">MIS & Reports</h2>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      <div className="bg-blue-50 rounded-lg p-4 flex items-center space-x-3 border border-blue-100">
        <Calendar className="w-8 h-8 text-blue-600" />
        <div>
          <h3 className="text-lg font-semibold text-blue-900">Attendance Summary</h3>
          <p className="text-sm text-blue-700">View monthly and yearly attendance stats</p>
        </div>
      </div>
      <div className="bg-green-50 rounded-lg p-4 flex items-center space-x-3 border border-green-100">
        <FileText className="w-8 h-8 text-green-600" />
        <div>
          <h3 className="text-lg font-semibold text-green-900">Leave Trends</h3>
          <p className="text-sm text-green-700">Analyze leave patterns and usage</p>
        </div>
      </div>
      <div className="bg-amber-50 rounded-lg p-4 flex items-center space-x-3 border border-amber-100">
        <Users className="w-8 h-8 text-amber-600" />
        <div>
          <h3 className="text-lg font-semibold text-amber-900">Department Stats</h3>
          <p className="text-sm text-amber-700">Compare department-wise performance</p>
        </div>
      </div>
    </div>
    <div className="bg-gray-50 rounded-lg p-8 flex flex-col items-center justify-center border border-gray-200">
      <BarChart3 className="w-16 h-16 text-gray-400 mb-4" />
      <h4 className="text-lg font-semibold text-gray-700 mb-2">Analytics Chart Placeholder</h4>
      <p className="text-gray-500 text-sm">Charts and analytics will be displayed here in the future.</p>
    </div>
  </div>
);

const AttendanceLogsPage: React.FC = () => {
  const dummyLogs = [
    { name: 'Dr. Sarah Johnson', date: '2024-03-22', status: 'Present', clockIn: '9:15 AM', clockOut: '5:30 PM', department: 'Computer Science' },
    { name: 'Dr. Michael Chen', date: '2024-03-22', status: 'Present', clockIn: '9:05 AM', clockOut: '5:20 PM', department: 'Computer Science' },
    { name: 'Prof. Rajesh Kumar', date: '2024-03-22', status: 'Absent', clockIn: '---', clockOut: '---', department: 'Mechanical Engineering' },
    { name: 'Dr. Priya Mehta', date: '2024-03-22', status: 'Late', clockIn: '9:35 AM', clockOut: '5:45 PM', department: 'Electronics' },
    { name: 'Ms. Anjali Desai', date: '2024-03-22', status: 'Present', clockIn: '9:00 AM', clockOut: '5:10 PM', department: 'Administration' },
  ];
  return (
    <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md p-6 border border-gray-200 mt-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Attendance Logs</h2>
      <div className="mb-4 flex flex-wrap gap-4">
        <div className="bg-green-50 px-4 py-2 rounded-lg text-green-700 font-semibold">Present: 3</div>
        <div className="bg-red-50 px-4 py-2 rounded-lg text-red-700 font-semibold">Absent: 1</div>
        <div className="bg-amber-50 px-4 py-2 rounded-lg text-amber-700 font-semibold">Late: 1</div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm border border-gray-200 rounded-lg">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-3 py-2 text-left font-medium text-gray-600">Name</th>
              <th className="px-3 py-2 text-left font-medium text-gray-600">Date</th>
              <th className="px-3 py-2 text-left font-medium text-gray-600">Status</th>
              <th className="px-3 py-2 text-left font-medium text-gray-600">Clock In</th>
              <th className="px-3 py-2 text-left font-medium text-gray-600">Clock Out</th>
              <th className="px-3 py-2 text-left font-medium text-gray-600">Department</th>
            </tr>
          </thead>
          <tbody>
            {dummyLogs.map((log, idx) => (
              <tr key={idx} className="border-t border-gray-100 hover:bg-gray-50">
                <td className="px-3 py-2 font-medium text-gray-900">{log.name}</td>
                <td className="px-3 py-2 text-gray-700">{log.date}</td>
                <td className="px-3 py-2">
                  <span className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${
                    log.status === 'Present' ? 'bg-green-100 text-green-700' :
                    log.status === 'Absent' ? 'bg-red-100 text-red-700' :
                    log.status === 'Late' ? 'bg-amber-100 text-amber-700' :
                    'bg-gray-100 text-gray-500'
                  }`}>{log.status}</span>
                </td>
                <td className="px-3 py-2 text-gray-700">{log.clockIn}</td>
                <td className="px-3 py-2 text-gray-700">{log.clockOut}</td>
                <td className="px-3 py-2 text-gray-700">{log.department}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const AppContent: React.FC = () => {
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState('dashboard');

  if (!user) {
    return <LoginForm />;
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'profile':
        return <ProfilePage user={user} />;
      case 'dashboard':
        return <Dashboard />;
      case 'apply-leave':
        return <LeaveRequestForm />;
      case 'my-leaves':
        return <MyLeaves />;
      case 'my-attendance':
        return <MyAttendance />;
      case 'notifications':
        return <Notifications />;
      case 'leave-requests':
        return <LeaveApprovalPanel />;
      case 'approvals':
        return <LeaveApprovalPanel />;
      case 'override':
        return (
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Override Center</h1>
            <p className="text-gray-600">Override functionality for special cases will be displayed here.</p>
          </div>
        );
      case 'attendance':
        return <AttendanceLogsPage />;
      case 'reports':
        return <ReportsPage />;
      case 'audit':
        return (
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Audit Logs</h1>
            <p className="text-gray-600">System audit trail and logging will be displayed here.</p>
          </div>
        );
      case 'users':
        return <UserManagementPage />;
      case 'settings':
        return (
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Settings & Policy</h1>
            <p className="text-gray-600">System configuration and leave policies will be displayed here.</p>
          </div>
        );
      case 'broadcast':
        return (
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Broadcast / Notice</h1>
            <p className="text-gray-600">Communication and announcement system will be displayed here.</p>
          </div>
        );
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar 
        isOpen={sidebarOpen} 
        onClose={() => setSidebarOpen(false)}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
      />
      
      <div className="flex-1 flex flex-col overflow-hidden lg:ml-4">
        <Header
          onMenuClick={() => setSidebarOpen(true)}
          onProfileClick={() => setCurrentPage('profile')}
        />
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-1">
          {renderPage()}
        </main>
      </div>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;