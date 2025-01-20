import React, { useEffect, useState } from 'react';
import axios from 'axios';

function ResourceList() {
  const [resources, setResources] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/resources').then((response) => {
      setResources(response.data);
    });
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white text-gray-800">
      {/* Hero Section */}
      <header className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-12 shadow-lg">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h1 className="text-4xl font-bold mb-4">
            Welcome to the Resource Allocation System
          </h1>
          <p className="text-lg font-medium mb-6">
            Efficiently manage and monitor your organization's resources with ease.
          </p>
          <a
            href="#resources"
            className="inline-block bg-white text-blue-600 px-6 py-3 rounded-full shadow-lg font-semibold hover:bg-gray-100 transition"
          >
            Explore Resources
          </a>
        </div>
      </header>

      {/* Resources Section */}
      <main id="resources" className="max-w-7xl mx-auto px-6 py-12">
        <h2 className="text-3xl font-bold mb-8 text-center">
          Available Resources
        </h2>

        {resources.length === 0 ? (
          <div className="text-center">
            <p className="text-gray-500">No resources available at the moment.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {resources.map((resource) => (
              <div
                key={resource.id}
                className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow"
              >
                <h3 className="text-xl font-semibold mb-2 text-blue-600">
                  {resource.name}
                </h3>
                <p className="text-gray-600 text-sm mb-4">
                  {resource.description || 'No description available.'}
                </p>
                <p
                  className={`inline-block px-4 py-1 rounded-full text-sm font-semibold ${
                    resource.status === 'Available'
                      ? 'bg-green-100 text-green-700'
                      : resource.status === 'In Use'
                      ? 'bg-yellow-100 text-yellow-700'
                      : 'bg-red-100 text-red-700'
                  }`}
                >
                  {resource.status}
                </p>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Call to Action */}
      <section className="bg-blue-600 text-white py-12 mt-12">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h3 className="text-2xl font-bold mb-4">
            Need to Allocate Resources?
          </h3>
          <p className="text-lg mb-6">
            Start assigning your resources to projects and track their usage in real time.
          </p>
          <a
            href="#"
            className="inline-block bg-white text-blue-600 px-6 py-3 rounded-full shadow-lg font-semibold hover:bg-gray-100 transition"
          >
            Allocate Now
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-6 mt-12">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-sm">
            © 2025 Resource Allocation System. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default ResourceList;
