document.addEventListener('DOMContentLoaded', () => {
    const table = document.getElementById('peopleTable');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const dialog = document.getElementById('personDetailDialog');
    const detailImage = document.getElementById('detailImage');
    const detailName = document.getElementById('detailName');
    const detailEmail = document.getElementById('detailEmail');
    const detailAddress = document.getElementById('detailAddress');
    const detailPhone = document.getElementById('detailPhone');
    const closeBtn = document.getElementById('closeBtn');
  
    let currentPage = 1;
    let data = [];
  
    function fetchData(page) {
      const url = `https://randomuser.me/api/?page=${page}&results=10&seed=abc`;
  
      return fetch(url)
        .then(response => {
          if (!response.ok) {
            throw new Error(`Error fetching data: ${response.status} ${response.statusText}`);
          }
          return response.json();
        })
        .catch(error => {
          console.error('Error:', error);
          throw error;
        });
    }
  
    function populateTable(results) {
      data = results;
      table.innerHTML = `
        <tr>
          <th>Name</th>
          <th>Email</th>
          <th>Thumbnail</th>
        </tr>
      `;
      results.forEach((person, index) => {
        const { name, email, picture } = person;
        const fullName = `${name.first} ${name.last}`;
        const thumbnail = `<img src="${picture.thumbnail}" alt="${fullName}">`;
  
        const row = document.createElement('tr');
        row.innerHTML = `
          <td>${fullName}</td>
          <td>${email}</td>
          <td>${thumbnail}</td>
        `;
        row.dataset.index = index;
        table.appendChild(row);
      });
    }
  
    function showPersonDetails(person) {
      const { name, email, picture, location, phone } = person;
      const fullName = `${name.first} ${name.last}`;
  
      detailImage.src = picture.large;
      detailName.textContent = fullName;
      detailEmail.textContent = email;
  
      const address = `${location.street.name} ${location.street.number}, ${location.city}, ${location.state}, ${location.country}`;
      detailAddress.textContent = address;
  
      detailPhone.textContent = phone;
    }
  
    function hideDetailsDialog() {
      dialog.classList.add('hidden');
    }
  
    function showDetailsDialog(person) {
      showPersonDetails(person);
      dialog.classList.remove('hidden');
    }
  
    table.addEventListener('click', event => {
      const targetRow = event.target.closest('tr');
      if (targetRow) {
        const personIndex = targetRow.dataset.index;
        const selectedPerson = data[personIndex];
        showDetailsDialog(selectedPerson);
      }
    });
  
    prevBtn.addEventListener('click', () => {
      currentPage = Math.max(currentPage - 1, 1);
      showPage(currentPage);
    });
  
    nextBtn.addEventListener('click', () => {
      currentPage++;
      showPage(currentPage);
    });
  
    closeBtn.addEventListener('click', hideDetailsDialog);
  
    function showPage(page) {
      fetchData(page)
        .then(response => {
          populateTable(response.results);
        })
        .catch(error => {
          console.error('Error fetching data:', error);
        });
    }
  
    showPage(currentPage);
  });
  