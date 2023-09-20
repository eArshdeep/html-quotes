/**
 * @typedef {Object} Quote
 * @property _id {String}
 * @property author {String}
 * @property content {String}
 * @property tags {String[]}
 * @property authorSlug {String}
 * @property length {Number}
 * @property dateAdded {String}
 * @property dateModified {String}
*/

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

function initQuotes() {
    if (localStorage.getItem("data") != null)
    {
        data = JSON.parse(localStorage.getItem("data"));
        populateEntries();
    }
    else fetchQuotes();
}

function fetchQuotes() {
    fetch(API_URL).then(res => {
        res.json().then(ents => {
            data = data.concat(ents);
            populateEntries(ents);
            localStorage.setItem("data", JSON.stringify(data));
        });
    });
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

function handleLoad (event)
{
    fetchQuotes();
}

initQuotes();
