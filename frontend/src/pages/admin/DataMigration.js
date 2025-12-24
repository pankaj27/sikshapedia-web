import React, { useState, useEffect } from 'react';
import { FiDownload, FiUpload, FiDatabase, FiCheck, FiX, FiAlertTriangle } from 'react-icons/fi';
import { Button } from '../../components/ui/button';
import api from '../../api/axios';

const DataMigration = () => {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [importing, setImporting] = useState(false);
  const [importResult, setImportResult] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchSummary();
  }, []);

  const fetchSummary = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get('/data-migration/export-summary');
      setSummary(response.data);
    } catch (err) {
      setError('Failed to fetch data summary. Make sure you are logged in as admin.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async () => {
    setExporting(true);
    setError(null);
    try {
      const response = await api.get('/data-migration/export', {
        responseType: 'blob'
      });
      
      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `sikshapedia_data_export_${new Date().toISOString().split('T')[0]}.json`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      setError('Failed to export data. Please try again.');
      console.error(err);
    } finally {
      setExporting(false);
    }
  };

  const handleImport = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (!window.confirm('⚠️ WARNING: This will REPLACE all existing data with the imported data. Are you sure you want to continue?')) {
      event.target.value = '';
      return;
    }

    setImporting(true);
    setError(null);
    setImportResult(null);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await api.post('/data-migration/import', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      setImportResult(response.data);
      fetchSummary(); // Refresh summary after import
    } catch (err) {
      setError('Failed to import data. Please check the file format.');
      console.error(err);
    } finally {
      setImporting(false);
      event.target.value = '';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <FiDatabase className="text-orange-600" size={32} />
        <div>
          <h1 className="text-3xl font-bold">Data Migration</h1>
          <p className="text-gray-600">Export and import database data for deployment</p>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex items-center gap-3">
          <FiAlertTriangle className="text-red-500" size={20} />
          <span className="text-red-700">{error}</span>
        </div>
      )}

      {/* Instructions */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <h3 className="font-bold text-blue-800 mb-2">📋 How to Transfer Data to Production:</h3>
        <ol className="list-decimal list-inside text-blue-700 text-sm space-y-1">
          <li><strong>Export</strong> your data from this preview environment (download JSON file)</li>
          <li><strong>Deploy</strong> your application to production</li>
          <li>Login to admin panel on your <strong>production site</strong></li>
          <li>Go to Data Migration page and <strong>Import</strong> the JSON file</li>
        </ol>
      </div>

      {/* Data Summary */}
      {summary && (
        <div className="bg-white rounded-lg shadow border p-6 mb-6">
          <h2 className="text-xl font-bold mb-4">📊 Data Summary</h2>
          <div className="text-2xl font-bold text-orange-600 mb-4">
            {summary.total_documents.toLocaleString()} Total Documents
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 max-h-64 overflow-y-auto">
            {summary.collections
              .filter(col => col.count > 0)
              .map(col => (
                <div key={col.name} className="bg-gray-50 rounded p-2 flex justify-between">
                  <span className="text-sm text-gray-700">{col.name}</span>
                  <span className="text-sm font-bold text-gray-900">{col.count}</span>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Export */}
        <div className="bg-white rounded-lg shadow border p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <FiDownload className="text-green-600" size={24} />
            </div>
            <div>
              <h3 className="font-bold text-lg">Export Data</h3>
              <p className="text-sm text-gray-600">Download all data as JSON</p>
            </div>
          </div>
          <Button
            onClick={handleExport}
            disabled={exporting}
            className="w-full bg-green-600 hover:bg-green-700"
          >
            {exporting ? (
              <>
                <span className="animate-spin mr-2">⏳</span>
                Exporting...
              </>
            ) : (
              <>
                <FiDownload className="mr-2" />
                Export All Data
              </>
            )}
          </Button>
        </div>

        {/* Import */}
        <div className="bg-white rounded-lg shadow border p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <FiUpload className="text-blue-600" size={24} />
            </div>
            <div>
              <h3 className="font-bold text-lg">Import Data</h3>
              <p className="text-sm text-gray-600">Upload JSON to restore data</p>
            </div>
          </div>
          <label className="block">
            <input
              type="file"
              accept=".json"
              onChange={handleImport}
              disabled={importing}
              className="hidden"
            />
            <Button
              as="span"
              disabled={importing}
              className="w-full bg-blue-600 hover:bg-blue-700 cursor-pointer"
            >
              {importing ? (
                <>
                  <span className="animate-spin mr-2">⏳</span>
                  Importing...
                </>
              ) : (
                <>
                  <FiUpload className="mr-2" />
                  Select JSON File to Import
                </>
              )}
            </Button>
          </label>
          <p className="text-xs text-red-500 mt-2">⚠️ Import will replace existing data!</p>
        </div>
      </div>

      {/* Import Result */}
      {importResult && (
        <div className="mt-6 bg-white rounded-lg shadow border p-6">
          <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
            <FiCheck className="text-green-500" />
            Import Completed
          </h3>
          
          {importResult.results.imported.length > 0 && (
            <div className="mb-4">
              <h4 className="font-semibold text-green-700 mb-2">✅ Imported Successfully:</h4>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {importResult.results.imported.map(item => (
                  <div key={item.collection} className="bg-green-50 rounded p-2 text-sm">
                    <span className="text-green-800">{item.collection}</span>
                    <span className="text-green-600 ml-2">({item.count})</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {importResult.results.failed.length > 0 && (
            <div className="mb-4">
              <h4 className="font-semibold text-red-700 mb-2">❌ Failed:</h4>
              <div className="space-y-1">
                {importResult.results.failed.map(item => (
                  <div key={item.collection} className="bg-red-50 rounded p-2 text-sm text-red-700">
                    {item.collection}: {item.error}
                  </div>
                ))}
              </div>
            </div>
          )}

          {importResult.results.skipped.length > 0 && (
            <div>
              <h4 className="font-semibold text-gray-700 mb-2">⏭️ Skipped:</h4>
              <div className="text-sm text-gray-600">
                {importResult.results.skipped.map(item => item.collection).join(', ')}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DataMigration;
