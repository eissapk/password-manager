const { modulesPath, mkPass, prompt, exists, isAndroid } = require("./olum");
const fs = require("fs");
const path = require("path");
const colors = require(modulesPath + "/colors");
const commander = require(modulesPath + "/commander");
const pkgJSON = require("./package.json");
const getEntry = require("./get");
const addEntry = require("./add");

// connect to db
let db = null;
let secrets = null;
try {
  db = JSON.parse(fs.readFileSync(path.resolve(__dirname, "./db.json")).toString());
  secrets = JSON.parse(fs.readFileSync(path.resolve(__dirname, "./credentials.json")).toString()).secrets;
} catch (err) {
  return console.error(colors.red("Couldn't connect to db!"), "\n", err);
}

const cmd = new commander.Command();

cmd.option("--id <id>", "Include account id - use it with 'get/add' commands");
cmd.option("--name <name>", "Include account name - use it with 'get/add' commands");
cmd.option("--location <location>", "Include account url - use it with 'get/add' commands");
cmd.option("--username <username>", "Include account username - use it with 'get/add' commands");
cmd.option("--login <login>", "Include account login - use it with 'get/add' commands");

cmd.option("--copy", "Copy account password to clipboard - use it with 'get' command");
cmd.option("--update", "Update account in db - use it with 'get' command");
cmd.option("--delete", "Delete account in db - use it with 'get' command");

cmd.option("--length <length>", "Password length - use it with 'make' command");

cmd.command("add").description("Add account").action(add);
cmd.command("get").description("display account(s)").action(get);
cmd.command("make").description("Generate a password").action(make);

cmd.version(pkgJSON.version).description("Password Manager CLI Tool (" + pkgJSON.version + ")");
cmd.on("command:*", (operands) => {
  console.error(colors.red(`error: unknown command '${operands[0]}'\n Try running --help`));
  process.exitCode = 1;
});

cmd.parse(process.argv);

function add() {
  var obj = cmd.opts();
  if (!obj.name) return console.error(colors.red("Missing --name argument!"));
  if (!obj.location) return console.error(colors.red("Missing --location argument!"));
  if (!obj.username) return console.error(colors.red("Missing --username argument!"));
  if (!obj.login) obj.login = "";

  prompt([{ type: "password", name: "password", message: "MASTER PASSWORD:" }], function (data) {
    var pwdExists = exists(data.password, secrets);
    if (!pwdExists) return console.error(colors.red("Wrong password!"));
    addEntry(db, obj);
  });
}

function get() {
    var query = {};
    var opts = cmd.opts();
    if (opts.id) query.id = opts.id;
    if (opts.name) query.name = opts.name;
    if (opts.location) query.location = opts.location;
    if (opts.username) query.username = opts.username;
    if (opts.login) query.login = opts.login;

  prompt([{ type: "password", name: "password", message: "MASTER PASSWORD:" }], function (data) {
    var pwdExists = exists(data.password, secrets);
    if (!pwdExists) return console.error(colors.red("Wrong password!"));
    getEntry(db, query, opts);
  });
}

function make() {
  var obj = cmd.opts();
  if (!obj.length) return console.error(colors.red("Missing --length argument!"));
  var pass = mkPass(+obj.length);

  if (isAndroid()) {
      console.log(colors.green(pass));
      return process.exit(1);
  }

  const ncp = require(modulesPath + "/copy-paste");
  ncp.copy(pass, () => {
    console.log(colors.green("Copied to clipboard:"), pass);
    process.exit(1);
  });

}
