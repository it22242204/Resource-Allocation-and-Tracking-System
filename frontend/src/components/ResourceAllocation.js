import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

function ResourceAllocation() {
  const { resourceId } = useParams();
  const navigate = useNavigate();
  const [resource, setResource] = useState(null);
  const [projects, setProjects] = useState([]);
  const [form, setForm] = useState({ projectId: "", startTime: "", endTime: "", status: "Available" });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [resResource, resProjects] = await Promise.all([
          axios.get(`http://localhost:5000/resources/${resourceId}`),
          axios.get("http://localhost:5000/projects"),
        ]);
        setResource(resResource.data);
        setProjects(resProjects.data);
        setForm((prev) => ({ ...prev, status: resResource.data.status }));
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, [resourceId]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const allocateResource = async () => {
    setLoading(true);
    try {
      await axios.post("http://localhost:5000/allocations", { resourceId, ...form });
      alert("✅ Resource allocated successfully!");
      navigate("/");
    } catch (error) {
      alert("❌ Error: " + error.response?.data?.error || error.message);
    } finally {
      setLoading(false);
    }
  };

  return resource ? (
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
              onClick={() => navigate("/")}
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
    <div className="max-w-lg mx-auto bg-gradient-to-br from-blue-100 via-indigo-100 to-purple-100 shadow-md rounded-2xl p-6 mt-8">
      <h2 className="text-3xl font-bold text-center text-blue-600 mb-6">Allocate Resource</h2>
      
      <p className="text-lg font-medium text-gray-700 mb-4">🔹 Resource: <span className="font-semibold">{resource.name}</span></p>

      <div className="space-y-4">
        <label className="block">
          <span className="text-gray-600 font-medium">Status:</span>
          <select name="status" value={form.status} onChange={handleChange}
            className="w-full p-3 border rounded-lg mt-1 focus:ring focus:ring-blue-300">
            <option value="Available">Available</option>
            <option value="In Use">In Use</option>
          </select>
        </label>

        <label className="block">
          <span className="text-gray-600 font-medium">Project:</span>
          <select name="projectId" value={form.projectId} onChange={handleChange}
            className="w-full p-3 border rounded-lg mt-1 focus:ring focus:ring-blue-300">
            <option value="">Select a project</option>
            {projects.map((p) => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
        </label>

        <label className="block">
          <span className="text-gray-600 font-medium">Start Time:</span>
          <input type="datetime-local" name="startTime" value={form.startTime} onChange={handleChange}
            className="w-full p-3 border rounded-lg mt-1 focus:ring focus:ring-blue-300"/>
        </label>

        <label className="block">
          <span className="text-gray-600 font-medium">End Time:</span>
          <input type="datetime-local" name="endTime" value={form.endTime} onChange={handleChange}
            className="w-full p-3 border rounded-lg mt-1 focus:ring focus:ring-blue-300"/>
        </label>

        <button onClick={allocateResource} disabled={loading}
          className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition duration-200">
          {loading ? "⏳ Allocating..." : "✅ Allocate Resource"}
        </button>
      </div>
    </div>
    {/* Footer */}
    <footer className="bg-gray-800 text-white py-4 mt-8">
        <div className="max-w-7xl mx-auto text-center">
          <p>&copy; 2025 Resource Allocation System. All Rights Reserved.</p>
        </div>
      </footer>
    </div>
  ) : <p className="text-center text-gray-600 text-lg">🔄 Loading...</p>;
}

export default ResourceAllocation;
