import React, { useState } from 'react';
import {
  ChartBarIcon,
  DocumentTextIcon,
  SparklesIcon,
  UsersIcon,
  FolderIcon,
  ChartPieIcon,
  ClipboardDocumentListIcon,
  BriefcaseIcon,
  GlobeAltIcon,
  ArrowTrendingUpIcon,
  Cog6ToothIcon,
  BellIcon,
  ArrowRightOnRectangleIcon
} from '@heroicons/react/24/outline';
import ExcelCleaningUI from './ExcelCleaningUI';
import PredictiveAnalysisUI from './PredictiveAnalysisUI';

export default function AdminDashboard({ user, onNavigate, onLogout }) {
  const [activeSection, setActiveSection] = useState('overview');

  const menuItems = [
    { id: 'overview', name: 'Overview', icon: ChartBarIcon },
    { id: 'files', name: 'All Files & Reports', icon: FolderIcon },
    { id: 'predictive', name: 'Predictive Analysis', icon: ArrowTrendingUpIcon },
    { id: 'reports', name: 'Report Generation', icon: DocumentTextIcon },
    { id: 'excel-cleaner', name: 'Excel File Cleaning', icon: SparklesIcon },
    { id: 'employees', name: 'Employee Performance', icon: UsersIcon },
    { id: 'projects', name: 'Project Tracking', icon: BriefcaseIcon },
    { id: 'analytics', name: 'Website Analytics', icon: GlobeAltIcon },
    { id: 'settings', name: 'Settings', icon: Cog6ToothIcon }
  ];

  const stats = [
    { name: 'Total Employees', value: '156', change: '+12%', icon: UsersIcon, color: 'blue' },
    { name: 'Files Processed', value: '2,847', change: '+23%', icon: FolderIcon, color: 'green' },
    { name: 'Active Projects', value: '24', change: '+5%', icon: BriefcaseIcon, color: 'purple' },
    { name: 'Website Visitors', value: '45.2K', change: '+18%', icon: GlobeAltIcon, color: 'orange' }
  ];

  const sampleReports = [
    {
      title: 'Q4 Sales Performance',
      date: 'Nov 1, 2025',
      metrics: { revenue: '$2.4M', growth: '+18%', orders: '3,245' },
      chartData: [65, 78, 85, 92, 88, 95]
    },
    {
      title: 'Employee Productivity',
      date: 'Oct 28, 2025',
      metrics: { avgTasks: '42', completion: '94%', efficiency: '+12%' },
      chartData: [70, 75, 82, 88, 90, 94]
    },
    {
      title: 'Website Traffic Analysis',
      date: 'Oct 25, 2025',
      metrics: { visitors: '45.2K', bounce: '32%', conversion: '4.2%' },
      chartData: [40, 52, 48, 65, 70, 78]
    }
  ];

  const recentActivity = [
    { user: 'John Doe', action: 'Cleaned Excel file', file: 'sales_data_2024.xlsx', time: '5 min ago' },
    { user: 'Jane Smith', action: 'Generated report', file: 'Q4_performance.pdf', time: '12 min ago' },
    { user: 'Mike Johnson', action: 'Applied for leave', file: 'Leave Request', time: '1 hour ago' },
    { user: 'Sarah Williams', action: 'Completed project', file: 'Website Redesign', time: '2 hours ago' }
  ];

  const renderContent = () => {
    switch (activeSection) {
      case 'overview':
        return (
          <div className="space-y-6">
            {/* Welcome Header */}
            <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-2xl p-8 text-white">
              <h2 className="text-3xl font-bold mb-2">Welcome back, {user?.name}! 👋</h2>
              <p className="text-green-100">Here's what's happening with your team today.</p>
            </div>

            {/* Statistics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((stat, index) => (
                <div key={index} className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`p-3 rounded-lg bg-${stat.color}-100`}>
                      <stat.icon className={`h-6 w-6 text-${stat.color}-600`} />
                    </div>
                    <span className="text-green-600 text-sm font-semibold">{stat.change}</span>
                  </div>
                  <h3 className="text-gray-600 text-sm font-medium">{stat.name}</h3>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
                </div>
              ))}
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <BellIcon className="h-6 w-6 mr-2 text-green-600" />
                Recent Activity
              </h3>
              <div className="space-y-4">
                {recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                    <div className="flex-1">
                      <p className="text-gray-900 font-medium">{activity.user}</p>
                      <p className="text-sm text-gray-600">{activity.action}: <span className="text-green-600">{activity.file}</span></p>
                    </div>
                    <span className="text-xs text-gray-400">{activity.time}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Sample Reports with Graphs */}
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-gray-900">Recent Reports</h3>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {sampleReports.map((report, index) => (
                  <div key={index} className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition">
                    <div className="mb-4">
                      <h4 className="font-bold text-gray-900 mb-1">{report.title}</h4>
                      <p className="text-sm text-gray-500">{report.date}</p>
                    </div>
                    
                    {/* Mini Chart */}
                    <div className="mb-4 h-24 flex items-end space-x-1">
                      {report.chartData.map((value, i) => (
                        <div
                          key={i}
                          className="flex-1 bg-gradient-to-t from-green-500 to-green-400 rounded-t"
                          style={{ height: `${value}%` }}
                        ></div>
                      ))}
                    </div>
                    
                    {/* Metrics */}
                    <div className="space-y-2">
                      {Object.entries(report.metrics).map(([key, value]) => (
                        <div key={key} className="flex justify-between items-center">
                          <span className="text-sm text-gray-600 capitalize">{key}</span>
                          <span className="font-semibold text-gray-900">{value}</span>
                        </div>
                      ))}
                    </div>
                    
                    <button className="mt-4 w-full bg-green-50 text-green-700 py-2 rounded-lg hover:bg-green-100 transition font-medium text-sm">
                      View Full Report
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <button
                onClick={() => setActiveSection('excel-cleaner')}
                className="bg-gradient-to-br from-green-500 to-green-600 text-white p-6 rounded-xl shadow-lg hover:shadow-xl transition flex items-center justify-between group"
              >
                <div>
                  <h4 className="font-bold text-lg mb-1">Clean Excel File</h4>
                  <p className="text-sm text-green-100">Quick data cleaning</p>
                </div>
                <SparklesIcon className="h-8 w-8 group-hover:scale-110 transition" />
              </button>
              
              <button
                onClick={() => setActiveSection('reports')}
                className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-6 rounded-xl shadow-lg hover:shadow-xl transition flex items-center justify-between group"
              >
                <div>
                  <h4 className="font-bold text-lg mb-1">Generate Report</h4>
                  <p className="text-sm text-blue-100">Create new report</p>
                </div>
                <DocumentTextIcon className="h-8 w-8 group-hover:scale-110 transition" />
              </button>
              
              <button
                onClick={() => setActiveSection('predictive')}
                className="bg-gradient-to-br from-purple-500 to-purple-600 text-white p-6 rounded-xl shadow-lg hover:shadow-xl transition flex items-center justify-between group"
              >
                <div>
                  <h4 className="font-bold text-lg mb-1">Predictive Analysis</h4>
                  <p className="text-sm text-purple-100">AI-powered insights</p>
                </div>
                <ArrowTrendingUpIcon className="h-8 w-8 group-hover:scale-110 transition" />
              </button>
            </div>
          </div>
        );

      case 'files':
        return (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">All Files & Reports</h2>
            <div className="text-center py-12">
              <FolderIcon className="h-16 w-16 mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500">File management system coming soon</p>
            </div>
          </div>
        );

      case 'predictive':
        return <PredictiveAnalysisUI />;

      case 'reports':
        return (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Report Generation (Non-AI)</h2>
            <div className="text-center py-12">
              <DocumentTextIcon className="h-16 w-16 mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500">Report generation system will be implemented</p>
            </div>
          </div>
        );

      case 'excel-cleaner':
        return <ExcelCleaningUI />;

      case 'employees':
        return (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Employee Performance Reviews</h2>
            <div className="text-center py-12">
              <UsersIcon className="h-16 w-16 mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500">Employee management system coming soon</p>
            </div>
          </div>
        );

      case 'projects':
        return (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Project Tracking</h2>
            <div className="text-center py-12">
              <BriefcaseIcon className="h-16 w-16 mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500">Project management system coming soon</p>
            </div>
          </div>
        );

      case 'analytics':
        return (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Website Traffic Analytics</h2>
            <div className="text-center py-12">
              <GlobeAltIcon className="h-16 w-16 mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500">Analytics dashboard coming soon</p>
            </div>
          </div>
        );

      case 'settings':
        return (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Settings</h2>
            <div className="space-y-4">
              <div className="border-b border-gray-200 pb-4">
                <h3 className="font-semibold text-gray-900 mb-2">Account Information</h3>
                <p className="text-gray-600">Name: {user?.name}</p>
                <p className="text-gray-600">Email: {user?.email}</p>
                <p className="text-gray-600">Role: Administrator</p>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navbar */}
      <div className="bg-gray-900 text-white px-8 py-4 flex items-center justify-between shadow-lg">
        <div>
          <h1 className="text-2xl font-bold text-green-500">GrowthCast</h1>
          <p className="text-sm text-gray-400">{user?.name} • Administrator</p>
        </div>
        <button
          onClick={onLogout}
          className="flex items-center space-x-2 bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg transition"
        >
          <ArrowRightOnRectangleIcon className="h-5 w-5" />
          <span>Logout</span>
        </button>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-gray-900 min-h-screen p-6 space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition ${
                activeSection === item.id
                  ? 'bg-green-600 text-white'
                  : 'text-gray-400 hover:bg-gray-800 hover:text-white'
              }`}
            >
              <item.icon className="h-5 w-5" />
              <span className="font-medium">{item.name}</span>
            </button>
          ))}
        </div>

        {/* Main Content */}
        <div className="flex-1 p-8">
          {renderContent()}
        </div>
      </div>
    </div>
  );
}
