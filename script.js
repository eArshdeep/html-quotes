var container = document.getElementById("container");

function createEntry(author, quote) {
    let entry = document.createElement("div");
    entry.classList.add("entry");

    let title = document.createElement("p");
    title.classList.add("author");
    title.textContent = author;

    let body = document.createElement("p");
    body.classList.add("quote");
    body.textContent = quote;

    entry.append(title);
    entry.append(body);
    container.append(entry);
}

const API_URL = "https://api.quotable.io/quotes/random?limit=5";
var data = [];

async function initQuotes() {
    if (localStorage.getItem("data") != null)
        data = JSON.parse(localStorage.getItem("data"))
    else await fetchQuotes()
    populateEntries()
}

// loads more entries and append to store.
// return newly fetched entries.
async function fetchQuotes() {
    let res = await fetch(API_URL);
    let ents = await res.json();
    data = data.concat(ents);
    localStorage.setItem("data", JSON.stringify(data));
    return ents;
}

// add entries to dom. render $ents if specified,
// otherwise render whole of $data.
function populateEntries(ents) {
    (ents || data).forEach(entry => {
        createEntry(entry.author, entry.content);
    });
}

function clearEntries() {
    while (container.firstChild) {
        container.removeChild(container.firstChild);
    }
}

function handleClear (event)
{
    data = [];
    clearEntries();
    localStorage.removeItem("data");
}

async function handleLoad (event)
{
    let ents = await fetchQuotes();
    populateEntries(ents);
}

initQuotes();
