
// Initialize menu and sidebar navigation
const menuBtn = document.querySelector(".menu-btn");
const menu = document.querySelector(".sidebar");
const items = document.querySelectorAll(".item");
const getStartedBtn = document.querySelector(".cta-button");


// Toggle sidebar visibility when menu button is clicked
menuBtn.addEventListener("click", function () {

  menu.classList.toggle("visible");

});

getStartedBtn.addEventListener("click", function () {
    menu.classList.add("visible");
  });

items.forEach(item => {
    item.addEventListener("click", function () {
      items.forEach(i => i.classList.remove("active"));
      this.classList.add("active");
  
      // Hide all sections
      const sections = document.querySelectorAll(".content-section");
      sections.forEach(section => section.classList.remove("active"));
  
      // Show the section corresponding to the clicked item
      const target = this.getAttribute("data-target");
      const activeSection = document.getElementById(target);
      if (activeSection) {
        activeSection.classList.add("active");
      }
    });
  });

// Users section interactions
const addUserBtn = document.getElementById('addUserBtn');
const userModal = document.getElementById('userModal');
const closeModal = document.querySelector('.close-modal');
const userForm = document.getElementById('userForm');
const usersTableBody = document.querySelector("#usersTable tbody");
const noUsersRow = document.getElementById('noUsersRow');
const saveUserBtn = document.getElementById('saveUserBtn');
let editingUser = null;

let groups = JSON.parse(localStorage.getItem('groups')) || [];
let users = JSON.parse(localStorage.getItem('users')) || [];
let roles = JSON.parse(localStorage.getItem('roles')) || [];

// Load users from local storage and initialize table
function loadUsers() {
  const users = JSON.parse(localStorage.getItem('users')) || [];
  usersTableBody.innerHTML = ''; // Clear existing rows
  users.forEach(user => addUserRow(user));
  // Update noUsersRow visibility
  noUsersRow.style.display = users.length === 0 ? '' : 'none'; // Show or hide "No Users" row based on user count
}

loadUsers(); 
// Add a user row to the table
function addUserRow(user) {
  const row = document.createElement('tr');
  row.dataset.username = user.username; // Set the username as a data attribute
  row.innerHTML = `
    <td class="sno">${usersTableBody.children.length + 1}</td>
    <td>${user.username}</td>
    <td>${user.firstName}</td>
    <td>${user.lastName}</td>
    <td>${user.email}</td>
    <td>
      <button class="edit-btn">Edit</button>
      <button class="delete-btn">Delete</button>
    </td>
  `;
  usersTableBody.appendChild(row);

  // Attach listeners to edit and delete buttons
  row.querySelector('.edit-btn').addEventListener('click', function () {
    editUser(user.username);
  });
  row.querySelector('.delete-btn').addEventListener('click', function () {
    deleteUser(user.username);
  });
}

// Show modal for adding a user
addUserBtn.addEventListener('click', function () {
  userModal.style.display = 'block';
  editingUser = null;
  document.getElementById('modalTitle').textContent = 'Add User';
  userForm.reset();
  saveUserBtn.style.display = 'block'; // Show Save button
});

// Close modal  
closeModal.addEventListener('click', function () {
  userModal.style.display = 'none';
});

window.onclick = function (event) {
  if (event.target == userModal) {
    userModal.style.display = 'none';
  }
};

// Handle form submission
userForm.addEventListener('submit', function (event) {
  event.preventDefault();
  const username = document.getElementById('username').value.trim();
  const firstName = document.getElementById('firstName').value.trim();
  const lastName = document.getElementById('lastName').value.trim();
  const email = document.getElementById('email').value.trim();

  let users = JSON.parse(localStorage.getItem('users')) || [];

  if (editingUser) {
    // Update existing user
    users = users.map(user => user.username === editingUser.username ? { username, firstName, lastName, email } : user);
    localStorage.setItem('users', JSON.stringify(users));
    loadUsers();
    showToast('User updated successfully');
  } else {
    // Add new user
    if (users.some(user => user.username === username)) {
      alert('Username already exists!');
      return;
    }
    users.push({ username, firstName, lastName, email });
    localStorage.setItem('users', JSON.stringify(users));
    addUserRow({ username, firstName, lastName, email });
    showToast('User added successfully');
    populateUserSelect();
  }

  noUsersRow.style.display = users.length === 0 ? '' : 'none'; // Update visibility
  userModal.style.display = 'none';
});

