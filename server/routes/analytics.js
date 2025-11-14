import express from 'express';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// @route   POST /api/analytics/predict-sales
// @desc    Predict future sales using historical data
// @access  Private
router.post('/predict-sales', protect, async (req, res) => {
  try {
    console.log('=== PREDICT SALES REQUEST ===');
    console.log('Request body:', req.body);
    console.log('User:', req.user?.email);

    const { salesData, predictionMonths } = req.body;

    if (!salesData || !Array.isArray(salesData) || salesData.length < 3) {
      console.log('Invalid data:', { salesData, length: salesData?.length });
      return res.status(400).json({
        success: false,
        message: 'At least 3 months of sales data required'
      });
    }

    console.log('Generating predictions for', salesData.length, 'data points');

    // Simple Moving Average + Linear Regression
    const predictions = generateSalesPredictions(salesData, predictionMonths || 3);
    const trends = calculateTrends(salesData);
    const insights = generateInsights(salesData, predictions);

    console.log('Predictions generated successfully');

    res.json({
      success: true,
      predictions,
      trends,
      insights,
      metadata: {
        dataPoints: salesData.length,
        predictionMonths: predictionMonths || 3,
        confidence: calculateConfidence(salesData)
      }
    });

  } catch (error) {
    console.error('Prediction error details:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({
      success: false,
      message: 'Error generating predictions',
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

// @route   POST /api/analytics/trend-analysis
// @desc    Analyze sales trends and patterns
// @access  Private
router.post('/trend-analysis', protect, async (req, res) => {
  try {
    console.log('=== TREND ANALYSIS REQUEST ===');
    console.log('Request body:', req.body);

    const { salesData } = req.body;

    if (!salesData || !Array.isArray(salesData)) {
      return res.status(400).json({
        success: false,
        message: 'Sales data required'
      });
    }

    console.log('Analyzing trends for', salesData.length, 'data points');

    const analysis = {
      overallTrend: calculateOverallTrend(salesData),
      monthlyGrowth: calculateMonthlyGrowth(salesData),
      seasonality: detectSeasonality(salesData),
      statistics: calculateStatistics(salesData),
      anomalies: detectAnomalies(salesData)
    };

    console.log('Trend analysis completed');

    res.json({
      success: true,
      analysis
    });

  } catch (error) {
    console.error('Trend analysis error details:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({
      success: false,
      message: 'Error analyzing trends',
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

// Helper functions for predictive analysis

function generateSalesPredictions(salesData, months) {
  const values = salesData.map(d => d.value || d.sales || 0);
  
  // Calculate linear regression
  const n = values.length;
  const sumX = (n * (n - 1)) / 2;
  const sumY = values.reduce((a, b) => a + b, 0);
  const sumXY = values.reduce((sum, val, idx) => sum + val * idx, 0);
  const sumX2 = (n * (n - 1) * (2 * n - 1)) / 6;
  
  const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
  const intercept = (sumY - slope * sumX) / n;
  
  // Generate predictions
  const predictions = [];
  for (let i = 0; i < months; i++) {
    const futureIndex = n + i;
    const predictedValue = slope * futureIndex + intercept;
    
    // Add some variance based on historical volatility
    const volatility = calculateVolatility(values);
    const lowerBound = predictedValue - volatility;
    const upperBound = predictedValue + volatility;
    
    predictions.push({
      month: i + 1,
      predicted: Math.max(0, Math.round(predictedValue)),
      lowerBound: Math.max(0, Math.round(lowerBound)),
      upperBound: Math.round(upperBound),
      confidence: calculatePredictionConfidence(i, salesData)
    });
  }
  
  return predictions;
}

function calculateTrends(salesData) {
  const values = salesData.map(d => d.value || d.sales || 0);
  
  return {
    direction: calculateOverallTrend(salesData),
    strength: calculateTrendStrength(values),
    volatility: calculateVolatility(values),
    growthRate: calculateGrowthRate(values)
  };
}

function calculateOverallTrend(salesData) {
  const values = salesData.map(d => d.value || d.sales || 0);
  if (values.length < 2) return 'insufficient_data';
  
  const firstHalf = values.slice(0, Math.floor(values.length / 2));
  const secondHalf = values.slice(Math.floor(values.length / 2));
  
  const avgFirst = firstHalf.reduce((a, b) => a + b, 0) / firstHalf.length;
  const avgSecond = secondHalf.reduce((a, b) => a + b, 0) / secondHalf.length;
  
  const change = ((avgSecond - avgFirst) / avgFirst) * 100;
  
  if (change > 5) return 'upward';
  if (change < -5) return 'downward';
  return 'stable';
}

function calculateTrendStrength(values) {
  if (values.length < 3) return 0;
  
  // Calculate R-squared
  const n = values.length;
  const meanY = values.reduce((a, b) => a + b, 0) / n;
  
  const sumX = (n * (n - 1)) / 2;
  const sumXY = values.reduce((sum, val, idx) => sum + val * idx, 0);
  const sumX2 = (n * (n - 1) * (2 * n - 1)) / 6;
  
  const slope = (n * sumXY - sumX * values.reduce((a, b) => a + b, 0)) / 
                (n * sumX2 - sumX * sumX);
  const intercept = (values.reduce((a, b) => a + b, 0) - slope * sumX) / n;
  
  const ssr = values.reduce((sum, val, idx) => {
    const predicted = slope * idx + intercept;
    return sum + Math.pow(predicted - meanY, 2);
  }, 0);
  
  const sst = values.reduce((sum, val) => sum + Math.pow(val - meanY, 2), 0);
  
  return sst === 0 ? 0 : Math.round((ssr / sst) * 100);
}

function calculateVolatility(values) {
  if (values.length < 2) return 0;
  
  const mean = values.reduce((a, b) => a + b, 0) / values.length;
  const variance = values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length;
  
  return Math.sqrt(variance);
}

function calculateGrowthRate(values) {
  if (values.length < 2) return 0;
  
  const first = values[0];
  const last = values[values.length - 1];
  
  return first === 0 ? 0 : Math.round(((last - first) / first) * 100);
}

function calculateConfidence(salesData) {
  // Confidence based on data quantity and consistency
  const dataPoints = salesData.length;
  const values = salesData.map(d => d.value || d.sales || 0);
  
  let confidence = Math.min(dataPoints * 5, 50); // Up to 50% based on data quantity
  
  // Add confidence based on data consistency
  const volatility = calculateVolatility(values);
  const mean = values.reduce((a, b) => a + b, 0) / values.length;
  const cv = mean === 0 ? 0 : (volatility / mean) * 100;
  
  if (cv < 20) confidence += 30;
  else if (cv < 40) confidence += 20;
  else confidence += 10;
  
  return Math.min(confidence, 95); // Cap at 95%
}

function calculatePredictionConfidence(monthsAhead, salesData) {
  // Confidence decreases with prediction distance
  const baseConfidence = calculateConfidence(salesData);
  const decay = Math.pow(0.9, monthsAhead);
  
  return Math.round(baseConfidence * decay);
}

function generateInsights(salesData, predictions) {
  const insights = [];
  const values = salesData.map(d => d.value || d.sales || 0);
  const avgSales = values.reduce((a, b) => a + b, 0) / values.length;
  const trend = calculateOverallTrend(salesData);
  
  if (trend === 'upward') {
    insights.push({
      type: 'positive',
      message: 'Sales showing strong upward trend',
      recommendation: 'Consider increasing inventory and marketing investment'
    });
  } else if (trend === 'downward') {
    insights.push({
      type: 'warning',
      message: 'Sales declining over recent periods',
      recommendation: 'Review pricing strategy and customer feedback'
    });
  }
  
  if (predictions[0].predicted > avgSales * 1.1) {
    insights.push({
      type: 'positive',
      message: 'Next month predicted to exceed historical average by 10%+',
      recommendation: 'Prepare for increased demand'
    });
  }
  
  const volatility = calculateVolatility(values);
  const cv = (volatility / avgSales) * 100;
  
  if (cv > 40) {
    insights.push({
      type: 'warning',
      message: 'High sales volatility detected',
      recommendation: 'Implement demand forecasting to optimize inventory'
    });
  }
  
  return insights;
}

function calculateMonthlyGrowth(salesData) {
  const values = salesData.map(d => d.value || d.sales || 0);
  const growth = [];
  
  for (let i = 1; i < values.length; i++) {
    const prev = values[i - 1];
    const current = values[i];
    const rate = prev === 0 ? 0 : ((current - prev) / prev) * 100;
    
    growth.push({
      month: i,
      rate: Math.round(rate * 100) / 100
    });
  }
  
  return growth;
}

function detectSeasonality(salesData) {
  if (salesData.length < 12) {
    return {
      detected: false,
      message: 'Need at least 12 months of data to detect seasonality'
    };
  }
  
  // Simple seasonality detection - check for recurring patterns
  const values = salesData.map(d => d.value || d.sales || 0);
  const quarters = [];
  
  for (let i = 0; i < Math.floor(values.length / 3); i++) {
    const quarterValues = values.slice(i * 3, (i + 1) * 3);
    quarters.push(quarterValues.reduce((a, b) => a + b, 0) / quarterValues.length);
  }
  
  return {
    detected: quarters.length >= 4,
    pattern: quarters.length >= 4 ? identifySeasonalPattern(quarters) : null
  };
}

function identifySeasonalPattern(quarters) {
  const maxQuarter = quarters.indexOf(Math.max(...quarters));
  const minQuarter = quarters.indexOf(Math.min(...quarters));
  
  const patterns = ['Q1', 'Q2', 'Q3', 'Q4'];
  
  return {
    peakQuarter: patterns[maxQuarter % 4],
    lowQuarter: patterns[minQuarter % 4]
  };
}

function calculateStatistics(salesData) {
  const values = salesData.map(d => d.value || d.sales || 0);
  const sorted = [...values].sort((a, b) => a - b);
  
  return {
    mean: Math.round(values.reduce((a, b) => a + b, 0) / values.length),
    median: sorted[Math.floor(sorted.length / 2)],
    min: Math.min(...values),
    max: Math.max(...values),
    range: Math.max(...values) - Math.min(...values)
  };
}

function detectAnomalies(salesData) {
  const values = salesData.map(d => d.value || d.sales || 0);
  const mean = values.reduce((a, b) => a + b, 0) / values.length;
  const stdDev = Math.sqrt(
    values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length
  );
  
  const anomalies = [];
  
  values.forEach((value, index) => {
    const zScore = (value - mean) / stdDev;
    
    if (Math.abs(zScore) > 2) {
      anomalies.push({
        index,
        value,
        type: zScore > 0 ? 'spike' : 'drop',
        severity: Math.abs(zScore) > 3 ? 'high' : 'moderate'
      });
    }
  });
  
  return anomalies;
}

export default router;
