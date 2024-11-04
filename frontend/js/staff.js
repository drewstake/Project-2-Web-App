document.addEventListener('DOMContentLoaded', fetchRequests);

document.getElementById('filterBtn').addEventListener('click', fetchRequests);
document.getElementById('resetBtn').addEventListener('click', resetFilters);

function fetchRequests() {
  const apartmentNumber = document.getElementById('filterApartment').value;
  const area = document.getElementById('filterArea').value;
  const status = document.getElementById('filterStatus').value;
  const startDate = document.getElementById('startDate').value;
  const endDate = document.getElementById('endDate').value;

  let query = [];

  if (apartmentNumber) query.push(`apartmentNumber=${apartmentNumber}`);
  if (area) query.push(`area=${area}`);
  if (status) query.push(`status=${status}`);
  if (startDate && endDate) query.push(`startDate=${startDate}&endDate=${endDate}`);

  const queryString = query.length ? `?${query.join('&')}` : '';

  fetch(`http://localhost:3000/api/requests${queryString}`)
    .then(response => response.json())
    .then(data => populateTable(data))
    .catch(error => console.error('Error:', error));
}

function populateTable(requests) {
  const tbody = document.getElementById('requestsTable').getElementsByTagName('tbody')[0];
  tbody.innerHTML = '';

  requests.forEach(request => {
    const row = tbody.insertRow();

    row.insertCell(0).innerText = request.id;
    row.insertCell(1).innerText = request.apartmentNumber;
    row.insertCell(2).innerText = request.area;
    row.insertCell(3).innerText = request.description;
    row.insertCell(4).innerText = new Date(request.dateTime).toLocaleString();
    
    const photoCell = row.insertCell(5);
    if (request.photo) {
      const img = document.createElement('img');
      img.src = request.photo;
      img.width = 100;
      photoCell.appendChild(img);
    } else {
      photoCell.innerText = 'No Photo';
    }

    row.insertCell(6).innerText = request.status;

    const actionCell = row.insertCell(7);
    if (request.status.toLowerCase() === 'pending') {
      const completeBtn = document.createElement('button');
      completeBtn.innerText = 'Mark as Completed';
      completeBtn.addEventListener('click', () => updateStatus(request.id));
      actionCell.appendChild(completeBtn);
    } else {
      actionCell.innerText = '-';
    }
  });
}

function updateStatus(id) {
  fetch(`http://localhost:3000/api/requests/${id}/status`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ status: 'completed' })
  })
  .then(response => response.json())
  .then(data => {
    alert(`Request ${id} marked as completed.`);
    fetchRequests();
  })
  .catch(error => {
    console.error('Error:', error);
    alert('There was an error updating the status.');
  });
}

function resetFilters() {
  document.getElementById('filterApartment').value = '';
  document.getElementById('filterArea').value = '';
  document.getElementById('filterStatus').value = '';
  document.getElementById('startDate').value = '';
  document.getElementById('endDate').value = '';
  fetchRequests();
}