// Edit user
function editUser(username) {
  const users = JSON.parse(localStorage.getItem('users')) || [];
  const user = users.find(user => user.username === username);
  if (user) {
    editingUser = user;
    document.getElementById('username').value = user.username;
    document.getElementById('firstName').value = user.firstName;
    document.getElementById('lastName').value = user.lastName;
    document.getElementById('email').value = user.email;

    document.getElementById('modalTitle').textContent = 'Edit User';
    saveUserBtn.style.display = 'block'; // Show Save button
    userModal.style.display = 'block'; // Show the modal
  }
}

// Delete user
function deleteUser(username) {
    let users = JSON.parse(localStorage.getItem('users')) || [];
    users = users.filter(user => user.username !== username);
    localStorage.setItem('users', JSON.stringify(users));

    // Remove user from all groups
    groups.forEach(group => {
        group.users = group.users.filter(user => user !== username);
    });
    localStorage.setItem('groups', JSON.stringify(groups));

    roles.forEach(role => {
        role.users = role.users.filter(user => user !== username);
    });
    localStorage.setItem('roles', JSON.stringify(roles));

    loadUsers(); 
    displayGroups(); 
    populateAddUserTable(); 
    populateRemoveUserTable();

    displayRoles(); 
    showToast('User deleted successfully');

}


// Update serial numbers
// function updateSerialNumbers() {
//   const rows = usersTableBody.querySelectorAll('tr');
//   rows.forEach((row, index) => {
//     row.querySelector('.sno').textContent = index + 1;
//   });
// }

// Display toast messages
function showToast(message) {
  const toast = document.createElement('div');
  toast.className = 'toast-message';
  toast.textContent = message;
  document.body.appendChild(toast);
  setTimeout(function () {
    toast.classList.add('show');
  }, 10);
  setTimeout(function () {
    toast.classList.remove('show');
    document.body.removeChild(toast);
  }, 3000);
}

// // Initialize table on page load
// window.onload = function () {
//   loadUsers();
// };

//-------------------------------groups-----------------------------------

const groupsTableBody = document.getElementById('groupsTableBody');
const groupNameInput = document.getElementById('groupNameInput');
const createGroupBtn = document.getElementById('createGroupBtn');
const addUserModal = document.getElementById('addUserModal');
const viewUsersModal = document.getElementById('viewUsersModal');
const removeUserModal = document.getElementById('removeUserModal');
const saveUsersBtn = document.getElementById('saveUsersBtn');
const removeUsersBtn = document.getElementById('removeUsersBtn');
const closeAddUserModal = document.querySelector('#addUserModal .close-modal');
const closeViewUsersModal = document.querySelector('#viewUsersModal .close-modal');
const closeRemoveUserModal = document.querySelector('#removeUserModal .close-modal');
let selectedGroupName = null;

displayGroups();

function displayGroups() {
    groupsTableBody.innerHTML = '';
    groups.forEach(group => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${group.name}</td>
            <td>
                <button class="view-users-btn" data-group="${group.name}">View Users</button>
                <button class="add-user-btn" data-group="${group.name}">Add User</button>
                <button class="remove-user-btn" data-group="${group.name}">Remove User</button>
                <button class="delete-group-btn" data-group="${group.name}">Delete Group</button>
            </td>
        `;
        groupsTableBody.appendChild(row);
    });
}

function populateAddUserTable() {
    const addUserTableBody = document.getElementById('addUserTableBody');
    addUserTableBody.innerHTML = '';
    users = JSON.parse(localStorage.getItem('users')) || []; // Ensure the latest user list is used
    users.forEach(user => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${user.username}</td>
            <td><input type="checkbox" name="users" value="${user.username}"></td>
        `;
        addUserTableBody.appendChild(row);
    });
}

