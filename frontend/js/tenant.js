document.getElementById('requestForm').addEventListener('submit', function(e) {
    e.preventDefault();
  
    const apartmentNumber = document.getElementById('apartmentNumber').value;
    const area = document.getElementById('area').value;
    const description = document.getElementById('description').value;
    const photoInput = document.getElementById('photo');
    let photo = null;
  
    if (photoInput.files.length > 0) {
      const reader = new FileReader();
      reader.onload = function() {
        photo = reader.result;
  
        submitRequest(apartmentNumber, area, description, photo);
      };
      reader.readAsDataURL(photoInput.files[0]);
    } else {
      submitRequest(apartmentNumber, area, description, photo);
    }
  });
  
  function submitRequest(apartmentNumber, area, description, photo) {
    const requestData = {
      apartmentNumber,
      area,
      description,
      photo
    };
  
    fetch('http://localhost:3000/api/requests', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestData)
    })
    .then(response => response.json())
    .then(data => {
      alert('Maintenance request submitted successfully!');
      document.getElementById('requestForm').reset();
    })
    .catch(error => {
      console.error('Error:', error);
      alert('There was an error submitting your request.');
    });
  }
  