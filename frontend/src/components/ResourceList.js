import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function ResourceList() {
  const [resources, setResources] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get("http://localhost:5000/resources").then((response) => {
      setResources(response.data);
    });
  }, []);

  return (
    <>
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white text-gray-800">
      {/* Hero Section */}
      <header className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-12 shadow-lg">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h1 className="text-4xl font-bold mb-4">
            Welcome to the Resource Allocation System
          </h1>
          <p className="text-lg font-medium mb-6">
            Efficiently manage and monitor your organization's resources with
            ease.
          </p>
          <div className="flex justify-center gap-4">
            <a
              href="#resources"
              className="inline-block bg-white text-blue-600 px-6 py-3 rounded-full shadow-lg font-semibold hover:bg-gray-100 transition"
            >
              Explore Resources
            </a>
            <button
              onClick={() => navigate("/utilization")}
              className="inline-block bg-white text-blue-600 px-6 py-3 rounded-full shadow-lg font-semibold hover:bg-gray-100 transition"
            >
              View Resource Utilization
            </button>
          </div>
        </div>
      </header>

      {/* Resources Section */}
      <main
        id="resources"
        className="max-w-7xl mx-auto px-6 py-12 bg-gradient-to-br from-blue-100 via-indigo-100 to-purple-100 rounded-lg shadow-lg"
      >
        <h2 className="text-3xl font-bold mb-8 text-center text-blue-700 drop-shadow-lg">
          Available Resources
        </h2>

        {resources.length === 0 ? (
          <div className="text-center">
            <p className="text-gray-500">
              No resources available at the moment.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {resources.map((resource) => (
              <div
                key={resource.id}
                className="bg-white rounded-lg shadow-xl p-6 hover:shadow-2xl transition-all transform hover:scale-105 hover:translate-y-1 border-2 border-transparent hover:border-blue-300 duration-300 relative"
              >
                <h3 className="text-xl font-semibold mb-2 text-blue-600 tracking-wide">
                  {resource.name}
                </h3>
                <p className="text-gray-600 text-sm mb-4 italic">
                  {resource.description || "No description available."}
                </p>
                <p
                  className={`inline-block px-4 py-1 rounded-full text-sm font-semibold ${
                    resource.status === "Available"
                      ? "bg-green-100 text-green-700"
                      : resource.status === "In Use"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {resource.status}
                </p>

                {/* Allocate Button - Positioned to the right */}
                {resource.status === "Available" && (
                  <button
                    onClick={() => navigate(`/allocate/${resource.id}`)}
                    className="absolute right-6 bottom-6 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-2 rounded-full shadow-lg hover:bg-gradient-to-l hover:from-indigo-600 hover:to-blue-600 transition duration-300 ease-in-out transform hover:scale-105"
                  >
                    Allocate
                  </button>
                )}
              </div>
            ))}
          </div>
        )}

       
      </main>
       {/* Footer Section */}
       <footer className="bg-blue-600 text-white py-6 mt-12 text-center">
          <p>
            &copy; {new Date().getFullYear()} Resource Allocation System. All
            Rights Reserved.
          </p>
        </footer>
    </div>
    </>
  );
}

export default ResourceList;
