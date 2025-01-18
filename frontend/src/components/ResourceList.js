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
    <div className="p-4 bg-gray-100">
      <h2 className="text-xl font-bold mb-4">Resource List</h2>
      <ul className="space-y-2">
        {resources.map((resource) => (
          <li key={resource.id} className="p-4 bg-white shadow rounded-lg">
            <span className="font-semibold">{resource.name}</span> - {resource.status}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ResourceList;