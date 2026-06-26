const contactForm = document.getElementById("contactForm");
const letterList = document.getElementById("letterList");
const hrName = document.getElementById("hrName");
const vacancyName = document.getElementById("vacancyName");
const phoneNumber = document.getElementById("phoneNumber");
const clearBtn = document.getElementById("clearBtn");
const editModalContainer = document.getElementById("editModalContainer");
const submitEditBtn = document.getElementById("submitEditBtn");
const cancelEditBtn = document.getElementById("cancelEditBtn");
const searchModal = document.getElementById("searchModal");
const searchBtn = document.getElementById("searchBtn");
const searchInput = document.getElementById("searchInput");
const searchItems = document.getElementById("searchItems");
const editModal = document.getElementById("editModal");
const exitModalBtn = document.getElementById("exitModalBtn");

const editHrName = document.getElementById("editHrName");
const editVacancyName = document.getElementById("editVacancyName");
const editPhoneNumber = document.getElementById("editPhoneNumber");

const alphabet = "абвгдеёжзийклмнопрстуфхцчшщъыьэюяabcdefghijklmnopqrstuvwxyz";

function isContact(data) {
  return (
    data &&
    typeof data.name === "string" &&
    typeof data.id === "string" &&
    typeof data.phone === "string" &&
    typeof data.vacancy === "string"
  );
}

function loadContacts() {
  try {
    const data = JSON.parse(localStorage.getItem("contacts")) || [];

    if (!Array.isArray(data)) {
      return [];
    }

    return data.filter(isContact);
  } catch {
    return [];
  }
}

let contacts = loadContacts();

let editingId = null;

function saveContacts() {
  localStorage.setItem("contacts", JSON.stringify(contacts));
}

function validateContact(contact) {
  if (!contact.name.trim()) {
    alert("введите имя");
    return false;
  }

  if (contact.name.trim().length < 2) {
    alert("имя слишком короткое");
    return false;
  }

  const firstLetter = contact.name.trim()[0].toLowerCase();

  if (!alphabet.includes(firstLetter)) {
    alert("имя должно начинаться с буквы RU / ENG");
    return false;
  }

  if (!contact.vacancy.trim()) {
    alert("введите вакансию");
    return false;
  }

  if (contact.vacancy.trim().length < 2) {
    alert("не похоже на вакансию, коротковато");
    return false;
  }

  if (!contact.phone.trim()) {
    alert("введите телефон");
    return false;
  }

  if (contact.phone.trim().length < 10) {
    alert("телефон слишком короткий");
    return false;
  }

  const phoneRegex = /^((\+7|7|8)[0-9]{10})$/;

  if (!phoneRegex.test(contact.phone.trim())) {
    alert(
      "телефон должен быть в формате +79991234567, 79991234567 или 89991234567",
    );

    return false;
  }

  return true;
}

function renderApp() {
  renderAllContacts();
  for (const letter of alphabet) {
    const count = countByLetter(letter);
    updateLetterBtnContent(letter, count);
  }
}

function updateLetterBtnContent(letter, count) {
  const letterBtn = document.getElementById(`${letter}-letter-btn`);

  if (letterBtn) {
    letterBtn.textContent = `${letterBtn.dataset.letter.toUpperCase()}, ${count}`;
  }
}

function renderAlphabet() {
  letterList.innerHTML = "";
  for (const letter of alphabet) {
    const letterBox = document.createElement("div");
    letterBox.className = "letterBox";
    letterBox.id = `${letter}-letter`;
    letterList.append(letterBox);

    const letterBtn = document.createElement("button");
    letterBtn.dataset.letter = letter;
    letterBtn.type = "button";
    letterBtn.id = `${letter}-letter-btn`;
    letterBtn.className = "letterBtn";
    letterBtn.dataset.action = "toggle-contracts";
    letterBox.append(letterBtn);

    const letterItems = document.createElement("div");
    letterItems.id = `${letter}-letter-items`;
    letterItems.className = "letterItems hidden";
    letterBox.append(letterItems);
  }
}

function renderAllContacts() {
  clearAllContactContainers();

  for (const data of contacts) {
    const letter = data.name.trim()[0].toLowerCase();
    const letterItemsId = `${letter}-letter-items`;
    const letterItemsContainer = document.getElementById(letterItemsId);

    if (letterItemsContainer) {
      letterItemsContainer.append(renderContactCard(data));
    }
  }
}

