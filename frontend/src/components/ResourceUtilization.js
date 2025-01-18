import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';

function ResourceUtilization() {
  const [utilizationData, setUtilizationData] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/allocations').then((response) => {
      setUtilizationData(response.data);
    });
  }, []);

  const chartData = {
    labels: utilizationData.map((data) => data.resource_name),
    datasets: [
      {
        label: 'Utilization',
        data: utilizationData.map((data) => new Date(data.end_time) - new Date(data.start_time)),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
      },
    ],
  };

  return (
    <div className="p-4 bg-gray-100">
      <h2 className="text-xl font-bold mb-4">Resource Utilization</h2>
      <div className="bg-white p-4 shadow rounded-lg">
        <Bar data={chartData} />
      </div>
    </div>
  );
}

export default ResourceUtilization;