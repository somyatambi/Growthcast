import React from 'react';

function ForecastTable({ data }) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-xl font-semibold text-slate-800 mb-6">
        Growth Predictions
      </h3>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200">
          <thead>
            <tr className="bg-slate-50">
              <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700 uppercase tracking-wider">
                Period
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700 uppercase tracking-wider">
                Predicted Value
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700 uppercase tracking-wider">
                Confidence Range
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-slate-200">
            {data.map((row, index) => (
              <tr
                key={index}
                className={index % 2 === 0 ? 'bg-white' : 'bg-slate-50'}
              >
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">
                  {row.period}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-700 font-semibold">
                  {row.predictedValue}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                  {row.confidenceRange}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <p className="text-sm text-blue-800">
          <span className="font-semibold">Note:</span> Predictions are based on historical data patterns and market trends. 
          Actual results may vary.
        </p>
      </div>
    </div>
  );
}

export default ForecastTable;
