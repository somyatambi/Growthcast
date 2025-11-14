import React, { useState } from 'react';
import {
  CloudArrowUpIcon,
  DocumentArrowDownIcon,
  SparklesIcon,
  CheckCircleIcon,
  XCircleIcon,
  Cog6ToothIcon
} from '@heroicons/react/24/outline';
import { cleanExcel, exportWorkbook } from '../utils/excelCleanerEnhanced';

export default function ExcelCleanerEnhanced() {
  const [file, setFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [stats, setStats] = useState(null);
  const [cleanedWorkbook, setCleanedWorkbook] = useState(null);
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Cleaning options state
  const [options, setOptions] = useState({
    removeDuplicates: true,
    duplicateKeys: [],
    trimSpaces: true,
    convertTypes: true,
    standardizeDates: false,
    dateFormat: 'YYYY-MM-DD',
    dateColumns: [],
    fixTextCase: false,
    headerCase: 'lowercase',
    textCase: 'title',
    removeBlankRows: true,
    normalizeColumnNames: false,
    findAndReplace: false,
    replacements: [
      { find: 'N/A', replace: '' },
      { find: 'nil', replace: '0' },
      { find: 'null', replace: '' }
    ],
    sortData: false,
    sortColumn: 0,
    sortOrder: 'asc'
  });

  // Custom inputs
  const [customDateFormat, setCustomDateFormat] = useState('YYYY-MM-DD');
  const [customDateColumns, setCustomDateColumns] = useState('');
  const [customDuplicateKeys, setCustomDuplicateKeys] = useState('');
  const [customSortColumn, setCustomSortColumn] = useState('');
  const [customReplacements, setCustomReplacements] = useState([{ find: 'N/A', replace: '' }]);

  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files && files[0]) {
      handleFileSelect(files[0]);
    }
  };

  const handleFileInput = (e) => {
    const files = e.target.files;
    if (files && files[0]) {
      handleFileSelect(files[0]);
    }
  };

  const handleFileSelect = (selectedFile) => {
    if (selectedFile.name.match(/\.(xlsx|xls)$/i)) {
      setFile(selectedFile);
      setStats(null);
      setCleanedWorkbook(null);
    } else {
      alert('Please select a valid Excel file (.xlsx or .xls)');
    }
  };

  const handleOptionChange = (key, value) => {
    setOptions(prev => ({ ...prev, [key]: value }));
  };

  const addReplacement = () => {
    setCustomReplacements([...customReplacements, { find: '', replace: '' }]);
  };

  const updateReplacement = (index, field, value) => {
    const updated = [...customReplacements];
    updated[index][field] = value;
    setCustomReplacements(updated);
  };

  const removeReplacement = (index) => {
    setCustomReplacements(customReplacements.filter((_, i) => i !== index));
  };

  const handleCleanFile = async () => {
    if (!file) return;

    setIsProcessing(true);

    try {
      // Update options with custom inputs
      const cleaningOptions = {
        ...options,
        dateFormat: customDateFormat,
        dateColumns: customDateColumns ? customDateColumns.split(',').map(s => s.trim()) : [],
        duplicateKeys: customDuplicateKeys ? customDuplicateKeys.split(',').map(s => s.trim()) : [],
        sortColumn: customSortColumn || 0,
        replacements: customReplacements.filter(r => r.find !== '')
      };

      const result = await cleanExcel(file, cleaningOptions);
      setStats(result.stats);
      setCleanedWorkbook(result.workbook);
    } catch (error) {
      console.error('Error cleaning file:', error);
      alert('Error processing file. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    if (!cleanedWorkbook) return;

    const originalName = file.name.replace(/\.(xlsx|xls)$/i, '');
    const cleanedName = `${originalName}_cleaned.xlsx`;
    exportWorkbook(cleanedWorkbook, cleanedName);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <SparklesIcon className="h-12 w-12 text-green-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Excel File Cleaner</h1>
          <p className="text-lg text-gray-600">
            Upload your Excel file and let our advanced cleaning tools transform your data
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - File Upload */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">1. Upload File</h2>
              
              {/* Drag and Drop Area */}
              <div
                className={`border-2 border-dashed rounded-xl p-8 text-center transition-all ${
                  isDragging
                    ? 'border-green-500 bg-green-50'
                    : 'border-gray-300 hover:border-green-400'
                }`}
                onDragEnter={handleDragEnter}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <CloudArrowUpIcon className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                <p className="text-gray-600 mb-2">Drag and drop your Excel file here</p>
                <p className="text-sm text-gray-500 mb-4">or</p>
                <label className="inline-block">
                  <span className="bg-green-600 text-white px-6 py-2 rounded-lg font-semibold cursor-pointer hover:bg-green-700 transition">
                    Browse Files
                  </span>
                  <input
                    type="file"
                    className="hidden"
                    accept=".xlsx,.xls"
                    onChange={handleFileInput}
                  />
                </label>
                <p className="text-xs text-gray-400 mt-4">Supports .xlsx and .xls files</p>
              </div>

              {file && (
                <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <CheckCircleIcon className="h-5 w-5 text-green-600" />
                      <span className="text-sm font-medium text-gray-900">{file.name}</span>
                    </div>
                    <button
                      onClick={() => setFile(null)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <XCircleIcon className="h-5 w-5" />
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {(file.size / 1024).toFixed(2)} KB
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Middle Column - Cleaning Options */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900">2. Select Operations</h2>
                <button
                  onClick={() => setShowAdvanced(!showAdvanced)}
                  className="text-sm text-green-600 hover:text-green-700 flex items-center"
                >
                  <Cog6ToothIcon className="h-4 w-4 mr-1" />
                  {showAdvanced ? 'Hide' : 'Advanced'}
                </button>
              </div>

              <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
                {/* Remove Duplicates */}
                <div className="flex items-start space-x-3 p-3 hover:bg-gray-50 rounded-lg">
                  <input
                    type="checkbox"
                    id="removeDuplicates"
                    checked={options.removeDuplicates}
                    onChange={(e) => handleOptionChange('removeDuplicates', e.target.checked)}
                    className="mt-1 h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                  />
                  <div className="flex-1">
                    <label htmlFor="removeDuplicates" className="font-medium text-gray-900 cursor-pointer">
                      Remove Duplicates
                    </label>
                    <p className="text-xs text-gray-500">Remove duplicate rows from your data</p>
                    {showAdvanced && options.removeDuplicates && (
                      <input
                        type="text"
                        placeholder="Columns (e.g., Name, Email)"
                        value={customDuplicateKeys}
                        onChange={(e) => setCustomDuplicateKeys(e.target.value)}
                        className="mt-2 w-full text-sm px-3 py-1.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                    )}
                  </div>
                </div>

                {/* Trim Spaces */}
                <div className="flex items-start space-x-3 p-3 hover:bg-gray-50 rounded-lg">
                  <input
                    type="checkbox"
                    id="trimSpaces"
                    checked={options.trimSpaces}
                    onChange={(e) => handleOptionChange('trimSpaces', e.target.checked)}
                    className="mt-1 h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                  />
                  <div className="flex-1">
                    <label htmlFor="trimSpaces" className="font-medium text-gray-900 cursor-pointer">
                      Trim Extra Spaces
                    </label>
                    <p className="text-xs text-gray-500">Remove leading, trailing, and extra spaces</p>
                  </div>
                </div>

                {/* Convert Data Types */}
                <div className="flex items-start space-x-3 p-3 hover:bg-gray-50 rounded-lg">
                  <input
                    type="checkbox"
                    id="convertTypes"
                    checked={options.convertTypes}
                    onChange={(e) => handleOptionChange('convertTypes', e.target.checked)}
                    className="mt-1 h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                  />
                  <div className="flex-1">
                    <label htmlFor="convertTypes" className="font-medium text-gray-900 cursor-pointer">
                      Convert Data Types
                    </label>
                    <p className="text-xs text-gray-500">Convert "123" to numbers, "TRUE" to booleans</p>
                  </div>
                </div>

                {/* Standardize Dates */}
                <div className="flex items-start space-x-3 p-3 hover:bg-gray-50 rounded-lg">
                  <input
                    type="checkbox"
                    id="standardizeDates"
                    checked={options.standardizeDates}
                    onChange={(e) => handleOptionChange('standardizeDates', e.target.checked)}
                    className="mt-1 h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                  />
                  <div className="flex-1">
                    <label htmlFor="standardizeDates" className="font-medium text-gray-900 cursor-pointer">
                      Standardize Dates
                    </label>
                    <p className="text-xs text-gray-500">Convert all dates to a standard format</p>
                    {showAdvanced && options.standardizeDates && (
                      <div className="mt-2 space-y-2">
                        <input
                          type="text"
                          placeholder="Format (e.g., YYYY-MM-DD)"
                          value={customDateFormat}
                          onChange={(e) => setCustomDateFormat(e.target.value)}
                          className="w-full text-sm px-3 py-1.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        />
                        <input
                          type="text"
                          placeholder="Columns (e.g., Date, CreatedAt)"
                          value={customDateColumns}
                          onChange={(e) => setCustomDateColumns(e.target.value)}
                          className="w-full text-sm px-3 py-1.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        />
                        <p className="text-xs text-gray-400">Leave empty to process all columns</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Fix Text Case */}
                <div className="flex items-start space-x-3 p-3 hover:bg-gray-50 rounded-lg">
                  <input
                    type="checkbox"
                    id="fixTextCase"
                    checked={options.fixTextCase}
                    onChange={(e) => handleOptionChange('fixTextCase', e.target.checked)}
                    className="mt-1 h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                  />
                  <div className="flex-1">
                    <label htmlFor="fixTextCase" className="font-medium text-gray-900 cursor-pointer">
                      Fix Text Case
                    </label>
                    <p className="text-xs text-gray-500">Standardize text capitalization</p>
                    {showAdvanced && options.fixTextCase && (
                      <div className="mt-2 space-y-2">
                        <select
                          value={options.headerCase}
                          onChange={(e) => handleOptionChange('headerCase', e.target.value)}
                          className="w-full text-sm px-3 py-1.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        >
                          <option value="lowercase">Header: lowercase</option>
                          <option value="uppercase">Header: UPPERCASE</option>
                          <option value="title">Header: Title Case</option>
                        </select>
                        <select
                          value={options.textCase}
                          onChange={(e) => handleOptionChange('textCase', e.target.value)}
                          className="w-full text-sm px-3 py-1.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        >
                          <option value="lowercase">Data: lowercase</option>
                          <option value="uppercase">Data: UPPERCASE</option>
                          <option value="title">Data: Title Case</option>
                        </select>
                      </div>
                    )}
                  </div>
                </div>

                {/* Remove Blank Rows */}
                <div className="flex items-start space-x-3 p-3 hover:bg-gray-50 rounded-lg">
                  <input
                    type="checkbox"
                    id="removeBlankRows"
                    checked={options.removeBlankRows}
                    onChange={(e) => handleOptionChange('removeBlankRows', e.target.checked)}
                    className="mt-1 h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                  />
                  <div className="flex-1">
                    <label htmlFor="removeBlankRows" className="font-medium text-gray-900 cursor-pointer">
                      Remove Blank Rows & Columns
                    </label>
                    <p className="text-xs text-gray-500">Delete completely empty rows and columns</p>
                  </div>
                </div>

                {/* Normalize Column Names */}
                <div className="flex items-start space-x-3 p-3 hover:bg-gray-50 rounded-lg">
                  <input
                    type="checkbox"
                    id="normalizeColumnNames"
                    checked={options.normalizeColumnNames}
                    onChange={(e) => handleOptionChange('normalizeColumnNames', e.target.checked)}
                    className="mt-1 h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                  />
                  <div className="flex-1">
                    <label htmlFor="normalizeColumnNames" className="font-medium text-gray-900 cursor-pointer">
                      Normalize Column Names
                    </label>
                    <p className="text-xs text-gray-500">Convert to lowercase with underscores</p>
                  </div>
                </div>

                {/* Find and Replace */}
                <div className="flex items-start space-x-3 p-3 hover:bg-gray-50 rounded-lg">
                  <input
                    type="checkbox"
                    id="findAndReplace"
                    checked={options.findAndReplace}
                    onChange={(e) => handleOptionChange('findAndReplace', e.target.checked)}
                    className="mt-1 h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                  />
                  <div className="flex-1">
                    <label htmlFor="findAndReplace" className="font-medium text-gray-900 cursor-pointer">
                      Find and Replace
                    </label>
                    <p className="text-xs text-gray-500">Replace specific text patterns</p>
                    {showAdvanced && options.findAndReplace && (
                      <div className="mt-2 space-y-2">
                        {customReplacements.map((replacement, index) => (
                          <div key={index} className="flex space-x-2">
                            <input
                              type="text"
                              placeholder="Find"
                              value={replacement.find}
                              onChange={(e) => updateReplacement(index, 'find', e.target.value)}
                              className="flex-1 text-sm px-3 py-1.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                            />
                            <input
                              type="text"
                              placeholder="Replace"
                              value={replacement.replace}
                              onChange={(e) => updateReplacement(index, 'replace', e.target.value)}
                              className="flex-1 text-sm px-3 py-1.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                            />
                            <button
                              onClick={() => removeReplacement(index)}
                              className="text-red-500 hover:text-red-700"
                            >
                              <XCircleIcon className="h-5 w-5" />
                            </button>
                          </div>
                        ))}
                        <button
                          onClick={addReplacement}
                          className="text-sm text-green-600 hover:text-green-700"
                        >
                          + Add Pattern
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Sort Data */}
                <div className="flex items-start space-x-3 p-3 hover:bg-gray-50 rounded-lg">
                  <input
                    type="checkbox"
                    id="sortData"
                    checked={options.sortData}
                    onChange={(e) => handleOptionChange('sortData', e.target.checked)}
                    className="mt-1 h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                  />
                  <div className="flex-1">
                    <label htmlFor="sortData" className="font-medium text-gray-900 cursor-pointer">
                      Sort Data
                    </label>
                    <p className="text-xs text-gray-500">Sort rows by column</p>
                    {showAdvanced && options.sortData && (
                      <div className="mt-2 space-y-2">
                        <input
                          type="text"
                          placeholder="Column name or index (0, 1, 2...)"
                          value={customSortColumn}
                          onChange={(e) => setCustomSortColumn(e.target.value)}
                          className="w-full text-sm px-3 py-1.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        />
                        <select
                          value={options.sortOrder}
                          onChange={(e) => handleOptionChange('sortOrder', e.target.value)}
                          className="w-full text-sm px-3 py-1.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        >
                          <option value="asc">Ascending (A-Z, 0-9)</option>
                          <option value="desc">Descending (Z-A, 9-0)</option>
                        </select>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Clean Button */}
              <button
                onClick={handleCleanFile}
                disabled={!file || isProcessing}
                className="w-full mt-6 bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {isProcessing ? (
                  <>
                    <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Processing...
                  </>
                ) : (
                  <>
                    <SparklesIcon className="h-5 w-5 mr-2" />
                    Clean File
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Right Column - Results */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">3. Results</h2>

              {stats ? (
                <div className="space-y-4">
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-center mb-3">
                      <CheckCircleIcon className="h-6 w-6 text-green-600 mr-2" />
                      <span className="font-semibold text-green-900">Cleaning Complete!</span>
                    </div>
                    <div className="space-y-2 text-sm">
                      {stats.duplicatesRemoved > 0 && (
                        <div className="flex justify-between">
                          <span className="text-gray-700">Duplicates removed:</span>
                          <span className="font-semibold text-gray-900">{stats.duplicatesRemoved}</span>
                        </div>
                      )}
                      {stats.blanksRemoved > 0 && (
                        <div className="flex justify-between">
                          <span className="text-gray-700">Blanks removed:</span>
                          <span className="font-semibold text-gray-900">{stats.blanksRemoved}</span>
                        </div>
                      )}
                      {stats.spacesFixed > 0 && (
                        <div className="flex justify-between">
                          <span className="text-gray-700">Spaces trimmed:</span>
                          <span className="font-semibold text-gray-900">{stats.spacesFixed}</span>
                        </div>
                      )}
                      {stats.typesConverted > 0 && (
                        <div className="flex justify-between">
                          <span className="text-gray-700">Types converted:</span>
                          <span className="font-semibold text-gray-900">{stats.typesConverted}</span>
                        </div>
                      )}
                      {stats.datesStandardized > 0 && (
                        <div className="flex justify-between">
                          <span className="text-gray-700">Dates standardized:</span>
                          <span className="font-semibold text-gray-900">{stats.datesStandardized}</span>
                        </div>
                      )}
                      {stats.caseFixed > 0 && (
                        <div className="flex justify-between">
                          <span className="text-gray-700">Case fixes:</span>
                          <span className="font-semibold text-gray-900">{stats.caseFixed}</span>
                        </div>
                      )}
                      {stats.columnsNormalized > 0 && (
                        <div className="flex justify-between">
                          <span className="text-gray-700">Columns normalized:</span>
                          <span className="font-semibold text-gray-900">{stats.columnsNormalized}</span>
                        </div>
                      )}
                      {stats.replacementsMade > 0 && (
                        <div className="flex justify-between">
                          <span className="text-gray-700">Replacements made:</span>
                          <span className="font-semibold text-gray-900">{stats.replacementsMade}</span>
                        </div>
                      )}
                      <div className="pt-2 mt-2 border-t border-green-300">
                        <div className="flex justify-between font-semibold">
                          <span className="text-gray-900">Total operations:</span>
                          <span className="text-green-600">{stats.totalOperations}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={handleDownload}
                    className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition flex items-center justify-center"
                  >
                    <DocumentArrowDownIcon className="h-5 w-5 mr-2" />
                    Download Cleaned File
                  </button>
                </div>
              ) : (
                <div className="text-center py-12">
                  <SparklesIcon className="h-16 w-16 mx-auto text-gray-300 mb-4" />
                  <p className="text-gray-500">
                    Upload a file and click "Clean File" to see results here
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
