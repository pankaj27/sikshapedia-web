import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiSave, FiUser, FiMail, FiPhone, FiMapPin, FiBook, FiCreditCard, FiLoader } from 'react-icons/fi';
import { Button } from '../components/ui/button';
import api from '../api/axios';

const EditProfile = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    city: '',
    state: '',
    course: '',
    education_level: '',
    // Payment Details
    upi_id: '',
    bank_name: '',
    account_holder: '',
    account_number: '',
    ifsc_code: ''
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get('/user/profile');
        const userData = response.data;
        setUser(userData);
        setFormData({
          name: userData.name || '',
          email: userData.email || '',
          phone: userData.phone || '',
          city: userData.city || '',
          state: userData.state || '',
          course: userData.course || '',
          education_level: userData.education_level || '',
          // Payment Details
          upi_id: userData.payment_details?.upi_id || '',
          bank_name: userData.payment_details?.bank_name || '',
          account_holder: userData.payment_details?.account_holder || '',
          account_number: userData.payment_details?.account_number || '',
          ifsc_code: userData.payment_details?.ifsc_code || ''
        });
      } catch (error) {
        console.error('Error fetching profile:', error);
        if (error.response?.status === 401) {
          window.location.href = '/login';
        }
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      // Prepare data with payment_details nested object
      const updateData = {
        name: formData.name,
        phone: formData.phone,
        city: formData.city,
        state: formData.state,
        course: formData.course,
        education_level: formData.education_level,
        payment_details: {
          upi_id: formData.upi_id,
          bank_name: formData.bank_name,
          account_holder: formData.account_holder,
          account_number: formData.account_number,
          ifsc_code: formData.ifsc_code
        }
      };

      await api.put('/user/profile', updateData);
      alert('Profile updated successfully!');
      window.location.href = '/dashboard';
    } catch (error) {
      console.error('Error updating profile:', error);
      alert(error.response?.data?.detail || 'Error updating profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => window.location.href = '/dashboard'}
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              <FiArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-xl font-bold text-gray-900">Edit Profile</h1>
          </div>
          <Button
            onClick={handleSubmit}
            disabled={saving}
            className="bg-orange-600 hover:bg-orange-700 flex items-center gap-2"
          >
            {saving ? <FiLoader className="w-4 h-4 animate-spin" /> : <FiSave className="w-4 h-4" />}
            {saving ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Personal Information */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <FiUser className="text-orange-500" /> Personal Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  disabled
                  className="w-full border border-gray-200 rounded-lg px-4 py-2 bg-gray-50 text-gray-500"
                />
                <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                <div className="flex">
                  <span className="inline-flex items-center px-3 border border-r-0 border-gray-300 bg-gray-50 text-gray-500 rounded-l-lg">
                    +91
                  </span>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    pattern="[0-9]{10}"
                    placeholder="9876543210"
                    className="w-full border border-gray-300 rounded-r-lg px-4 py-2 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Education Level</label>
                <select
                  name="education_level"
                  value={formData.education_level}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                >
                  <option value="">Select Level</option>
                  <option value="10th">10th Pass</option>
                  <option value="12th">12th Pass</option>
                  <option value="graduate">Graduate</option>
                  <option value="post_graduate">Post Graduate</option>
                  <option value="working">Working Professional</option>
                </select>
              </div>
            </div>
          </div>

          {/* Location */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <FiMapPin className="text-blue-500" /> Location
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                <input
                  type="text"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  placeholder="e.g., Maharashtra"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="e.g., Mumbai"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Course Interest */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <FiBook className="text-green-500" /> Course Interest
            </h2>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Interested Course/Stream</label>
              <input
                type="text"
                name="course"
                value={formData.course}
                onChange={handleChange}
                placeholder="e.g., Engineering, MBA, Medical"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Payment Details - For Rewards Redemption */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-2 flex items-center gap-2">
              <FiCreditCard className="text-purple-500" /> Payment Details
            </h2>
            <p className="text-sm text-gray-500 mb-4">
              Add your payment details to receive rewards redemption payouts. We support UPI and Bank Transfer.
            </p>

            {/* UPI Section */}
            <div className="mb-6">
              <h3 className="font-medium text-gray-800 mb-3 flex items-center gap-2">
                <span className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center text-xs text-green-600">1</span>
                UPI (Recommended - Instant Transfer)
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-8">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">UPI ID</label>
                  <input
                    type="text"
                    name="upi_id"
                    value={formData.upi_id}
                    onChange={handleChange}
                    placeholder="yourname@upi, phone@ybl, name@paytm"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                  <p className="text-xs text-gray-500 mt-1">Enter your UPI ID linked to any UPI app (GPay, PhonePe, Paytm, etc.)</p>
                </div>
              </div>
            </div>

            {/* Bank Details Section */}
            <div>
              <h3 className="font-medium text-gray-800 mb-3 flex items-center gap-2">
                <span className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-xs text-blue-600">2</span>
                Bank Account (Alternative)
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-8">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Account Holder Name</label>
                  <input
                    type="text"
                    name="account_holder"
                    value={formData.account_holder}
                    onChange={handleChange}
                    placeholder="Name as per bank records"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Bank Name</label>
                  <input
                    type="text"
                    name="bank_name"
                    value={formData.bank_name}
                    onChange={handleChange}
                    placeholder="e.g., State Bank of India"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Account Number</label>
                  <input
                    type="text"
                    name="account_number"
                    value={formData.account_number}
                    onChange={handleChange}
                    placeholder="Enter account number"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">IFSC Code</label>
                  <input
                    type="text"
                    name="ifsc_code"
                    value={formData.ifsc_code}
                    onChange={handleChange}
                    placeholder="e.g., SBIN0001234"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            <div className="mt-4 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
              <p className="text-sm text-yellow-800">
                <strong>Note:</strong> Payment details are securely stored and only used for reward redemption payouts. 
                We prefer UPI for instant transfers.
              </p>
            </div>
          </div>

          {/* Submit Button (Mobile) */}
          <div className="md:hidden">
            <Button
              type="submit"
              disabled={saving}
              className="w-full bg-orange-600 hover:bg-orange-700 flex items-center justify-center gap-2 py-3"
            >
              {saving ? <FiLoader className="w-4 h-4 animate-spin" /> : <FiSave className="w-4 h-4" />}
              {saving ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfile;
