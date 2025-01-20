import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ResourceList from './components/ResourceList';
import ResourceAllocation from './components/ResourceAllocation';
import ResourceUtilization from './components/ResourceUtilization';

function App() {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<ResourceList />} />
          <Route path="/allocate" element={<ResourceAllocation />} />
          <Route path="/utilization" element={<ResourceUtilization />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;