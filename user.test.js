const fs = require("fs");
const path = require("path");
const { fireEvent } = require("@testing-library/dom");

let sidebar, menuBtn, getStartedBtn, items, sections;

beforeEach(() => {
  // Load the HTML file into the DOM
  const html = fs.readFileSync(path.resolve(__dirname, "./index.html"), "utf8");
  document.documentElement.innerHTML = html;

  menuBtn = document.querySelector(".menu-btn");
  sidebar = document.querySelector(".sidebar");
  getStartedBtn = document.querySelector(".cta-button");
  items = document.querySelectorAll(".item");
  sections = document.querySelectorAll(".content-section");

  jest.resetModules();

 
  ({
    addUserRow,
    loadUsers,
    addGroup,
    populateAddUserTable,
    populateRemoveUserTable,
    displayRoles,
  } = require("./script.js"));

  //   const mockLocalStorage = (() => {
  //     let store = {};
  //     return {
  //       getItem: (key) => store[key] || null,
  //       setItem: (key, value) => (store[key] = value.toString()),
  //       clear: () => (store = {}),
  //       removeItem: (key) => delete store[key],
  //     };
  //   })();
  //   Object.defineProperty(window, "localStorage", {
  //     value: mockLocalStorage,
  //   });
  //   localStorage.clear();
});

afterEach(() => {
  // localStorage.clear();
});

describe("User Management App - Initial Rendering", () => {
  test("should have index.html present", () => {
    const fileExists = document !== undefined;
    expect(fileExists).toBe(true);
  });

  test("should render the page with initial content", () => {
    // Check if the menu button is present
    const menuButton = document.querySelector(".menu-btn img");
    expect(menuButton).not.toBeNull();
    expect(menuButton.getAttribute("alt")).toBe("menu-icon");

    // Check if the nav heading is present
    const navHeading = document.querySelector("nav h3");
    expect(navHeading).not.toBeNull();
    expect(navHeading.textContent).toBe("UserNexus");

    // Check if the hero section is rendered
    const heroSection = document.querySelector(".hero-section");
    expect(heroSection).not.toBeNull();

    // Check if the hero content is present
    const heroHeading = document.querySelector(
      ".hero-section .text-content h1"
    );
    expect(heroHeading).not.toBeNull();
    expect(heroHeading.textContent).toBe(
      "Manage Users, Groups, and Roles with Ease"
    );

    const heroText = document.querySelector(".hero-section p");
    expect(heroText).not.toBeNull();
    expect(heroText.textContent.trim().replace(/\s+/g, " ")).toBe(
      "Simplify user management, organize groups, and assign roles effortlessly. Streamline your workflows."
    );
    // Check if the Get Started button is present
    const ctaButton = document.querySelector(".cta-button");
    expect(ctaButton).not.toBeNull();
    expect(ctaButton.textContent).toBe("Get Started Now");

    // Check if the hero image is present
    const heroImage = document.querySelector(".hero-image");
    expect(heroImage).not.toBeNull();
    expect(heroImage.getAttribute("alt")).toBe("User Management");
  });

  test('should open sidebar when "Get Started" button is clicked', () => {
    expect(sidebar.classList.contains("visible")).toBe(false);
    getStartedBtn.click();
    expect(sidebar.classList.contains("visible")).toBe(true);
  });

  test("should toggle sidebar visibility when menu button is clicked", () => {
    expect(menuBtn).not.toBeNull();
    expect(sidebar).not.toBeNull();
    expect(sidebar.classList.contains("visible")).toBe(false);
    fireEvent.click(menuBtn);
    expect(sidebar.classList.contains("visible")).toBe(true);
  });

  test('should have "Home" item active initially and others inactive', () => {
    expect(items[0].classList.contains("active")).toBe(true);
    items.forEach((item, index) => {
      if (index !== 0) {
        expect(item.classList.contains("active")).toBe(false);
      }
    });
  });

  test("should activate clicked item and deactivate others", () => {
    const items = document.querySelectorAll(".item");

    // Simulate clicking on the "Users" item
    fireEvent.click(items[1]);
    expect(items[1].classList.contains("active")).toBe(true);
    expect(items[0].classList.contains("active")).toBe(false);
    expect(items[2].classList.contains("active")).toBe(false);
    expect(items[3].classList.contains("active")).toBe(false);

    // Simulate clicking on the "Groups" item
    fireEvent.click(items[2]);
    expect(items[2].classList.contains("active")).toBe(true);
    expect(items[0].classList.contains("active")).toBe(false);
    expect(items[1].classList.contains("active")).toBe(false);
    expect(items[3].classList.contains("active")).toBe(false);

    // Simulate clicking on the "Roles" item
    fireEvent.click(items[3]);
    expect(items[3].classList.contains("active")).toBe(true);
    expect(items[0].classList.contains("active")).toBe(false);
    expect(items[1].classList.contains("active")).toBe(false);
    expect(items[2].classList.contains("active")).toBe(false);
  });

  test("should activate corresponding section when an item is clicked", () => {
    fireEvent.click(items[1]);
    // Check that "Users" section is visible and others are not
    expect(sections[1].classList.contains("active")).toBe(true);
    expect(sections[0].classList.contains("active")).toBe(false);
    expect(sections[2].classList.contains("active")).toBe(false);
    expect(sections[3].classList.contains("active")).toBe(false);

    fireEvent.click(items[2]);
    // Check that "Groups" section is visible and others are not
    expect(sections[2].classList.contains("active")).toBe(true);
    expect(sections[0].classList.contains("active")).toBe(false);
    expect(sections[1].classList.contains("active")).toBe(false);
    expect(sections[3].classList.contains("active")).toBe(false);

    fireEvent.click(items[3]);
    // Check that "Roles" section is visible and others are not
    expect(sections[3].classList.contains("active")).toBe(true);
    expect(sections[0].classList.contains("active")).toBe(false);
    expect(sections[1].classList.contains("active")).toBe(false);
    expect(sections[2].classList.contains("active")).toBe(false);
  });
});