function renderContactCard(data) {
  const card = document.createElement("div");
  card.className = "dataVisualize";

  const info = document.createElement("div");
  card.append(info);

  const name = document.createElement("p");
  info.append(name);
  name.textContent = `Имя: ${data.name},`;

  const vacancy = document.createElement("p");
  info.append(vacancy);
  vacancy.textContent = `Вакансия: ${data.vacancy},`;

  const phone = document.createElement("p");
  info.append(phone);
  phone.textContent = `Телефон: ${data.phone}`;

  const buttonGroup = document.createElement("div");
  card.append(buttonGroup);

  const editBtn = document.createElement("button");
  editBtn.textContent = "Изменить";
  editBtn.dataset.action = "edit";
  editBtn.dataset.id = data.id;
  buttonGroup.append(editBtn);

  const removeBtn = document.createElement("button");
  removeBtn.textContent = "Удалить";
  removeBtn.dataset.action = "delete";
  removeBtn.dataset.id = data.id;
  buttonGroup.append(removeBtn);

  return card;
}

function clearAllContactContainers() {
  for (const letter of alphabet) {
    const letterItemsId = `${letter.toLowerCase()}-letter-items`;
    const letterItemsContainer = document.getElementById(letterItemsId);
    letterItemsContainer.innerHTML = "";
  }
}

function countByLetter(letter) {
  let count = 0;

  for (const data of contacts) {
    if (data.name && data.name.trim()[0].toLowerCase() === letter) {
      count++;
    }
  }

  return count;
}

function toggleLetterContacts(letter) {
  const idx = `${letter}-letter-items`;
  const letterEl = document.getElementById(idx);
  letterEl.classList.toggle("hidden");
}

function removeContact(id) {
  contacts = contacts.filter((contact) => contact.id !== id);
  saveContacts();

  renderApp();
  searchContacts(searchInput.value);
}

function openEditModal(id) {
  editingId = id;
  editModalContainer.classList.toggle("hidden");

  const currentContact = contacts.find((contact) => contact.id === id);

  if (!currentContact) return;

  editHrName.value = currentContact.name;
  editVacancyName.value = currentContact.vacancy;
  editPhoneNumber.value = currentContact.phone;
}

function searchContacts(query) {
  const lowerQuery = query.trim().toLowerCase();

  searchItems.innerHTML = "";

  if (!lowerQuery) {
    return;
  }

  let found = false;

  for (const data of contacts) {
    const matchesName = data.name.toLowerCase().includes(lowerQuery);
    const matchesVacancy = data.vacancy.toLowerCase().includes(lowerQuery);
    const matchesPhone = data.phone.toLowerCase().includes(lowerQuery);

    if (matchesName || matchesPhone || matchesVacancy) {
      searchItems.append(renderContactCard(data));
      found = true;
    }
  }

  if (!found) {
    const empty = document.createElement("p");
    empty.textContent = "Не нашел";
    searchItems.append(empty);
  }
}

contactForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const newContact = {
    name: hrName.value.trim(),
    vacancy: vacancyName.value.trim(),
    phone: phoneNumber.value.trim(),
    id: crypto.randomUUID(),
  };

  if (!validateContact(newContact)) return;

  contacts.push(newContact);
  saveContacts();

  contactForm.reset();

  renderApp();
});

clearBtn.addEventListener("click", () => {
  contacts = [];
  saveContacts();

  searchInput.value = "";
  searchItems.innerHTML = "";

  renderApp();
});

cancelEditBtn.addEventListener("click", () => {
  editModalContainer.classList.toggle("hidden");
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    searchModal.classList.add("hidden");
    editModalContainer.classList.add("hidden");
  }
});

editModal.addEventListener("submit", (e) => {
  e.preventDefault();

  const contactIndex = contacts.findIndex(
    (contact) => contact.id === editingId,
  );

  if (contactIndex === -1) return;

  let updatedContact = {
    name: editHrName.value.trim(),
    vacancy: editVacancyName.value.trim(),
    phone: editPhoneNumber.value.trim(),
    id: editingId,
  };

  if (!validateContact(updatedContact)) return;

  contacts[contactIndex] = updatedContact;
  saveContacts();

  editModalContainer.classList.add("hidden");

  renderApp();
  searchContacts(searchInput.value);
});

searchBtn.addEventListener("click", () => {
  searchModal.classList.remove("hidden");
  searchInput.value = "";
  searchItems.innerHTML = "";
});

searchInput.addEventListener("input", (e) => {
  const value = e.target.value;
  searchContacts(value);
});

exitModalBtn.addEventListener("click", () => {
  searchModal.classList.add("hidden");
});

letterList.addEventListener("click", (e) => {
  const button = e.target.closest("button");

  if (!button || !button.dataset.action) return;

  const action = button.dataset.action;
  const id = button.dataset.id;

  if (action === "edit") {
    openEditModal(id);
  }

  if (action === "remove") {
    removeContact(id);
  }

  if (action === "toggle-contracts") {
    toggleLetterContacts(button.dataset.letter);
  }
});

renderAlphabet();
renderApp();
