/**
 * AdmissionPartnersList - Admin page to manage admission partners
 * Lists colleges/schools/universities with admission partner status
 */
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Link } from '../../components/CustomLink';
import { 
  FiSearch, FiCheckCircle, FiXCircle, FiEdit, FiEye, FiPlus,
  FiHome, FiBookOpen, FiAward, FiFilter
} from 'react-icons/fi';
import AdminLayout from '../../components/admin/AdminLayout';
import api from '../../api/axios';
import { Button } from '../../components/ui/button';

const AdmissionPartnersList = () => {
  const { type } = useParams(); // colleges, schools, universities
  const [institutions, setInstitutions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterPartner, setFilterPartner] = useState('all'); // all, partners, non-partners
  const [updating, setUpdating] = useState(null);

  const entityType = type === 'schools' ? 'school' : 
                     type === 'universities' ? 'university' : 'college';
  
  const pageTitle = type === 'schools' ? 'Partner Schools' :
                    type === 'universities' ? 'Partner Universities' : 'Partner Colleges';

  const Icon = type === 'schools' ? FiBookOpen : 
               type === 'universities' ? FiAward : FiHome;

  useEffect(() => {
    fetchInstitutions();
  }, [type]);

  const fetchInstitutions = async () => {
    setLoading(true);
    try {
      const endpoint = type === 'schools' ? '/schools' : 
                       type === 'universities' ? '/universities' : '/colleges';
      const response = await api.get(endpoint);
      // Handle both array and object responses
      let data = [];
      if (Array.isArray(response.data)) {
        data = response.data;
      } else {
        data = response.data[type] || response.data.colleges || response.data.schools || response.data.universities || [];
      }
      setInstitutions(data);
    } catch (error) {
      console.error('Error fetching institutions:', error);
    } finally {
      setLoading(false);
    }
  };

  const togglePartnerStatus = async (id, currentStatus) => {
    setUpdating(id);
    try {
      const endpoint = type === 'schools' ? `/schools/${id}` : 
                       type === 'universities' ? `/universities/${id}` : `/colleges/${id}`;
      await api.put(endpoint, { is_admission_partner: !currentStatus });
      
      // Update local state
      setInstitutions(prev => prev.map(inst => 
        inst.id === id ? { ...inst, is_admission_partner: !currentStatus } : inst
      ));
    } catch (error) {
      console.error('Error updating partner status:', error);
      alert('Failed to update partner status');
    } finally {
      setUpdating(null);
    }
  };

  // Filter institutions
  const filteredInstitutions = institutions.filter(inst => {
    const matchesSearch = inst.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          inst.city?.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (filterPartner === 'partners') return matchesSearch && inst.is_admission_partner;
    if (filterPartner === 'non-partners') return matchesSearch && !inst.is_admission_partner;
    return matchesSearch;
  });

  const partnerCount = institutions.filter(i => i.is_admission_partner).length;

  return (
    <AdminLayout>
      <div className="p-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <Icon className="text-green-600" />
              {pageTitle}
            </h1>
            <p className="text-gray-600 mt-1">
              {partnerCount} admission partners out of {institutions.length} {type}
            </p>
          </div>
          <Link to={`/admin/${type}/new`}>
            <Button className="bg-green-600 hover:bg-green-700 flex items-center gap-2">
              <FiPlus /> Add New {entityType.charAt(0).toUpperCase() + entityType.slice(1)}
            </Button>
          </Link>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder={`Search ${type}...`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            
            {/* Filter by Partner Status */}
            <div className="flex items-center gap-2">
              <FiFilter className="text-gray-500" />
              <select
                value={filterPartner}
                onChange={(e) => setFilterPartner(e.target.value)}
                className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="all">All Institutions</option>
                <option value="partners">Admission Partners Only</option>
                <option value="non-partners">Non-Partners Only</option>
              </select>
            </div>
          </div>
        </div>

        {/* Institutions List */}
        {loading ? (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <div className="animate-spin w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading {type}...</p>
          </div>
        ) : filteredInstitutions.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <Icon className="text-6xl text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-700 mb-2">No {type} found</h3>
            <p className="text-gray-600">Try adjusting your search or filter</p>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Institution
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Location
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Partner Status
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredInstitutions.map((inst) => (
                  <tr key={inst.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {inst.logo ? (
                          <img src={inst.logo} alt="" className="w-10 h-10 rounded-lg object-cover" />
                        ) : (
                          <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
                            <Icon className="text-gray-400" />
                          </div>
                        )}
                        <div>
                          <p className="font-medium text-gray-900">{inst.name}</p>
                          <p className="text-sm text-gray-500">{inst.type || entityType}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      {inst.city}, {inst.state}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() => togglePartnerStatus(inst.id, inst.is_admission_partner)}
                        disabled={updating === inst.id}
                        className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium transition ${
                          inst.is_admission_partner 
                            ? 'bg-green-100 text-green-700 hover:bg-green-200' 
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        {updating === inst.id ? (
                          <span className="animate-spin">⟳</span>
                        ) : inst.is_admission_partner ? (
                          <>
                            <FiCheckCircle /> Partner
                          </>
                        ) : (
                          <>
                            <FiXCircle /> Not Partner
                          </>
                        )}
                      </button>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <Link to={`/${type === 'schools' ? 'school' : type === 'universities' ? 'university' : 'college'}/${inst.slug || inst.id}`}>
                          <Button variant="outline" size="sm" className="flex items-center gap-1">
                            <FiEye size={14} /> View
                          </Button>
                        </Link>
                        <Link to={`/admin/${type}/${inst.id}`}>
                          <Button variant="outline" size="sm" className="flex items-center gap-1">
                            <FiEdit size={14} /> Edit
                          </Button>
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdmissionPartnersList;
