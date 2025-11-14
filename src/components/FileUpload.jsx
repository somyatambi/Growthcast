import React, { useState } from 'react';
import { ArrowUpTrayIcon } from '@heroicons/react/24/outline';

function FileUpload({ onUploadComplete }) {
  const [isLoading, setIsLoading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileSelect = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setIsDragging(false);
    
    const file = event.dataTransfer.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const processFile = (file) => {
    setIsLoading(true);
    
    // Simulate file processing
    setTimeout(() => {
      setIsLoading(false);
      if (onUploadComplete) {
        onUploadComplete();
      }
    }, 2000);
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-200px)]">
      <div className="w-full max-w-2xl">
        {isLoading ? (
          // Loading State
          <div className="bg-white rounded-lg shadow-lg p-12 text-center">
            <div className="flex flex-col items-center space-y-4">
              <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-500"></div>
              <p className="text-xl text-slate-700 font-medium">Processing your data...</p>
              <p className="text-sm text-slate-500">This may take a few moments</p>
            </div>
          </div>
        ) : (
          // Upload Area
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            className={`bg-white rounded-lg shadow-lg p-12 border-4 border-dashed transition-all cursor-pointer ${
              isDragging
                ? 'border-blue-500 bg-blue-50'
                : 'border-slate-300 hover:border-blue-400 hover:bg-slate-50'
            }`}
          >
            <input
              type="file"
              id="fileInput"
              className="hidden"
              accept=".xlsx,.xls,.csv"
              onChange={handleFileSelect}
            />
            <label
              htmlFor="fileInput"
              className="flex flex-col items-center space-y-4 cursor-pointer"
            >
              <ArrowUpTrayIcon className="h-20 w-20 text-slate-400" />
              <div className="text-center">
                <p className="text-xl font-semibold text-slate-700 mb-2">
                  Drag & drop your Excel file here
                </p>
                <p className="text-slate-500">or click to select a file</p>
              </div>
              <div className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
                Choose File
              </div>
              <p className="text-xs text-slate-400 mt-4">
                Supported formats: .xlsx, .xls, .csv
              </p>
            </label>
          </div>
        )}
      </div>
    </div>
  );
}

export default FileUpload;