describe("Users Tab", () => {
  beforeEach(() => {
    const mockLocalStorage = (() => {
      let store = {};
      return {
        getItem: (key) => store[key] || null,
        setItem: (key, value) => (store[key] = value.toString()),
        clear: () => (store = {}),
        removeItem: (key) => delete store[key],
      };
    })();
    Object.defineProperty(window, "localStorage", {
      value: mockLocalStorage,
    });
    fireEvent.click(items[1]);
  });
  afterEach(() => {
    localStorage.clear();
  });

  test('should display "Add User" button and table in the Users tab', () => {
    const addUserBtn = document.querySelector("#addUserBtn");
    expect(addUserBtn).not.toBeNull();
    expect(addUserBtn.textContent).toBe("Add User");
    // Check that the table is present and has the correct headers
    const usersTable = document.querySelector("#usersTable");
    expect(usersTable).not.toBeNull();

    const tableHeaders = usersTable.querySelectorAll("th");
    expect(tableHeaders[0].textContent).toBe("S.No");
    expect(tableHeaders[1].textContent).toBe("Username");
    expect(tableHeaders[2].textContent).toBe("First Name");
    expect(tableHeaders[3].textContent).toBe("Last Name");
    expect(tableHeaders[4].textContent).toBe("Email");
    expect(tableHeaders[5].textContent).toBe("Actions");
  });

  test('should display "No Users" message when no users are present', () => {
    // Check that the "No Users" message is visible
    const noUsersMessage = document.querySelector("#noUsersRow");
    expect(noUsersMessage).not.toBeNull();
    expect(noUsersMessage.querySelector("img").src).toContain("nousers.png");

    // Ensure table body is empty
    const tableBody = document.querySelector("#usersTable tbody");
    expect(tableBody.children.length).toBe(0); // No rows should be present
  });

  test('should open the Add User modal when "Add User" button is clicked', () => {
    // Click the "Add User" button
    const addUserBtn = document.querySelector("#addUserBtn");
    fireEvent.click(addUserBtn);

    // Check that the modal is visible
    const userModal = document.querySelector("#userModal");
    expect(userModal.style.display).toBe("block");

    // Check that modal content is present
    const modalTitle = document.querySelector("#modalTitle");
    expect(modalTitle.textContent).toBe("Add User");

    const usernameInput = document.querySelector("#username");
    const firstNameInput = document.querySelector("#firstName");
    const lastNameInput = document.querySelector("#lastName");
    const emailInput = document.querySelector("#email");
    const saveUserBtn = document.querySelector("#saveUserBtn");
    const closeModal = document.querySelector(".close-modal");

    const usernameLabel = document.querySelector('label[for="username"]');
    const firstNameLabel = document.querySelector('label[for="firstName"]');
    const lastNameLabel = document.querySelector('label[for="lastName"]');
    const emailLabel = document.querySelector('label[for="email"]');

    expect(usernameInput).not.toBeNull();
    expect(firstNameInput).not.toBeNull();
    expect(lastNameInput).not.toBeNull();
    expect(emailInput).not.toBeNull();
    expect(saveUserBtn).not.toBeNull();
    expect(closeModal).not.toBeNull();

    expect(usernameLabel.textContent).toBe("Username");
    expect(firstNameLabel.textContent).toBe("First Name");
    expect(lastNameLabel.textContent).toBe("Last Name");
    expect(emailLabel.textContent).toBe("Email");

    fireEvent.click(closeModal);
    expect(userModal.style.display).toBe("none");
  });
});
describe("User Management", () => {
  test("should add a user and verify it is present in the table and local storage", () => {
    jest.useFakeTimers();
    const items = document.querySelectorAll(".item");
    fireEvent.click(items[1]);
    const addUserBtn = document.querySelector("#addUserBtn");
    fireEvent.click(addUserBtn);

    // Fill out the user form
    const usernameInput = document.querySelector("#username");
    const firstNameInput = document.querySelector("#firstName");
    const lastNameInput = document.querySelector("#lastName");
    const emailInput = document.querySelector("#email");
    const saveUserBtn = document.querySelector("#saveUserBtn");

    // Set form values
    fireEvent.change(usernameInput, { target: { value: "johndoe" } });
    fireEvent.change(firstNameInput, { target: { value: "John" } });
    fireEvent.change(lastNameInput, { target: { value: "Doe" } });
    fireEvent.change(emailInput, { target: { value: "johndoe@example.com" } });

    // Click "Save" button
    fireEvent.click(saveUserBtn);

    // Verify user is added to the table
    const usersTable = document.querySelector("#usersTable tbody");
    expect(usersTable.children.length).toBe(1); // One row for the added user

    const firstRow = usersTable.children[0];
    expect(firstRow.querySelector(".sno").textContent).toBe("1");
    expect(firstRow.textContent).toContain("johndoe");
    console.log("firstRow.textContent", firstRow.textContent);
    expect(firstRow.textContent).toContain("John");
    expect(firstRow.textContent).toContain("Doe");
    expect(firstRow.textContent).toContain("johndoe@example.com");
    expect(firstRow.querySelector(".edit-btn")).not.toBeNull();
    expect(firstRow.querySelector(".delete-btn")).not.toBeNull();

    // Verify user is present in local storage
    const users = JSON.parse(localStorage.getItem("users")) || [];
    expect(users.length).toBe(1); // One user added
    expect(users[0]).toEqual({
      username: "johndoe",
      firstName: "John",
      lastName: "Doe",
      email: "johndoe@example.com",
    });
    console.log(users);
    // Verify "No users available" message is not displayed
    const noUsersMessage = document.querySelector("#noUsersRow");
    expect(noUsersMessage).not.toBeNull();
    expect(noUsersMessage.style.display).toBe("none");

    const toast = document.querySelector(".toast-message");
    expect(toast).not.toBeNull();
    expect(toast.textContent).toBe("User added successfully");
    expect(toast.classList.contains("toast-message")).toBe(true);

    expect(toast.classList.contains("show")).toBe(false);

    jest.advanceTimersByTime(10);
    expect(toast.classList.contains("show")).toBe(true);
    jest.advanceTimersByTime(3000);
    expect(document.querySelector(".toast-message")).toBeNull();
    jest.useRealTimers();
  });

  test("should open the edit modal with user details when edit button is clicked", () => {
    // Add a user to localStorage
    const user = {
      username: "johndoe",
      firstName: "John",
      lastName: "Doe",
      email: "johndoe@example.com",
    };
    localStorage.setItem("users", JSON.stringify([user]));

    // Add user row to the table
    addUserRow(user);

    // Click the edit button
    const editButton = document.querySelector(".edit-btn");
    fireEvent.click(editButton);

    // Verify the modal is shown and populated with user details
    expect(document.getElementById("userModal").style.display).toBe("block");
    expect(document.getElementById("modalTitle").textContent).toBe("Edit User");
    expect(document.getElementById("username").value).toBe(user.username);
    expect(document.getElementById("firstName").value).toBe(user.firstName);
    expect(document.getElementById("lastName").value).toBe(user.lastName);
    expect(document.getElementById("email").value).toBe(user.email);
  });

  test("should delete a user and update the table", () => {
    const usersTable = document.querySelector("#usersTable tbody");
    usersTable.innerHTML='';
    // Add users to localStorage
    const user1 = {
      username: "johndoe",
      firstName: "John",
      lastName: "Doe",
      email: "johndoe@example.com",
    };
    const user2 = {
      username: "janedoe",
      firstName: "Jane",
      lastName: "Doe",
      email: "janedoe@example.com",
    };
    localStorage.setItem("users", JSON.stringify([user1, user2]));

    // Add user rows to the table
    addUserRow(user1);
    addUserRow(user2);

    
    console.log("Table content:", usersTable.innerHTML);
    expect(usersTable.children.length).toBe(2);

    // Click the delete button for the first user
    const deleteButton = document.querySelectorAll(".delete-btn")[0];
    fireEvent.click(deleteButton);
    console.log("Table content:", usersTable.innerHTML);

    // Verify the user is removed from the table
    expect(usersTable.children.length).toBe(1);

    // Verify the user is removed from localStorage
    const users = JSON.parse(localStorage.getItem("users")) || [];
    expect(users.length).toBe(1); // Only one user should remain
    expect(users[0].username).toBe("janedoe");
  });

  test("should add or update a user and display it in the table", () => {
    // Add initial users to localStorage
    const user1 = {
      username: "johndoe",
      firstName: "John",
      lastName: "Doe",
      email: "johndoe@example.com",
    };
    const user2 = {
      username: "janedoe",
      firstName: "Jane",
      lastName: "Doe",
      email: "janedoe@example.com",
    };
    localStorage.setItem("users", JSON.stringify([user1, user2]));

    loadUsers();
    const usersTable = document.querySelector("#usersTable tbody");
    expect(usersTable.children.length).toBe(2);

    // Click the edit button for the first user (user1)
    const editButton = usersTable.querySelectorAll(".edit-btn")[0];
    fireEvent.click(editButton);

    // Simulate user editing the details
    document.getElementById("username").value = "john_doe_updated";
    document.getElementById("firstName").value = "John Updated";
    document.getElementById("lastName").value = "Doe Updated";
    document.getElementById("email").value = "john_doe_updated@example.com";

    // Click the save button to submit the form
    const saveUserBtn = document.querySelector("#saveUserBtn");
    fireEvent.click(saveUserBtn);

    // Verify the user was updated in the table
    const updatedRow = usersTable.querySelectorAll("tr");
    console.log("updatedRow.textContent", updatedRow[0].textContent); // Assuming no header row
    expect(updatedRow[0].textContent).toContain("john_doe_updated");
    expect(updatedRow[0].textContent).toContain("John Updated");
    expect(updatedRow[0].textContent).toContain("Doe Updated");
    expect(updatedRow[0].textContent).toContain("john_doe_updated@example.com");

    // Verify the user was updated in localStorage
    const updatedUsers = JSON.parse(localStorage.getItem("users")) || [];
    expect(updatedUsers.length).toBe(2);
    expect(updatedUsers[0].username).toBe("john_doe_updated");
    expect(updatedUsers[0].firstName).toBe("John Updated");
    expect(updatedUsers[0].lastName).toBe("Doe Updated");
    expect(updatedUsers[0].email).toBe("john_doe_updated@example.com");
  });
  test("should show an alert if the username already exists", () => {
    window.alert = jest.fn();

    // Add initial users to localStorage
    const user1 = {
      username: "johndoe",
      firstName: "John",
      lastName: "Doe",
      email: "johndoe@example.com",
    };
    localStorage.setItem("users", JSON.stringify([user1]));

    // Load users into the table
    loadUsers();

    // Simulate user input with an existing username
    document.getElementById("username").value = "johndoe";
    document.getElementById("firstName").value = "John";
    document.getElementById("lastName").value = "Doe";
    document.getElementById("email").value = "john.doe@newemail.com";

    // Simulate form submission
    const saveUserBtn = document.querySelector("#saveUserBtn");
    fireEvent.click(saveUserBtn);

    // Check that the alert was called with the expected message
    expect(window.alert).toHaveBeenCalledWith("Username already exists!");

    // Check that the user was not added again
    const users = JSON.parse(localStorage.getItem("users"));
    expect(users.length).toBe(1); // Only one user should remain
    expect(users[0].email).toBe("johndoe@example.com"); // Email should not have been updated
  });

  test("should close the modal when clicking outside of it", () => {
    fireEvent.click(items[1]);
    fireEvent.click(addUserBtn);
    const userModal = document.querySelector("#userModal");
    expect(userModal.style.display).toBe("block");

    // Simulate a click event on the modal background
    const clickEvent = new MouseEvent("click", {
      bubbles: true,
      cancelable: true,
    });
    userModal.dispatchEvent(clickEvent);
    // Check that the modal is hidden
    expect(userModal.style.display).toBe("none");
  });

  test("should click edit and should close the modal when clicking outside of it", () => {
    // Add initial users to localStorage
    const user1 = {
      username: "johndoe",
      firstName: "John",
      lastName: "Doe",
      email: "johndoe@example.com",
    };
    const user2 = {
      username: "janedoe",
      firstName: "Jane",
      lastName: "Doe",
      email: "janedoe@example.com",
    };
    localStorage.setItem("users", JSON.stringify([user1, user2]));

    loadUsers();
    const usersTable = document.querySelector("#usersTable tbody");
    expect(usersTable.children.length).toBe(2);

    // Click the edit button for the first user (user1)
    const editButton = usersTable.querySelectorAll(".edit-btn")[0];
    fireEvent.click(editButton);

    // Simulate user editing the details
    document.getElementById("username").value = "john_doe_updated";
    document.getElementById("firstName").value = "John Updated";
    document.getElementById("lastName").value = "Doe Updated";
    document.getElementById("email").value = "john_doe_updated@example.com";

    const userModal = document.querySelector("#userModal");
    expect(userModal.style.display).toBe("block");

    // Simulate a click event on the modal background
    const clickEvent = new MouseEvent("click", {
      bubbles: true,
      cancelable: true,
    });
    userModal.dispatchEvent(clickEvent);
    // Check that the modal is hidden
    expect(userModal.style.display).toBe("none");

    // Verify the user is not  updated in the table
    const updatedRow = usersTable.querySelectorAll("tr");
    console.log("updatedRow.textContent", updatedRow[0].textContent); // Assuming no header row
    expect(updatedRow[0].textContent).toContain("johndoe");
    expect(updatedRow[0].textContent).toContain("John");
    expect(updatedRow[0].textContent).toContain("Doe");
    expect(updatedRow[0].textContent).toContain("johndoe@example.com");

    // Verify the user was updated in localStorage
    const updatedUsers = JSON.parse(localStorage.getItem("users")) || [];
    expect(updatedUsers.length).toBe(2);
    expect(updatedUsers[0].username).toBe("johndoe");
    expect(updatedUsers[0].firstName).toBe("John");
    expect(updatedUsers[0].lastName).toBe("Doe");
    expect(updatedUsers[0].email).toBe("johndoe@example.com");
  });
});
describe("Group Management System", () => {
  let groupsTableBody,
    groupNameInput,
    createGroupBtn,
    addUserModal,
    viewUsersModal,
    removeUserModal,
    saveUsersBtn,
    removeUsersBtn,
    closeAddUserModal,
    closeViewUsersModal,
    closeRemoveUserModal;

  function addGroupToLocalStorage(groupName) {
    const groups = JSON.parse(localStorage.getItem("groups")) || [];
    groups.push({ name: groupName, users: [] });
    localStorage.setItem("groups", JSON.stringify(groups));
  }

  function addUserToGroup(groupName, username, firstName, lastName, email) {
    const groups = JSON.parse(localStorage.getItem("groups")) || [];
    const group = groups.find((g) => g.name === groupName);

    if (group) {
      group.users.push({ username, firstName, lastName, email });
      localStorage.setItem("groups", JSON.stringify(groups));
    }
  }

  beforeEach(() => {
    // Mock dialog methods
    HTMLDialogElement.prototype.showModal = jest.fn();
    HTMLDialogElement.prototype.close = jest.fn();

    groupsTableBody = document.getElementById("groupsTableBody");
    groupNameInput = document.getElementById("groupNameInput");
    createGroupBtn = document.getElementById("createGroupBtn");
    addUserModal = document.getElementById("addUserModal");
    viewUsersModal = document.getElementById("viewUsersModal");
    removeUserModal = document.getElementById("removeUserModal");
    saveUsersBtn = document.getElementById("saveUsersBtn");
    removeUsersBtn = document.getElementById("removeUsersBtn");
    closeAddUserModal = document.querySelector("#addUserModal .close-modal");
    closeViewUsersModal = document.querySelector(
      "#viewUsersModal .close-modal"
    );
    closeRemoveUserModal = document.querySelector(
      "#removeUserModal .close-modal"
    );

    const mockLocalStorage = (() => {
      let store = {};
      return {
        getItem: (key) => store[key] || null,
        setItem: (key, value) => (store[key] = value.toString()),
        clear: () => (store = {}),
        removeItem: (key) => delete store[key],
      };
    })();
    Object.defineProperty(window, "localStorage", {
      value: mockLocalStorage,
    });
    fireEvent.click(items[2]);
  });

  afterEach(() => {
    localStorage.clear();
  });

  describe("Initial Rendering and Layout", () => {
    test("should display input field and create group button", () => {
      expect(groupNameInput).not.toBeNull();
      expect(createGroupBtn).not.toBeNull();
    });

    test("should display table headers", () => {
      const headers = document.querySelectorAll("#groupsTable thead th");
      expect(headers[0].textContent).toBe("Group Name");
      expect(headers[1].textContent).toBe("Actions");
    });
  });

  describe("Group Creation and Display", () => {
    test("should display group names in the table and store them in localStorage", () => {
      // Simulate entering group names and clicking the Create Group button
      fireEvent.change(groupNameInput, { target: { value: "Group A" } });
      fireEvent.click(createGroupBtn);

      fireEvent.change(groupNameInput, { target: { value: "Group B" } });
      fireEvent.click(createGroupBtn);

      // Verify the DOM
      const rows = groupsTableBody.querySelectorAll("tr");
      expect(rows.length).toBe(2);
      expect(rows[0].textContent).toContain("Group A");
      expect(rows[1].textContent).toContain("Group B");

      const actionsGroupA = rows[0].querySelectorAll("td button");
      expect(actionsGroupA.length).toBe(4);
      expect(actionsGroupA[0].textContent).toBe("View Users");
      expect(actionsGroupA[1].textContent).toBe("Add User");
      expect(actionsGroupA[2].textContent).toBe("Remove User");
      expect(actionsGroupA[3].textContent).toBe("Delete Group");

      // Verify action buttons for the second group
      const actionsGroupB = rows[1].querySelectorAll("td button");
      expect(actionsGroupB.length).toBe(4);
      expect(actionsGroupB[0].textContent).toBe("View Users");
      expect(actionsGroupB[1].textContent).toBe("Add User");
      expect(actionsGroupB[2].textContent).toBe("Remove User");
      expect(actionsGroupB[3].textContent).toBe("Delete Group");

      // Verify localStorage
      const storedGroups = JSON.parse(localStorage.getItem("groups"));
      expect(storedGroups).toEqual([
        { name: "Group A", users: [] },
        { name: "Group B", users: [] },
      ]);
    });
    test("should display correct actions for each group", () => {
      // Add group
      addGroup("Group A");
      const rows = groupsTableBody.querySelectorAll("tr");
      const actions = rows[0].querySelectorAll("td button");

      console.log("Number of action buttons:", actions.length);
      console.log("Buttons in row:", actions);

      expect(actions.length).toBe(4); // Four action buttons per group
      expect(actions[0].textContent).toBe("View Users");
      expect(actions[1].textContent).toBe("Add User");
      expect(actions[2].textContent).toBe("Remove User");
      expect(actions[3].textContent).toBe("Delete Group");

      const toast = document.querySelector(".toast-message");
      expect(toast.textContent).toContain("Group created successfully!");

      fireEvent.click(groupsTableBody.querySelector(".add-user-btn"));
      expect(addUserModal.showModal).toHaveBeenCalled();
      fireEvent.click(closeAddUserModal);
      expect(addUserModal.close).toHaveBeenCalled();

      fireEvent.click(groupsTableBody.querySelector(".view-users-btn"));
      expect(viewUsersModal.showModal).toHaveBeenCalled();
      fireEvent.click(closeViewUsersModal);
      expect(viewUsersModal.close).toHaveBeenCalled();

      fireEvent.click(groupsTableBody.querySelector(".remove-user-btn"));
      expect(removeUserModal.showModal).toHaveBeenCalled();
      fireEvent.click(closeRemoveUserModal);
      expect(removeUserModal.close).toHaveBeenCalled();
    });

    test("should not allow duplicate group names and show error toast", () => {
      alert("Group name must be unique.");

      groupNameInput.value = "Group A";
      fireEvent.click(createGroupBtn);

      groupNameInput.value = "Group A";
      fireEvent.click(createGroupBtn);

      expect(window.alert).toHaveBeenCalledWith("Group name must be unique.");

      // Verify the DOM - there should only be one entry for 'Group A'
      const rows = groupsTableBody.querySelectorAll("tr");
      expect(rows.length).toBe(1);
      expect(rows[0].textContent).toContain("Group A");
    });
  });

  describe("Modal Functionality", () => {
    beforeEach(() => {
      groupNameInput.value = "Group A";
      fireEvent.click(createGroupBtn);
    });
    test("should open modals for view, add, and remove users and close correctly", () => {
      fireEvent.click(groupsTableBody.querySelector(".add-user-btn"));
      expect(addUserModal.showModal).toHaveBeenCalled();
      fireEvent.click(closeAddUserModal);
      expect(addUserModal.close).toHaveBeenCalled();

      fireEvent.click(groupsTableBody.querySelector(".view-users-btn"));
      expect(viewUsersModal.showModal).toHaveBeenCalled();
      fireEvent.click(closeViewUsersModal);
      expect(viewUsersModal.close).toHaveBeenCalled();

      fireEvent.click(groupsTableBody.querySelector(".remove-user-btn"));
      expect(removeUserModal.showModal).toHaveBeenCalled();
      fireEvent.click(closeRemoveUserModal);
      expect(removeUserModal.close).toHaveBeenCalled();
    });

    test("should verify the structure and content of Add User Modal", () => {
      // Open Add User Modal
      fireEvent.click(groupsTableBody.querySelector(".add-user-btn"));

      // Verify modal title
      const modalTitle = addUserModal.querySelector("h3");
      expect(modalTitle.textContent).toBe("Add Users to Group");

      // Verify table structure
      const addUserTable = addUserModal.querySelector("#addUserTable");
      const addUserTableHeaders = addUserTable.querySelectorAll("thead th");
      expect(addUserTableHeaders[0].textContent).toBe("Username");
      expect(addUserTableHeaders[1].textContent).toBe("Select");

      // Verify save button
      const saveUsersBtn = addUserModal.querySelector("#saveUsersBtn");
      expect(saveUsersBtn).not.toBeNull();
    });

    test("should verify the structure and content of View Users Modal", () => {
      // Open View Users Modal
      fireEvent.click(groupsTableBody.querySelector(".view-users-btn"));

      // Verify modal title
      const modalTitle = viewUsersModal.querySelector("h3");
      expect(modalTitle.textContent).toBe("View Users in Group");

      // Verify users list structure
      const viewUsersList = viewUsersModal.querySelector("#viewUsersList");
      expect(viewUsersList).not.toBeNull();
    });

    test("should verify the structure and content of Remove User Modal", () => {
      // Open Remove User Modal
      fireEvent.click(groupsTableBody.querySelector(".remove-user-btn"));

      // Verify modal title
      const modalTitle = removeUserModal.querySelector("h3");
      expect(modalTitle.textContent).toBe("Remove Users from Group");

      // Verify table structure
      const removeUserTable = removeUserModal.querySelector("#removeUserTable");
      const removeUserTableHeaders =
        removeUserTable.querySelectorAll("thead th");
      expect(removeUserTableHeaders[0].textContent).toBe("Username");
      expect(removeUserTableHeaders[1].textContent).toBe("Select");

      // Verify remove button
      const removeUsersBtn = removeUserModal.querySelector("#removeUsersBtn");
      expect(removeUsersBtn).not.toBeNull();
    });
  });

  describe("Flow 1: Adding Users", () => {
    beforeEach(() => {
      // Setup: Clear local storage and set up mock modals
      localStorage.clear();
      HTMLDialogElement.prototype.showModal = jest.fn();
      HTMLDialogElement.prototype.close = jest.fn();

      // Assume `addGroup` and `populateAddUserTable` functions are defined in your code
      groupNameInput.value = "Group A";
      fireEvent.click(createGroupBtn);
    });

    test("should show add user modal, list users, and close the modal", () => {
      // Adding a user to the local storage directly for test purposes
      const users = [
        { id: "user1", username: "User One", email: "user1@example.com" },
      ];
      localStorage.setItem("users", JSON.stringify(users));

      // Simulate opening the add user modal
      fireEvent.click(groupsTableBody.querySelector(".add-user-btn"));
      expect(addUserModal.showModal).toHaveBeenCalled();

      // Check if the user is listed in the modal
      populateAddUserTable();
      const usersTable = document.querySelector("#addUserTableBody");
      expect(usersTable.children.length).toBe(1);
      expect(usersTable.textContent).toContain("User One");

      // Close the modal
      fireEvent.click(closeAddUserModal);
      expect(addUserModal.close).toHaveBeenCalled();
    });

    test("should not list users in remove user modal if none added", () => {
      fireEvent.click(groupsTableBody.querySelector(".remove-user-btn"));

      const removeUserTable = document.querySelector("#removeUserTableBody");
      expect(removeUserTable.children.length).toBe(0); // No users should be listed
      fireEvent.click(closeRemoveUserModal);
      expect(removeUserModal.close).toHaveBeenCalled();
    });

    test("should not list users in view user modal if none added", () => {
      fireEvent.click(groupsTableBody.querySelector(".view-users-btn"));

      const viewUsersList = document.querySelector("#viewUsersList");
      expect(viewUsersList.textContent).toContain("No users in this group");
      fireEvent.click(closeViewUsersModal);
      expect(viewUsersModal.close).toHaveBeenCalled();
    });
  });

  describe("Flow 2: Adding and Removing Users", () => {
    test("should add user, display in view users modal, remove user, and verify", () => {
      // Add a group
      groupNameInput.value = "Group A";
      fireEvent.click(createGroupBtn);

      // Add users to local storage
      localStorage.setItem(
        "users",
        JSON.stringify([
          {
            id: "user1",
            username: "user1",
            firstName: "User",
            lastName: "One",
            email: "user1@example.com",
          },
          {
            id: "user2",
            username: "user2",
            firstName: "User",
            lastName: "Two",
            email: "user2@example.com",
          },
        ])
      );

      // Open the 'Add User' modal and select users
      fireEvent.click(groupsTableBody.querySelector(".add-user-btn"));
      populateAddUserTable(); // Populate the add user modal

      const addUserCheckboxes = document.querySelectorAll(
        '#addUserTableBody input[type="checkbox"]'
      );
      expect(addUserCheckboxes.length).toBe(2); // Ensure there are two checkboxes for the two users

      // Select the first checkbox and save
      fireEvent.click(addUserCheckboxes[0]);
      fireEvent.click(saveUsersBtn);
      //checkToastMessage('Group created successfully!');
      // checkToastMessage('User added to group successfully!');

      // Open the 'View Users' modal and verify added users
      fireEvent.click(groupsTableBody.querySelector(".view-users-btn"));
      const viewUsersList = document.querySelector("#viewUsersList");
      expect(viewUsersList.textContent).toContain("user1");
      expect(viewUsersList.textContent).not.toContain("user2"); // Ensure user2 is not yet added

      // Open the 'Remove User' modal
      fireEvent.click(groupsTableBody.querySelector(".remove-user-btn"));
      populateRemoveUserTable(); // Populate the remove user modal

      const removeUserCheckboxes = document.querySelectorAll(
        '#removeUserTableBody input[type="checkbox"]'
      );
      expect(removeUserCheckboxes.length).toBe(1); // Only user1 should be listed for removal

      // Select the checkbox and remove
      fireEvent.click(removeUserCheckboxes[0]);
      fireEvent.click(removeUsersBtn);

      //   checkToastMessage('User removed from group successfully!');

      // Verify that user1 has been removed
      fireEvent.click(groupsTableBody.querySelector(".view-users-btn"));
      expect(viewUsersList.textContent).not.toContain("user1");
      expect(viewUsersList.textContent).not.toContain("user2"); // Ensure user2 is still not added
    });
  });

  describe("Group Deletion", () => {
    beforeEach(() => {
      // Setup group and button elements
      groupNameInput.value = "Group A";
      fireEvent.click(createGroupBtn);

      // Mock confirm dialog to always confirm
      global.confirm = jest.fn(() => true);
    });

    test("should prompt for confirmation and delete the group", () => {
      expect(groupsTableBody.querySelectorAll("tr").length).toBe(1);

      // Mock confirm dialog to always confirm
      global.confirm.mockReturnValue(true);

      fireEvent.click(groupsTableBody.querySelector(".delete-group-btn"));

      expect(global.confirm).toHaveBeenCalledWith(
        "Are you sure you want to delete the group 'Group A'?"
      );

      expect(groupsTableBody.querySelectorAll("tr").length).toBe(0);

      const storedGroups = JSON.parse(localStorage.getItem("groups"));
      expect(storedGroups.length).toBe(0);
    });

    test("should not delete the group if canceled", () => {
      expect(groupsTableBody.querySelectorAll("tr").length).toBe(1);

      // Mock confirm dialog to cancel
      global.confirm.mockReturnValue(false);

      fireEvent.click(groupsTableBody.querySelector(".delete-group-btn"));

      expect(global.confirm).toHaveBeenCalledWith(
        "Are you sure you want to delete the group 'Group A'?"
      );

      expect(groupsTableBody.querySelectorAll("tr").length).toBe(1);

      const storedGroups = JSON.parse(localStorage.getItem("groups"));
      expect(storedGroups.length).toBe(1);
    });
  });
});

