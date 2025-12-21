import React, { useState, useEffect } from 'react';
import { FiPlus, FiEdit2, FiTrash2, FiSearch, FiRefreshCw, FiMapPin, FiCheck, FiX } from 'react-icons/fi';
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
  CardDescription,
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
import { Label } from '../../components/ui/label';
import { Switch } from '../../components/ui/switch';

const StatesManagement = () => {
  const [states, setStates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingState, setEditingState] = useState(null);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    country: 'India',
    is_union_territory: false,
    status: 'active'
  });

  useEffect(() => {
    fetchStates();
  }, []);

  const fetchStates = async () => {
    setLoading(true);
    try {
      const response = await api.get('/locations/all-states');
      setStates(response.data);
    } catch (error) {
      console.error('Error fetching states:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateSlug = (name) => {
    return name.toLowerCase().replace(/\s+/g, '-').replace(/&/g, 'and').replace(/[^a-z0-9-]/g, '');
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
    setSaving(true);
    try {
      if (editingState) {
        await api.put(`/admin/states/${editingState._id || editingState.id}`, formData);
      } else {
        await api.post('/admin/states', formData);
      }
      await fetchStates();
      setShowModal(false);
      resetForm();
    } catch (error) {
      console.error('Error saving state:', error);
      alert('Failed to save state');
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (state) => {
    setEditingState(state);
    setFormData({
      name: state.name,
      slug: state.slug,
      country: state.country || 'India',
      is_union_territory: state.is_union_territory || false,
      status: state.status || 'active'
    });
    setShowModal(true);
  };

  const handleDelete = async (state) => {
    if (!window.confirm(`Are you sure you want to delete "${state.name}"?`)) return;
    try {
      await api.delete(`/admin/states/${state._id || state.id}`);
      await fetchStates();
    } catch (error) {
      console.error('Error deleting state:', error);
      alert('Failed to delete state');
    }
  };

  const resetForm = () => {
    setEditingState(null);
    setFormData({
      name: '',
      slug: '',
      country: 'India',
      is_union_territory: false,
      status: 'active'
    });
  };

  const filteredStates = states.filter(state =>
    state.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const statesCount = states.filter(s => !s.is_union_territory).length;
  const utsCount = states.filter(s => s.is_union_territory).length;

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">States & Union Territories</h1>
            <p className="text-gray-600">Manage all states and union territories of India</p>
          </div>
          <Button onClick={() => { resetForm(); setShowModal(true); }} className="bg-orange-600 hover:bg-orange-700">
            <FiPlus className="mr-2" />
            Add State/UT
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="text-3xl font-bold text-gray-900">{states.length}</div>
              <p className="text-sm text-gray-500">Total States/UTs</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-3xl font-bold text-blue-600">{statesCount}</div>
              <p className="text-sm text-gray-500">States</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-3xl font-bold text-purple-600">{utsCount}</div>
              <p className="text-sm text-gray-500">Union Territories</p>
            </CardContent>
          </Card>
        </div>

        {/* Search and Table */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>All States & Union Territories</CardTitle>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <Input
                    placeholder="Search states..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-64"
                  />
                </div>
                <Button variant="outline" onClick={fetchStates}>
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
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>#</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Slug</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredStates.map((state, index) => (
                    <TableRow key={state._id || state.name}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell className="font-medium">{state.name}</TableCell>
                      <TableCell className="text-gray-500">{state.slug}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          state.is_union_territory 
                            ? 'bg-purple-100 text-purple-700' 
                            : 'bg-blue-100 text-blue-700'
                        }`}>
                          {state.is_union_territory ? 'Union Territory' : 'State'}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          state.status === 'active' 
                            ? 'bg-green-100 text-green-700' 
                            : 'bg-gray-100 text-gray-600'
                        }`}>
                          {state.status || 'active'}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm" onClick={() => handleEdit(state)}>
                          <FiEdit2 className="text-blue-600" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleDelete(state)}>
                          <FiTrash2 className="text-red-600" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* Add/Edit Modal */}
        <Dialog open={showModal} onOpenChange={setShowModal}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingState ? 'Edit State/UT' : 'Add New State/UT'}</DialogTitle>
              <DialogDescription>
                {editingState ? 'Update state or union territory details' : 'Add a new state or union territory'}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label>Name *</Label>
                <Input
                  value={formData.name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  placeholder="e.g., Maharashtra"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Slug (URL-friendly)</Label>
                <Input
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  placeholder="e.g., maharashtra"
                />
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  checked={formData.is_union_territory}
                  onCheckedChange={(checked) => setFormData({ ...formData, is_union_territory: checked })}
                />
                <Label>This is a Union Territory</Label>
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
                  {editingState ? 'Update' : 'Add'} State/UT
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
};

export default StatesManagement;
