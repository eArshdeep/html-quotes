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

const API_URL = "https://api.quotable.io/quotes/random?limit=5";

/** Quotes data loaded from API.
 * @type Quote[] */
var data = [];

/** Ids of quotes saved by the user.
 * @type String[] */
var saved = [];

/**
 * Tracks whether placeholder cards are rendered.
 * Set to false on when first batch of entries is rendered.
 * @type {Boolean}
*/
var placeholdersShown = true;

/** Save button text value for a saved quote. */
const SAVED = "Saved!";
/** Save button text value for a unsaved quote. */
const UNSAVED = "Save";

var container = document.getElementById("container");

/**
 * Create and add quote entry to DOM.
 * @param {!Quote} quote Quote data.
 */
function createEntry(quote) {
    let entry = document.createElement("div");
    entry.classList.add("entry");
    entry.id = quote._id;

    let title = document.createElement("p");
    title.classList.add("author");
    title.textContent = quote.author;

    let body = document.createElement("p");
    body.classList.add("quote");
    body.textContent = quote.content;

    let saveBtn = document.createElement("button");
    saveBtn.classList.add("save");
    saveBtn.textContent = UNSAVED;
    saveBtn.addEventListener("click", () => {
        handleSave(entry, saveBtn, quote);
    });

    entry.append(title);
    entry.append(body);
    entry.append(saveBtn);
    container.append(entry);
}

function initQuotes() {
    if (localStorage.getItem("data") != null)
    {
        data = JSON.parse(localStorage.getItem("data")) || [];
        populateEntries();
        saved = JSON.parse(localStorage.getItem("saved")) || [];
        // Restore styles for saved entries
        for (let i = 0; i < saved.length; i++)
        {
            document.getElementById(saved[i]).classList.add("saved");
            document.querySelector(`[id='${saved[i]}'] button.save`).textContent = SAVED;
        }
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
        createEntry(entry);
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
    saved = [];
    clearEntries();
    localStorage.removeItem("data");
    localStorage.removeItem("saved");
}

function handleLoad (event)
{
    fetchQuotes();
}

/**
 * Handle quote's save button being clicked.
 * @param {HTMLDivElement} entry Enclosing div.entry element.
 * @param {HTMLButtonElement} saveBtn Save button.
 * @param {Quote} quote Quote associated with entry.
 */
function handleSave(entry, saveBtn, quote) {
    entry.classList.toggle("saved")
    // Saving
    if (saveBtn.textContent == UNSAVED)
    {
        saveBtn.textContent = SAVED
        saved.push(quote._id);
        localStorage.setItem("saved", JSON.stringify(saved));
    }
    // Removing
    else
    {
        saveBtn.textContent = UNSAVED;
        saved = saved.filter(id => id != quote._id)
        localStorage.setItem("saved", JSON.stringify(saved));
    }
}

/**
 * Handle clear saves button being pressed.
 * 
 * Removes styles on entries and clears memory and localStorage
 * store.
 */
function handleClearSaves()
{
    let savedEntries = Array.from(document.getElementsByClassName("saved"));
    for (let i = 0; i < savedEntries.length; i++)
        savedEntries[i].classList.remove("saved");
    
    let saveBtns = document.getElementsByClassName("save");
    for (let i = 0; i < savedEntries.length; i++)
    {
        if (saveBtns[i].textContent == SAVED)
            saveBtns[i].textContent = UNSAVED;
    }
    
    saved = [];
    localStorage.removeItem("saved");
}

initQuotes();
