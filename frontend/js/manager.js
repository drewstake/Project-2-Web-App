// frontend/js/manager.js
document.addEventListener('DOMContentLoaded', fetchTenants);

document.getElementById('addTenantForm').addEventListener('submit', function(e) {
  e.preventDefault();

  const name = document.getElementById('name').value;
  const phone = document.getElementById('phone').value;
  const email = document.getElementById('email').value;
  const checkIn = document.getElementById('checkIn').value;
  const checkOut = document.getElementById('checkOut').value;
  const apartmentNumber = document.getElementById('apartmentNumber').value;

  const tenantData = {
    name,
    phone,
    email,
    checkIn,
    checkOut,
    apartmentNumber
  };

  fetch('http://localhost:3000/api/tenants', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(tenantData)
  })
  .then(response => response.json())
  .then(data => {
    alert('Tenant added successfully!');
    document.getElementById('addTenantForm').reset();
    fetchTenants();
  })
  .catch(error => {
    console.error('Error:', error);
    alert('There was an error adding the tenant.');
  });
});

function fetchTenants() {
  fetch('http://localhost:3000/api/tenants')
    .then(response => response.json())
    .then(data => populateTable(data))
    .catch(error => console.error('Error:', error));
}

function populateTable(tenants) {
  const tbody = document.getElementById('tenantsTable').getElementsByTagName('tbody')[0];
  tbody.innerHTML = '';

  tenants.forEach(tenant => {
    const row = tbody.insertRow();

    row.insertCell(0).innerText = tenant.id;
    row.insertCell(1).innerText = tenant.name;
    row.insertCell(2).innerText = tenant.phone;
    row.insertCell(3).innerText = tenant.email;
    row.insertCell(4).innerText = tenant.checkIn;
    row.insertCell(5).innerText = tenant.checkOut || '-';
    row.insertCell(6).innerText = tenant.apartmentNumber;

    const actionsCell = row.insertCell(7);

    // Move Tenant Button
    const moveBtn = document.createElement('button');
    moveBtn.innerText = 'Move';
    moveBtn.addEventListener('click', () => moveTenant(tenant.id));
    actionsCell.appendChild(moveBtn);

    // Delete Tenant Button
    const deleteBtn = document.createElement('button');
    deleteBtn.innerText = 'Delete';
    deleteBtn.style.marginLeft = '10px';
    deleteBtn.addEventListener('click', () => deleteTenant(tenant.id));
    actionsCell.appendChild(deleteBtn);
  });
}

function moveTenant(id) {
  const newApartment = prompt('Enter new apartment number:');
  if (newApartment) {
    fetch(`http://localhost:3000/api/tenants/${id}/move`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ apartmentNumber: newApartment })
    })
    .then(response => response.json())
    .then(data => {
      alert(`Tenant moved to apartment ${data.apartmentNumber}`);
      fetchTenants();
    })
    .catch(error => {
      console.error('Error:', error);
      alert('There was an error moving the tenant.');
    });
  }
}

function deleteTenant(id) {
  if (confirm('Are you sure you want to delete this tenant?')) {
    fetch(`http://localhost:3000/api/tenants/${id}`, {
      method: 'DELETE'
    })
    .then(response => response.json())
    .then(data => {
      alert('Tenant deleted successfully.');
      fetchTenants();
    })
    .catch(error => {
      console.error('Error:', error);
      alert('There was an error deleting the tenant.');
    });
  }
}
