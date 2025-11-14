import React, { useState } from 'react';
import { 
  ChartBarIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  MinusIcon,
  LightBulbIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  DocumentArrowUpIcon
} from '@heroicons/react/24/outline';
import axios from 'axios';

const PredictiveAnalysisUI = () => {
  const [salesData, setSalesData] = useState([]);
  const [predictionMonths, setPredictionMonths] = useState(3);
  const [loading, setLoading] = useState(false);
  const [predictions, setPredictions] = useState(null);
  const [trendAnalysis, setTrendAnalysis] = useState(null);
  const [error, setError] = useState('');

  // Sample data for demo
  const loadSampleData = () => {
    const sample = [
      { month: 'Jan 2024', sales: 45000 },
      { month: 'Feb 2024', sales: 52000 },
      { month: 'Mar 2024', sales: 48000 },
      { month: 'Apr 2024', sales: 61000 },
      { month: 'May 2024', sales: 58000 },
      { month: 'Jun 2024', sales: 67000 },
      { month: 'Jul 2024', sales: 72000 },
      { month: 'Aug 2024', sales: 69000 },
      { month: 'Sep 2024', sales: 78000 },
      { month: 'Oct 2024', sales: 82000 },
      { month: 'Nov 2024', sales: 85000 },
      { month: 'Dec 2024', sales: 91000 }
    ];
    setSalesData(sample);
    setError('');
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target.result;
        const rows = text.split('\n').slice(1); // Skip header
        const data = rows
          .filter(row => row.trim())
          .map(row => {
            const [month, sales] = row.split(',');
            return {
              month: month.trim(),
              sales: parseFloat(sales.trim())
            };
          })
          .filter(item => item.month && !isNaN(item.sales));
        
        if (data.length < 3) {
          setError('Please upload at least 3 months of sales data');
          return;
        }
        
        setSalesData(data);
        setError('');
      } catch (err) {
        setError('Error parsing file. Please ensure it\'s in CSV format with Month,Sales columns');
      }
    };
    reader.readAsText(file);
  };

  const handlePredict = async () => {
    if (salesData.length < 3) {
      setError('Please provide at least 3 months of sales data');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      
      // Format data for API
      const formattedData = salesData.map(item => ({
        value: item.sales
      }));

      const [predictResponse, trendResponse] = await Promise.all([
        axios.post(
          'http://localhost:5000/api/analytics/predict-sales',
          { 
            salesData: formattedData,
            predictionMonths 
          },
          {
            headers: { 'Authorization': `Bearer ${token}` }
          }
        ),
        axios.post(
          'http://localhost:5000/api/analytics/trend-analysis',
          { salesData: formattedData },
          {
            headers: { 'Authorization': `Bearer ${token}` }
          }
        )
      ]);

      setPredictions(predictResponse.data);
      setTrendAnalysis(trendResponse.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Error generating predictions. Please try again.');
      console.error('Prediction error:', err);
    } finally {
      setLoading(false);
    }
  };

  const getTrendIcon = (trend) => {
    switch (trend) {
      case 'upward':
        return <ArrowTrendingUpIcon className="h-6 w-6 text-green-600" />;
      case 'downward':
        return <ArrowTrendingDownIcon className="h-6 w-6 text-red-600" />;
      default:
        return <MinusIcon className="h-6 w-6 text-gray-600" />;
    }
  };

  const getTrendColor = (trend) => {
    switch (trend) {
      case 'upward': return 'text-green-600';
      case 'downward': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="bg-white rounded-xl shadow-lg p-8">
        {/* Header */}
        <div className="flex items-center space-x-3 mb-6">
          <ChartBarIcon className="h-8 w-8 text-blue-600" />
          <h2 className="text-3xl font-bold text-gray-800">Sales Predictive Analysis</h2>
        </div>
        <p className="text-gray-600 mb-8">
          Upload your sales data or use sample data to generate forecasts and insights.
        </p>

        {/* Data Input Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* File Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Upload Sales Data (CSV)
            </label>
            <label className="flex items-center justify-center px-6 py-8 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 transition-colors">
              <div className="text-center">
                <DocumentArrowUpIcon className="mx-auto h-12 w-12 text-gray-400" />
                <p className="mt-2 text-sm text-gray-600">
                  Upload CSV file
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Format: Month, Sales
                </p>
              </div>
              <input
                type="file"
                className="hidden"
                accept=".csv"
                onChange={handleFileUpload}
              />
            </label>
          </div>

          {/* Sample Data */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Or Use Sample Data
            </label>
            <button
              onClick={loadSampleData}
              className="w-full h-full flex items-center justify-center px-6 py-8 border-2 border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
            >
              <div className="text-center">
                <ChartBarIcon className="mx-auto h-12 w-12 text-blue-600" />
                <p className="mt-2 text-sm font-semibold text-gray-700">
                  Load Sample Data
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  12 months of demo sales data
                </p>
              </div>
            </button>
          </div>
        </div>

        {/* Prediction Settings */}
        {salesData.length > 0 && (
          <div className="mb-8 p-6 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-semibold text-gray-800">
                  Current Data: {salesData.length} months
                </h3>
                <p className="text-sm text-gray-600">
                  {salesData[0].month} - {salesData[salesData.length - 1].month}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">Average Monthly Sales</p>
                <p className="text-2xl font-bold text-blue-600">
                  {formatCurrency(salesData.reduce((sum, d) => sum + d.sales, 0) / salesData.length)}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <label className="text-sm font-medium text-gray-700">
                Predict next:
              </label>
              <select
                value={predictionMonths}
                onChange={(e) => setPredictionMonths(Number(e.target.value))}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value={3}>3 months</option>
                <option value={6}>6 months</option>
                <option value={12}>12 months</option>
              </select>
              <button
                onClick={handlePredict}
                disabled={loading}
                className={`flex-1 py-3 rounded-lg font-semibold text-white transition-colors ${
                  loading
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700'
                }`}
              >
                {loading ? 'Analyzing...' : 'Generate Predictions'}
              </button>
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start space-x-3">
            <ExclamationTriangleIcon className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {/* Results */}
        {predictions && trendAnalysis && (
          <div className="space-y-6">
            {/* Trend Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-medium text-blue-900">Overall Trend</p>
                  {getTrendIcon(trendAnalysis.analysis.overallTrend)}
                </div>
                <p className={`text-2xl font-bold capitalize ${getTrendColor(trendAnalysis.analysis.overallTrend)}`}>
                  {trendAnalysis.analysis.overallTrend}
                </p>
              </div>

              <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-lg">
                <p className="text-sm font-medium text-green-900 mb-2">Trend Strength</p>
                <p className="text-2xl font-bold text-green-600">
                  {predictions.trends.strength}%
                </p>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-lg">
                <p className="text-sm font-medium text-purple-900 mb-2">Growth Rate</p>
                <p className="text-2xl font-bold text-purple-600">
                  {predictions.trends.growthRate > 0 ? '+' : ''}{predictions.trends.growthRate}%
                </p>
              </div>

              <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-6 rounded-lg">
                <p className="text-sm font-medium text-orange-900 mb-2">Confidence</p>
                <p className="text-2xl font-bold text-orange-600">
                  {predictions.metadata.confidence}%
                </p>
              </div>
            </div>

            {/* Predictions Chart */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">
                Sales Forecast - Next {predictionMonths} Months
              </h3>
              <div className="space-y-4">
                {predictions.predictions.map((pred, index) => {
                  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
                  const currentDate = new Date();
                  const futureDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + pred.month, 1);
                  const monthLabel = `${monthNames[futureDate.getMonth()]} ${futureDate.getFullYear()}`;
                  
                  return (
                    <div key={index} className="border-l-4 border-blue-500 pl-4 py-2">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <p className="font-semibold text-gray-800">{monthLabel}</p>
                          <p className="text-sm text-gray-600">Confidence: {pred.confidence}%</p>
                        </div>
                        <p className="text-2xl font-bold text-blue-600">
                          {formatCurrency(pred.predicted)}
                        </p>
                      </div>
                      <div className="relative h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="absolute h-full bg-gradient-to-r from-blue-400 to-blue-600 rounded-full"
                          style={{ width: `${pred.confidence}%` }}
                        />
                      </div>
                      <div className="flex justify-between text-xs text-gray-500 mt-1">
                        <span>Lower: {formatCurrency(pred.lowerBound)}</span>
                        <span>Upper: {formatCurrency(pred.upperBound)}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Insights */}
            {predictions.insights && predictions.insights.length > 0 && (
              <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-lg p-6">
                <div className="flex items-center space-x-2 mb-4">
                  <LightBulbIcon className="h-6 w-6 text-indigo-600" />
                  <h3 className="text-xl font-bold text-gray-800">AI Insights & Recommendations</h3>
                </div>
                <div className="space-y-3">
                  {predictions.insights.map((insight, index) => (
                    <div
                      key={index}
                      className={`p-4 rounded-lg ${
                        insight.type === 'positive'
                          ? 'bg-green-100 border border-green-200'
                          : 'bg-yellow-100 border border-yellow-200'
                      }`}
                    >
                      <div className="flex items-start space-x-3">
                        {insight.type === 'positive' ? (
                          <CheckCircleIcon className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                        ) : (
                          <ExclamationTriangleIcon className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                        )}
                        <div>
                          <p className="font-semibold text-gray-800">{insight.message}</p>
                          <p className="text-sm text-gray-600 mt-1">
                            <strong>Recommendation:</strong> {insight.recommendation}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Statistics */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
                <p className="text-sm text-gray-600 mb-1">Mean</p>
                <p className="text-lg font-bold text-gray-800">
                  {formatCurrency(trendAnalysis.analysis.statistics.mean)}
                </p>
              </div>
              <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
                <p className="text-sm text-gray-600 mb-1">Median</p>
                <p className="text-lg font-bold text-gray-800">
                  {formatCurrency(trendAnalysis.analysis.statistics.median)}
                </p>
              </div>
              <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
                <p className="text-sm text-gray-600 mb-1">Min</p>
                <p className="text-lg font-bold text-gray-800">
                  {formatCurrency(trendAnalysis.analysis.statistics.min)}
                </p>
              </div>
              <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
                <p className="text-sm text-gray-600 mb-1">Max</p>
                <p className="text-lg font-bold text-gray-800">
                  {formatCurrency(trendAnalysis.analysis.statistics.max)}
                </p>
              </div>
              <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
                <p className="text-sm text-gray-600 mb-1">Range</p>
                <p className="text-lg font-bold text-gray-800">
                  {formatCurrency(trendAnalysis.analysis.statistics.range)}
                </p>
              </div>
            </div>

            {/* Anomalies */}
            {trendAnalysis.analysis.anomalies.length > 0 && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                <h3 className="text-lg font-bold text-red-900 mb-3">
                  Anomalies Detected ({trendAnalysis.analysis.anomalies.length})
                </h3>
                <div className="space-y-2">
                  {trendAnalysis.analysis.anomalies.map((anomaly, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-white rounded-lg">
                      <span className="text-gray-700">
                        {salesData[anomaly.index]?.month || `Month ${anomaly.index + 1}`}
                      </span>
                      <div className="flex items-center space-x-3">
                        <span className="text-gray-800 font-semibold">
                          {formatCurrency(anomaly.value)}
                        </span>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          anomaly.type === 'spike'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {anomaly.type} - {anomaly.severity}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default PredictiveAnalysisUI;
