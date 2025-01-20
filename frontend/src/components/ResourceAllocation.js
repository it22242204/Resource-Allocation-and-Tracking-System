import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

function ResourceAllocation() {
  const { resourceId } = useParams();  // Get the resource ID from the URL
  const [resourceData, setResourceData] = useState(null);
  const [projectId, setProjectId] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch resource details by ID (optional)
    if (resourceId) {
      axios.get(`http://localhost:5000/resources/${resourceId}`).then((response) => {
        setResourceData(response.data);
      });
    }
  }, [resourceId]);

  const allocateResource = () => {
    setLoading(true);
    axios
      .post('http://localhost:5000/allocate', {
        resourceId,
        projectId,
        startTime,
        endTime,
      })
      .then(() => {
        alert('Resource allocated successfully!');
        navigate('/');  // Redirect to the homepage after successful allocation
      })
      .catch((error) => {
        alert('Error allocating resource: ' + error.message);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center">
      <div className="bg-white p-8 shadow-lg rounded-lg max-w-md w-full">
        <h2 className="text-2xl font-bold text-center mb-6 text-blue-600">
          Allocate Resource
        </h2>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            allocateResource();
          }}
          className="space-y-6"
        >
          <label className="block">
            <span className="block text-sm font-medium text-gray-700">Resource ID:</span>
            <input
              type="text"
              value={resourceId || ''}
              className="mt-1 block w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              placeholder="Resource ID"
              readOnly
            />
          </label>

          <label className="block">
            <span className="block text-sm font-medium text-gray-700">Project ID:</span>
            <input
              type="text"
              value={projectId}
              onChange={(e) => setProjectId(e.target.value)}
              className="mt-1 block w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter project ID"
              required
            />
          </label>

          <label className="block">
            <span className="block text-sm font-medium text-gray-700">Start Time:</span>
            <input
              type="datetime-local"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="mt-1 block w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </label>

          <label className="block">
            <span className="block text-sm font-medium text-gray-700">End Time:</span>
            <input
              type="datetime-local"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              className="mt-1 block w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </label>

          <button
            type="submit"
            className={`w-full text-white px-4 py-3 rounded-lg font-semibold ${
              loading
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 transition'
            }`}
            disabled={loading}
          >
            {loading ? 'Allocating...' : 'Allocate Resource'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default ResourceAllocation;
