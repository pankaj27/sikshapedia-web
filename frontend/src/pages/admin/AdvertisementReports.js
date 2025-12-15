import React, { useState, useEffect } from 'react';
import { FiArrowLeft, FiTrendingUp, FiEye, FiMousePointer, FiActivity } from 'react-icons/fi';
import { Button } from '../../components/ui/button';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';

const AdvertisementReports = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [reportData, setReportData] = useState(null);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    setLoading(true);
    try {
      const response = await api.get('/advertisements/reports/stats');
      setReportData(response.data);
    } catch (error) {
      console.error('Error fetching reports:', error);
      alert('Failed to load reports');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
      </div>
    );
  }

  const { summary, advertisements } = reportData || {};

  return (
    <div className="p-6">
      <div className="flex items-center gap-4 mb-6">
        <Button
          variant="outline"
          onClick={() => navigate('/admin/advertisements')}
          className="flex items-center gap-2"
        >
          <FiArrowLeft /> Back
        </Button>
        <h1 className="text-3xl font-bold">Advertisement Performance Reports</h1>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600 text-sm">Total Ads</span>
            <FiActivity className="text-gray-400" />
          </div>
          <div className="text-3xl font-bold text-gray-900">{summary?.total_ads || 0}</div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600 text-sm">Active Ads</span>
            <FiTrendingUp className="text-green-500" />
          </div>
          <div className="text-3xl font-bold text-green-600">{summary?.active_ads || 0}</div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600 text-sm">Total Impressions</span>
            <FiEye className="text-blue-500" />
          </div>
          <div className="text-3xl font-bold text-blue-600">
            {(summary?.total_impressions || 0).toLocaleString()}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600 text-sm">Total Clicks</span>
            <FiMousePointer className="text-purple-500" />
          </div>
          <div className="text-3xl font-bold text-purple-600">
            {(summary?.total_clicks || 0).toLocaleString()}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600 text-sm">Average CTR</span>
            <FiTrendingUp className="text-orange-500" />
          </div>
          <div className="text-3xl font-bold text-orange-600">
            {summary?.average_ctr || 0}%
          </div>
        </div>
      </div>

      {/* Detailed Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-6 border-b">
          <h2 className="text-xl font-bold">Detailed Performance by Advertisement</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Campaign Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Pages
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Impressions
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Clicks
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  CTR
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Date Range
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {advertisements && advertisements.length > 0 ? (
                advertisements.map((ad) => (
                  <tr key={ad.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{ad.name}</div>
                      <div className="text-xs text-gray-500">Priority: {ad.priority}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                        {ad.ad_type}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-xs text-gray-500">
                        {ad.pages?.join(', ') || 'None'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-1 text-sm">
                        <FiEye className="text-blue-500" />
                        <span className="font-semibold">{ad.impressions.toLocaleString()}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-1 text-sm">
                        <FiMousePointer className="text-purple-500" />
                        <span className="font-semibold">{ad.clicks.toLocaleString()}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-semibold">
                        <span className={`${
                          ad.ctr >= 2 ? 'text-green-600' :
                          ad.ctr >= 1 ? 'text-yellow-600' :
                          'text-red-600'
                        }`}>
                          {ad.ctr}%
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        ad.is_currently_active
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {ad.is_currently_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs text-gray-500">
                      <div>{new Date(ad.start_date).toLocaleDateString()}</div>
                      <div>to</div>
                      <div>{new Date(ad.end_date).toLocaleDateString()}</div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="px-6 py-8 text-center text-gray-500">
                    No advertisement data available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Performance Insights */}
      {advertisements && advertisements.length > 0 && (
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-bold mb-4">Top Performing Ads</h3>
            <div className="space-y-3">
              {advertisements
                .slice(0, 5)
                .map((ad, index) => (
                  <div key={ad.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-bold text-gray-400">#{index + 1}</span>
                      <span className="text-sm font-medium">{ad.name}</span>
                    </div>
                    <span className="text-sm font-semibold text-blue-600">
                      {ad.impressions.toLocaleString()} views
                    </span>
                  </div>
                ))}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-bold mb-4">Highest CTR</h3>
            <div className="space-y-3">
              {[...advertisements]
                .sort((a, b) => b.ctr - a.ctr)
                .slice(0, 5)
                .map((ad, index) => (
                  <div key={ad.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-bold text-gray-400">#{index + 1}</span>
                      <span className="text-sm font-medium">{ad.name}</span>
                    </div>
                    <span className={`text-sm font-semibold ${
                      ad.ctr >= 2 ? 'text-green-600' : 'text-orange-600'
                    }`}>
                      {ad.ctr}% CTR
                    </span>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdvertisementReports;