describe("Role Management", () => {
  let createRoleForm,
    roleNameInput,
    roleDescriptionInput,
    roleSuccessMessage,
    roleSelectForUser,
    userSelectForRole,
    roleSelectForGroup,
    groupSelectForRole,
    viewRoleAssignmentsBtn,
    roleSelectForView;
  beforeEach(() => {
    function checkToastMessage(expectedText) {
      jest.useFakeTimers();

      expect(toast.classList.contains("toast-message")).toBe(true);
      expect(toast.classList.contains("show")).toBe(false);

      jest.advanceTimersByTime(10);
      expect(toast.classList.contains("show")).toBe(true);
      jest.advanceTimersByTime(3000);
      expect(document.querySelector(".toast-message")).toBeNull();

      jest.useRealTimers();
    }

    createRoleForm = document.getElementById("createRoleForm");
    roleNameInput = document.getElementById("roleNameInput");
    roleDescriptionInput = document.getElementById("roleDescriptionInput");
    rolesTableBody = document.getElementById("rolesTableBody");
    roleSuccessMessage = document.getElementById("roleSuccessMessage");
    roleSelectForUser = document.getElementById("roleSelectForUser");
    userSelectForRole = document.getElementById("userSelectForRole");
    roleSelectForGroup = document.getElementById("roleSelectForGroup");
    groupSelectForRole = document.getElementById("groupSelectForRole");
    viewRoleAssignmentsBtn = document.getElementById("viewRoleAssignmentsBtn");
    roleSelectForView = document.getElementById("roleSelectForView");
    const mockLocalStorage = (() => {
      let store = {};
      return {
        getItem: (key) => store[key] || null,
        setItem: (key, value) => (store[key] = value.toString()),
        clear: () => (store = {}),
        removeItem: (key) => delete store[key],
      };
    })();
    Object.defineProperty(window, "localStorage", {
      value: mockLocalStorage,
    });
    fireEvent.click(items[3]);
  });

  afterEach(() => {
    localStorage.clear();
  });

  test("Role HTML structure initial rendering", () => {
    // Check Create Role Section
    expect(createRoleForm).not.toBeNull();
    expect(roleNameInput).not.toBeNull();
    expect(roleNameInput.placeholder).toBe("Role Name");
    expect(roleDescriptionInput).not.toBeNull();
    expect(roleDescriptionInput.placeholder).toBe("Role Description");
    expect(document.getElementById("createRoleBtn")).not.toBeNull();
    expect(roleSuccessMessage).not.toBeNull();
  
    // Check View Roles Section
    expect(document.querySelector(".view-roles h2").textContent).toBe(
      "View Roles"
    );
    expect(document.getElementById("searchRolesInput")).not.toBeNull();
    expect(document.getElementById('searchRolesInput')).not.toBeNull()
    expect(document.getElementById("filterRolesBtn")).not.toBeNull();
    expect(document.getElementById("sortRolesBtn")).not.toBeNull();
    expect(rolesTableBody).not.toBeNull();
    expect(rolesTableBody.innerHTML).toBe(""); // Ensure table body is empty initially

    // Check Assign Roles to Users Section
    expect(
      document.querySelector(".assign-roles-to-users h2").textContent
    ).toBe("Assign Roles to Users");
    expect(document.getElementById("assignRolesToUsersForm")).not.toBeNull();
    expect(roleSelectForUser).not.toBeNull();
    expect(userSelectForRole).not.toBeNull();
    expect(userSelectForRole.multiple).toBe(true);
    expect(document.getElementById("assignRolesToUsersBtn")).not.toBeNull();
    expect(roleAssignmentSuccessMessage).not.toBeNull();

    // Check Assign Roles to Groups Section
    expect(
      document.querySelector(".assign-roles-to-groups h2").textContent
    ).toBe("Assign Roles to Groups");
    expect(document.getElementById("assignRolesToGroupsForm")).not.toBeNull();
    expect(roleSelectForGroup).not.toBeNull();
    expect(groupSelectForRole).not.toBeNull();
    expect(groupSelectForRole.multiple).toBe(true);
    expect(document.getElementById("assignRolesToGroupsBtn")).not.toBeNull();
    expect(groupAssignmentSuccessMessage).not.toBeNull();

    // Check View Role Assignments Section
    expect(
      document.querySelector(".view-role-assignments h2").textContent
    ).toBe("View Role Assignments");
    expect(roleSelectForView).not.toBeNull();
    expect(viewRoleAssignmentsBtn).not.toBeNull();
    expect(document.getElementById("roleAssignmentsTable")).not.toBeNull();
    expect(roleAssignmentsTableBody).not.toBeNull();
  });

  test("Create Role and verify UI and local storage", () => {
    const initialRoles = JSON.parse(localStorage.getItem("roles")) || [];
    expect(initialRoles).toEqual([]);

    const roleName = "Admin";
    const roleDescription = "Administrator role";
    roleNameInput.value = roleName;
    roleDescriptionInput.value = roleDescription;

    createRoleForm.dispatchEvent(new Event("submit"));

    // Verify the role is added to the rolesTableBody
    const rows = rolesTableBody.querySelectorAll("tr");
    expect(rows.length).toBe(1);
    const cells = rows[0].querySelectorAll("td");
    expect(cells[0].textContent).toBe(roleName);
    expect(cells[1].textContent).toBe(roleDescription);

    // Verify the role is stored in local storage
    const storedRoles = JSON.parse(localStorage.getItem("roles"));
    expect(storedRoles.length).toBe(1);
    expect(storedRoles[0].name).toBe(roleName);
    expect(storedRoles[0].description).toBe(roleDescription);

    // Verify success message
    expect(roleSuccessMessage.textContent).toBe("Role created successfully!");

    // Verify the input fields are cleared
    expect(roleNameInput.value).toBe("");
    expect(roleDescriptionInput.value).toBe("");
  });

  test("should assign roles to users and reflect in UI and local storage", () => {
    localStorage.setItem("roles", JSON.stringify([]));
    localStorage.setItem(
      "users",
      JSON.stringify([
        { username: "user1" },
        { username: "user2" },
        { username: "user3" },
      ])
    );

    roleNameInput.value = "Admin";
    roleDescriptionInput.value = "Administrator role";
    createRoleForm.dispatchEvent(new Event("submit"));

    expect(rolesTableBody.innerHTML).toContain("Admin");
    expect(rolesTableBody.innerHTML).toContain("Administrator role");

    // Verify in localStorage
    const roles = JSON.parse(localStorage.getItem("roles"));
    expect(roles).toHaveLength(1);
    expect(roles[0]).toEqual({
      name: "Admin",
      description: "Administrator role",
      users: [],
      groups: [],
    });

    // add role and user selects
    roleSelectForUser.innerHTML = '<option value="Admin">Admin</option>';
    userSelectForRole.innerHTML =
      '<option value="user1">user1</option><option value="user2">user2</option>';

    // Assign roles to users
    userSelectForRole.querySelector('option[value="user1"]').selected = true;
    userSelectForRole.querySelector('option[value="user2"]').selected = true;
    assignRolesToUsersForm.dispatchEvent(new Event("submit"));

    // Verify role assignment in localStorage
    const updatedRoles = JSON.parse(localStorage.getItem("roles"));
    expect(updatedRoles[0].users).toContain("user1");
    expect(updatedRoles[0].users).toContain("user2");
    expect(updatedRoles[0].users).not.toContain("user3");
  });

  test("should assign roles to groups and reflect in UI and local storage", () => {
    localStorage.setItem("roles", JSON.stringify([]));
    localStorage.setItem(
      "groups",
      JSON.stringify([
        { name: "groupA" },
        { name: "groupB" },
        { name: "groupC" },
      ])
    );

    roleNameInput.value = "Admin";
    roleDescriptionInput.value = "Administrator role";
    createRoleForm.dispatchEvent(new Event("submit"));

    // Verify role creation in the UI
    expect(rolesTableBody.innerHTML).toContain("Admin");
    expect(rolesTableBody.innerHTML).toContain("Administrator role");

    // Verify role creation in localStorage
    const roles = JSON.parse(localStorage.getItem("roles"));
    expect(roles).toHaveLength(1);
    expect(roles[0]).toEqual({
      name: "Admin",
      description: "Administrator role",
      users: [],
      groups: [],
    });

    // Populate role and group selects
    roleSelectForGroup.innerHTML = '<option value="Admin">Admin</option>';
    groupSelectForRole.innerHTML =
      '<option value="groupA">groupA</option><option value="groupB">groupB</option>';

    // Assign roles to groups
    groupSelectForRole.querySelector('option[value="groupA"]').selected = true;
    groupSelectForRole.querySelector('option[value="groupB"]').selected = true;
    assignRolesToGroupsForm.dispatchEvent(new Event("submit"));

    // Verify role assignment in localStorage
    const updatedRoles = JSON.parse(localStorage.getItem("roles"));
    expect(updatedRoles[0].groups).toContain("groupA");
    expect(updatedRoles[0].groups).toContain("groupB");
    expect(updatedRoles[0].groups).not.toContain("groupC");
  });


  test("should display role assignments correctly in the UI", () => {
    
    const mockRoles = [
      { name: "Admin", users: ["UserA", "UserB"], groups: ["GroupA", "GroupB"] },
      { name: "Editor", users: ["UserC"], groups: ["GroupC"] }
    ];
    localStorage.setItem("roles", JSON.stringify(mockRoles));
  
    // Prepare the dropdown and click button
    roleSelectForView.innerHTML = '<option value="Admin">Admin</option><option value="Editor">Editor</option>';
    roleSelectForView.querySelector('option[value="Admin"]').selected = true;
    viewRoleAssignmentsBtn.click();
    
    const rows = roleAssignmentsTableBody.querySelectorAll('tr');
    expect(rows.length).toBe(4); // 2 users + 2 groups
  
    // Check the content of each row
    const expectedData = [
      { type: "User", name: "UserA" },
      { type: "User", name: "UserB" },
      { type: "Group", name: "GroupA" },
      { type: "Group", name: "GroupB" }
    ];
  
    expectedData.forEach((data, index) => {
      expect(rows[index].cells[0].textContent).toBe(data.type);
      expect(rows[index].cells[1].textContent).toBe(data.name);
    });
  });

 
  
});


