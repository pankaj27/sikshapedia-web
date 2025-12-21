import React, { useState, useEffect } from 'react';
import { Link } from '../components/CustomLink';
import { FiSearch, FiFilter, FiDollarSign, FiPercent, FiClock, FiCheckCircle, FiXCircle } from 'react-icons/fi';
import api from '../api/axios';
import { Button } from '../components/ui/button';
import MetaTags from '../components/SEO/MetaTags';
import { FeaturedSponsoredSection } from '../components/SponsoredAds';

const EducationLoansPage = () => {
  const [loans, setLoans] = useState([]);
  const [filteredLoans, setFilteredLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loanType, setLoanType] = useState('all');
  const [maxInterestRate, setMaxInterestRate] = useState(15);
  const [selectedLoan, setSelectedLoan] = useState(null);
  const [showApplicationModal, setShowApplicationModal] = useState(false);
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    date_of_birth: '',
    course_name: '',
    college_name: '',
    course_fees: '',
    course_duration: '',
    loan_amount_required: '',
    annual_family_income: '',
    existing_loans: ''
  });

  useEffect(() => {
    fetchLoans();
  }, []);

  useEffect(() => {
    filterLoans();
  }, [loans, loanType, maxInterestRate]);

  const fetchLoans = async () => {
    try {
      const response = await api.get('/education-loans');
      setLoans(response.data);
      setFilteredLoans(response.data);
    } catch (error) {
      console.error('Error fetching loans:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterLoans = () => {
    let filtered = loans;

    if (loanType !== 'all') {
      filtered = filtered.filter(loan => loan.loan_type === loanType);
    }

    filtered = filtered.filter(loan => loan.interest_rate <= maxInterestRate);

    setFilteredLoans(filtered);
  };

  const handleApplyClick = (loan) => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    setSelectedLoan(loan);
    setFormData({
      ...formData,
      full_name: user.name || '',
      email: user.email || ''
    });
    setShowApplicationModal(true);
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const submitData = {
        ...formData,
        loan_id: selectedLoan.id,
        course_fees: parseFloat(formData.course_fees),
        course_duration: parseInt(formData.course_duration),
        loan_amount_required: parseFloat(formData.loan_amount_required),
        annual_family_income: parseFloat(formData.annual_family_income)
      };

      await api.post('/loan-applications', submitData);
      alert('Loan application submitted successfully! Check your dashboard for updates.');
      setShowApplicationModal(false);
      setFormData({
        full_name: '',
        email: '',
        phone: '',
        date_of_birth: '',
        course_name: '',
        college_name: '',
        course_fees: '',
        course_duration: '',
        loan_amount_required: '',
        annual_family_income: '',
        existing_loans: ''
      });
    } catch (error) {
      alert(error.response?.data?.detail || 'Error submitting application. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading education loans...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <MetaTags 
        title="Education Loans - Compare Best Student Loans | admissionbuddy"
        description="Compare education loans from top banks in India. Find the best interest rates, loan amounts, and repayment terms for studying in India and abroad."
      />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-orange-600 to-orange-500 text-white py-10">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <h1 className="text-3xl md:text-4xl font-bold mb-3">Education Loans</h1>
            <p className="text-base md:text-lg text-orange-100">
              Compare and apply for education loans from India's leading banks. Get instant approval for loans up to ₹1 Crore.
            </p>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-6">
        {/* Featured Colleges for Education Loans */}
        <FeaturedSponsoredSection 
          placementId="loan_featured"
          title="Colleges with Loan Assistance"
          subtitle="Explore institutions with education loan tie-ups"
          bgColor="from-emerald-50 via-green-50 to-teal-50"
          headerColor="from-emerald-500 to-green-500"
          linkColor="text-emerald-600"
          viewAllLink="/colleges"
        />

        {/* Filters */}
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <div className="flex items-center gap-2 mb-3">
            <FiFilter className="text-orange-600 text-sm" />
            <h2 className="text-base font-bold">Filter Loans</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Loan Type</label>
              <select
                value={loanType}
                onChange={(e) => setLoanType(e.target.value)}
                className="w-full px-3 py-1.5 text-sm border rounded-lg focus:ring-2 focus:ring-orange-500"
              >
                <option value="all">All Types</option>
                <option value="Domestic">Domestic</option>
                <option value="International">International</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Max Interest Rate: {maxInterestRate}%
              </label>
              <input
                type="range"
                min="5"
                max="15"
                step="0.5"
                value={maxInterestRate}
                onChange={(e) => setMaxInterestRate(parseFloat(e.target.value))}
                className="w-full"
              />
            </div>
          </div>
          <div className="mt-3 text-xs text-gray-600">
            Showing {filteredLoans.length} of {loans.length} loans
          </div>
        </div>

        {/* Loans Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filteredLoans.map((loan) => (
            <div key={loan.id} className="bg-white rounded-lg shadow hover:shadow-lg transition">
              <div className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">{loan.bank_name}</h3>
                    <span className={`inline-block mt-1.5 px-2 py-0.5 rounded-full text-xs font-medium ${
                      loan.loan_type === 'International' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
                    }`}>
                      {loan.loan_type}
                    </span>
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-bold text-orange-600">{loan.interest_rate}%</div>
                    <div className="text-xs text-gray-600">Interest Rate</div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-3">
                  <div className="flex items-center gap-1.5">
                    <FiDollarSign className="text-green-600 text-sm" />
                    <div>
                      <div className="text-xs text-gray-600">Max Loan</div>
                      <div className="text-sm font-bold">₹{(loan.max_loan_amount / 100000).toFixed(1)}L</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <FiClock className="text-blue-600 text-sm" />
                    <div>
                      <div className="text-xs text-gray-600">Repayment</div>
                      <div className="text-sm font-bold">{loan.repayment_period} years</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <FiPercent className="text-purple-600 text-sm" />
                    <div>
                      <div className="text-xs text-gray-600">Processing</div>
                      <div className="text-sm font-bold">{loan.processing_fee}%</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5">
                    {loan.collateral_required ? (
                      <FiXCircle className="text-red-600 text-sm" />
                    ) : (
                      <FiCheckCircle className="text-green-600 text-sm" />
                    )}
                    <div>
                      <div className="text-xs text-gray-600">Collateral</div>
                      <div className="text-sm font-bold">{loan.collateral_required ? 'Required' : 'Not Required'}</div>
                    </div>
                  </div>
                </div>

                <div className="mb-3">
                  <h4 className="text-xs font-semibold mb-1.5">Key Features:</h4>
                  <ul className="space-y-1">
                    {loan.features.slice(0, 3).map((feature, idx) => (
                      <li key={idx} className="text-xs text-gray-700 flex items-start gap-1.5">
                        <FiCheckCircle className="text-green-500 mt-0.5 flex-shrink-0 text-xs" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex gap-2">
                  <Button
                    onClick={() => handleApplyClick(loan)}
                    className="flex-1 bg-orange-600 hover:bg-orange-700 h-8 text-xs"
                  >
                    Apply Now
                  </Button>
                  {loan.website_url && (
                    <a
                      href={loan.website_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 h-8 border border-orange-600 text-orange-600 rounded-lg hover:bg-orange-50 transition flex items-center text-xs"
                    >
                      More Info
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredLoans.length === 0 && (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <p className="text-sm text-gray-600">No loans match your filter criteria. Try adjusting the filters.</p>
          </div>
        )}
      </div>

      {/* Application Modal */}
      {showApplicationModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-lg max-w-2xl w-full my-8">
            <div className="p-4 border-b">
              <h2 className="text-lg font-bold">Apply for Education Loan</h2>
              <p className="text-xs text-gray-600 mt-1">{selectedLoan?.bank_name}</p>
            </div>

            <form onSubmit={handleSubmit} className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium mb-1">Full Name *</label>
                  <input
                    type="text"
                    name="full_name"
                    value={formData.full_name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-2 py-1.5 text-sm border rounded-lg focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1">Email *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-2 py-1.5 text-sm border rounded-lg focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1">Phone *</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                    className="w-full px-2 py-1.5 text-sm border rounded-lg focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1">Date of Birth *</label>
                  <input
                    type="date"
                    name="date_of_birth"
                    value={formData.date_of_birth}
                    onChange={handleInputChange}
                    required
                    className="w-full px-2 py-1.5 text-sm border rounded-lg focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1">Course Name *</label>
                  <input
                    type="text"
                    name="course_name"
                    value={formData.course_name}
                    onChange={handleInputChange}
                    required
                    placeholder="e.g., B.Tech Computer Science"
                    className="w-full px-2 py-1.5 text-sm border rounded-lg focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1">College Name *</label>
                  <input
                    type="text"
                    name="college_name"
                    value={formData.college_name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-2 py-1.5 text-sm border rounded-lg focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1">Course Fees (₹) *</label>
                  <input
                    type="number"
                    name="course_fees"
                    value={formData.course_fees}
                    onChange={handleInputChange}
                    required
                    className="w-full px-2 py-1.5 text-sm border rounded-lg focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1">Course Duration (years) *</label>
                  <input
                    type="number"
                    name="course_duration"
                    value={formData.course_duration}
                    onChange={handleInputChange}
                    required
                    min="1"
                    max="10"
                    className="w-full px-2 py-1.5 text-sm border rounded-lg focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1">Loan Amount Required (₹) *</label>
                  <input
                    type="number"
                    name="loan_amount_required"
                    value={formData.loan_amount_required}
                    onChange={handleInputChange}
                    required
                    className="w-full px-2 py-1.5 text-sm border rounded-lg focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1">Annual Family Income (₹) *</label>
                  <input
                    type="number"
                    name="annual_family_income"
                    value={formData.annual_family_income}
                    onChange={handleInputChange}
                    required
                    className="w-full px-2 py-1.5 text-sm border rounded-lg focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-medium mb-1">Existing Loans (if any)</label>
                  <textarea
                    name="existing_loans"
                    value={formData.existing_loans}
                    onChange={handleInputChange}
                    rows="2"
                    placeholder="Mention any existing loans with EMI amount"
                    className="w-full px-2 py-1.5 text-sm border rounded-lg focus:ring-2 focus:ring-orange-500"
                  />
                </div>
              </div>

              <div className="flex gap-2 mt-4">
                <Button type="submit" className="flex-1 bg-orange-600 hover:bg-orange-700 h-8 text-xs">
                  Submit Application
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowApplicationModal(false)}
                  className="flex-1 h-8 text-xs"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default EducationLoansPage;
