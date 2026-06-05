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
const exitModalBtn = document.getElementById("exitModalBtn");

const editHrName = document.getElementById("editHrName");
const editVacancyName = document.getElementById("editVacancyName");
const editPhoneNumber = document.getElementById("editPhoneNumber");

const alphabet = "абвгдеёжзийклмнопрстуфхцчшщъыьэюяabcdefghijklmnopqrstuvwxyz";

let contacts = JSON.parse(localStorage.getItem("contacts")) || [];
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

  return true;
}

function renderApp() {
  renderAlphabet();
  renderAllContacts();
}

function renderAlphabet() {
  letterList.innerHTML = "";
  for (const letter of alphabet) {
    letterList.innerHTML += `<div id='${letter}-letter' class="letterBox">
      <div id='${letter}-letter-btn'
      class="letterBtn"
      onclick=toggleLetterContacts('${letter}-letter-items')>${letter.toUpperCase()}, 
      ${countByLetter(letter)}</div>
      <div id='${letter}-letter-items' class="letterItems hidden"></div>
    </div>`;
  }
}

function renderAllContacts() {
  clearAllContactContainers();

  for (const data of contacts) {
    const letter = data.name.trim()[0].toLowerCase();
    const letterItemsId = `${letter}-letter-items`;
    const letterItemsContainer = document.getElementById(letterItemsId);

    if (letterItemsContainer) {
      letterItemsContainer.innerHTML += renderContactCard(data);
    }
  }
}

function renderContactCard(data) {
  return `<div class="dataVisualize">
            <div>
            <p><b>Имя</b>: ${data.name},</p>
            <p><b>Вакансия</b>: ${data.vacancy},</p>
            <p><b>Телефон</b>: ${data.phone}</p>
            </div>
            <div>
                  <button onclick=openEditModal('${data.id}')>Изменить</button>
                  <button onclick=removeContact('${data.id}')>Удалить</button>
                </div>
          </div>`;
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
    if (data.name.trim()[0].toLowerCase() === letter) {
      count++;
    }
  }

  return count;
}

function toggleLetterContacts(letterItemsId) {
  const letter = document.getElementById(letterItemsId);
  letter.classList.toggle("hidden");
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

  if (!lowerQuery) {
    searchItems.innerHTML = "";
    return;
  }

  let htmlContent = "";

  for (const data of contacts) {
    const matchesName = data.name.toLowerCase().includes(lowerQuery);
    const matchesVacancy = data.vacancy.toLowerCase().includes(lowerQuery);
    const matchesPhone = data.phone.toLowerCase().includes(lowerQuery);

    if (matchesName || matchesPhone || matchesVacancy) {
      htmlContent += renderContactCard(data);
    }
  }

  if (htmlContent.length === 0) {
    searchItems.innerHTML = "<p>не нашел ничего</p>";
  } else {
    searchItems.innerHTML = htmlContent;
  }
}

contactForm.onsubmit = function (e) {
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
};

clearBtn.onclick = function () {
  contacts = [];
  saveContacts();

  renderApp();
};

cancelEditBtn.addEventListener("click", () => {
  editModalContainer.classList.toggle("hidden");
});

submitEditBtn.addEventListener("click", (e) => {
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

renderApp();
