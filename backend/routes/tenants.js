// backend/routes/tenants.js
const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

// Path to tenants.json
const tenantsPath = path.join(__dirname, '../data/tenants.json');

// Helper function to read tenants
const readTenants = () => {
  const data = fs.readFileSync(tenantsPath);
  return JSON.parse(data);
};

// Helper function to write tenants
const writeTenants = (tenants) => {
  fs.writeFileSync(tenantsPath, JSON.stringify(tenants, null, 2));
};

// FR4: Add a new tenant
router.post('/', (req, res) => {
  const tenants = readTenants();
  const newTenant = { id: Date.now(), ...req.body };
  tenants.push(newTenant);
  writeTenants(tenants);
  res.status(201).json(newTenant);
});

// FR4: Move tenant to another apartment
router.put('/:id/move', (req, res) => {
  const tenants = readTenants();
  const tenant = tenants.find(t => t.id === parseInt(req.params.id));
  if (tenant) {
    tenant.apartmentNumber = req.body.apartmentNumber;
    writeTenants(tenants);
    res.json(tenant);
  } else {
    res.status(404).json({ message: 'Tenant not found' });
  }
});

// FR4: Delete a tenant
router.delete('/:id', (req, res) => {
  let tenants = readTenants();
  const index = tenants.findIndex(t => t.id === parseInt(req.params.id));
  if (index !== -1) {
    const deleted = tenants.splice(index, 1);
    writeTenants(tenants);
    res.json(deleted[0]);
  } else {
    res.status(404).json({ message: 'Tenant not found' });
  }
});

// Get all tenants (optional)
router.get('/', (req, res) => {
  const tenants = readTenants();
  res.json(tenants);
});

module.exports = router;
