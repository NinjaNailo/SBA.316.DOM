const signupFormEl = document.getElementById("signupForm");
const nameInputEl = document.getElementById("nameInput");
const activitySelectEl = document.getElementById("activitySelect");
const termsCheckboxEl = document.getElementById("termsCheckbox");
const submitButtonEl = document.getElementById("submitButton");
const listEl = document.getElementById("list");
const countAllEl = document.getElementById("countAll");
const countCheckedInEl = document.getElementById("countCheckedIn");
const nextUpEl = document.getElementById("nextUp");
const viewportEl = document.getElementById("viewport");
const nameErrorEl = document.getElementById("nameError");

let lineup = [];

function showViewport() {
  viewportEl.textContent = `Viewport: ${window.innerWidth} x ${window.innerHeight}`;
}
window.addEventListener("resize", showViewport);
showViewport();

const titleEl = document.getElementById("title");

setTimeout(() => {
  titleEl.style.color = "blue";
  setTimeout(() => {
    titleEl.style.color = "red";
  }, 500);
}, 500);
function save() {
  localStorage.setItem("lineup", JSON.stringify(lineup));
}

function load() {
  const saved = localStorage.getItem("lineup");
  if (saved) {
    lineup = JSON.parse(saved);
    renderList();
  }
}

function validate() {
  nameErrorEl.style.display = "none";
  const ok =
    nameInputEl.checkValidity() &&
    activitySelectEl.checkValidity() &&
    termsCheckboxEl.checkValidity();
  submitButtonEl.disabled = !ok;
  return ok;
}
nameInputEl.addEventListener("input", validate);
activitySelectEl.addEventListener("input", validate);
termsCheckboxEl.addEventListener("input", validate);

function makeRow(entry) {
  const node = rowTemplate.content.cloneNode(true);
  const row = node.querySelector(".list-item");
  const chk = node.querySelector(".check");
  const pname = node.querySelector(".pname");
  const act = node.querySelector(".activity");

  row.dataset.id = entry.id;
  row.setAttribute("title", "double click the name to edit");
  pname.textContent = entry.name;
  act.textContent = entry.activity;
  chk.checked = entry.checkedIn;
  if (entry.checkedIn) row.classList.add("checked-in");

  return node;
}
function renderList() {
  const frag = document.createDocumentFragment();
  listEl.innerHTML = "";
  for (const e of lineup) {
    frag.appendChild(makeRow(e));
  }
  listEl.appendChild(frag);
  updatedStats();
}
function updatedStats() {
  const all = document.querySelectorAll(".list-item").length;
  const checked = document.querySelectorAll(".list-item.checked-in").length;
  countAllEl.textContent = all;
  countCheckedInEl.textContent = checked;

  const first = listEl.firstChild;
  if (first && first.querySelector(".pname")) {
    const nameSpan = first.querySelector(".pname");
    nextUpEl.textContent = nameSpan ? nameSpan.textContent : "none yet";
  } else {
    nextUpEl.textContent = "none yet";
  }
  function addEntry(name, act) {
    const entry = {
      id: Date.now().toString(),
      name: name,
      act,
      checkedIn: false,
    };
    lineup.push(entry);
    save();
    renderList();
  }
}

signupFormEl.addEventListener("submit", (e) => {
  e.preventDefault();
  if (!validate()) return;
  addEntry(nameInputEl.value, activitySelectEl.value);
  signupFormEl.reset();
  validate();
  nameInputEl.focus();
});

listEl.addEventListener("click", (e) => {
  const row = e.target.closest(".list-item");
  if (!row) return;
  const id = row.dataset.id;
  const idx = lineup.findIndex((e) => e.id === id);
  if (idx === -1) return;

  if (e.target.classList.contains("remove")) {
    const ok = confirm("remove this act now?");
    if (!ok) return;
    lineup.splice(idx, 1);
    save();
    renderList();
    const checked = e.target.checked;
    lineup[idx].checkedIn = checked;
    row.classList.toggle("checked-in", checked);
    save();
    updatedStats();
    row.classList.toggle("checked-in");
    save();
    updatedStats();
  }
});

listEl.addEventListener("dblclick", (e) => {
  const nameSpan = e.target.closest(".pname");
  if (!nameSpan) return;

  const input = document.createElement("input");
  input.type = "text";
  input.value = nameSpan.textContent;
  input.minLength = 2;
  input.maxLength = 30;
  input.pattern = "[A-Za-z0-9 ]{2,30}";
  input.required = true;
  nameSpan.replaceWith(input);
  input.focus();

  input.addEventListener("blur", () => {
    const val = input.value.trim();
    const newSpan = document.createElement("span");
    newSpan.className = "pname";
    newSpan.textContent = val.length >= 2 ? val : "(unnamed)";

    const row = input.closest(".list-item");
    const id = row.dataset.id;
    const idx = lineup.findIndex((e) => e.id === id);
    if (idx !== -1 && val.length >= 2) {
      lineup[idx].name = val;
      save();
    }
    input.replaceWith(newSpan);
    updatedStats();
  });
});

function rowClickHandler(e) {
  const row = e.target.closest(".list-item");
  if (!row) return;
  const id = row.dataset.id;
  const idx = lineup.findIndex((e) => e.id === id);
  if (idx === -1) return;
  function init(){
load()
renderList()
validate()
  }
document.addEventListener("DOMContentLoaded", init);
}