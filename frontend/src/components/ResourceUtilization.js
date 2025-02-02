import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function ResourceUtilization() {
  const [utilizationData, setUtilizationData] = useState([]);

  useEffect(() => {
    const fetchUtilizationData = async () => {
        try {
            console.log("Fetching all utilization data...");
            const response = await axios.get('http://localhost:5000/allocations');
            console.log("Utilization data fetched:", response.data);

            
            if (Array.isArray(response.data)) {
                setUtilizationData(response.data);
            } else {
                console.error("Expected an array but got:", response.data);
                setUtilizationData([]); 
            }
        } catch (error) {
            console.error("Error fetching utilization data:", error);
            setUtilizationData([]);
        }
    };

    fetchUtilizationData();
}, []);

  const chartData = {
    labels: utilizationData.map((data) => data.resource_name),
    datasets: [
      {
        label: 'Utilization (ms)',
        data: utilizationData.map((data) => new Date(data.end_time) - new Date(data.start_time)),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
      },
    ],
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white text-gray-800">
      
      <header className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-12 shadow-lg">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h1 className="text-4xl font-bold mb-4">Resource Allocation System</h1>
          <p className="text-lg font-medium mb-6">Manage and monitor resource utilization efficiently.</p>
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
              View Utilization
            </a>
          </div>
        </div>
      </header>

      
      <section id="utilization" className="max-w-7xl mx-auto px-6 py-12 bg-white rounded-lg shadow-lg">
        <h2 className="text-3xl font-bold mb-6 text-center text-blue-700">Resource Utilization</h2>
        <div className="bg-white p-6 shadow-lg rounded-lg">
          {utilizationData.length > 0 ? <Bar data={chartData} /> : <p className="text-center text-gray-500">No utilization data available.</p>}
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
