const { modulesPath, prompt, encrypt } = require("./olum");
const fs = require("fs");
const path = require("path");
const colors = require(modulesPath + "/colors");

function mkEntryId(arr) {
  if (!arr.length) return 1;
  let ids = [];
  arr.forEach((obj) => ids.push(obj.id)); // push all ids
  ids.sort((a, b) => a - b); // ascending order
  const currentMaxId = ids.pop();
  const nextId = currentMaxId + 1; // get max number + 1
  //   console.log({ currentMaxId });
  //   console.log({ nextId });
  return nextId;
}

function addEntry(db, entry) {
  const dbPath = path.resolve(__dirname, "./db.json");
  if (!fs.existsSync(dbPath)) return console.error(colors.red("DB doesn't exist @: " + dbPath));

  const entryExists = db.accounts.find((obj) => {
    if (entry["name"] == obj["name"] && entry["location"] == obj["location"] && entry["username"] == obj["username"] && entry["login"] == obj["login"]) return obj;
  });
  if (entryExists) return console.log(colors.yellow("Entry exists!"));

  prompt([{ type: "password", name: "password", message: "Add password: " }], function (data) {
    entry.password = encrypt(data.password.trim()).str;
    entry.id = mkEntryId(db.accounts);
    // console.log(entry);
    db.accounts.push(entry); // push new entry
    console.log(colors.green("[+] Added entry."));

    try {
      fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));
      console.log(colors.green("[+] Updated db."));
    } catch (err) {
      console.log(colors.red("Error while adding entry!"), err);
    }
  });
}

module.exports = addEntry;
