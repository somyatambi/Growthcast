import React, { useState } from 'react';
import {
  CalendarIcon,
  ClockIcon,
  DocumentTextIcon,
  SparklesIcon,
  UsersIcon,
  MegaphoneIcon,
  WrenchScrewdriverIcon,
  ClipboardDocumentListIcon,
  HomeIcon,
  BellIcon
} from '@heroicons/react/24/outline';

export default function EmployeeDashboard() {
  const [activeSection, setActiveSection] = useState('overview');
  const [leaveForm, setLeaveForm] = useState({
    type: 'Sick Leave',
    startDate: '',
    endDate: '',
    reason: ''
  });
  const [helpdeskForm, setHelpdeskForm] = useState({
    category: 'Hardware Issue',
    subject: '',
    description: ''
  });

  const user = { name: 'John Doe' };

  const menuItems = [
    { id: 'overview', name: 'Dashboard', icon: HomeIcon },
    { id: 'attendance', name: 'Attendance', icon: ClockIcon },
    { id: 'leave', name: 'Leave Application', icon: ClipboardDocumentListIcon },
    { id: 'reports', name: 'Generate Reports', icon: DocumentTextIcon },
    { id: 'excel-cleaner', name: 'Excel Cleaning', icon: SparklesIcon },
    { id: 'announcements', name: 'Announcements', icon: MegaphoneIcon },
    { id: 'calendar', name: 'Company Calendar', icon: CalendarIcon },
    { id: 'directory', name: 'Employee Directory', icon: UsersIcon },
    { id: 'helpdesk', name: 'IT Help Desk', icon: WrenchScrewdriverIcon }
  ];

  const announcements = [
    { title: 'Team Meeting', date: 'Tomorrow, 10:00 AM', type: 'important' },
    { title: 'Holiday Notice', date: 'Dec 25, 2024', type: 'info' },
    { title: 'New Policy Update', date: 'Jan 1, 2025', type: 'info' }
  ];

  const upcomingEvents = [
    { title: 'Project Deadline', date: 'Dec 20, 2024' },
    { title: 'Team Building Event', date: 'Dec 22, 2024' },
    { title: 'Performance Review', date: 'Dec 28, 2024' }
  ];

  const handleLeaveSubmit = () => {
    alert('Leave request submitted successfully!');
    setLeaveForm({ type: 'Sick Leave', startDate: '', endDate: '', reason: '' });
  };

  const handleHelpdeskSubmit = () => {
    alert('Support ticket submitted successfully!');
    setHelpdeskForm({ category: 'Hardware Issue', subject: '', description: '' });
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'overview':
        return (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-8 text-white">
              <h2 className="text-3xl font-bold mb-2">Welcome back, {user.name}! 👋</h2>
              <p className="text-blue-100">Have a productive day at work.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
                <div className="flex items-center justify-between mb-2">
                  <Clock className="h-8 w-8 text-green-600" />
                  <span className="text-sm font-semibold text-green-600">On Time</span>
                </div>
                <h3 className="text-gray-600 text-sm">Attendance This Month</h3>
                <p className="text-3xl font-bold text-gray-900 mt-2">22/23</p>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
                <div className="flex items-center justify-between mb-2">
                  <ClipboardList className="h-8 w-8 text-blue-600" />
                  <span className="text-sm font-semibold text-blue-600">Available</span>
                </div>
                <h3 className="text-gray-600 text-sm">Leave Balance</h3>
                <p className="text-3xl font-bold text-gray-900 mt-2">15 days</p>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
                <div className="flex items-center justify-between mb-2">
                  <FileText className="h-8 w-8 text-purple-600" />
                  <span className="text-sm font-semibold text-purple-600">Completed</span>
                </div>
                <h3 className="text-gray-600 text-sm">Reports Generated</h3>
                <p className="text-3xl font-bold text-gray-900 mt-2">47</p>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
                <div className="flex items-center justify-between mb-2">
                  <Sparkles className="h-8 w-8 text-green-600" />
                  <span className="text-sm font-semibold text-green-600">Active</span>
                </div>
                <h3 className="text-gray-600 text-sm">Files Cleaned</h3>
                <p className="text-3xl font-bold text-gray-900 mt-2">128</p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                  <Megaphone className="h-6 w-6 mr-2 text-blue-600" />
                  Recent Announcements
                </h3>
                <div className="space-y-3">
                  {announcements.map((announcement, index) => (
                    <div key={index} className="p-3 bg-blue-50 rounded-lg border border-blue-100">
                      <h4 className="font-semibold text-gray-900">{announcement.title}</h4>
                      <p className="text-sm text-gray-600">{announcement.date}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                  <Calendar className="h-6 w-6 mr-2 text-green-600" />
                  Upcoming Events
                </h3>
                <div className="space-y-3">
                  {upcomingEvents.map((event, index) => (
                    <div key={index} className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                      <h4 className="font-semibold text-gray-900">{event.title}</h4>
                      <p className="text-sm text-gray-600">{event.date}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <button
                onClick={() => setActiveSection('attendance')}
                className="bg-gradient-to-br from-green-500 to-green-600 text-white p-6 rounded-xl shadow-lg hover:shadow-xl transition flex items-center justify-between group"
              >
                <div className="text-left">
                  <h4 className="font-bold text-lg mb-1">Check Attendance</h4>
                  <p className="text-sm text-green-100">Mark your attendance</p>
                </div>
                <Clock className="h-8 w-8 group-hover:scale-110 transition" />
              </button>
              
              <button
                onClick={() => setActiveSection('leave')}
                className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-6 rounded-xl shadow-lg hover:shadow-xl transition flex items-center justify-between group"
              >
                <div className="text-left">
                  <h4 className="font-bold text-lg mb-1">Apply for Leave</h4>
                  <p className="text-sm text-blue-100">Submit leave request</p>
                </div>
                <ClipboardList className="h-8 w-8 group-hover:scale-110 transition" />
              </button>
              
              <button
                onClick={() => setActiveSection('excel-cleaner')}
                className="bg-gradient-to-br from-purple-500 to-purple-600 text-white p-6 rounded-xl shadow-lg hover:shadow-xl transition flex items-center justify-between group"
              >
                <div className="text-left">
                  <h4 className="font-bold text-lg mb-1">Clean Excel File</h4>
                  <p className="text-sm text-purple-100">Quick data cleaning</p>
                </div>
                <Sparkles className="h-8 w-8 group-hover:scale-110 transition" />
              </button>
            </div>
          </div>
        );

      case 'attendance':
        return (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Attendance Tracking</h2>
            
            <div className="mb-6">
              <div className="flex items-center justify-between p-6 bg-green-50 rounded-xl border border-green-200">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Today's Status</h3>
                  <p className="text-green-600 font-semibold">Checked In - 9:00 AM</p>
                </div>
                <button className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition font-semibold">
                  Check Out
                </button>
              </div>
            </div>

            <div className="border border-gray-200 rounded-xl p-6">
              <h3 className="font-bold text-gray-900 mb-4">This Month's Summary</h3>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-2xl font-bold text-gray-900">22</p>
                  <p className="text-sm text-gray-600">Present</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-2xl font-bold text-gray-900">1</p>
                  <p className="text-sm text-gray-600">Absent</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-2xl font-bold text-gray-900">3</p>
                  <p className="text-sm text-gray-600">Holidays</p>
                </div>
              </div>
            </div>
          </div>
        );

      case 'leave':
        return (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Leave Application</h2>
            
            <div className="space-y-4 max-w-2xl">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Leave Type</label>
                <select 
                  value={leaveForm.type}
                  onChange={(e) => setLeaveForm({...leaveForm, type: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option>Sick Leave</option>
                  <option>Casual Leave</option>
                  <option>Vacation Leave</option>
                  <option>Emergency Leave</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
                  <input 
                    type="date" 
                    value={leaveForm.startDate}
                    onChange={(e) => setLeaveForm({...leaveForm, startDate: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
                  <input 
                    type="date" 
                    value={leaveForm.endDate}
                    onChange={(e) => setLeaveForm({...leaveForm, endDate: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" 
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Reason</label>
                <textarea 
                  rows={4}
                  value={leaveForm.reason}
                  onChange={(e) => setLeaveForm({...leaveForm, reason: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter reason for leave..."
                />
              </div>

              <button 
                onClick={handleLeaveSubmit}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition font-semibold"
              >
                Submit Leave Request
              </button>
            </div>
          </div>
        );

      case 'reports':
        return (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Generate Reports</h2>
            <div className="text-center py-12">
              <FileText className="h-16 w-16 mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500">Report generation feature will be implemented</p>
            </div>
          </div>
        );

      case 'excel-cleaner':
        return (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Excel File Cleaning</h2>
            <p className="text-gray-600 mb-4">Upload and clean your Excel files with ease.</p>
            <button className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition">
              Open Excel Cleaner
            </button>
          </div>
        );

      case 'announcements':
        return (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Company Announcements</h2>
            <div className="space-y-4">
              {announcements.map((announcement, index) => (
                <div key={index} className="p-6 bg-blue-50 rounded-xl border border-blue-200">
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{announcement.title}</h3>
                  <p className="text-gray-600 mb-2">Date: {announcement.date}</p>
                  <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                    announcement.type === 'important' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
                  }`}>
                    {announcement.type === 'important' ? 'Important' : 'Information'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        );

      case 'calendar':
        return (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Company Calendar</h2>
            <div className="space-y-3">
              {upcomingEvents.map((event, index) => (
                <div key={index} className="p-4 bg-gray-50 rounded-lg border border-gray-200 flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-gray-900">{event.title}</h3>
                    <p className="text-sm text-gray-600">{event.date}</p>
                  </div>
                  <Calendar className="h-6 w-6 text-gray-400" />
                </div>
              ))}
            </div>
          </div>
        );

      case 'directory':
        return (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Employee Directory</h2>
            <div className="text-center py-12">
              <Users className="h-16 w-16 mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500">Employee directory feature coming soon</p>
            </div>
          </div>
        );

      case 'helpdesk':
        return (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">IT Help Desk</h2>
            <div className="space-y-4 max-w-2xl">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Issue Category</label>
                <select 
                  value={helpdeskForm.category}
                  onChange={(e) => setHelpdeskForm({...helpdeskForm, category: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option>Hardware Issue</option>
                  <option>Software Problem</option>
                  <option>Network Connectivity</option>
                  <option>Access Request</option>
                  <option>Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
                <input 
                  type="text"
                  value={helpdeskForm.subject}
                  onChange={(e) => setHelpdeskForm({...helpdeskForm, subject: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Brief description of the issue"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea 
                  rows={4}
                  value={helpdeskForm.description}
                  onChange={(e) => setHelpdeskForm({...helpdeskForm, description: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Provide detailed information about your issue..."
                />
              </div>
              <button 
                onClick={handleHelpdeskSubmit}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition font-semibold"
              >
                Submit Ticket
              </button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        <div className="w-64 bg-white shadow-lg h-screen sticky top-0">
          <div className="p-6 border-b border-gray-200">
            <h1 className="text-2xl font-bold text-gray-900">Employee Portal</h1>
          </div>
          <nav className="p-4">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveSection(item.id)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg mb-2 transition ${
                    activeSection === item.id
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span className="font-medium">{item.name}</span>
                </button>
              );
            })}
          </nav>
        </div>

        <div className="flex-1 p-8">
          {renderContent()}
        </div>
      </div>
    </div>
  );
}