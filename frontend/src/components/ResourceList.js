import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function ResourceList() {
  const [resources, setResources] = useState([]);
  const [selectedResource, setSelectedResource] = useState(null);
  const [allocation, setAllocation] = useState(null); // State for allocation details
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  const fetchResources = async () => {
    try {
      console.log("Fetching resources...");
      const response = await axios.get("http://localhost:5000/resources");

      console.log("Raw resources fetched:", response.data);

      const updatedResources = response.data.map((resource) => {
        if (
          resource.status === "In Use" &&
          resource.endTime &&
          new Date(resource.endTime) <= new Date()
        ) {
          console.log(`Resource ${resource.name} status updated to Available.`);
          return { ...resource, status: "Available" };
        }
        return resource;
      });

      console.log("Updated resources:", updatedResources);
      setResources(updatedResources);
    } catch (error) {
      console.error("Error fetching resources:", error);
    }
  };

  const fetchAllocation = async (resourceId) => {
    try {
      console.log(`Fetching allocation details for resource ID: ${resourceId}...`);
      const response = await axios.get(`http://localhost:5000/allocations?resource_id=${resourceId}`);
      
      const allocation = response.data[0]; // Assuming only one allocation record for each resource_id
      console.log("Allocation details fetched:", allocation);
  
      // Check if the start and end times are valid Date objects
      const startTime = new Date(allocation.start_time);
      const endTime = new Date(allocation.end_time);
  
      if (startTime.toString() === "Invalid Date" || endTime.toString() === "Invalid Date") {
        console.error("Invalid date found for allocation times");
      }
  
      // Set the allocation details including valid date parsing
      setAllocation({
        ...allocation,
        startTime: startTime.toString() === "Invalid Date" ? "Start time not available" : startTime.toLocaleString(),
        endTime: endTime.toString() === "Invalid Date" ? "End time not available" : endTime.toLocaleString()
      });
    } catch (error) {
      if (error.response && error.response.status === 404) {
        console.error("Allocation not found for resource ID:", resourceId);
        setAllocation(null);
      } else {
        console.error("Error fetching allocation details:", error);
      }
    }
  };
  
  

  useEffect(() => {
    fetchResources();

    const interval = setInterval(() => {
      console.log("Polling for resource updates...");
      fetchResources();
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  const handleResourceClick = (resource) => {
    if (resource.status === "In Use" || resource.status === "Under Maintenance") {
      console.log("Selected Resource:", resource);
      setSelectedResource(resource);
      fetchAllocation(resource.id); // Fetch allocation details when a resource is clicked
      setIsModalOpen(true);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedResource(null);
    setAllocation(null); // Clear allocation details when modal is closed
  };

  return (
    <>
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white text-gray-800">
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
                  onClick={() => handleResourceClick(resource)}
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
                  {resource.status === "Available" && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/allocate/${resource.id}`);
                      }}
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

        {isModalOpen && selectedResource && allocation && (
          <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full">
              <h3 className="text-2xl font-bold mb-4 text-blue-700">
                {selectedResource.name}
              </h3>
              <p className="text-gray-600 mb-2">
                <strong>Description:</strong>{" "}
                {selectedResource.description || "No description available."}
              </p>
              <p className="text-gray-600 mb-2">
                <strong>Status:</strong> {selectedResource.status}
              </p>
              <p className="text-gray-600 mb-2">
                <strong>Start Time:</strong> {new Date(allocation.startTime).toLocaleString()}
              </p>
              <p className="text-gray-600 mb-2">
                <strong>End Time:</strong> {new Date(allocation.endTime).toLocaleString()}
              </p>

              <button
                onClick={closeModal}
                className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700 transition"
              >
                Close
              </button>
            </div>
          </div>
        )}

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
