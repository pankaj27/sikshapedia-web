import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FiMapPin, FiStar, FiPhone, FiMail, FiGlobe, FiBookmark, FiShare2 } from 'react-icons/fi';
import api from '../api/axios';
import { Button } from '../components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../components/ui/tabs';

const CollegeDetailPage = () => {
  const { id } = useParams();
  const [college, setCollege] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCollege();
  }, [id]);

  const fetchCollege = async () => {
    try {
      const response = await api.get(`/colleges/${id}`);
      setCollege(response.data);
    } catch (error) {
      console.error('Error fetching college:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!college) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">College Not Found</h2>
          <Link to="/colleges"><Button>Back to Colleges</Button></Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="text-2xl font-bold">
              <span className="text-orange-600">Siksha</span>
              <span className="text-blue-600">pedia</span>
            </Link>
            <nav className="flex items-center gap-6">
              <Link to="/colleges" className="text-gray-700 hover:text-orange-600">Back to Colleges</Link>
              <Link to="/login"><Button variant="ghost">Login</Button></Link>
              <Link to="/register"><Button className="bg-orange-600 hover:bg-orange-700">Sign Up</Button></Link>
            </nav>
          </div>
        </div>
      </header>

      {/* College Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex gap-6">
            <div className="w-32 h-32 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg overflow-hidden flex-shrink-0">
              {college.images?.[0] ? (
                <img src={college.images[0]} alt={college.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-white text-4xl font-bold">
                  {college.name.charAt(0)}
                </div>
              )}
            </div>
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{college.name}</h1>
              <div className="flex items-center gap-4 text-gray-600 mb-3">
                <div className="flex items-center gap-1">
                  <FiMapPin className="text-orange-600" />
                  <span>{college.location.city}, {college.location.state}</span>
                </div>
                <span>•</span>
                <span>{college.type}</span>
                <span>•</span>
                <span>Estd. {college.established_year}</span>
              </div>
              <div className="flex items-center gap-4">
                <div className="bg-green-100 text-green-700 px-4 py-2 rounded font-bold">
                  <FiStar className="inline mr-1" />
                  {college.rating || 'N/A'} ({college.total_reviews} reviews)
                </div>
                {college.ranking && (
                  <div className="bg-orange-100 text-orange-700 px-4 py-2 rounded font-bold">
                    Rank #{college.ranking}
                  </div>
                )}
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline"><FiBookmark className="mr-2" /> Save</Button>
              <Button variant="outline"><FiShare2 className="mr-2" /> Share</Button>
              <Button className="bg-orange-600 hover:bg-orange-700">Apply Now</Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6">
        <div className="flex gap-6">
          {/* Main Content Area */}
          <div className="flex-1">
            <Tabs defaultValue="overview">
              <TabsList className="bg-white border-b w-full justify-start rounded-none">
                <TabsTrigger value="overview" className="data-[state=active]:text-orange-600 data-[state=active]:border-b-2 data-[state=active]:border-orange-600">Overview</TabsTrigger>
                <TabsTrigger value="courses" className="data-[state=active]:text-orange-600 data-[state=active]:border-b-2 data-[state=active]:border-orange-600">Courses & Fees</TabsTrigger>
                <TabsTrigger value="admissions" className="data-[state=active]:text-orange-600 data-[state=active]:border-b-2 data-[state=active]:border-orange-600">Admissions</TabsTrigger>
                <TabsTrigger value="reviews" className="data-[state=active]:text-orange-600 data-[state=active]:border-b-2 data-[state=active]:border-orange-600">Reviews</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="mt-6">
                <div className="bg-white rounded-lg shadow p-6 mb-6">
                  <h2 className="text-2xl font-bold mb-4">About {college.name}</h2>
                  <p className="text-gray-700 leading-relaxed">{college.description}</p>
                </div>

                {college.facilities?.length > 0 && (
                  <div className="bg-white rounded-lg shadow p-6">
                    <h2 className="text-2xl font-bold mb-4">Facilities</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {college.facilities.map((facility, idx) => (
                        <div key={idx} className="flex items-center gap-2 p-3 bg-gray-50 rounded">
                          <span>✓</span>
                          <span>{facility}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="courses" className="mt-6">
                <div className="bg-white rounded-lg shadow p-6">
                  <h2 className="text-2xl font-bold mb-6">Courses Offered</h2>
                  {college.courses?.length > 0 ? (
                    <div className="space-y-4">
                      {college.courses.map((course) => (
                        <div key={course.id} className="border rounded-lg p-4 hover:border-orange-600 transition">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-bold text-lg">{course.name}</h3>
                              <div className="flex gap-4 text-sm text-gray-600 mt-2">
                                <span>Degree: {course.degree_type}</span>
                                <span>Duration: {course.duration}</span>
                                {course.seats && <span>Seats: {course.seats}</span>}
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-2xl font-bold text-orange-600">₹{(course.fees / 100000).toFixed(1)}L</div>
                              <div className="text-sm text-gray-600">per year</div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-600">No courses listed.</p>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="admissions" className="mt-6">
                <div className="bg-white rounded-lg shadow p-6">
                  <h2 className="text-2xl font-bold mb-4">Admission Process</h2>
                  <p className="text-gray-700 leading-relaxed">
                    {college.admission_process || 'Admission information will be updated soon.'}
                  </p>
                </div>
              </TabsContent>

              <TabsContent value="reviews" className="mt-6">
                <div className="bg-white rounded-lg shadow p-6">
                  <h2 className="text-2xl font-bold mb-4">Student Reviews</h2>
                  <p className="text-gray-600">Reviews coming soon...</p>
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <aside className="w-80 flex-shrink-0">
            <div className="bg-white rounded-lg shadow p-6 sticky top-6">
              <h3 className="font-bold text-lg mb-4">Quick Facts</h3>
              <div className="space-y-4">
                <div>
                  <div className="text-sm text-gray-600">Average Fees</div>
                  <div className="text-2xl font-bold text-orange-600">₹{(college.average_fees / 100000).toFixed(1)}L/year</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">Total Courses</div>
                  <div className="text-xl font-bold">{college.total_courses}</div>
                </div>
                {college.affiliation && (
                  <div>
                    <div className="text-sm text-gray-600">Affiliation</div>
                    <div className="font-semibold">{college.affiliation}</div>
                  </div>
                )}
              </div>

              <div className="mt-6 pt-6 border-t">
                <h4 className="font-semibold mb-3">Contact Information</h4>
                <div className="space-y-2 text-sm">
                  {college.contact_info?.phone && (
                    <div className="flex items-center gap-2">
                      <FiPhone className="text-orange-600" />
                      <span>{college.contact_info.phone}</span>
                    </div>
                  )}
                  {college.contact_info?.email && (
                    <div className="flex items-center gap-2">
                      <FiMail className="text-orange-600" />
                      <span>{college.contact_info.email}</span>
                    </div>
                  )}
                  {college.contact_info?.website && (
                    <div className="flex items-center gap-2">
                      <FiGlobe className="text-orange-600" />
                      <a href={college.contact_info.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                        Visit Website
                      </a>
                    </div>
                  )}
                </div>
              </div>

              <Button className="w-full mt-6 bg-orange-600 hover:bg-orange-700">Apply Now</Button>
              <Button variant="outline" className="w-full mt-2">Download Brochure</Button>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default CollegeDetailPage;
