import React from 'react';
import DashboardStats from './DashboardStats';
import RecentActivity from './RecentActivity';
import { useAuth } from '../../contexts/AuthContext';
import { Calendar, Users, TrendingUp, Clock } from 'lucide-react';
import LeaveApprovalPanel from '../Leave/LeaveApprovalPanel';

const Dashboard: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Good morning, {user?.name?.split(' ')[0]}!
          </h1>
          <p className="text-gray-600">
            {user?.accessLevel === 'full' 
              ? 'Here\'s your organization overview for today'
              : 'Here\'s your attendance and leave summary'
            }
          </p>
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-500">
          <Calendar className="w-4 h-4" />
          <span>{new Date().toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}</span>
        </div>
      </div>

      <DashboardStats />

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2">
          <RecentActivity />
        </div>
        
        {user?.accessLevel === 'full' ? (
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Department Overview</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Users className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Computer Science</p>
                    <p className="text-sm text-gray-600">24 faculty members</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-green-600">98% Present</p>
                  <p className="text-xs text-gray-500">23/24 today</p>
                </div>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Mechanical Engineering</p>
                    <p className="text-sm text-gray-600">18 faculty members</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-green-600">94% Present</p>
                  <p className="text-xs text-gray-500">17/18 today</p>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                    <Clock className="w-5 h-5 text-amber-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Electronics</p>
                    <p className="text-sm text-gray-600">15 faculty members</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-amber-600">87% Present</p>
                  <p className="text-xs text-gray-500">13/15 today</p>
                </div>
              </div>
            </div>
            <button className="mt-4 text-sm text-blue-600 hover:text-blue-700 font-medium">
              View detailed reports
            </button>
          </div>
        ) : (
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">This Month's Attendance</h3>
            <div className="grid grid-cols-7 gap-1 text-center mb-4">
              <div className="text-xs font-medium text-gray-500 py-2">Mon</div>
              <div className="text-xs font-medium text-gray-500 py-2">Tue</div>
              <div className="text-xs font-medium text-gray-500 py-2">Wed</div>
              <div className="text-xs font-medium text-gray-500 py-2">Thu</div>
              <div className="text-xs font-medium text-gray-500 py-2">Fri</div>
              <div className="text-xs font-medium text-gray-500 py-2">Sat</div>
              <div className="text-xs font-medium text-gray-500 py-2">Sun</div>
              
              {Array.from({ length: 31 }, (_, i) => {
                const day = i + 1;
                const isWeekend = [6, 7, 13, 14, 20, 21, 27, 28].includes(day);
                const isPresent = !isWeekend && day <= 22;
                const isToday = day === 22;
                
                return (
                  <div
                    key={day}
                    className={`
                      w-7 h-7 rounded-lg flex items-center justify-center text-xs font-medium
                      ${isToday ? 'bg-blue-600 text-white' : 
                        isPresent ? 'bg-green-100 text-green-700' : 
                        isWeekend ? 'bg-gray-100 text-gray-400' : 
                        'bg-red-100 text-red-700'}
                    `}
                  >
                    {day}
                  </div>
                );
              })}
            </div>
            <div className="flex items-center justify-center space-x-4 text-xs">
              <div className="flex items-center space-x-1">
                <div className="w-3 h-3 bg-green-100 rounded"></div>
                <span className="text-gray-600">Present</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-3 h-3 bg-red-100 rounded"></div>
                <span className="text-gray-600">Absent</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-3 h-3 bg-blue-600 rounded"></div>
                <span className="text-gray-600">Today</span>
              </div>
            </div>
          </div>
        )}
      </div>
      {/* Always show LeaveApprovalPanel for HODs at the bottom of the dashboard */}
      {user?.role === 'hod' || user?.accessLevel === 'approver' ? (
        <div className="mt-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Leave Approval Panel</h2>
          <LeaveApprovalPanel />
        </div>
      ) : null}
    </div>
  );
};

export default Dashboard;