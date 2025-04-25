const { modulesPath, decrypt, isAndroid } = require("./olum");
const colors = require(modulesPath + "/colors");
const deleteEntry = require("./delete");
const updateEntry = require("./update");

function showTable(arr) {
  if (!arr.length) return console.log(colors.cyan("0 Entries"));
  console.table(arr, ["id", "name", "location", "username", "login"]);
  console.log(arr.length >= 2 ? arr.length + " rows" : arr.length + " row");
}

function filter(arr, query) {
  const keys = Object.keys(query);
  const filteredAcc = [];
  arr.forEach(obj => {
    if (keys.length === 1) {
      const key = keys[0];
      const value = query[key];
      if (String(obj[key]).includes(value)) filteredAcc.push(obj);
    } else if (keys.length === 2) {
      const key = keys[0];
      const value = query[key];
      const key2 = keys[1];
      const value2 = query[key2];
      if (String(obj[key]).includes(value) && String(obj[key2]).includes(value2)) filteredAcc.push(obj);
    } else if (keys.length === 3) {
      const key = keys[0];
      const value = query[key];
      const key2 = keys[1];
      const value2 = query[key2];
      const key3 = keys[2];
      const value3 = query[key3];
      if (String(obj[key]).includes(value) && String(obj[key2]).includes(value2) && String(obj[key3]).includes(value3)) filteredAcc.push(obj);
    } else if (keys.length === 4) {
      const key = keys[0];
      const value = query[key];
      const key2 = keys[1];
      const value2 = query[key2];
      const key3 = keys[2];
      const value3 = query[key3];
      const key4 = keys[3];
      const value4 = query[key4];
      if (String(obj[key]).includes(value) && String(obj[key2]).includes(value2) && String(obj[key3]).includes(value3) && String(obj[key4]).includes(value4)) filteredAcc.push(obj);
    }
  });
  return filteredAcc;
}

function getEntry(db, query, opts) {
  if (!Object.keys(query).length) return showTable(db.accounts); // show all table

  const filteredEntries = filter(db.accounts, query);
  showTable(filteredEntries); // show matched items

  // console.log({ opts });

  if (opts.update) return updateEntry(db, filteredEntries);
  if (opts.delete) return deleteEntry(db, filteredEntries);
  if (opts.copy) {
    if (filteredEntries.length) {
      let password = filteredEntries[0].password;
      const data = password.split(".");
      password = decrypt({ iv: data[0], key: data[1], encryptedData: data[2] });

      if (isAndroid()) {
        console.log(colors.green(password));
        return process.exit(1);
      }

      var ncp = require(modulesPath + "/copy-paste");
      ncp.copy(password, () => {
        console.log(colors.cyan("Copied password of 1st entry to clipboard"));
        process.exit(1);
      });
    }
  }
}

module.exports = getEntry;
