import React, { useState } from 'react';
import { FiDownload, FiUpload, FiCheck, FiAlertCircle } from 'react-icons/fi';
import api from '../../api/axios';

const MigrationTool = () => {
  const [uploading, setUploading] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleDownload = async () => {
    setDownloading(true);
    setError(null);
    try {
      const response = await api.get('/migration/download', {
        responseType: 'blob'
      });
      
      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'migration_data.json');
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      
      setResult({ type: 'download', message: 'Download started!' });
    } catch (err) {
      setError('Download failed: ' + (err.response?.data?.detail || err.message));
    } finally {
      setDownloading(false);
    }
  };

  const handleUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setUploading(true);
    setError(null);
    setResult(null);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await api.post('/migration/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setResult({
        type: 'upload',
        data: response.data.results
      });
    } catch (err) {
      setError('Upload failed: ' + (err.response?.data?.detail || err.message));
    } finally {
      setUploading(false);
      event.target.value = '';
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">🔄 Data Migration Tool</h1>
      
      <div className="grid md:grid-cols-2 gap-6">
        {/* Download Section */}
        <div className="bg-white rounded-lg shadow-md p-6 border-2 border-blue-100">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-blue-100 rounded-full">
              <FiDownload className="text-blue-600 text-xl" />
            </div>
            <div>
              <h2 className="text-lg font-semibold">Download Data</h2>
              <p className="text-sm text-gray-500">Export for migration</p>
            </div>
          </div>
          
          <p className="text-gray-600 text-sm mb-4">
            Downloads all Streams, Sub-streams, and Courses as JSON file.
          </p>
          
          <button
            onClick={handleDownload}
            disabled={downloading}
            className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-300 flex items-center justify-center gap-2"
          >
            {downloading ? (
              <>
                <span className="animate-spin">⏳</span> Downloading...
              </>
            ) : (
              <>
                <FiDownload /> Download JSON
              </>
            )}
          </button>
        </div>

        {/* Upload Section */}
        <div className="bg-white rounded-lg shadow-md p-6 border-2 border-green-100">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-green-100 rounded-full">
              <FiUpload className="text-green-600 text-xl" />
            </div>
            <div>
              <h2 className="text-lg font-semibold">Upload Data</h2>
              <p className="text-sm text-gray-500">Import from migration file</p>
            </div>
          </div>
          
          <p className="text-gray-600 text-sm mb-4">
            Upload migration JSON to import data. Duplicates will be skipped.
          </p>
          
          <label className="w-full py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-green-300 flex items-center justify-center gap-2 cursor-pointer">
            {uploading ? (
              <>
                <span className="animate-spin">⏳</span> Uploading...
              </>
            ) : (
              <>
                <FiUpload /> Select JSON File
              </>
            )}
            <input
              type="file"
              accept=".json"
              onChange={handleUpload}
              disabled={uploading}
              className="hidden"
            />
          </label>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
          <FiAlertCircle className="text-red-500 text-xl flex-shrink-0" />
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {/* Success Result */}
      {result && (
        <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center gap-3 mb-3">
            <FiCheck className="text-green-500 text-xl" />
            <p className="text-green-700 font-medium">
              {result.type === 'download' ? result.message : 'Migration Complete!'}
            </p>
          </div>
          
          {result.type === 'upload' && result.data && (
            <div className="grid grid-cols-3 gap-4 mt-4">
              <div className="text-center p-3 bg-white rounded border">
                <p className="text-2xl font-bold text-blue-600">{result.data.streams.added}</p>
                <p className="text-xs text-gray-500">Streams Added</p>
                <p className="text-xs text-gray-400">({result.data.streams.skipped} skipped)</p>
              </div>
              <div className="text-center p-3 bg-white rounded border">
                <p className="text-2xl font-bold text-purple-600">{result.data.sub_streams.added}</p>
                <p className="text-xs text-gray-500">Sub-streams Added</p>
                <p className="text-xs text-gray-400">({result.data.sub_streams.skipped} skipped)</p>
              </div>
              <div className="text-center p-3 bg-white rounded border">
                <p className="text-2xl font-bold text-green-600">{result.data.courses.added}</p>
                <p className="text-xs text-gray-500">Courses Added</p>
                <p className="text-xs text-gray-400">({result.data.courses.skipped} skipped)</p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Instructions */}
      <div className="mt-8 p-4 bg-gray-50 rounded-lg">
        <h3 className="font-semibold mb-2">📋 Migration Steps:</h3>
        <ol className="list-decimal list-inside text-sm text-gray-600 space-y-1">
          <li><strong>Preview Site:</strong> Click "Download JSON" to export data</li>
          <li><strong>Live Site:</strong> Go to Admin → Migration Tool</li>
          <li><strong>Live Site:</strong> Click "Select JSON File" and upload the downloaded file</li>
          <li>Done! Existing data will not be overwritten.</li>
        </ol>
      </div>
    </div>
  );
};

export default MigrationTool;
