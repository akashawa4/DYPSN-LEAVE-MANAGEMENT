import React, { useState } from 'react';
import { Clock, CheckCircle, XCircle, AlertTriangle, X, Filter, Calendar, FileText, User, MapPin, Search } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface ActivityDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ActivityDetailModal: React.FC<ActivityDetailModalProps> = ({ isOpen, onClose }) => {
  const [filterType, setFilterType] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  if (!isOpen) return null;

  const allActivities = [
    {
      id: 1,
      type: 'leave_approved',
      title: 'Leave Request Approved',
      description: 'Your sick leave for March 15-16 has been approved by HR Executive',
      time: '2 hours ago',
      date: '2024-03-22',
      icon: CheckCircle,
      color: 'text-green-600',
      details: {
        leaveType: 'Medical Leave',
        duration: '2 days',
        finalApprover: 'Mr. Arjun Kumar (HR Executive)',
        approvalFlow: 'HOD → Principal → Registrar → HR Executive',
        reason: 'Fever and flu symptoms',
        status: 'Approved'
      }
    },
    {
      id: 2,
      type: 'attendance_marked',
      title: 'Attendance Marked',
      description: 'Clock in at 9:15 AM today',
      time: '5 hours ago',
      date: '2024-03-22',
      icon: Clock,
      color: 'text-blue-600',
      details: {
        clockIn: '9:15 AM',
        clockOut: 'Not yet',
        location: 'Main Campus - Block A',
        workingHours: '5h 45m (so far)',
        status: 'Active'
      }
    },
    {
      id: 3,
      type: 'leave_submitted',
      title: 'Leave Request Submitted',
      description: 'Casual leave application for March 25 - awaiting HOD approval',
      time: '1 day ago',
      date: '2024-03-21',
      icon: AlertTriangle,
      color: 'text-amber-600',
      details: {
        leaveType: 'Casual Leave',
        duration: '1 day',
        reason: 'Personal work - family function',
        status: 'Pending with HOD',
        submittedTo: 'Dr. Michael Chen',
        nextApprover: 'Principal → Registrar → HR Executive'
      }
    },
    {
      id: 4,
      type: 'attendance_marked',
      title: 'Attendance Marked',
      description: 'Full day attendance - 8h 20m',
      time: '1 day ago',
      date: '2024-03-21',
      icon: Clock,
      color: 'text-blue-600',
      details: {
        clockIn: '9:10 AM',
        clockOut: '5:30 PM',
        location: 'Main Campus - Block A',
        workingHours: '8h 20m',
        status: 'Completed'
      }
    },
    {
      id: 5,
      type: 'leave_approved',
      title: 'Leave Request Approved',
      description: 'Casual leave for March 8 was approved by HR Executive',
      time: '2 weeks ago',
      date: '2024-03-07',
      icon: CheckCircle,
      color: 'text-green-600',
      details: {
        leaveType: 'Casual Leave',
        duration: '1 day',
        finalApprover: 'Mr. Arjun Kumar (HR Executive)',
        approvalFlow: 'HOD → Principal → Registrar → HR Executive',
        reason: 'Personal appointment',
        status: 'Approved'
      }
    },
    {
      id: 6,
      type: 'profile_updated',
      title: 'Profile Information Updated',
      description: 'Emergency contact details updated',
      time: '3 weeks ago',
      date: '2024-03-01',
      icon: User,
      color: 'text-purple-600',
      details: {
        field: 'Emergency Contact',
        oldValue: '+91 98765 43210',
        newValue: '+91 98765 43211',
        updatedBy: 'Self',
        status: 'Updated'
      }
    },
    {
      id: 7,
      type: 'attendance_override',
      title: 'Attendance Override Applied',
      description: 'Late arrival excused due to traffic - approved by HR Executive',
      time: '1 month ago',
      date: '2024-02-28',
      icon: AlertTriangle,
      color: 'text-amber-600',
      details: {
        originalTime: '10:30 AM',
        correctedTime: '9:00 AM',
        reason: 'Heavy traffic due to road construction',
        approver: 'Mr. Arjun Kumar (HR Executive)',
        approvalFlow: 'HOD → Principal → Registrar → HR Executive',
        status: 'Override Applied'
      }
    },
    {
      id: 8,
      type: 'leave_rejected',
      title: 'Leave Request Returned',
      description: 'Casual leave request needs more details - returned by HOD',
      time: '1 month ago',
      date: '2024-02-25',
      icon: XCircle,
      color: 'text-red-600',
      details: {
        leaveType: 'Casual Leave',
        duration: '2 days',
        reason: 'Insufficient documentation',
        returnedBy: 'Dr. Michael Chen (HOD)',
        nextStep: 'Resubmit with proper documentation',
        status: 'Returned for Revision'
      }
    }
  ];

  const filteredActivities = allActivities.filter(activity => {
    const matchesFilter = filterType === 'all' || activity.type.includes(filterType);
    const matchesSearch = activity.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         activity.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getActivityTypeColor = (type: string) => {
    switch (type) {
      case 'leave_approved': return 'bg-green-50 border-green-200';
      case 'leave_rejected': return 'bg-red-50 border-red-200';
      case 'leave_submitted': return 'bg-amber-50 border-amber-200';
      case 'attendance_marked': return 'bg-blue-50 border-blue-200';
      case 'attendance_override': return 'bg-purple-50 border-purple-200';
      case 'profile_updated': return 'bg-gray-50 border-gray-200';
      default: return 'bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h3 className="text-xl font-semibold text-gray-900">Activity History</h3>
            <p className="text-sm text-gray-600 mt-1">Complete record of your activities and requests</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search activities..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-gray-500" />
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Activities</option>
                <option value="leave">Leave Related</option>
                <option value="attendance">Attendance</option>
                <option value="profile">Profile Updates</option>
              </select>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <div className="space-y-4">
            {filteredActivities.map((activity) => {
              const Icon = activity.icon;
              return (
                <div key={activity.id} className={`border rounded-lg p-4 ${getActivityTypeColor(activity.type)}`}>
                  <div className="flex items-start space-x-4">
                    <div className={`p-2 rounded-lg bg-white ${activity.color}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="text-sm font-medium text-gray-900">{activity.title}</h4>
                          <p className="text-sm text-gray-600 mt-1">{activity.description}</p>
                          <p className="text-xs text-gray-400 mt-2">{activity.time} • {activity.date}</p>
                        </div>
                      </div>
                      
                      <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                        {Object.entries(activity.details).map(([key, value]) => (
                          <div key={key} className="flex justify-between">
                            <span className="text-gray-500 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}:</span>
                            <span className="font-medium text-gray-900">{value}</span>
                          </div>
                        ))}
                      </div>

                      {(activity.type === 'leave_approved' || activity.type === 'leave_submitted') && (
                        <div className="mt-3 p-2 bg-blue-50 rounded-lg">
                          <p className="text-xs text-blue-800">
                            <strong>Approval Process:</strong> All leave requests follow the hierarchy: 
                            HOD → Principal → Registrar → HR Executive
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {filteredActivities.length === 0 && (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-6 h-6 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No activities found</h3>
              <p className="text-gray-600">Try adjusting your search or filter criteria</p>
            </div>
          )}
        </div>

        <div className="p-6 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <span>Showing {filteredActivities.length} of {allActivities.length} activities</span>
            <div className="flex items-center space-x-4">
              <button className="text-blue-600 hover:text-blue-700 font-medium">
                Export History
              </button>
              <button className="text-blue-600 hover:text-blue-700 font-medium">
                Download Report
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const RecentActivity: React.FC = () => {
  const { user } = useAuth();
  const [showDetailModal, setShowDetailModal] = useState(false);

  const teacherActivities = [
    {
      id: 1,
      type: 'leave_approved',
      title: 'Leave Request Approved',
      description: 'Your sick leave for March 15-16 has been approved by HR Executive',
      time: '2 hours ago',
      icon: CheckCircle,
      color: 'text-green-600'
    },
    {
      id: 2,
      type: 'attendance_marked',
      title: 'Attendance Marked',
      description: 'Clock in at 9:15 AM today',
      time: '5 hours ago',
      icon: Clock,
      color: 'text-blue-600'
    },
    {
      id: 3,
      type: 'leave_submitted',
      title: 'Leave Request Submitted',
      description: 'Casual leave application for March 25 - awaiting HOD approval',
      time: '1 day ago',
      icon: AlertTriangle,
      color: 'text-amber-600'
    }
  ];

  const adminActivities = [
    {
      id: 1,
      type: 'leave_approved',
      title: 'Leave Request Approved',
      description: 'Approved Dr. Sarah Johnson\'s medical leave (Final approval by HR Executive)',
      time: '30 minutes ago',
      icon: CheckCircle,
      color: 'text-green-600'
    },
    {
      id: 2,
      type: 'user_added',
      title: 'New User Added',
      description: 'Dr. Amit Patel added to Computer Science department',
      time: '2 hours ago',
      icon: AlertTriangle,
      color: 'text-blue-600'
    },
    {
      id: 3,
      type: 'leave_rejected',
      title: 'Leave Request Returned',
      description: 'Returned leave request to HOD for insufficient documentation',
      time: '4 hours ago',
      icon: XCircle,
      color: 'text-red-600'
    },
    {
      id: 4,
      type: 'override_performed',
      title: 'Override Performed',
      description: 'Override attendance approved through full hierarchy',
      time: '1 day ago',
      icon: AlertTriangle,
      color: 'text-amber-600'
    }
  ];

  const activities = user?.accessLevel === 'full' ? adminActivities : teacherActivities;

  return (
    <>
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 h-fit">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
        <div className="space-y-4">
          {activities.map((activity) => {
            const Icon = activity.icon;
            return (
              <div key={activity.id} className="flex items-start space-x-3">
                <div className={`p-2 rounded-lg bg-gray-50 ${activity.color}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                  <p className="text-sm text-gray-600 mt-1">{activity.description}</p>
                  <p className="text-xs text-gray-400 mt-1">{activity.time}</p>
                </div>
              </div>
            );
          })}
        </div>
        <button 
          onClick={() => setShowDetailModal(true)}
          className="mt-4 text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors"
        >
          View all activity
        </button>
        
        {user?.accessLevel !== 'full' && (
          <div className="mt-4 p-3 bg-blue-50 rounded-lg">
            <p className="text-xs text-blue-800">
              <strong>Approval Flow:</strong> All requests follow: HOD → Principal → Registrar → HR Executive
            </p>
          </div>
        )}
      </div>

      <ActivityDetailModal 
        isOpen={showDetailModal}
        onClose={() => setShowDetailModal(false)}
      />
    </>
  );
};

export default RecentActivity;