function populateRemoveUserTable() {
    const removeUserTableBody = document.getElementById('removeUserTableBody');
    removeUserTableBody.innerHTML = '';
    const group = groups.find(g => g.name === selectedGroupName);
    if (group) {
        group.users.forEach(username => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${username}</td>
                <td><input type="checkbox" name="users" value="${username}"></td>
            `;
            removeUserTableBody.appendChild(row);
        });
    }
}

function displayGroupUsers(groupName) {
    const group = groups.find(g => g.name === groupName);
    const viewUsersList = document.getElementById('viewUsersList');
    viewUsersList.innerHTML = '';
    if (group && group.users.length > 0) {
        group.users.forEach(username => {
            const li = document.createElement('li');
            li.textContent = username;
            viewUsersList.appendChild(li);
        });
    } else {
        viewUsersList.innerHTML = '<li>No users in this group</li>';
    }
}

function addGroup(name) {
    if (groups.some(group => group.name === name)) {
      alert("Group name must be unique.");
        return;
    }
    groups.push({ name, users: [] });
    localStorage.setItem('groups', JSON.stringify(groups));
    displayGroups();
    populateGroupSelect();
    showToast("Group created successfully!");
}

function removeGroup(name) {
    const index = groups.findIndex(g => g.name === name);
    if (index !== -1) {
        groups.splice(index, 1);
        localStorage.setItem('groups', JSON.stringify(groups));
        displayGroups();
    }
}

function addUserToGroup(username) {
    const group = groups.find(g => g.name === selectedGroupName);
    if (group && !group.users.includes(username)) {
        group.users.push(username);
        localStorage.setItem('groups', JSON.stringify(groups));
        displayGroupUsers(selectedGroupName); // Refresh displayed users
        showToast("User added to group successfully!");
    }
}

function removeUserFromGroup(username) {
    const group = groups.find(g => g.name === selectedGroupName);
    if (group) {
        group.users = group.users.filter(user => user !== username);
        localStorage.setItem('groups', JSON.stringify(groups));
        displayGroupUsers(selectedGroupName); // Refresh displayed users
        showToast("User removed from group successfully!");
    }
}

// Event Handlers
createGroupBtn.addEventListener('click', () => {
    const groupName = groupNameInput.value.trim();
    if (groupName) {
        addGroup(groupName);
        groupNameInput.value = '';
    }
});

groupsTableBody.addEventListener('click', (event) => {
    const button = event.target;
    const groupName = button.getAttribute('data-group');
    selectedGroupName = groupName;

    if (button.classList.contains('view-users-btn')) {
        displayGroupUsers(groupName);
        viewUsersModal.showModal();
    } else if (button.classList.contains('add-user-btn')) {
        populateAddUserTable();
        addUserModal.showModal();
    } else if (button.classList.contains('remove-user-btn')) {
        populateRemoveUserTable();
        removeUserModal.showModal();
    } else if (button.classList.contains('delete-group-btn')) {
        if (confirm(`Are you sure you want to delete the group '${groupName}'?`)) {
            removeGroup(groupName);
        }
    }
});

saveUsersBtn.addEventListener('click', () => {
    const checkboxes = document.querySelectorAll('#addUserModal input[type="checkbox"]');
    checkboxes.forEach(checkbox => {
        if (checkbox.checked) {
            addUserToGroup(checkbox.value);
        }
    });
    addUserModal.close();
    displayGroupUsers(selectedGroupName);
});

removeUsersBtn.addEventListener('click', () => {
    const checkboxes = document.querySelectorAll('#removeUserModal input[type="checkbox"]');
    checkboxes.forEach(checkbox => {
        if (checkbox.checked) {
            removeUserFromGroup(checkbox.value);
        }
    });
    removeUserModal.close();
    displayGroupUsers(selectedGroupName);
});

closeAddUserModal.addEventListener('click', () => {
    addUserModal.close();
});

closeViewUsersModal.addEventListener('click', () => {
    viewUsersModal.close();
});

closeRemoveUserModal.addEventListener('click', () => {
    removeUserModal.close();
});

//---------------------------Roles---------------------------------------


const createRoleForm = document.getElementById('createRoleForm');
const roleNameInput = document.getElementById('roleNameInput');
const roleDescriptionInput = document.getElementById('roleDescriptionInput');
const rolesTableBody = document.getElementById('rolesTableBody');
const roleSuccessMessage = document.getElementById('roleSuccessMessage');
const roleSelectForUser = document.getElementById('roleSelectForUser');
const userSelectForRole = document.getElementById('userSelectForRole');
const roleSelectForGroup = document.getElementById('roleSelectForGroup');
const groupSelectForRole = document.getElementById('groupSelectForRole');
const viewRoleAssignmentsBtn = document.getElementById('viewRoleAssignmentsBtn');
const roleSelectForView = document.getElementById('roleSelectForView');
const roleAssignmentsTableBody = document.getElementById('roleAssignmentsTableBody');
const roleAssignmentSuccessMessage = document.getElementById('roleAssignmentSuccessMessage');
const groupAssignmentSuccessMessage = document.getElementById('groupAssignmentSuccessMessage');

function displayRoles(rolesToDisplay = roles) {
    rolesTableBody.innerHTML = '';
    rolesToDisplay.forEach(role => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${role.name}</td>
            <td>${role.description}</td>
        `;
        rolesTableBody.appendChild(row);
    });
    populateRoleSelects();
}
function populateRoleSelects() {
    const roleOptions = roles.map(role => `<option value="${role.name}">${role.name}</option>`).join('');
    roleSelectForUser.innerHTML = roleOptions;
    roleSelectForGroup.innerHTML = roleOptions;
    roleSelectForView.innerHTML = roleOptions;
}