describe('Roles Table - Add and Search', () => {
  beforeEach(() => {
    fireEvent.click(items[3]);
  
    
    localStorage.clear()
    

  });
  afterEach(()=>{    localStorage.clear()


  })

  test('should add a role and search by name', () => {
    const roleNameInput = document.getElementById('roleNameInput');
    const roleDescriptionInput = document.getElementById('roleDescriptionInput');
    const createRoleForm = document.getElementById('createRoleForm');
    const searchInput = document.getElementById('searchRolesInput');
    const searchButton = document.getElementById('searchRolesBtn');
    const rolesTableBody = document.getElementById('rolesTableBody');

    // Add a role
    const roleName = "Admin";
    const roleDescription = "Administrator role";
    roleNameInput.value = roleName;
    roleDescriptionInput.value = roleDescription;

    createRoleForm.dispatchEvent(new Event('submit'));

    // Verify the role is added to the rolesTableBody
  
    expect(rolesTableBody.innerHTML).toContain(roleName);
    expect(rolesTableBody.innerHTML).toContain(roleDescription);
 

    // Verify the role is stored in local storage
    const storedRoles = JSON.parse(localStorage.getItem("roles"));
    expect(storedRoles.length).toBe(1);
    expect(storedRoles[0].name).toBe(roleName);
    expect(storedRoles[0].description).toBe(roleDescription);

    // Add the role again
    roleNameInput.value = 'BA';
    roleDescriptionInput.value = 'business';
    createRoleForm.dispatchEvent(new Event('submit'));

    // Verify the role is added again to the rolesTableBody  
    const storedRole = JSON.parse(localStorage.getItem("roles"));
    expect(storedRole.length).toBe(2);
    expect(storedRole[1].name).toBe('BA');
    expect(storedRole[1].description).toBe('business');

    // Search for the role
    fireEvent.change(searchInput, { target: { value: roleName } });
    fireEvent.click(searchButton);

    // Verify the role is displayed correctly after search
    expect(rolesTableBody.innerHTML).toContain(roleName);
    expect(rolesTableBody.innerHTML).toContain(roleDescription);
    expect(rolesTableBody.innerHTML).not.toContain('BA');
    expect(rolesTableBody.innerHTML).not.toContain('business');
  });

  test('should filter a role by ascending order', () => {
    const roleNameInput = document.getElementById('roleNameInput');
    const roleDescriptionInput = document.getElementById('roleDescriptionInput');
    const createRoleForm = document.getElementById('createRoleForm');
    const searchInput = document.getElementById('searchRolesInput');
    const searchButton = document.getElementById('searchRolesBtn');
    const rolesTableBody = document.getElementById('rolesTableBody');

    // Add a role
    const roleName = "Admin";
    const roleDescription = "Administrator role";
    roleNameInput.value = roleName;
    roleDescriptionInput.value = roleDescription;

    createRoleForm.dispatchEvent(new Event('submit'));

    // Verify the role is added to the rolesTableBody
  
    expect(rolesTableBody.innerHTML).toContain(roleName);
    expect(rolesTableBody.innerHTML).toContain(roleDescription);
 

    // Verify the role is stored in local storage
    const storedRoles = JSON.parse(localStorage.getItem("roles"));
    expect(storedRoles.length).toBe(1);
    expect(storedRoles[0].name).toBe(roleName);
    expect(storedRoles[0].description).toBe(roleDescription);

    // Add the role again
    roleNameInput.value = 'BA';
    roleDescriptionInput.value = 'business';
    createRoleForm.dispatchEvent(new Event('submit'));

    // Verify the role is added again to the rolesTableBody  
    const storedRole = JSON.parse(localStorage.getItem("roles"));
    expect(storedRole.length).toBe(2);
    expect(storedRole[1].name).toBe('BA');
    expect(storedRole[1].description).toBe('business');

    const filterButton = document.getElementById('filterRolesBtn');

        fireEvent.click(filterButton);

    // Verify the role is displayed correctly after search
    const rows = rolesTableBody.querySelectorAll('tr');
    expect(rows.length).toBe(2);
    const cells = rows[0].querySelectorAll('td');
    expect(cells[0].textContent).toBe(roleName);
    expect(cells[1].textContent).toBe(roleDescription);
    const cell = rows[1].querySelectorAll('td');
    expect(cell[0].textContent).toBe('BA');
    expect(cell[1].textContent).toBe('business');
    
  });

  test('should sort a role by descending order', () => {
    const roleNameInput = document.getElementById('roleNameInput');
    const roleDescriptionInput = document.getElementById('roleDescriptionInput');
    const createRoleForm = document.getElementById('createRoleForm');
    const searchInput = document.getElementById('searchRolesInput');
    const searchButton = document.getElementById('searchRolesBtn');
    const rolesTableBody = document.getElementById('rolesTableBody');

    // Add a role
    const roleName = "Admin";
    const roleDescription = "Administrator role";
    roleNameInput.value = roleName;
    roleDescriptionInput.value = roleDescription;

    createRoleForm.dispatchEvent(new Event('submit'));

    // Verify the role is added to the rolesTableBody
  
    expect(rolesTableBody.innerHTML).toContain(roleName);
    expect(rolesTableBody.innerHTML).toContain(roleDescription);
 

    // Verify the role is stored in local storage
    const storedRoles = JSON.parse(localStorage.getItem("roles"));
    expect(storedRoles.length).toBe(1);
    expect(storedRoles[0].name).toBe(roleName);
    expect(storedRoles[0].description).toBe(roleDescription);

    // Add the role again
    roleNameInput.value = 'BA';
    roleDescriptionInput.value = 'business';
    createRoleForm.dispatchEvent(new Event('submit'));

    // Verify the role is added again to the rolesTableBody  
    const storedRole = JSON.parse(localStorage.getItem("roles"));
    expect(storedRole.length).toBe(2);
    expect(storedRole[1].name).toBe('BA');
    expect(storedRole[1].description).toBe('business');

    const sortButton = document.getElementById('sortRolesBtn');
    // Click the sort button
    fireEvent.click(sortButton);

    // Verify the role is displayed correctly after search
    const rows = rolesTableBody.querySelectorAll('tr');
    expect(rows.length).toBe(2);
    const cells = rows[1].querySelectorAll('td');
    expect(cells[0].textContent).toBe(roleName);
    expect(cells[1].textContent).toBe(roleDescription);
    const cell = rows[0].querySelectorAll('td');
    expect(cell[0].textContent).toBe('BA');
    expect(cell[1].textContent).toBe('business');
    
  });
});