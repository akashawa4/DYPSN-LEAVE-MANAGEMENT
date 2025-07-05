import React, { useState } from 'react';
import { Calendar, FileText, Clock, AlertCircle } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

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

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Reset form
    setFormData({
      leaveType: '',
      fromDate: '',
      toDate: '',
      reason: '',
      attachments: null
    });
    setIsSubmitting(false);
    
    // Show success message (in real app, use toast notification)
    alert('Leave request submitted successfully!');
  };

  const selectedLeaveType = leaveTypes.find(type => type.id === formData.leaveType);
  const daysRequested = calculateDays();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Apply for Leave</h1>
          <p className="text-gray-600">Submit your leave request for approval</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        <div className="lg:col-span-3">
          <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Leave Type <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.leaveType}
                  onChange={(e) => setFormData({ ...formData, leaveType: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value="">Select leave type</option>
                  {leaveTypes.map(type => (
                    <option key={type.id} value={type.id}>
                      {type.name} ({type.balance} days available)
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  From Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={formData.fromDate}
                  onChange={(e) => setFormData({ ...formData, fromDate: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  min={new Date().toISOString().split('T')[0]}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  To Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={formData.toDate}
                  onChange={(e) => setFormData({ ...formData, toDate: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  min={formData.fromDate || new Date().toISOString().split('T')[0]}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Supporting Documents
                </label>
                <input
                  type="file"
                  onChange={(e) => setFormData({ ...formData, attachments: e.target.files })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  multiple
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Upload medical certificates, documents (PDF, DOC, JPG, PNG)
                </p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Reason for Leave <span className="text-red-500">*</span>
              </label>
              <textarea
                value={formData.reason}
                onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                rows={4}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Please provide a detailed reason for your leave request (minimum 20 characters)"
                minLength={20}
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                {formData.reason.length}/20 characters minimum
              </p>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-gray-200">
              <button
                type="button"
                className="px-6 py-3 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 font-medium"
              >
                Save as Draft
              </button>
              <button
                type="submit"
                disabled={isSubmitting || !formData.leaveType || !formData.fromDate || !formData.toDate || formData.reason.length < 20}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium flex items-center space-x-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Submitting...</span>
                  </>
                ) : (
                  <>
                    <FileText className="w-4 h-4" />
                    <span>Submit Request</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        <div className="space-y-4">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Leave Balance</h3>
            <div className="space-y-4">
              {leaveTypes.map(type => (
                <div key={type.id} className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">{type.name}</span>
                  <span className={`text-sm font-bold ${type.balance > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {type.balance} days
                  </span>
                </div>
              ))}
            </div>
          </div>

          {selectedLeaveType && daysRequested > 0 && (
            <div className="bg-blue-50 p-6 rounded-xl border border-blue-200">
              <h3 className="text-lg font-semibold text-blue-900 mb-4 flex items-center">
                <Calendar className="w-5 h-5 mr-2" />
                Leave Preview
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-blue-700">Leave Type:</span>
                  <span className="text-sm font-medium text-blue-900">{selectedLeaveType.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-blue-700">Duration:</span>
                  <span className="text-sm font-medium text-blue-900">{daysRequested} days</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-blue-700">Balance After:</span>
                  <span className={`text-sm font-bold ${selectedLeaveType.balance - daysRequested >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {selectedLeaveType.balance - daysRequested} days
                  </span>
                </div>
                {selectedLeaveType.balance - daysRequested < 0 && (
                  <div className="flex items-start space-x-2 pt-2 border-t border-blue-200">
                    <AlertCircle className="w-4 h-4 text-red-500 mt-0.5" />
                    <p className="text-xs text-red-600">
                      Insufficient balance. This will be processed as LOP.
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="bg-amber-50 p-6 rounded-xl border border-amber-200">
            <h3 className="text-lg font-semibold text-amber-900 mb-4 flex items-center">
              <Clock className="w-5 h-5 mr-2" />
              Important Notes
            </h3>
            <ul className="space-y-2 text-sm text-amber-800">
              <li>• Submit leave requests at least 24 hours in advance</li>
              <li>• Medical leave requires doctor&apos;s certificate</li>
              <li>• Emergency leaves can be applied retrospectively</li>
              <li>• Leave balance resets every financial year</li>
              <li>• Maximum consecutive leave: 30 days (with approval)</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeaveRequestForm;