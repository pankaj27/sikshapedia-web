import React, { useState, useEffect } from 'react';
import { FiDownload, FiExternalLink, FiFilter, FiStar, FiBook, FiVideo, FiFileText, FiLock } from 'react-icons/fi';
import api from '../api/axios';
import { Button } from '../components/ui/button';
import MetaTags from '../components/SEO/MetaTags';
import { FeaturedSponsoredSection } from '../components/SponsoredAds';

const StudyMaterialsPage = () => {
  const [materials, setMaterials] = useState([]);
  const [filteredMaterials, setFilteredMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [examName, setExamName] = useState('all');
  const [subject, setSubject] = useState('all');
  const [materialType, setMaterialType] = useState('all');

  useEffect(() => {
    fetchMaterials();
  }, []);

  useEffect(() => {
    filterMaterials();
  }, [materials, examName, subject, materialType]);

  const fetchMaterials = async () => {
    try {
      const response = await api.get('/study-materials');
      setMaterials(response.data);
      setFilteredMaterials(response.data);
    } catch (error) {
      console.error('Error fetching materials:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterMaterials = () => {
    let filtered = materials;

    if (examName !== 'all') {
      filtered = filtered.filter(m => m.exam_name === examName);
    }

    if (subject !== 'all') {
      filtered = filtered.filter(m => m.subject === subject);
    }

    if (materialType !== 'all') {
      filtered = filtered.filter(m => m.material_type === materialType);
    }

    setFilteredMaterials(filtered);
  };

  const handleDownload = async (material) => {
    if (material.is_premium) {
      alert('This is a premium material. Please upgrade to access.');
      return;
    }

    try {
      await api.get(`/study-materials/${material.id}`);
      if (material.file_url) {
        window.open(material.file_url, '_blank');
      } else if (material.external_link) {
        window.open(material.external_link, '_blank');
      }
    } catch (error) {
      console.error('Error downloading material:', error);
    }
  };

  const getIcon = (type) => {
    switch (type) {
      case 'Video': return <FiVideo className="text-red-500" />;
      case 'Notes': return <FiBook className="text-blue-500" />;
      case 'Sample Paper': return <FiFileText className="text-green-500" />;
      case 'Previous Year': return <FiFileText className="text-purple-500" />;
      case 'Mock Test': return <FiFileText className="text-orange-500" />;
      default: return <FiBook className="text-gray-500" />;
    }
  };

  const examList = [...new Set(materials.map(m => m.exam_name))];
  const subjectList = [...new Set(materials.map(m => m.subject))];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading study materials...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <MetaTags 
        title="Study Materials - Free Notes, Sample Papers & Mock Tests | AdmissionBuddy"
        description="Download free study materials for JEE, NEET, CAT, GATE, UPSC. Get notes, sample papers, previous year questions, and video lectures."
      />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Study Materials & Resources</h1>
            <p className="text-xl text-blue-100">
              Access 10,000+ free study materials including notes, sample papers, previous year questions, and video lectures for all major exams.
            </p>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8">
        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{materials.length}</div>
            <div className="text-sm text-gray-600">Resources</div>
          </div>
          <div className="bg-white rounded-lg shadow p-4 text-center">
            <div className="text-2xl font-bold text-green-600">
              {materials.filter(m => !m.is_premium).length}
            </div>
            <div className="text-sm text-gray-600">Free</div>
          </div>
          <div className="bg-white rounded-lg shadow p-4 text-center">
            <div className="text-2xl font-bold text-purple-600">{examList.length}</div>
            <div className="text-sm text-gray-600">Exams</div>
          </div>
          <div className="bg-white rounded-lg shadow p-4 text-center">
            <div className="text-2xl font-bold text-orange-600">
              {materials.reduce((sum, m) => sum + m.downloads, 0)}
            </div>
            <div className="text-sm text-gray-600">Downloads</div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <div className="flex items-center gap-2 mb-4">
            <FiFilter className="text-blue-600" />
            <h2 className="text-xl font-bold">Filter Materials</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Exam</label>
              <select
                value={examName}
                onChange={(e) => setExamName(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Exams</option>
                {examList.map(exam => (
                  <option key={exam} value={exam}>{exam}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
              <select
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Subjects</option>
                {subjectList.map(subj => (
                  <option key={subj} value={subj}>{subj}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
              <select
                value={materialType}
                onChange={(e) => setMaterialType(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Types</option>
                <option value="Notes">Notes</option>
                <option value="Sample Paper">Sample Papers</option>
                <option value="Previous Year">Previous Year</option>
                <option value="Mock Test">Mock Tests</option>
                <option value="Video">Videos</option>
              </select>
            </div>
          </div>
          <div className="mt-4 text-sm text-gray-600">
            Showing {filteredMaterials.length} of {materials.length} materials
          </div>
        </div>

        {/* Materials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMaterials.map((material) => (
            <div key={material.id} className="bg-white rounded-lg shadow hover:shadow-xl transition">
              <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    {getIcon(material.material_type)}
                    <span className={`text-xs font-medium px-2 py-1 rounded ${
                      material.is_premium ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'
                    }`}>
                      {material.is_premium ? 'Premium' : 'Free'}
                    </span>
                  </div>
                  {material.is_premium && <FiLock className="text-yellow-500" />}
                </div>

                <h3 className="text-lg font-bold mb-2 line-clamp-2">{material.title}</h3>
                
                <div className="flex flex-wrap gap-2 mb-3">
                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                    {material.exam_name}
                  </span>
                  <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded">
                    {material.subject}
                  </span>
                  <span className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded">
                    {material.material_type}
                  </span>
                </div>

                <p className="text-sm text-gray-600 mb-4 line-clamp-3">{material.description}</p>

                <div className="flex items-center justify-between mb-4 text-sm">
                  <div className="flex items-center gap-1">
                    <FiStar className="text-yellow-500" />
                    <span className="font-semibold">{material.rating}</span>
                    <span className="text-gray-500">({material.total_ratings})</span>
                  </div>
                  <div className="flex items-center gap-1 text-gray-600">
                    <FiDownload />
                    <span>{material.downloads}</span>
                  </div>
                </div>

                <Button
                  onClick={() => handleDownload(material)}
                  className={`w-full ${material.is_premium ? 'bg-yellow-600 hover:bg-yellow-700' : 'bg-blue-600 hover:bg-blue-700'}`}
                >
                  {material.is_premium ? (
                    <>
                      <FiLock className="mr-2" /> Unlock Premium
                    </>
                  ) : material.file_url ? (
                    <>
                      <FiDownload className="mr-2" /> Download
                    </>
                  ) : (
                    <>
                      <FiExternalLink className="mr-2" /> Access
                    </>
                  )}
                </Button>
              </div>
            </div>
          ))}
        </div>

        {filteredMaterials.length === 0 && (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <p className="text-gray-600">No materials match your filter criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudyMaterialsPage;