function populateUserSelect() {
    let users= JSON.parse(localStorage.getItem('users')) || [];

    const userOptions = users.map(user => `<option value="${user.username}">${user.username}</option>`).join('');
    userSelectForRole.innerHTML = userOptions;
}

function populateGroupSelect() {
    let groups = JSON.parse(localStorage.getItem('groups')) || [];
    console.log("check",groups); 
    const groupOptions = groups.map(group => `<option value="${group.name}">${group.name}</option>`).join('');
    groupSelectForRole.innerHTML = groupOptions;
}

function addRole(name, description) {
    roles.push({ name, description, users: [], groups: [] });
    localStorage.setItem('roles', JSON.stringify(roles));
    displayRoles();
    roleSuccessMessage.textContent = 'Role created successfully!';
}

function assignRolesToUsers(roleName, selectedUsers) {
    const role = roles.find(r => r.name === roleName);
    if (role) {
        selectedUsers.forEach(username => {
            if (!role.users.includes(username)) {
                role.users.push(username);
            }
        });
        localStorage.setItem('roles', JSON.stringify(roles));
        showToast('Roles assigned to users successfully!')
        roleAssignmentSuccessMessage.textContent = 'Roles assigned to users successfully!';
        showToast('Roles assigned to users successfully!')
    }
}

function assignRolesToGroups(roleName, selectedGroups) {
    const role = roles.find(r => r.name === roleName);
    if (role) {
        selectedGroups.forEach(groupName => {
            if (!role.groups.includes(groupName)) {
                role.groups.push(groupName);
            }
        });
        localStorage.setItem('roles', JSON.stringify(roles));
        groupAssignmentSuccessMessage.textContent = 'Roles assigned to groups successfully!';
        showToast('Roles assigned to groups successfully!')
    }
}

function displayRoleAssignments(roleName) {
  
    const role = roles.find(r => r.name === roleName);
    if (role) {
        roleAssignmentsTableBody.innerHTML = '';
        role.users.forEach(user => {
            const row = document.createElement('tr');
            row.innerHTML = `<td>User</td><td>${user}</td>`;
            roleAssignmentsTableBody.appendChild(row);
        });
        role.groups.forEach(group => {
            const row = document.createElement('tr');
            row.innerHTML = `<td>Group</td><td>${group}</td>`;
            roleAssignmentsTableBody.appendChild(row);
        });
    }
}

createRoleForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const roleName = roleNameInput.value.trim();
    const roleDescription = roleDescriptionInput.value.trim();
    if (roleName && roleDescription) {
        addRole(roleName, roleDescription);
        roleNameInput.value = '';
        roleDescriptionInput.value = '';
    }
});

document.getElementById('assignRolesToUsersForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const roleName = roleSelectForUser.value;
    const selectedUsers = Array.from(userSelectForRole.selectedOptions).map(option => option.value);
    if (roleName && selectedUsers.length) {
        assignRolesToUsers(roleName, selectedUsers);
    }
});

document.getElementById('assignRolesToGroupsForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const roleName = roleSelectForGroup.value;
    const selectedGroups = Array.from(groupSelectForRole.selectedOptions).map(option => option.value);
    if (roleName && selectedGroups.length) {
        assignRolesToGroups(roleName, selectedGroups);
    }
});

viewRoleAssignmentsBtn.addEventListener('click', () => {
    
    const roleName = roleSelectForView.value;
    if (roleName) {
        displayRoleAssignments(roleName);
    }
});

document.getElementById('searchRolesBtn').addEventListener('click', () => {
  const searchTerm = document.getElementById('searchRolesInput').value.toLowerCase();
  const filteredRoles = roles.filter(role => role.name.toLowerCase().includes(searchTerm));
  displayRoles(filteredRoles);
});

document.getElementById('sortRolesBtn').addEventListener('click', () => {
  const sortedRoles = [...roles].sort((a, b) => b.name.localeCompare(a.name));
  displayRoles(sortedRoles);
});

document.getElementById('filterRolesBtn').addEventListener('click', () => {
  const sortedRoles = [...roles].sort((a, b) => a.name.localeCompare(b.name));
  displayRoles(sortedRoles);
});

displayRoles();
populateUserSelect();
    populateGroupSelect();


module.exports = {addUserRow,loadUsers,addGroup,populateAddUserTable,populateRemoveUserTable,displayRoleAssignments,displayRoles}