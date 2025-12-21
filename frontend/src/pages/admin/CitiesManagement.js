import React, { useState, useEffect } from 'react';
import { FiPlus, FiEdit2, FiTrash2, FiSearch, FiRefreshCw, FiMapPin } from 'react-icons/fi';
import api from '../../api/axios';
import AdminLayout from '../../components/admin/AdminLayout';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../components/ui/table';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '../../components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '../../components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../components/ui/select';
import { Label } from '../../components/ui/label';
import { Switch } from '../../components/ui/switch';

const CitiesManagement = () => {
  const [cities, setCities] = useState([]);
  const [states, setStates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterState, setFilterState] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [editingCity, setEditingCity] = useState(null);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    state: '',
    country: 'India',
    status: 'active'
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [citiesRes, statesRes] = await Promise.all([
        api.get('/locations/all-cities'),
        api.get('/locations/all-states')
      ]);
      setCities(citiesRes.data);
      setStates(statesRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateSlug = (name) => {
    return name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
  };

  const handleNameChange = (name) => {
    setFormData({
      ...formData,
      name,
      slug: generateSlug(name)
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.state) {
      alert('Please select a state');
      return;
    }
    setSaving(true);
    try {
      if (editingCity) {
        await api.put(`/admin/cities/${editingCity._id || editingCity.id}`, formData);
      } else {
        await api.post('/admin/cities', formData);
      }
      await fetchData();
      setShowModal(false);
      resetForm();
    } catch (error) {
      console.error('Error saving city:', error);
      alert('Failed to save city');
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (city) => {
    setEditingCity(city);
    setFormData({
      name: city.name,
      slug: city.slug,
      state: city.state,
      country: city.country || 'India',
      status: city.status || 'active'
    });
    setShowModal(true);
  };

  const handleDelete = async (city) => {
    if (!window.confirm(`Are you sure you want to delete "${city.name}"?`)) return;
    try {
      await api.delete(`/admin/cities/${city._id || city.id}`);
      await fetchData();
    } catch (error) {
      console.error('Error deleting city:', error);
      alert('Failed to delete city');
    }
  };

  const resetForm = () => {
    setEditingCity(null);
    setFormData({
      name: '',
      slug: '',
      state: '',
      country: 'India',
      status: 'active'
    });
  };

  const filteredCities = cities.filter(city => {
    const matchesSearch = city.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          city.state?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesState = filterState === 'all' || city.state === filterState;
    return matchesSearch && matchesState;
  });

  // Group cities by state for stats
  const citiesByState = cities.reduce((acc, city) => {
    acc[city.state] = (acc[city.state] || 0) + 1;
    return acc;
  }, {});

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Cities Management</h1>
            <p className="text-gray-600">Manage all cities across India</p>
          </div>
          <Button onClick={() => { resetForm(); setShowModal(true); }} className="bg-orange-600 hover:bg-orange-700">
            <FiPlus className="mr-2" />
            Add City
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="text-3xl font-bold text-gray-900">{cities.length}</div>
              <p className="text-sm text-gray-500">Total Cities</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-3xl font-bold text-blue-600">{Object.keys(citiesByState).length}</div>
              <p className="text-sm text-gray-500">States Covered</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-3xl font-bold text-green-600">
                {Math.round(cities.length / Object.keys(citiesByState).length) || 0}
              </div>
              <p className="text-sm text-gray-500">Avg Cities/State</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-3xl font-bold text-purple-600">
                {cities.filter(c => c.status === 'active').length}
              </div>
              <p className="text-sm text-gray-500">Active Cities</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Table */}
        <Card>
          <CardHeader>
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <CardTitle>All Cities ({filteredCities.length})</CardTitle>
              <div className="flex items-center gap-2 flex-wrap">
                <div className="relative">
                  <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <Input
                    placeholder="Search cities..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-48"
                  />
                </div>
                <Select value={filterState} onValueChange={setFilterState}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Filter by state" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All States</SelectItem>
                    {states.map(state => (
                      <SelectItem key={state.name} value={state.name}>
                        {state.name} ({citiesByState[state.name] || 0})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button variant="outline" onClick={fetchData}>
                  <FiRefreshCw className={loading ? 'animate-spin' : ''} />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8">
                <FiRefreshCw className="animate-spin text-3xl text-gray-400 mx-auto" />
              </div>
            ) : filteredCities.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <FiMapPin className="text-4xl mx-auto mb-2 opacity-50" />
                <p>No cities found</p>
              </div>
            ) : (
              <div className="max-h-[500px] overflow-y-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>#</TableHead>
                      <TableHead>City Name</TableHead>
                      <TableHead>Slug</TableHead>
                      <TableHead>State</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredCities.map((city, index) => (
                      <TableRow key={city._id || `${city.name}-${city.state}`}>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell className="font-medium">{city.name}</TableCell>
                        <TableCell className="text-gray-500">{city.slug}</TableCell>
                        <TableCell>
                          <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-sm">
                            {city.state}
                          </span>
                        </TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            city.status === 'active' 
                              ? 'bg-green-100 text-green-700' 
                              : 'bg-gray-100 text-gray-600'
                          }`}>
                            {city.status || 'active'}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm" onClick={() => handleEdit(city)}>
                            <FiEdit2 className="text-blue-600" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => handleDelete(city)}>
                            <FiTrash2 className="text-red-600" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Add/Edit Modal */}
        <Dialog open={showModal} onOpenChange={setShowModal}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingCity ? 'Edit City' : 'Add New City'}</DialogTitle>
              <DialogDescription>
                {editingCity ? 'Update city details' : 'Add a new city to the database'}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label>City Name *</Label>
                <Input
                  value={formData.name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  placeholder="e.g., Mumbai"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Slug (URL-friendly)</Label>
                <Input
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  placeholder="e.g., mumbai"
                />
              </div>
              <div className="space-y-2">
                <Label>State *</Label>
                <Select value={formData.state} onValueChange={(value) => setFormData({ ...formData, state: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a state" />
                  </SelectTrigger>
                  <SelectContent>
                    {states.map(state => (
                      <SelectItem key={state.name} value={state.name}>
                        {state.name} {state.is_union_territory ? '(UT)' : ''}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  checked={formData.status === 'active'}
                  onCheckedChange={(checked) => setFormData({ ...formData, status: checked ? 'active' : 'inactive' })}
                />
                <Label>Active</Label>
              </div>
              <div className="flex justify-end gap-2 pt-4">
                <Button type="button" variant="outline" onClick={() => setShowModal(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={saving} className="bg-orange-600 hover:bg-orange-700">
                  {saving ? <FiRefreshCw className="animate-spin mr-2" /> : null}
                  {editingCity ? 'Update' : 'Add'} City
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
};

export default CitiesManagement;
