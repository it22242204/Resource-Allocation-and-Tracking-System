const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const projectRoutes = require('./routes/projects');
const resourceRoutes = require('./routes/resources');
const allocationRoutes = require('./routes/allocations');

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());


app.use('/projects', projectRoutes);
app.use('/resources', resourceRoutes);
app.use('/allocations', allocationRoutes);


app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
