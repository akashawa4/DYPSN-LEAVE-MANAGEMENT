export interface User {
  id: string;
  name: string;
  email: string;
  role: 'teacher' | 'hod' | 'principal' | 'director' | 'registrar' | 'hr';
  department: string;
  accessLevel: 'basic' | 'approver' | 'full';
  avatar?: string;
  isActive: boolean;
  phone?: string;
  employeeId?: string;
  joiningDate?: string;
  designation?: string;
  createdAt?: string;
  lastLogin?: string;
  loginCount?: number;
}

export interface LeaveRequest {
  id: string;
  userId: string;
  userName: string;
  department: string;
  leaveType: 'CL' | 'ML' | 'EL' | 'LOP' | 'COH';
  fromDate: string;
  toDate: string;
  reason: string;
  status: 'pending' | 'approved' | 'rejected' | 'returned';
  submittedAt: string;
  approvedBy?: string;
  approvedAt?: string;
  remarks?: string;
  daysCount: number;
}

export interface AttendanceRecord {
  id: string;
  userId: string;
  date: string;
  clockIn: string;
  clockOut?: string;
  status: 'present' | 'absent' | 'late' | 'leave';
  workingHours?: number;
}

export interface LeaveBalance {
  userId: string;
  CL: number;
  ML: number;
  EL: number;
  totalUsed: number;
  totalAvailable: number;
}

export interface AuditLog {
  id: string;
  userId: string;
  userName: string;
  action: string;
  target: string;
  timestamp: string;
  details: Record<string, any>;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  timestamp: string;
  read: boolean;
  targetRoles?: string[];
}