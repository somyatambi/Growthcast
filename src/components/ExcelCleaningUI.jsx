import React, { useState } from 'react';
import { 
  DocumentArrowUpIcon, 
  CheckCircleIcon, 
  XCircleIcon,
  ArrowDownTrayIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';
import axios from 'axios';

const ExcelCleaningUI = () => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [selectedOperations, setSelectedOperations] = useState([
    'removeDuplicates',
    'trimSpaces',
    'removeBlankRows',
    'normalizeColumns'
  ]);

  const operations = [
    { id: 'removeDuplicates', label: 'Remove Duplicate Rows', description: 'Removes identical rows from your data' },
    { id: 'trimSpaces', label: 'Trim Spaces', description: 'Removes extra spaces from text fields' },
    { id: 'removeBlankRows', label: 'Remove Blank Rows', description: 'Deletes rows with no data' },
    { id: 'normalizeColumns', label: 'Normalize Column Names', description: 'Standardizes column headers' }
  ];

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      if (selectedFile.name.endsWith('.xlsx') || selectedFile.name.endsWith('.xls')) {
        setFile(selectedFile);
        setError('');
        setResult(null);
      } else {
        setError('Please select a valid Excel file (.xlsx or .xls)');
        setFile(null);
      }
    }
  };

  const toggleOperation = (operationId) => {
    setSelectedOperations(prev => 
      prev.includes(operationId)
        ? prev.filter(id => id !== operationId)
        : [...prev, operationId]
    );
  };

  const handleClean = async () => {
    if (!file) {
      setError('Please select a file first');
      return;
    }

    if (selectedOperations.length === 0) {
      setError('Please select at least one cleaning operation');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('operations', JSON.stringify(selectedOperations));

      const token = localStorage.getItem('token');
      const response = await axios.post(
        'http://localhost:5000/api/excel-cleaning/clean',
        formData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      setResult(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Error cleaning file. Please try again.');
      console.error('Cleaning error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (!result?.file) return;

    try {
      const byteCharacters = atob(result.file);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `cleaned_${file.name}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      setError('Error downloading file. Please try again.');
      console.error('Download error:', err);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-xl shadow-lg p-8">
        {/* Header */}
        <div className="flex items-center space-x-3 mb-6">
          <SparklesIcon className="h-8 w-8 text-green-600" />
          <h2 className="text-3xl font-bold text-gray-800">Excel Data Cleaner</h2>
        </div>
        <p className="text-gray-600 mb-8">
          Upload your Excel file and select cleaning operations to optimize your data quality.
        </p>

        {/* File Upload */}
        <div className="mb-8">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Upload Excel File
          </label>
          <div className="flex items-center space-x-4">
            <label className="flex-1 flex items-center justify-center px-6 py-8 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-green-500 transition-colors">
              <div className="text-center">
                <DocumentArrowUpIcon className="mx-auto h-12 w-12 text-gray-400" />
                <p className="mt-2 text-sm text-gray-600">
                  {file ? file.name : 'Click to upload or drag and drop'}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Excel files (.xlsx, .xls)
                </p>
              </div>
              <input
                type="file"
                className="hidden"
                accept=".xlsx,.xls"
                onChange={handleFileChange}
              />
            </label>
          </div>
        </div>

        {/* Cleaning Operations */}
        <div className="mb-8">
          <label className="block text-sm font-medium text-gray-700 mb-4">
            Select Cleaning Operations
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {operations.map((op) => (
              <div
                key={op.id}
                onClick={() => toggleOperation(op.id)}
                className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                  selectedOperations.includes(op.id)
                    ? 'border-green-500 bg-green-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 mt-1">
                    {selectedOperations.includes(op.id) ? (
                      <CheckCircleIcon className="h-6 w-6 text-green-600" />
                    ) : (
                      <div className="h-6 w-6 rounded-full border-2 border-gray-300" />
                    )}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-800">{op.label}</h4>
                    <p className="text-sm text-gray-600">{op.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start space-x-3">
            <XCircleIcon className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {/* Clean Button */}
        <button
          onClick={handleClean}
          disabled={loading || !file}
          className={`w-full py-4 rounded-lg font-semibold text-white transition-colors ${
            loading || !file
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-green-600 hover:bg-green-700'
          }`}
        >
          {loading ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Cleaning Data...
            </span>
          ) : (
            'Clean Excel File'
          )}
        </button>

        {/* Results */}
        {result && (
          <div className="mt-8 p-6 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-start space-x-3 mb-4">
              <CheckCircleIcon className="h-6 w-6 text-green-600 flex-shrink-0" />
              <div className="flex-1">
                <h3 className="font-semibold text-green-900 text-lg">
                  File Cleaned Successfully!
                </h3>
                <p className="text-green-700 text-sm mt-1">
                  {result.message}
                </p>
              </div>
            </div>

            {/* Statistics */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="bg-white p-4 rounded-lg">
                <p className="text-sm text-gray-600">Original Rows</p>
                <p className="text-2xl font-bold text-gray-800">{result.stats.originalRows}</p>
              </div>
              <div className="bg-white p-4 rounded-lg">
                <p className="text-sm text-gray-600">Cleaned Rows</p>
                <p className="text-2xl font-bold text-green-600">{result.stats.cleanedRows}</p>
              </div>
              <div className="bg-white p-4 rounded-lg">
                <p className="text-sm text-gray-600">Rows Removed</p>
                <p className="text-2xl font-bold text-red-600">
                  {result.stats.originalRows - result.stats.cleanedRows}
                </p>
              </div>
            </div>

            {/* Operations Applied */}
            <div className="mb-6">
              <p className="text-sm font-medium text-gray-700 mb-2">Operations Applied:</p>
              <div className="flex flex-wrap gap-2">
                {result.stats.operations.map((op, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium"
                  >
                    {operations.find(o => o.id === op)?.label || op}
                  </span>
                ))}
              </div>
            </div>

            {/* Download Button */}
            <button
              onClick={handleDownload}
              className="w-full flex items-center justify-center space-x-2 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors"
            >
              <ArrowDownTrayIcon className="h-5 w-5" />
              <span>Download Cleaned File</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExcelCleaningUI;
