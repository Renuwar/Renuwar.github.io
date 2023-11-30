// toggle class active navbar nav
const navbarNav = document.querySelector(".navbar-nav");
// ketika hmnu di klik
document.querySelector("#hmenu").onclick = () => {
  navbarNav.classList.toggle("active");
};
// klik dimana saja biar keluar dari hmenu
const hmnu = document.querySelector("#hmenu");

document.addEventListener("click", function (e) {
  if (!hmnu.contains(e.target) && !navbarNav.contains(e.target)) {
    navbarNav.classList.remove("active");
  }
});

document.addEventListener("DOMContentLoaded", function () {
  const classSelector = document.getElementById('classSelector');
  const table = document.getElementById('classTable');
  const form = document.getElementById('classForm');
  const newClassBtn = document.getElementById('newClassBtn');
  const deleteClassBtn = document.getElementById('deleteClassBtn');

  // Retrieve existing classes from local storage
  let classes = JSON.parse(localStorage.getItem('classes')) || {};

  // Populate class selector
  updateClassSelector();

  // Display the selected class schedule
  displayClassSchedule();

  // Handle class selection change
  classSelector.addEventListener('change', function () {
      displayClassSchedule();
  });

  // Handle form submission
  form.addEventListener('submit', function (event) {
      event.preventDefault();

      // Get form data
      const formData = {};
      const formElements = form.elements;
      for (let i = 0; i < formElements.length; i++) {
          if (formElements[i].type !== 'submit') {
              formData[formElements[i].name] = formElements[i].value;
          }
      }

      // Add new class to the selected class schedule
      const className = formData.className;
      if (!classes[className]) {
          classes[className] = [];
      }
      delete formData.className; // Remove className from the class schedule
      classes[className].push(formData);
      localStorage.setItem('classes', JSON.stringify(classes));

      // Display the updated class schedule
      displayClassSchedule();

      // Clear the form
      form.reset();
  });

  // Handle new class button click
  newClassBtn.addEventListener('click', function () {
      const className = prompt('Enter the name for the new class:');
      if (className) {
          classes[className] = [];
          localStorage.setItem('classes', JSON.stringify(classes));

          // Update the class selector and display the new class schedule
          updateClassSelector();
          classSelector.value = className;
          displayClassSchedule();
      }
  });

  // Handle delete class button click
  deleteClassBtn.addEventListener('click', function () {
      const selectedClass = classSelector.value;
      if (selectedClass) {
          if (confirm(`Are you sure you want to delete ${selectedClass}?`)) {
              delete classes[selectedClass];
              localStorage.setItem('classes', JSON.stringify(classes));

              // Update the class selector and display the default class schedule
              updateClassSelector();
              classSelector.value = Object.keys(classes)[0];
              displayClassSchedule();
          }
      } else {
          alert('Please select a class to delete.');
      }
  });

  // Function to populate class selector
  function updateClassSelector() {
      classSelector.innerHTML = '';

      Object.keys(classes).forEach((className, index) => {
          const option = document.createElement('option');
          option.value = className;
          option.textContent = `Class ${index + 1}: ${className}`;
          classSelector.appendChild(option);
      });
  }

  // Function to display the selected class schedule
  function displayClassSchedule() {
      const selectedClass = classSelector.value;
      const selectedSchedule = classes[selectedClass] || [];
      const selectedTable = generateClassTable(selectedSchedule);

      // Clear existing table content
      table.innerHTML = '';

      // Append new table content
      table.appendChild(selectedTable);
  }

  // Function to generate a table for a class schedule
  function generateClassTable(schedule) {
      const newTable = document.createElement('table');
      newTable.id = 'classTable';
      newTable.innerHTML = `
          <thead>
              <tr>
                  <th>Time</th>
                  <th>Monday</th>
                  <th>Tuesday</th>
                  <th>Wednesday</th>
                  <th>Thursday</th>
                  <th>Friday</th>
                  <th>Action</th>
              </tr>
          </thead>
          <tbody>
              <!-- Class schedule rows will be dynamically added here -->
          </tbody>
      `;

      const tbody = newTable.querySelector('tbody');
      schedule.forEach((classData, index) => {
          const row = createTableRow(classData, index);
          tbody.appendChild(row);
      });

      return newTable;
  }

  // Function to create a table row with delete button
  function createTableRow(classData, index) {
      const row = document.createElement('tr');

      Object.values(classData).forEach(value => {
          const cell = document.createElement('td');
          cell.textContent = value;
          row.appendChild(cell);
      });

      const deleteCell = document.createElement('td');
      const deleteButton = document.createElement('button');
      deleteButton.textContent = 'Delete';
      deleteButton.addEventListener('click', function () {
          // Remove the row from the table
          classes[classSelector.value].splice(index, 1);
          localStorage.setItem('classes', JSON.stringify(classes));

          // Display the updated class schedule
          displayClassSchedule();
      });

      deleteCell.appendChild(deleteButton);
      row.appendChild(deleteCell);

      return row;
  }
});