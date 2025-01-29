import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

function ResourceAllocation() {
  const { resourceId } = useParams();
  const [resourceData, setResourceData] = useState(null);
  const [projectId, setProjectId] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [status, setStatus] = useState(""); // Added state for selectable status
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchResourceData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/resources/${resourceId}`
        );
        const resource = response.data;

        setResourceData(resource);
        setStatus(resource.status); // Set initial status to resource status
        setEndTime(resource.endTime ? new Date(resource.endTime).toLocaleString() : null);
      } catch (error) {
        console.error("Error fetching resource:", error);
      }
    };

    const fetchProjects = async () => {
      try {
        const response = await axios.get("http://localhost:5000/projects");
        setProjects(response.data);
      } catch (error) {
        console.error("Error fetching projects:", error);
      }
    };

    fetchResourceData();
    fetchProjects();

    const interval = setInterval(fetchResourceData, 10000); // Refresh every 10 seconds
    return () => clearInterval(interval);
  }, [resourceId]);

  const formatDateForMySQL = (date) => {
    const d = new Date(date);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(
      2,
      "0"
    )}-${String(d.getDate()).padStart(2, "0")} ${String(d.getHours()).padStart(
      2,
      "0"
    )}:${String(d.getMinutes()).padStart(2, "0")}:${String(
      d.getSeconds()
    ).padStart(2, "0")}`;
  };

  const allocateResource = async () => {
    setLoading(true);
    try {
      const formattedStartTime = formatDateForMySQL(startTime);
      const formattedEndTime = formatDateForMySQL(endTime);

      // Step 1: Create allocation record in the allocations table
      await axios.post("http://localhost:5000/allocations", {
        resourceId,
        projectId,
        status, // Send the selected status
        startTime: formattedStartTime,
        endTime: formattedEndTime,
      });

      // Step 2: Update the resource status to the selected status
      await axios.put(`http://localhost:5000/resources/${resourceId}/status`, {
        status,
      });

      console.log(
        "Allocated resource:",
        resourceId,
        projectId,
        formattedStartTime,
        formattedEndTime
      );
      alert("Resource allocated successfully!");
      navigate("/"); // Redirect after allocation
    } catch (error) {
      alert("Error allocating resource: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Make sure all fields are filled before allowing allocation
  const isFormValid = projectId && startTime && endTime && status;

  if (!resourceData) return <div>Loading resource...</div>;

  return (
    <div className="max-w-xl mx-auto p-6">
      <h2 className="text-2xl font-semibold mb-4 text-blue-600">Allocate Resource</h2>

      <div className="mb-4">
        <label className="block font-medium text-gray-600">Resource</label>
        <input
          type="text"
          value={resourceData.name}
          disabled
          className="w-full p-2 border rounded-md bg-gray-100"
        />
      </div>

      {/* Selectable Status */}
      <div className="mb-4">
        <label className="block font-medium text-gray-600">Status</label>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="w-full p-2 border rounded-md"
        >
          <option value="Available">Available</option>
          <option value="In Use">In Use</option>
          <option value="Under Maintenance">Under Maintenance</option>
        </select>
      </div>

      <div className="mb-4">
        <label className="block font-medium text-gray-600">Project</label>
        <select
          value={projectId}
          onChange={(e) => setProjectId(e.target.value)}
          className="w-full p-2 border rounded-md"
        >
          <option value="">Select a project</option>
          {projects.map((project) => (
            <option key={project.id} value={project.id}>
              {project.name}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-4">
        <label className="block font-medium text-gray-600">Start Time</label>
        <input
          type="datetime-local"
          value={startTime}
          onChange={(e) => setStartTime(e.target.value)}
          className="w-full p-2 border rounded-md"
        />
      </div>

      <div className="mb-4">
        <label className="block font-medium text-gray-600">End Time</label>
        <input
          type="datetime-local"
          value={endTime}
          onChange={(e) => setEndTime(e.target.value)}
          className="w-full p-2 border rounded-md"
        />
      </div>

      <button
        onClick={allocateResource}
        disabled={loading || !isFormValid} // Disable only if form is invalid
        className="w-full py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
      >
        {loading ? "Allocating..." : "Allocate Resource"}
      </button>
    </div>
  );
}

export default ResourceAllocation;
