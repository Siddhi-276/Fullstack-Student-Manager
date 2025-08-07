const apiBase = "http://localhost:8080/api/students";
const studentTableBody = document.getElementById("studentTableBody");
const studentForm = document.getElementById("studentForm");
let currentEditId = null;

// Fetch and display all students
function fetchStudents() {
  fetch(apiBase)
    .then(res => res.json())
    .then(data => {
      studentTableBody.innerHTML = "";
      data.forEach(student => {
        const row = `
          <tr>
            <td>${student.id}</td>
            <td>${student.name}</td>
            <td>${student.email}</td>
            <td>
              <button class="edit-btn" onclick="openEditModal(${student.id}, '${student.name}', '${student.email}')">Edit</button>
              <button class="delete-btn" onclick="deleteStudent(${student.id})">Delete</button>
            </td>
          </tr>
        `;
        studentTableBody.innerHTML += row;
      });
    });
}

// Add student
studentForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;

  fetch(apiBase, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email }),
  }).then(res => {
    if (res.ok) {
      studentForm.reset();
      fetchStudents();
    } else {
      alert("Failed to add student.");
    }
  });
});

// Delete student
function deleteStudent(id) {
  fetch(`${apiBase}/${id}`, {
    method: "DELETE",
  }).then(res => {
    if (res.ok) {
      fetchStudents();
    } else {
      alert("Failed to delete student.");
    }
  });
}

// Open edit modal
function openEditModal(id, name, email) {
  currentEditId = id;
  document.getElementById("editName").value = name;
  document.getElementById("editEmail").value = email;
  document.getElementById("editModal").style.display = "block";
}

// Close modal
function closeEditModal() {
  document.getElementById("editModal").style.display = "none";
}

// Update student
function updateStudent() {
  const updatedName = document.getElementById("editName").value;
  const updatedEmail = document.getElementById("editEmail").value;

  fetch(`${apiBase}/${currentEditId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: updatedName,
      email: updatedEmail,
    }),
  }).then(res => {
    if (res.ok) {
      closeEditModal();
      fetchStudents();
    } else {
      alert("Failed to update student.");
    }
  });
}

// Initialize
fetchStudents();
