import React, { useState } from 'react';
import axios from 'axios';

function ResourceAllocation() {
  const [resourceId, setResourceId] = useState('');
  const [projectId, setProjectId] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');

  const allocateResource = () => {
    axios.post('http://localhost:5000/allocate', {
      resourceId,
      projectId,
      startTime,
      endTime,
    }).then(() => {
      alert('Resource allocated successfully');
    }).catch((error) => {
      alert('Error allocating resource: ' + error.message);
    });
  };

  return (
    <div className="p-4 bg-gray-100">
      <h2 className="text-xl font-bold mb-4">Allocate Resource</h2>
      <form onSubmit={(e) => {
        e.preventDefault();
        allocateResource();
      }} className="space-y-4">
        <label className="block">
          <span className="block text-sm font-medium">Resource ID:</span>
          <input type="text" value={resourceId} onChange={(e) => setResourceId(e.target.value)} className="mt-1 block w-full p-2 border rounded" />
        </label>
        <label className="block">
          <span className="block text-sm font-medium">Project ID:</span>
          <input type="text" value={projectId} onChange={(e) => setProjectId(e.target.value)} className="mt-1 block w-full p-2 border rounded" />
        </label>
        <label className="block">
          <span className="block text-sm font-medium">Start Time:</span>
          <input type="datetime-local" value={startTime} onChange={(e) => setStartTime(e.target.value)} className="mt-1 block w-full p-2 border rounded" />
        </label>
        <label className="block">
          <span className="block text-sm font-medium">End Time:</span>
          <input type="datetime-local" value={endTime} onChange={(e) => setEndTime(e.target.value)} className="mt-1 block w-full p-2 border rounded" />
        </label>
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">Allocate</button>
      </form>
    </div>
  );
}

export default ResourceAllocation;