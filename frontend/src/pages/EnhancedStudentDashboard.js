import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiFileText, FiStar, FiBookmark, FiLogOut, FiUser, FiBarChart2, FiTrash2, FiEdit } from 'react-icons/fi';
import api from '../api/axios';
import { Button } from '../components/ui/button';

const EnhancedStudentDashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({
    total_applications: 0,
    total_reviews: 0,
    saved_colleges: 0,
    recent_applications: []
  });
  const [applications, setApplications] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [savedColleges, setSavedColleges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (!savedUser) {
      navigate('/login');
      return;
    }
    setUser(JSON.parse(savedUser));
    fetchAllData();
  }, [navigate]);

  const fetchAllData = async () => {
    try {
      const [statsRes, appsRes, savedRes] = await Promise.all([
        api.get('/dashboard/stats'),
        api.get('/applications/my'),
        api.get('/users/saved-colleges')
      ]);
      setStats(statsRes.data);
      setApplications(appsRes.data);
      setSavedColleges(savedRes.data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  const handleUnsaveCollege = async (collegeId) => {
    try {
      await api.delete(`/users/save-college/${collegeId}`);
      setSavedColleges(savedColleges.filter(c => c.id !== collegeId));
      setStats({...stats, saved_colleges: stats.saved_colleges - 1});
    } catch (error) {
      alert('Error removing college');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center">
              <img src="/admissionbuddy-logo.png" alt="AdmissionBuddy" className="h-10" />
            </Link>
            <div className="flex items-center gap-4">
              <Link to="/" className="text-gray-700 hover:text-orange-600">Home</Link>
              <Link to="/colleges" className="text-gray-700 hover:text-orange-600">Colleges</Link>
              <Link to="/exams" className="text-gray-700 hover:text-orange-600">Exams</Link>
              <span className="text-gray-700">Welcome, {user?.name}</span>
              <Button onClick={handleLogout} variant="ghost" className="flex items-center gap-2">
                <FiLogOut /> Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-6 sticky top-6">
              <div className="flex items-center gap-3 mb-6 pb-6 border-b">
                <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-pink-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                  {user?.name?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 className="font-bold text-lg">{user?.name}</h3>
                  <p className="text-sm text-gray-600">{user?.email}</p>
                </div>
              </div>

              <nav className="space-y-2">
                <button
                  onClick={() => setActiveTab('overview')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                    activeTab === 'overview' ? 'bg-orange-50 text-orange-600 font-semibold' : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <FiBarChart2 /> Overview
                </button>
                <button
                  onClick={() => setActiveTab('applications')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                    activeTab === 'applications' ? 'bg-orange-50 text-orange-600 font-semibold' : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <FiFileText /> Applications ({applications.length})
                </button>
                <button
                  onClick={() => setActiveTab('saved')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                    activeTab === 'saved' ? 'bg-orange-50 text-orange-600 font-semibold' : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <FiBookmark /> Saved Colleges ({savedColleges.length})
                </button>
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {activeTab === 'overview' && (
              <div>
                <h1 className="text-3xl font-bold mb-6">Dashboard Overview</h1>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-gray-600">Total Applications</h3>
                      <FiFileText className="text-blue-600 text-2xl" />
                    </div>
                    <p className="text-3xl font-bold text-blue-600">{stats.total_applications}</p>
                  </div>

                  <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-gray-600">Reviews Written</h3>
                      <FiStar className="text-yellow-500 text-2xl" />
                    </div>
                    <p className="text-3xl font-bold text-yellow-500">{stats.total_reviews}</p>
                  </div>

                  <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-gray-600">Saved Colleges</h3>
                      <FiBookmark className="text-green-600 text-2xl" />
                    </div>
                    <p className="text-3xl font-bold text-green-600">{stats.saved_colleges}</p>
                  </div>
                </div>

                {/* Recent Applications */}
                <div className="bg-white rounded-lg shadow p-6">
                  <h2 className="text-2xl font-bold mb-4">Recent Applications</h2>
                  {stats.recent_applications && stats.recent_applications.length > 0 ? (
                    <div className="space-y-4">
                      {stats.recent_applications.map((app) => (
                        <div key={app.id} className="border rounded-lg p-4 hover:bg-gray-50 transition">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <h3 className="font-semibold">{app.preferred_course}</h3>
                              <p className="text-sm text-gray-600">Application #{app.application_number}</p>
                            </div>
                            <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                              app.status === 'accepted' ? 'bg-green-100 text-green-700' :
                              app.status === 'rejected' ? 'bg-red-100 text-red-700' :
                              app.status === 'under_review' ? 'bg-yellow-100 text-yellow-700' :
                              'bg-blue-100 text-blue-700'
                            }`}>
                              {app.status.replace('_', ' ').toUpperCase()}
                            </span>
                          </div>
                          <p className="text-sm text-gray-500">Submitted: {new Date(app.created_at).toLocaleDateString()}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-gray-500 mb-4">No applications yet</p>
                      <Link to="/colleges">
                        <Button className="bg-orange-600 hover:bg-orange-700">Browse Colleges</Button>
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'applications' && (
              <div>
                <h1 className="text-3xl font-bold mb-6">My Applications</h1>
                <div className="bg-white rounded-lg shadow">
                  {applications.length > 0 ? (
                    <div className="divide-y">
                      {applications.map((app) => (
                        <div key={app.id} className="p-6 hover:bg-gray-50 transition">
                          <div className="flex justify-between items-start mb-3">
                            <div>
                              <h3 className="font-bold text-lg">{app.preferred_course}</h3>
                              <p className="text-sm text-gray-600">Application #{app.application_number}</p>
                            </div>
                            <span className={`px-4 py-2 rounded-full text-sm font-semibold ${
                              app.status === 'accepted' ? 'bg-green-100 text-green-700' :
                              app.status === 'rejected' ? 'bg-red-100 text-red-700' :
                              app.status === 'under_review' ? 'bg-yellow-100 text-yellow-700' :
                              'bg-blue-100 text-blue-700'
                            }`}>
                              {app.status.replace('_', ' ').toUpperCase()}
                            </span>
                          </div>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                            <div>
                              <p className="text-gray-600">Name</p>
                              <p className="font-semibold">{app.student_name}</p>
                            </div>
                            <div>
                              <p className="text-gray-600">Email</p>
                              <p className="font-semibold">{app.email}</p>
                            </div>
                            <div>
                              <p className="text-gray-600">Class 12 %</p>
                              <p className="font-semibold">{app.class_12_percentage}%</p>
                            </div>
                            <div>
                              <p className="text-gray-600">Submitted On</p>
                              <p className="font-semibold">{new Date(app.created_at).toLocaleDateString()}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-12 text-center">
                      <FiFileText className="text-6xl text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500 mb-4">No applications submitted yet</p>
                      <Link to="/colleges">
                        <Button className="bg-orange-600 hover:bg-orange-700">Find Colleges</Button>
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'saved' && (
              <div>
                <h1 className="text-3xl font-bold mb-6">Saved Colleges</h1>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {savedColleges.length > 0 ? (
                    savedColleges.map((college) => (
                      <div key={college.id} className="bg-white rounded-lg shadow overflow-hidden">
                        <div className="h-32 bg-gradient-to-br from-blue-500 to-indigo-600 relative">
                          {college.images?.[0] && (
                            <img src={college.images[0]} alt={college.name} className="w-full h-full object-cover" />
                          )}
                        </div>
                        <div className="p-4">
                          <h3 className="font-bold text-lg mb-2">{college.name}</h3>
                          <p className="text-sm text-gray-600 mb-3">{college.location?.city}, {college.location?.state}</p>
                          <div className="flex gap-2">
                            <Link to={`/colleges/${college.id}`} className="flex-1">
                              <Button size="sm" className="w-full bg-orange-600 hover:bg-orange-700">View Details</Button>
                            </Link>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleUnsaveCollege(college.id)}
                              className="text-red-600 hover:bg-red-50"
                            >
                              <FiTrash2 />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="col-span-2 bg-white rounded-lg shadow p-12 text-center">
                      <FiBookmark className="text-6xl text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500 mb-4">No saved colleges yet</p>
                      <Link to="/colleges">
                        <Button className="bg-orange-600 hover:bg-orange-700">Browse Colleges</Button>
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnhancedStudentDashboard;
