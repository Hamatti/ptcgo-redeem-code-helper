let state = [];

document.querySelector("#clear").addEventListener("click", (ev) => {
  const decision = confirm("Are you sure? This will remove all added codes from the sidebar and browser storage and cannot be reversed.");
  if(decision) {
    browser.storage.local.remove('ptcgo-redeem-codes');
    clearTable();
    state = [];
  }
});

browser.runtime.onMessage.addListener((message) => {
  if (message.action === "addCode") {
    processCodes(message.codes);
  }
});

/* Load existing when sidebar is opened and this script loads */
loadFromStorage();


/* ------ FUNCTIONS ------ */

/**
 * Loads stored codes from local extension storage
 * and renders to sidebar
 */
function loadFromStorage() {
  browser.storage.local.get("ptcgo-redeem-codes").then((results) => {
    render(results["ptcgo-redeem-codes"]);
  });
}

/**
 * Adds the code from the adjacent sibling element
 * to clipboard, adds `copied` class to code table cell
 * and stores the new status to local extension storage.
 */
function onClickCopy(ev) {
  const target = ev.target;
  const parent = target.parentElement.parentElement;

  const code = parent.querySelector("td");
  const codeToCopy = code.textContent.trim();
  code.classList.add("copied");
  target.parentElement.classList.add("copied");

  navigator.clipboard.writeText(codeToCopy).then(() => {
    browser.storage.local.get("ptcgo-redeem-codes").then((results) => {
      let codes = results["ptcgo-redeem-codes"];
      codes = {
        ...codes,
        [codeToCopy]: true,
      };
      browser.storage.local.set({
        "ptcgo-redeem-codes": codes,
      }).then(() => { console.log('Successfully stored in onCLickCopy')}).catch(err => {
        console.log(err)
      });
    });
  });
}

/**
 * Creates a <tr> element for code
 * 
 * @param {string} code Code to be redeemed
 * @param {boolean} isCopied True if code has already been copied before
 * @returns new <tr> element with code and button
 */
function createRow(code, isCopied) {
  const codeTd = document.createElement("td");
  codeTd.textContent = code;
  if (isCopied) {
    codeTd.classList.add("copied");
  }

  const button = document.createElement("button");
  button.textContent = `Copy`;
  button.addEventListener("click", onClickCopy);

  const buttonTd = document.createElement("td");
  buttonTd.classList.add('copy')
  buttonTd.appendChild(button);

  const newRow = document.createElement("tr");
  newRow.appendChild(codeTd);
  newRow.appendChild(buttonTd);

  return newRow;
}

/**
 * Renders a table tbody with codes
 * 
 * @param {object} codes 
 */
function render(codes) {
  const tbody = document.querySelector("table tbody");
  Object.keys(codes).forEach((code) => {
    if (state.includes(code)) {
      return;
    }
    const row = createRow(code, codes[code]);
    tbody.appendChild(row);
    state.push(code);
  });
}

/**
 * Processes a raw array of string codes:
 *  - creates an object with string codes as keys and false as value
 *  - stores them to local extension storage
 *  - renders the table to sidebar
 * @param {array} codes 
 */
function processCodes(codes) {
  const processedCodes = codes.reduce((acc, cur) => {
    return { ...acc, [cur]: false };
  }, {});
  storeToStorage(processedCodes);
  render(processedCodes);
}

/**
 * Adds codes to local extension storage
 * 
 * @param {object} codes 
 */
function storeToStorage(codes) {
  browser.storage.local.get("ptcgo-redeem-codes").then((fromStorage) => {
    const combinedCodes = {
      ...codes,
      ...fromStorage['ptcgo-redeem-codes'],
    };

    browser.storage.local.set({
      "ptcgo-redeem-codes": combinedCodes,
    }).then(() => { console.log('Successfully stored in storeToStorage')}).catch(err => {
      console.log(err)
    });
  });
}

/**
 * Removes all rows from tbody
 */
function clearTable() {
  const tbody = document.querySelector("table tbody");
  while(tbody.firstChild) {
    tbody.removeChild(tbody.firstChild)
  }
}