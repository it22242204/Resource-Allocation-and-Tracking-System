import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

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
    <div>
      
      <header className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-12 shadow-lg">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h1 className="text-4xl font-bold mb-4">
            Welcome to the Resource Allocation System
          </h1>
          <p className="text-lg font-medium mb-6">
            Efficiently manage and monitor your organization's resources with ease.
          </p>
          <div className="flex justify-center gap-4">
            <a
              href="/"
              className="inline-block bg-white text-blue-600 px-6 py-3 rounded-full shadow-lg font-semibold hover:bg-gray-100 transition"
            >
              Explore Resources
            </a>
            <a
              href="#utilization"
              className="inline-block bg-white text-blue-600 px-6 py-3 rounded-full shadow-lg font-semibold hover:bg-gray-100 transition"
            >
              View Resource Utilization
            </a>
          </div>
        </div>
      </header>

      
      <section id="utilization" className="p-4 bg-gray-100">
        <h2 className="text-xl font-bold mb-4">Resource Utilization</h2>
        <div className="bg-white p-4 shadow rounded-lg">
          <Bar data={chartData} />
        </div>
      </section>

      
      <footer className="bg-gray-800 text-white py-4 mt-8">
        <div className="max-w-7xl mx-auto text-center">
          <p>&copy; 2025 Resource Allocation System. All Rights Reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default ResourceUtilization;
