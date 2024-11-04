const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const tenantRoutes = require('./routes/tenants');
const requestRoutes = require('./routes/requests');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());

app.use('/api/tenants', tenantRoutes);
app.use('/api/requests', requestRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
