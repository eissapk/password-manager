const { modulesPath, prompt, encrypt } = require("./olum");
const fs = require("fs");
const path = require("path");
const colors = require(modulesPath + "/colors");

function updateEntry(db, filteredEntries) {
  if (filteredEntries.length) {
    const entry = filteredEntries[0];
    const dbPath = path.resolve(__dirname, "./db.json");
    if (!fs.existsSync(dbPath)) return console.error(colors.red("DB doesn't exist @: " + dbPath));

    prompt([{ type: "confirm", name: "question", message: "The entry will be " + colors.yellow("updated") + ", Are you sure" }], function (data) {
      if (!data.question) return;

      const id = entry.id;
      const newEntry = { name: null, location: null, username: null, login: null, password: null, id };

      // ask for new values
      prompt([{ type: "input", name: "name", message: "Add name: " }], function (data2) {
        const name = data2.name.trim();
        if (name != "") newEntry.name = name;
        prompt([{ type: "input", name: "location", message: "Add location: " }], function (data3) {
          const location = data3.location.trim();
          if (location != "") newEntry.location = location;
          prompt([{ type: "input", name: "username", message: "Add username: " }], function (data4) {
            const username = data4.username.trim();
            if (username != "") newEntry.username = username;
            prompt([{ type: "input", name: "login", message: "Add login: " }], function (data5) {
              const login = data5.login.trim();
              if (login != "") newEntry.login = login;
              prompt([{ type: "password", name: "password", message: "Add password: " }], function (data6) {
                const password = data6.password.trim();
                if (password != "") newEntry.password = encrypt(password).str;
                next();
              });
            });
          });
        });
      });

      // update values
      function next() {
        db.accounts.find((obj) => {
          if (obj.id == id) {
            if (newEntry.name) obj.name = newEntry.name;
            if (newEntry.location) obj.location = newEntry.location;
            if (newEntry.username) obj.username = newEntry.username;
            if (newEntry.login) obj.login = newEntry.login;
            if (newEntry.password) obj.password = newEntry.password;
          }
        });
        console.log(colors.yellow("[+] Updated entry."));

        try {
          fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));
          console.log(colors.yellow("[+] Updated db."));
        } catch (err) {
          console.log(colors.red("Error while updating entry!"), err);
        }
      }
    });
  }
}

module.exports = updateEntry;
