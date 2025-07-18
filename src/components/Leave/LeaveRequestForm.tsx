import React, { useState } from 'react';
import { Calendar, FileText, Clock, AlertCircle } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { leaveService } from '../../firebase/firestore';

const LeaveRequestForm: React.FC = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    leaveType: '',
    fromDate: '',
    toDate: '',
    reason: '',
    attachments: null as FileList | null
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const leaveTypes = [
    { id: 'CL', name: 'Casual Leave', balance: 3 },
    { id: 'EL', name: 'Earned Leave', balance: 5 },
    { id: 'ML', name: 'Medical Leave', balance: 8 },
    { id: 'LOP', name: 'Leave without Pay', balance: 0 },
    { id: 'COH', name: 'Compensatory Off', balance: 2 }
  ];

  const calculateDays = () => {
    if (formData.fromDate && formData.toDate) {
      const from = new Date(formData.fromDate);
      const to = new Date(formData.toDate);
      const diffTime = Math.abs(to.getTime() - from.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
      return diffDays;
    }
    return 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage(null);

    try {
      if (!user) {
        throw new Error('User not authenticated');
      }

      const daysRequested = calculateDays();
      
      // Create leave request data
      const leaveRequestData = {
        userId: user.id,
        userName: user.name,
        department: user.department,
        leaveType: formData.leaveType as 'CL' | 'ML' | 'EL' | 'LOP' | 'COH',
        fromDate: formData.fromDate,
        toDate: formData.toDate,
        reason: formData.reason,
        daysCount: daysRequested,
        submittedAt: new Date().toISOString(),
        currentApprovalLevel: 'HOD', // Start with HOD approval
        approvalFlow: ['HOD', 'Principal', 'Registrar', 'HR Executive'] // Define approval hierarchy
      };

      // Save to Firestore
      const requestId = await leaveService.createLeaveRequest(leaveRequestData);
      


    // Reset form
    setFormData({
      leaveType: '',
      fromDate: '',
      toDate: '',
      reason: '',
      attachments: null
    });

      setMessage({
        type: 'success',
        text: `Leave request submitted successfully! Request ID: ${requestId}`
      });

    } catch (error: any) {
      console.error('Error submitting leave request:', error);
      setMessage({
        type: 'error',
        text: error.message || 'Failed to submit leave request. Please try again.'
      });
    } finally {
    setIsSubmitting(false);
    }
  };

  const selectedLeaveType = leaveTypes.find(type => type.id === formData.leaveType);
  const daysRequested = calculateDays();

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
      <div className="flex items-center space-x-3 mb-6">
        <FileText className="w-6 h-6 text-blue-600" />
          <h1 className="text-2xl font-bold text-gray-900">Apply for Leave</h1>
      </div>

      {message && (
        <div className={`mb-6 p-4 rounded-lg ${
          message.type === 'success' 
            ? 'bg-green-50 border border-green-200 text-green-800' 
            : 'bg-red-50 border border-red-200 text-red-800'
        }`}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
              Leave Type *
                </label>
                <select
              required
                  value={formData.leaveType}
                  onChange={(e) => setFormData({ ...formData, leaveType: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
              <option value="">Select Leave Type</option>
              {leaveTypes.map((type) => (
                    <option key={type.id} value={type.id}>
                  {type.name} (Balance: {type.balance})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
              Days Requested
            </label>
            <div className="flex items-center space-x-2 px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg">
              <Clock className="w-4 h-4 text-gray-500" />
              <span className="text-gray-900 font-medium">{daysRequested} days</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              From Date *
                </label>
                <input
                  type="date"
              required
                  value={formData.fromDate}
                  onChange={(e) => setFormData({ ...formData, fromDate: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
              To Date *
                </label>
                <input
                  type="date"
              required
                  value={formData.toDate}
                  onChange={(e) => setFormData({ ...formData, toDate: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        {selectedLeaveType && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <AlertCircle className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-800">Leave Balance</span>
            </div>
            <p className="text-sm text-blue-700">
              You have {selectedLeaveType.balance} {selectedLeaveType.name} days remaining.
            </p>
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Reason for Leave *
          </label>
          <textarea
                  required
            value={formData.reason}
            onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
            rows={4}
            placeholder="Please provide a detailed reason for your leave request..."
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
            Supporting Documents (Optional)
                </label>
                <input
                  type="file"
                  multiple
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
            onChange={(e) => setFormData({ ...formData, attachments: e.target.files })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <p className="text-xs text-gray-500 mt-1">
            Accepted formats: PDF, DOC, DOCX, JPG, JPEG, PNG (Max 5MB each)
              </p>
            </div>

        <div className="flex justify-end space-x-4">
              <button
                type="button"
            onClick={() => setFormData({
              leaveType: '',
              fromDate: '',
              toDate: '',
              reason: '',
              attachments: null
            })}
            className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
              >
            Reset
              </button>
              <button
                type="submit"
            disabled={isSubmitting}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
            {isSubmitting ? 'Submitting...' : 'Submit Request'}
              </button>
            </div>
          </form>
    </div>
  );
};

export default LeaveRequestForm;