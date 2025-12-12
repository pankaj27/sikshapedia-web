import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../../components/ui/button';
import { FiPlus, FiList, FiUsers, FiBarChart, FiLogOut } from 'react-icons/fi';

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Link to="/" className="text-2xl font-bold">
                <span className="text-orange-600">Siksha</span>
                <span className="text-blue-600">pedia</span>
              </Link>
              <span className="text-sm bg-orange-100 text-orange-700 px-3 py-1 rounded font-semibold">ADMIN</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-gray-700">Welcome, {user?.name}</span>
              <Button variant="outline" onClick={handleLogout}>
                <FiLogOut className="mr-2" /> Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Admin Dashboard</h1>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Link to="/admin/colleges/add" className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition border-2 border-orange-200">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <FiPlus className="text-2xl text-orange-600" />
              </div>
              <div>
                <h3 className="font-bold text-lg">Add College</h3>
                <p className="text-sm text-gray-600">Create new entry</p>
              </div>
            </div>
          </Link>

          <Link to="/admin/colleges" className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition border-2 border-transparent hover:border-orange-200">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <FiList className="text-2xl text-blue-600" />
              </div>
              <div>
                <h3 className="font-bold text-lg">Manage Colleges</h3>
                <p className="text-sm text-gray-600">View & edit</p>
              </div>
            </div>
          </Link>

          <div className="bg-white p-6 rounded-lg shadow border-2 border-transparent">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <FiUsers className="text-2xl text-green-600" />
              </div>
              <div>
                <h3 className="font-bold text-lg">Users</h3>
                <p className="text-sm text-gray-600">Coming soon</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow border-2 border-transparent">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <FiBarChart className="text-2xl text-purple-600" />
              </div>
              <div>
                <h3 className="font-bold text-lg">Analytics</h3>
                <p className="text-sm text-gray-600">Coming soon</p>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold mb-4">Quick Stats</h2>
          <div className="grid grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-600 mb-1">3</div>
              <div className="text-gray-600">Total Colleges</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-1">0</div>
              <div className="text-gray-600">Pending Reviews</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-1">0</div>
              <div className="text-gray-600">New Inquiries</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
