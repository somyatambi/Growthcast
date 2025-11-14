import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import {
  DocumentArrowUpIcon,
  DocumentArrowDownIcon,
  SparklesIcon,
  CheckCircleIcon,
  XCircleIcon
} from '@heroicons/react/24/outline';
import { cleanExcelData } from '../utils/excelCleaner';

function ExcelCleaner() {
  const [file, setFile] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [cleaningOptions, setCleaningOptions] = useState({
    removeDuplicates: true,
    trimSpaces: true,
    normalizeColumns: true,
    removeBlankRows: true,
    handleMissing: true,
    convertTypes: true,
    standardizeDates: false,
    fixCase: false,
    missingStrategy: 'fill',
    fillValue: 'N/A',
    caseType: 'proper'
  });
  const [stats, setStats] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && (droppedFile.name.endsWith('.xlsx') || droppedFile.name.endsWith('.xls'))) {
      setFile(droppedFile);
      setStats(null);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleFileSelect = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setStats(null);
    }
  };

  const handleCleanFile = async () => {
    if (!file) return;

    setIsProcessing(true);

    try {
      // Read the Excel file
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data, { type: 'array' });
      
      // Get the first sheet
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      
      // Convert to JSON
      const jsonData = XLSX.utils.sheet_to_json(worksheet);

      const originalCount = jsonData.length;
      const originalColumns = jsonData.length > 0 ? Object.keys(jsonData[0]).length : 0;

      // Clean the data
      const cleanedData = cleanExcelData(jsonData, cleaningOptions);

      const cleanedCount = cleanedData.length;
      const cleanedColumns = cleanedData.length > 0 ? Object.keys(cleanedData[0]).length : 0;

      // Create new workbook with cleaned data
      const newWorksheet = XLSX.utils.json_to_sheet(cleanedData);
      const newWorkbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(newWorkbook, newWorksheet, 'Cleaned Data');

      // Generate Excel file
      const excelBuffer = XLSX.write(newWorkbook, { bookType: 'xlsx', type: 'array' });
      const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      
      // Download the file
      const fileName = file.name.replace(/\.(xlsx|xls)$/, '_cleaned.xlsx');
      saveAs(blob, fileName);

      // Set stats
      setStats({
        originalRows: originalCount,
        cleanedRows: cleanedCount,
        rowsRemoved: originalCount - cleanedCount,
        originalColumns,
        cleanedColumns,
        columnsRemoved: originalColumns - cleanedColumns
      });

    } catch (error) {
      console.error('Error cleaning file:', error);
      alert('Error processing file. Please make sure it\'s a valid Excel file.');
    } finally {
      setIsProcessing(false);
    }
  };

  const toggleOption = (option) => {
    setCleaningOptions(prev => ({
      ...prev,
      [option]: !prev[option]
    }));
  };

  return (
    <div className="min-h-screen bg-slate-100 pt-24 pb-12 px-4">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center space-x-2 bg-green-100 border border-green-300 rounded-full px-6 py-2 mb-4">
            <SparklesIcon className="h-5 w-5 text-green-600" />
            <span className="text-green-700 font-medium">Excel File Cleaning</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-slate-800 mb-4">
            Clean Your Excel Files Instantly
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Upload your Excel file and get a cleaned version automatically with duplicates removed,
            missing values handled, and data standardized.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Upload */}
          <div className="lg:col-span-2 space-y-6">
            {/* File Upload Area */}
            <div className="bg-white rounded-xl shadow-md p-8">
              <h2 className="text-2xl font-bold text-slate-800 mb-6">Upload File</h2>
              
              <div
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                className={`border-4 border-dashed rounded-xl p-12 text-center transition-all ${
                  isDragging
                    ? 'border-green-500 bg-green-50'
                    : file
                    ? 'border-green-300 bg-green-50'
                    : 'border-slate-300 hover:border-green-400 hover:bg-slate-50'
                }`}
              >
                <input
                  type="file"
                  id="fileInput"
                  className="hidden"
                  accept=".xlsx,.xls"
                  onChange={handleFileSelect}
                />
                
                {file ? (
                  <div className="space-y-4">
                    <CheckCircleIcon className="h-16 w-16 text-green-500 mx-auto" />
                    <div>
                      <p className="text-lg font-semibold text-slate-800">{file.name}</p>
                      <p className="text-sm text-slate-600">
                        {(file.size / 1024).toFixed(2)} KB
                      </p>
                    </div>
                    <label
                      htmlFor="fileInput"
                      className="inline-block px-6 py-2 bg-slate-600 hover:bg-slate-700 text-white rounded-lg cursor-pointer transition-colors"
                    >
                      Choose Different File
                    </label>
                  </div>
                ) : (
                  <label htmlFor="fileInput" className="cursor-pointer">
                    <DocumentArrowUpIcon className="h-16 w-16 text-slate-400 mx-auto mb-4" />
                    <p className="text-xl font-semibold text-slate-700 mb-2">
                      Drop your Excel file here
                    </p>
                    <p className="text-slate-500 mb-4">or click to browse</p>
                    <div className="inline-block px-6 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors">
                      Select File
                    </div>
                    <p className="text-xs text-slate-400 mt-4">
                      Supported formats: .xlsx, .xls
                    </p>
                  </label>
                )}
              </div>

              {/* Clean Button */}
              {file && (
                <div className="mt-6 flex justify-center">
                  <button
                    onClick={handleCleanFile}
                    disabled={isProcessing}
                    className="px-8 py-4 bg-green-500 hover:bg-green-600 text-white font-bold rounded-lg text-lg transition-all hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                  >
                    {isProcessing ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        <span>Cleaning...</span>
                      </>
                    ) : (
                      <>
                        <SparklesIcon className="h-6 w-6" />
                        <span>Clean Excel File</span>
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>

            {/* Stats */}
            {stats && (
              <div className="bg-white rounded-xl shadow-md p-8">
                <div className="flex items-center space-x-2 mb-6">
                  <CheckCircleIcon className="h-6 w-6 text-green-500" />
                  <h2 className="text-2xl font-bold text-slate-800">Cleaning Complete!</h2>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-blue-50 rounded-lg p-4">
                    <p className="text-sm text-blue-600 font-medium mb-1">Original Rows</p>
                    <p className="text-3xl font-bold text-blue-700">{stats.originalRows}</p>
                  </div>
                  <div className="bg-green-50 rounded-lg p-4">
                    <p className="text-sm text-green-600 font-medium mb-1">Cleaned Rows</p>
                    <p className="text-3xl font-bold text-green-700">{stats.cleanedRows}</p>
                  </div>
                  <div className="bg-red-50 rounded-lg p-4">
                    <p className="text-sm text-red-600 font-medium mb-1">Rows Removed</p>
                    <p className="text-3xl font-bold text-red-700">{stats.rowsRemoved}</p>
                  </div>
                  <div className="bg-purple-50 rounded-lg p-4">
                    <p className="text-sm text-purple-600 font-medium mb-1">Columns</p>
                    <p className="text-3xl font-bold text-purple-700">
                      {stats.originalColumns} → {stats.cleanedColumns}
                    </p>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-green-100 rounded-lg border border-green-300">
                  <p className="text-green-800 font-medium flex items-center space-x-2">
                    <DocumentArrowDownIcon className="h-5 w-5" />
                    <span>Your cleaned file has been downloaded!</span>
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Options */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-md p-6 sticky top-24">
              <h3 className="text-xl font-bold text-slate-800 mb-4">Cleaning Options</h3>
              
              <div className="space-y-3">
                {[
                  { key: 'removeDuplicates', label: 'Remove Duplicates', icon: '🧹' },
                  { key: 'trimSpaces', label: 'Trim Extra Spaces', icon: '🧾' },
                  { key: 'normalizeColumns', label: 'Normalize Column Names', icon: '🧮' },
                  { key: 'removeBlankRows', label: 'Remove Blank Rows/Columns', icon: '📊' },
                  { key: 'handleMissing', label: 'Handle Missing Values', icon: '⚠️' },
                  { key: 'convertTypes', label: 'Convert Data Types', icon: '🔢' },
                  { key: 'standardizeDates', label: 'Standardize Date Formats', icon: '🕓' },
                  { key: 'fixCase', label: 'Fix Text Case', icon: '🔤' },
                ].map(option => (
                  <label
                    key={option.key}
                    className="flex items-center space-x-3 p-3 rounded-lg hover:bg-slate-50 cursor-pointer transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={cleaningOptions[option.key]}
                      onChange={() => toggleOption(option.key)}
                      className="w-5 h-5 text-green-500 rounded focus:ring-2 focus:ring-green-500"
                    />
                    <span className="text-2xl">{option.icon}</span>
                    <span className="text-sm font-medium text-slate-700">{option.label}</span>
                  </label>
                ))}
              </div>

              {cleaningOptions.handleMissing && (
                <div className="mt-4 p-3 bg-slate-50 rounded-lg">
                  <label className="block text-xs font-medium text-slate-600 mb-2">
                    Missing Values Strategy
                  </label>
                  <select
                    value={cleaningOptions.missingStrategy}
                    onChange={(e) => setCleaningOptions(prev => ({ ...prev, missingStrategy: e.target.value }))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <option value="fill">Fill with value</option>
                    <option value="average">Fill with average</option>
                    <option value="remove">Remove rows</option>
                  </select>
                </div>
              )}

              {cleaningOptions.fixCase && (
                <div className="mt-4 p-3 bg-slate-50 rounded-lg">
                  <label className="block text-xs font-medium text-slate-600 mb-2">
                    Text Case Type
                  </label>
                  <select
                    value={cleaningOptions.caseType}
                    onChange={(e) => setCleaningOptions(prev => ({ ...prev, caseType: e.target.value }))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <option value="proper">Proper Case</option>
                    <option value="upper">UPPERCASE</option>
                    <option value="lower">lowercase</option>
                  </select>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ExcelCleaner;
