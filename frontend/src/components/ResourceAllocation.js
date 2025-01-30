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
      alert("Resource allocated successfully!");
      navigate("/");
    } catch (error) {
      alert("Error: " + error.response?.data?.error || error.message);
    } finally {
      setLoading(false);
    }
  };

  return resource ? (
    <div className="max-w-xl mx-auto p-6">
      <h2 className="text-2xl font-semibold mb-4 text-blue-600">Allocate Resource</h2>
      <p className="font-medium text-gray-600">Resource: {resource.name}</p>
      <label>Status:
        <select name="status" value={form.status} onChange={handleChange} className="w-full p-2 border rounded-md">
          <option value="Available">Available</option>
          <option value="In Use">In Use</option>
          {/* <option value="Under Maintenance">Under Maintenance</option> */}
        </select>
      </label>
      <label>Project:
        <select name="projectId" value={form.projectId} onChange={handleChange} className="w-full p-2 border rounded-md">
          <option value="">Select a project</option>
          {projects.map((p) => (
            <option key={p.id} value={p.id}>{p.name}</option>
          ))}
        </select>
      </label>
      <label>Start Time:
        <input type="datetime-local" name="startTime" value={form.startTime} onChange={handleChange} className="w-full p-2 border rounded-md"/>
      </label>
      <label>End Time:
        <input type="datetime-local" name="endTime" value={form.endTime} onChange={handleChange} className="w-full p-2 border rounded-md"/>
      </label>
      <button onClick={allocateResource} disabled={loading} className="w-full py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700">
        {loading ? "Allocating..." : "Allocate Resource"}
      </button>
    </div>
  ) : <p>Loading...</p>;
}
export default ResourceAllocation;