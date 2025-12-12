import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FiMapPin, FiStar, FiPhone, FiMail, FiGlobe, FiBookOpen, FiAward, FiHeart } from 'react-icons/fi';
import api from '../api/axios';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Label } from '../components/ui/label';

const CollegeDetailPage = () => {
  const { id } = useParams();
  const { user, isAuthenticated } = useAuth();
  const [college, setCollege] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  
  // Review form
  const [reviewForm, setReviewForm] = useState({ rating: 5, review_text: '' });
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  
  // Inquiry form
  const [inquiryForm, setInquiryForm] = useState({
    student_name: user?.name || '',
    email: user?.email || '',
    phone: '',
    course_interested: '',
    message: ''
  });
  const [inquirySubmitting, setInquirySubmitting] = useState(false);

  useEffect(() => {
    fetchCollegeData();
  }, [id]);

  const fetchCollegeData = async () => {
    try {
      const [collegeRes, reviewsRes] = await Promise.all([
        api.get(`/colleges/${id}`),
        api.get(`/reviews/college/${id}`)
      ]);
      setCollege(collegeRes.data);
      setReviews(reviewsRes.data);
    } catch (error) {
      console.error('Error fetching college data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveCollege = async () => {
    if (!isAuthenticated) {
      alert('Please login to save colleges');
      return;
    }
    
    try {
      if (saved) {
        await api.delete(`/users/save-college/${id}`);
        setSaved(false);
      } else {
        await api.post(`/users/save-college/${id}`);
        setSaved(true);
      }
    } catch (error) {
      console.error('Error saving college:', error);
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      alert('Please login to submit a review');
      return;
    }
    
    setReviewSubmitting(true);
    try {
      await api.post('/reviews', {
        college_id: id,
        ...reviewForm
      });
      alert('Review submitted successfully!');
      setReviewForm({ rating: 5, review_text: '' });
      fetchCollegeData();
    } catch (error) {
      alert(error.response?.data?.detail || 'Failed to submit review');
    } finally {
      setReviewSubmitting(false);
    }
  };

  const handleInquirySubmit = async (e) => {
    e.preventDefault();
    setInquirySubmitting(true);
    try {
      await api.post('/inquiries', {
        college_id: id,
        ...inquiryForm
      });
      alert('Inquiry submitted successfully! The college will contact you soon.');
      setInquiryForm({
        student_name: user?.name || '',
        email: user?.email || '',
        phone: '',
        course_interested: '',
        message: ''
      });
    } catch (error) {
      alert('Failed to submit inquiry');
    } finally {
      setInquirySubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading college information...</p>
        </div>
      </div>
    );
  }

  if (!college) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">College Not Found</h2>
          <Link to="/colleges">
            <Button>Browse Colleges</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="container mx-auto max-w-7xl px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="text-2xl font-bold text-blue-600" data-testid="logo">
              Sikshapedia
            </Link>
            <Link to="/colleges">
              <Button variant="outline" data-testid="back-button">Back to Colleges</Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-12">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="flex justify-between items-start gap-8">
            <div className="flex-1">
              <h1 className="text-4xl font-bold mb-4" data-testid="college-name">{college.name}</h1>
              <div className="flex items-center gap-2 text-blue-100 mb-4">
                <FiMapPin />
                <span data-testid="college-location">{college.location.city}, {college.location.state}, {college.location.country}</span>
              </div>
              <div className="flex gap-6 text-sm">
                <div>
                  <div className="text-blue-100">Established</div>
                  <div className="text-xl font-bold" data-testid="established-year">{college.established_year}</div>
                </div>
                <div>
                  <div className="text-blue-100">Type</div>
                  <div className="text-xl font-bold" data-testid="college-type">{college.type}</div>
                </div>
                <div>
                  <div className="text-blue-100">Rating</div>
                  <div className="text-xl font-bold flex items-center gap-1" data-testid="college-rating">
                    <FiStar className="text-yellow-400" />
                    {college.rating || 'N/A'} ({college.total_reviews})
                  </div>
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-blue-100 mb-2">Average Fees</div>
              <div className="text-3xl font-bold mb-4" data-testid="college-fees">₹{(college.average_fees / 100000).toFixed(1)}L/year</div>
              <div className="flex gap-2">
                <Button
                  variant="secondary"
                  onClick={handleSaveCollege}
                  className="flex items-center gap-2"
                  data-testid="save-button"
                >
                  <FiHeart className={saved ? 'fill-current' : ''} />
                  {saved ? 'Saved' : 'Save'}
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => setActiveTab('inquiry')}
                  data-testid="inquire-button"
                >
                  Inquire Now
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto max-w-7xl px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList>
            <TabsTrigger value="overview" data-testid="tab-overview">Overview</TabsTrigger>
            <TabsTrigger value="courses" data-testid="tab-courses">Courses & Fees</TabsTrigger>
            <TabsTrigger value="reviews" data-testid="tab-reviews">Reviews</TabsTrigger>
            <TabsTrigger value="inquiry" data-testid="tab-inquiry">Apply/Inquire</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* About */}
            <div className="bg-white rounded-lg p-6 border">
              <h2 className="text-2xl font-bold mb-4">About {college.name}</h2>
              <p className="text-gray-700 leading-relaxed" data-testid="college-description">{college.description}</p>
            </div>

            {/* Key Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg p-6 border">
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <FiBookOpen className="text-blue-600" />
                  Academic Details
                </h3>
                <div className="space-y-3">
                  <div>
                    <div className="text-sm text-gray-600">Affiliation</div>
                    <div className="font-semibold" data-testid="affiliation">{college.affiliation || 'N/A'}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Total Courses</div>
                    <div className="font-semibold" data-testid="total-courses">{college.total_courses}</div>
                  </div>
                  {college.ranking && (
                    <div>
                      <div className="text-sm text-gray-600">Ranking</div>
                      <div className="font-semibold" data-testid="ranking">#{college.ranking}</div>
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-white rounded-lg p-6 border">
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <FiAward className="text-blue-600" />
                  Accreditations
                </h3>
                {college.accreditations.length > 0 ? (
                  <ul className="space-y-2">
                    {college.accreditations.map((acc, idx) => (
                      <li key={idx} className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                        {acc}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-600">No accreditations listed</p>
                )}
              </div>
            </div>

            {/* Facilities */}
            {college.facilities.length > 0 && (
              <div className="bg-white rounded-lg p-6 border">
                <h3 className="text-xl font-bold mb-4">Facilities</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {college.facilities.map((facility, idx) => (
                    <div key={idx} className="flex items-center gap-2 p-3 bg-blue-50 rounded">
                      <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                      <span className="text-sm">{facility}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Contact Information */}
            <div className="bg-white rounded-lg p-6 border">
              <h3 className="text-xl font-bold mb-4">Contact Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {college.contact_info.phone && (
                  <div className="flex items-center gap-3">
                    <FiPhone className="text-blue-600 text-xl" />
                    <div>
                      <div className="text-sm text-gray-600">Phone</div>
                      <div className="font-semibold" data-testid="contact-phone">{college.contact_info.phone}</div>
                    </div>
                  </div>
                )}
                {college.contact_info.email && (
                  <div className="flex items-center gap-3">
                    <FiMail className="text-blue-600 text-xl" />
                    <div>
                      <div className="text-sm text-gray-600">Email</div>
                      <div className="font-semibold" data-testid="contact-email">{college.contact_info.email}</div>
                    </div>
                  </div>
                )}
                {college.contact_info.website && (
                  <div className="flex items-center gap-3">
                    <FiGlobe className="text-blue-600 text-xl" />
                    <div>
                      <div className="text-sm text-gray-600">Website</div>
                      <a href={college.contact_info.website} target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 hover:underline" data-testid="contact-website">
                        Visit Website
                      </a>
                    </div>
                  </div>
                )}
                {college.contact_info.address && (
                  <div className="flex items-center gap-3">
                    <FiMapPin className="text-blue-600 text-xl" />
                    <div>
                      <div className="text-sm text-gray-600">Address</div>
                      <div className="font-semibold" data-testid="contact-address">{college.contact_info.address}</div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Admission Process */}
            {college.admission_process && (
              <div className="bg-white rounded-lg p-6 border">
                <h3 className="text-xl font-bold mb-4">Admission Process</h3>
                <p className="text-gray-700 leading-relaxed" data-testid="admission-process">{college.admission_process}</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="courses">
            <div className="bg-white rounded-lg p-6 border">
              <h2 className="text-2xl font-bold mb-6">Courses Offered</h2>
              {college.courses.length > 0 ? (
                <div className="space-y-4">
                  {college.courses.map((course) => (
                    <div key={course.id} className="p-4 border rounded-lg hover:border-blue-300 transition" data-testid={`course-${course.id}`}>
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-bold text-lg">{course.name}</h3>
                          <div className="flex gap-4 text-sm text-gray-600 mt-2">
                            <span>Degree: <span className="font-semibold">{course.degree_type}</span></span>
                            <span>Duration: <span className="font-semibold">{course.duration}</span></span>
                            {course.seats && <span>Seats: <span className="font-semibold">{course.seats}</span></span>}
                          </div>
                          {course.eligibility && (
                            <div className="text-sm text-gray-600 mt-2">
                              Eligibility: {course.eligibility}
                            </div>
                          )}
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-blue-600">₹{(course.fees / 100000).toFixed(1)}L</div>
                          <div className="text-sm text-gray-600">per year</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-600">No courses listed yet.</p>
              )}
            </div>
          </TabsContent>

          <TabsContent value="reviews">
            {/* Submit Review */}
            {isAuthenticated && (
              <div className="bg-white rounded-lg p-6 border mb-6">
                <h3 className="text-xl font-bold mb-4">Write a Review</h3>
                <form onSubmit={handleReviewSubmit} className="space-y-4">
                  <div>
                    <Label>Rating</Label>
                    <select
                      value={reviewForm.rating}
                      onChange={(e) => setReviewForm({ ...reviewForm, rating: parseInt(e.target.value) })}
                      className="w-full p-2 border rounded"
                      data-testid="review-rating"
                    >
                      {[5, 4, 3, 2, 1].map(num => (
                        <option key={num} value={num}>{num} Stars</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <Label>Your Review</Label>
                    <Textarea
                      value={reviewForm.review_text}
                      onChange={(e) => setReviewForm({ ...reviewForm, review_text: e.target.value })}
                      placeholder="Share your experience..."
                      rows={4}
                      required
                      data-testid="review-text"
                    />
                  </div>
                  <Button type="submit" disabled={reviewSubmitting} data-testid="submit-review-button">
                    {reviewSubmitting ? 'Submitting...' : 'Submit Review'}
                  </Button>
                </form>
              </div>
            )}

            {/* Reviews List */}
            <div className="bg-white rounded-lg p-6 border">
              <h2 className="text-2xl font-bold mb-6">Student Reviews ({reviews.length})</h2>
              {reviews.length > 0 ? (
                <div className="space-y-6">
                  {reviews.map((review) => (
                    <div key={review.id} className="pb-6 border-b last:border-0" data-testid={`review-${review.id}`}>
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <div className="font-semibold">{review.user_name}</div>
                          <div className="flex items-center gap-1 mt-1">
                            {[...Array(5)].map((_, i) => (
                              <FiStar key={i} className={i < review.rating ? 'text-yellow-500 fill-current' : 'text-gray-300'} />
                            ))}
                          </div>
                        </div>
                        <div className="text-sm text-gray-500">
                          {new Date(review.created_at).toLocaleDateString()}
                        </div>
                      </div>
                      <p className="text-gray-700">{review.review_text}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-600">No reviews yet. Be the first to review!</p>
              )}
            </div>
          </TabsContent>

          <TabsContent value="inquiry">
            <div className="bg-white rounded-lg p-6 border max-w-2xl mx-auto">
              <h2 className="text-2xl font-bold mb-6">Submit an Inquiry</h2>
              <form onSubmit={handleInquirySubmit} className="space-y-4">
                <div>
                  <Label>Your Name *</Label>
                  <Input
                    value={inquiryForm.student_name}
                    onChange={(e) => setInquiryForm({ ...inquiryForm, student_name: e.target.value })}
                    required
                    data-testid="inquiry-name"
                  />
                </div>
                <div>
                  <Label>Email *</Label>
                  <Input
                    type="email"
                    value={inquiryForm.email}
                    onChange={(e) => setInquiryForm({ ...inquiryForm, email: e.target.value })}
                    required
                    data-testid="inquiry-email"
                  />
                </div>
                <div>
                  <Label>Phone *</Label>
                  <Input
                    value={inquiryForm.phone}
                    onChange={(e) => setInquiryForm({ ...inquiryForm, phone: e.target.value })}
                    required
                    data-testid="inquiry-phone"
                  />
                </div>
                <div>
                  <Label>Course Interested In *</Label>
                  <Input
                    value={inquiryForm.course_interested}
                    onChange={(e) => setInquiryForm({ ...inquiryForm, course_interested: e.target.value })}
                    required
                    placeholder="e.g., BTech Computer Science"
                    data-testid="inquiry-course"
                  />
                </div>
                <div>
                  <Label>Message</Label>
                  <Textarea
                    value={inquiryForm.message}
                    onChange={(e) => setInquiryForm({ ...inquiryForm, message: e.target.value })}
                    rows={4}
                    placeholder="Tell us about your interests and questions..."
                    data-testid="inquiry-message"
                  />
                </div>
                <Button type="submit" disabled={inquirySubmitting} className="w-full" data-testid="submit-inquiry-button">
                  {inquirySubmitting ? 'Submitting...' : 'Submit Inquiry'}
                </Button>
              </form>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default CollegeDetailPage;
