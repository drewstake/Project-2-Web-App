const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

// Path to requests.json
const requestsPath = path.join(__dirname, '../data/requests.json');

// Helper function to read requests
const readRequests = () => {
  const data = fs.readFileSync(requestsPath);
  return JSON.parse(data);
};

// Helper function to write requests
const writeRequests = (requests) => {
  fs.writeFileSync(requestsPath, JSON.stringify(requests, null, 2));
};

// FR1: Submit a maintenance request
router.post('/', (req, res) => {
  const requests = readRequests();
  const newRequest = {
    id: Date.now(),
    ...req.body,
    status: 'pending',
    dateTime: new Date().toISOString()
  };
  requests.push(newRequest);
  writeRequests(requests);
  res.status(201).json(newRequest);
});

// FR2: Browse maintenance requests with filters
router.get('/', (req, res) => {
  let requests = readRequests();
  const { apartmentNumber, area, startDate, endDate, status } = req.query;

  if (apartmentNumber) {
    requests = requests.filter(r => r.apartmentNumber === apartmentNumber);
  }
  if (area) {
    requests = requests.filter(r => r.area.toLowerCase() === area.toLowerCase());
  }
  if (status) {
    requests = requests.filter(r => r.status.toLowerCase() === status.toLowerCase());
  }
  if (startDate && endDate) {
    requests = requests.filter(r => {
      const requestDate = new Date(r.dateTime);
      return requestDate >= new Date(startDate) && requestDate <= new Date(endDate);
    });
  }

  res.json(requests);
});

// FR3: Update the status of a request
router.put('/:id/status', (req, res) => {
  const requests = readRequests();
  const request = requests.find(r => r.id === parseInt(req.params.id));
  if (request) {
    request.status = req.body.status;
    writeRequests(requests);
    res.json(request);
  } else {
    res.status(404).json({ message: 'Request not found' });
  }
});

module.exports = router;
