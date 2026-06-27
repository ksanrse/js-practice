const contactForm = document.getElementById("contactForm") as HTMLFormElement;
const letterList = document.getElementById("letterList") as HTMLElement;

const hrName = document.getElementById("hrName") as HTMLInputElement;
const vacancyName = document.getElementById("vacancyName") as HTMLInputElement;
const phoneNumber = document.getElementById("phoneNumber") as HTMLInputElement;

const clearBtn = document.getElementById("clearBtn") as HTMLButtonElement;
const editModalContainer = document.getElementById(
  "editModalContainer",
) as HTMLElement;
const cancelEditBtn = document.getElementById(
  "cancelEditBtn",
) as HTMLButtonElement;

const searchModal = document.getElementById("searchModal") as HTMLElement;
const searchBtn = document.getElementById("searchBtn") as HTMLButtonElement;
const searchInput = document.getElementById("searchInput") as HTMLInputElement;
const searchItems = document.getElementById("searchItems") as HTMLElement;
const editModal = document.getElementById("editModal") as HTMLFormElement;
const exitModalBtn = document.getElementById(
  "exitModalBtn",
) as HTMLButtonElement;

const editHrName = document.getElementById("editHrName") as HTMLInputElement;
const editVacancyName = document.getElementById(
  "editVacancyName",
) as HTMLInputElement;
const editPhoneNumber = document.getElementById(
  "editPhoneNumber",
) as HTMLInputElement;

const alphabet = "абвгдеёжзийклмнопрстуфхцчшщъыьэюяabcdefghijklmnopqrstuvwxyz";

interface Contact {
  name: string;
  id: string;
  phone: string;
  vacancy: string;
}

function isContact(data: unknown): data is Contact {
  if (typeof data !== "object" || data === null) {
    return false;
  }

  const obj = data as Record<string, unknown>;

  return (
    typeof obj.name === "string" &&
    typeof obj.id === "string" &&
    typeof obj.phone === "string" &&
    typeof obj.vacancy === "string"
  );
}

function loadContacts(): Contact[] {
  try {
    const data = JSON.parse(localStorage.getItem("contacts") || "[]");

    if (!Array.isArray(data)) {
      return [];
    }

    return data.filter(isContact);
  } catch {
    return [];
  }
}

let contacts: Contact[] = loadContacts();

let editingId: null | string = null;

function saveContacts(): void {
  localStorage.setItem("contacts", JSON.stringify(contacts));
}

function validateContact(contact: Contact): boolean {
  if (!contact.name.trim()) {
    alert("введите имя");
    return false;
  }

  if (contact.name.trim().length < 2) {
    alert("имя слишком короткое");
    return false;
  }

  const firstLetter = contact.name.trim().charAt(0).toLowerCase();

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

function renderApp(): void {
  renderAllContacts();
  for (const letter of alphabet) {
    const count = countByLetter(letter);
    updateLetterBtnContent(letter, count);
  }
}

function updateLetterBtnContent(letter: string, count: number): void {
  const letterBtn = document.getElementById(`${letter}-letter-btn`);

  if (letterBtn) {
    letterBtn.textContent = `${letter.toUpperCase()}, ${count}`;
  }
}

function renderAlphabet(): void {
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
    letterBtn.dataset.action = "toggle-contacts";
    letterBox.append(letterBtn);

    const letterItems = document.createElement("div");
    letterItems.id = `${letter}-letter-items`;
    letterItems.className = "letterItems hidden";
    letterBox.append(letterItems);
  }
}

function renderAllContacts(): void {
  clearAllContactContainers();

  for (const data of contacts) {
    const letter = data.name.trim().charAt(0).toLowerCase();
    const letterItemsId = `${letter}-letter-items`;
    const letterItemsContainer = document.getElementById(letterItemsId);

    if (letterItemsContainer) {
      letterItemsContainer.append(renderContactCard(data));
    }
  }
}

function renderContactCard(data: Contact): HTMLElement {
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
  removeBtn.dataset.action = "remove";
  removeBtn.dataset.id = data.id;
  buttonGroup.append(removeBtn);

  return card;
}

function clearAllContactContainers(): void {
  for (const letter of alphabet) {
    const letterItemsId = `${letter.toLowerCase()}-letter-items`;
    const letterItemsContainer = document.getElementById(letterItemsId);
    if (letterItemsContainer) {
      letterItemsContainer.innerHTML = "";
    }
  }
}

function countByLetter(letter: string): number {
  let count = 0;

  for (const data of contacts) {
    if (data.name && data.name.trim().charAt(0).toLowerCase() === letter) {
      count++;
    }
  }

  return count;
}

function toggleLetterContacts(letter: string): void {
  const idx = `${letter}-letter-items`;
  const letterEl = document.getElementById(idx);
  if (letterEl) {
    letterEl.classList.toggle("hidden");
  }
}

function removeContact(id: string): void {
  contacts = contacts.filter((contact) => contact.id !== id);
  saveContacts();

  renderApp();
  searchContacts(searchInput.value);
}

function openEditModal(id: string): void {
  const currentContact = contacts.find((contact) => contact.id === id);

  if (!currentContact) return;

  editingId = id;
  editModalContainer.classList.remove("hidden");

  editHrName.value = currentContact.name;
  editVacancyName.value = currentContact.vacancy;
  editPhoneNumber.value = currentContact.phone;
}

function searchContacts(query: string): void {
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

  const newContact: Contact = {
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
  editingId = null;
  editModalContainer.classList.add("hidden");
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

  if (contactIndex === -1 || editingId === null) return;

  const updatedContact: Contact = {
    name: editHrName.value.trim(),
    vacancy: editVacancyName.value.trim(),
    phone: editPhoneNumber.value.trim(),
    id: editingId,
  };

  if (!validateContact(updatedContact)) return;

  contacts[contactIndex] = updatedContact;
  saveContacts();

  editingId = null;
  editModalContainer.classList.add("hidden");

  renderApp();
  searchContacts(searchInput.value);
});

searchBtn.addEventListener("click", () => {
  searchModal.classList.remove("hidden");
  searchInput.value = "";
  searchItems.innerHTML = "";
});

searchInput.addEventListener("input", () => {
  const value = searchInput.value;
  searchContacts(value);
});

exitModalBtn.addEventListener("click", () => {
  searchModal.classList.add("hidden");
});

letterList.addEventListener("click", (e) => {
  const target = e.target as HTMLElement;
  const button = target.closest("button");

  if (!button || !button.dataset.action) return;

  const action = button.dataset.action;
  const id = button.dataset.id ?? "";
  const letter = button.dataset.letter ?? "";

  if (action === "edit") {
    openEditModal(id);
  }

  if (action === "remove") {
    removeContact(id);
  }

  if (action === "toggle-contacts") {
    toggleLetterContacts(letter);
  }
});

renderAlphabet();
renderApp();
