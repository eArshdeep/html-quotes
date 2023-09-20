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

/**
 * Tracks whether placeholder cards are rendered.
 * Set to false on when first batch of entries is rendered.
 * @type {Boolean}
*/
var placeholdersShown = true;

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

/**
 * Render quote entries on the DOM.
 * 
 * Renders `entries` if not null, otherwise `data` entries.
 * 
 * @param {Quote[]} [entries] Optional entries to render.
 */
function populateEntries(entries) {
    if (placeholdersShown)
    {
        clearEntries();
        placeholdersShown = false;
    }
    (entries || data).forEach(entry => {
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
