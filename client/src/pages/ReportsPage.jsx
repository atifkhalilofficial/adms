import { useState } from 'react';
import axios from 'axios';

function ReportsPage() {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [downloading, setDownloading] = useState(false);

  const buildQuery = () => {
    const params = new URLSearchParams();
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    return params.toString();
  };

  const handleDownload = async (format) => {
    setDownloading(true);
    try {
      const query = buildQuery();
      const url = `http://localhost:5000/api/reports/orders/${format}${query ? `?${query}` : ''}`;

      const response = await axios.get(url, {
        withCredentials: true,
        responseType: 'blob',
      });

      const blobUrl = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = blobUrl;
      link.setAttribute('download', `orders-report.${format === 'excel' ? 'xlsx' : 'pdf'}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(blobUrl);
    } catch (err) {
      console.error('Download failed', err);
      alert('Failed to generate report. Check console for details.');
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-2xl font-bold mb-6">Reports</h1>

      <div className="bg-white p-6 rounded-lg shadow-md max-w-lg">
        <h2 className="font-semibold mb-4">Orders Report</h2>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium mb-1">Start Date</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full border rounded px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">End Date</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full border rounded px-3 py-2"
            />
          </div>
        </div>

        <p className="text-xs text-gray-500 mb-4">
          Leave both blank to export all orders.
        </p>

        <div className="flex gap-3">
          <button
            onClick={() => handleDownload('excel')}
            disabled={downloading}
            className="flex-1 bg-green-600 text-white py-2 rounded hover:bg-green-700 disabled:opacity-50"
          >
            {downloading ? 'Generating...' : 'Download Excel'}
          </button>
          <button
            onClick={() => handleDownload('pdf')}
            disabled={downloading}
            className="flex-1 bg-red-600 text-white py-2 rounded hover:bg-red-700 disabled:opacity-50"
          >
            {downloading ? 'Generating...' : 'Download PDF'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ReportsPage;