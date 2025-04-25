function getModulesPath () {
  const os = require("os");
  let currentOs = null;
  ["linux", "android"].includes(os.platform()) ? (currentOs = "linux") : os.platform() == "darwin" ? (currentOs = "mac") : (currentOs = "win");
  return "./node/" + currentOs + "/node_modules";
}
const modulesPath = getModulesPath();
module.exports.modulesPath = modulesPath;

function isAndroid() {
  return require("os").platform() === "android";
}
module.exports.isAndroid = isAndroid;

const inquirer = require(modulesPath + "/inquirer");
const bcrypt = require(modulesPath + "/bcryptjs"); // bcrypt is faster, but we use bcryptjs because it is slow which will make the brute force attack slow also
const crypto = require("crypto");
const algorithm = "aes-256-cbc"; // Using AES encryption

function shuffle(arr) {
  return arr.sort(() => (Math.random() > 0.5 ? 1 : -1));
}

function mkPass(length) {
  // ascii_lowercase 30%
  var s1 = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"];
  // ascii_uppercase 30%
  var s2 = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];
  // digits 20%
  var s3 = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
  // punctuation 20%
  var s4 = ["!", '"', "#", "$", "%", "&", "'", "(", ")", "*", "+", ",", "-", ".", "/", ":", ";", "<", "=", ">", "?", "@", "[", "\\", "]", "^", "_", "`", "{", "|", "}", "~"];

  // shuffle lists
  s1 = shuffle(s1);
  s2 = shuffle(s2);
  s3 = shuffle(s3);
  s4 = shuffle(s4);

  // calc percentages
  var part1 = Math.round(length * (30 / 100)); // 30%
  var part2 = Math.round(length * (20 / 100)); // 20%

  var password = [];

  // 30%
  for (let i = 0; i < part1; i++) {
    password.push(s1[i]);
    password.push(s2[i]);
  }

  // 20%
  for (let i = 0; i < part2; i++) {
    password.push(s3[i]);
    password.push(s4[i]);
  }

  // shuffle again
  password = shuffle(password);
  return password.join("");
}

function prompt(data, cb) {
  inquirer
    .prompt(data)
    .then((res) => {
      if (cb) cb(res);
    })
    .catch(console.error);
}

function exists(pwd, secrets) {
  var matched = false;
  for (let i = 0; i < secrets.length; i++) {
    if (bcrypt.compareSync(pwd, secrets[i])) {
      matched = true;
      break;
    }
  }
  return matched;
}

function hashPwd(pwd) {
  return bcrypt.hashSync(pwd, bcrypt.genSaltSync(10));
}

function encrypt(text) {
  const iv = crypto.randomBytes(16);
  const key = crypto.randomBytes(32);
  let cipher = crypto.createCipheriv(algorithm, Buffer.from(key), iv);
  let encrypted = cipher.update(text);
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  const obj = { iv: iv.toString("hex"), key: key.toString("hex"), encryptedData: encrypted.toString("hex") };
  obj.str = obj.iv + "." + obj.key + "." + obj.encryptedData; // order matters: iv . key . encryptedData
  return obj;
}

function decrypt(text) {
  let iv = Buffer.from(text.iv, "hex");
  let encryptedText = Buffer.from(text.encryptedData, "hex");
  let decipher = crypto.createDecipheriv(algorithm, Buffer.from(text.key, "hex"), iv);
  let decrypted = decipher.update(encryptedText);
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  return decrypted.toString();
}

module.exports.prompt = prompt;
module.exports.mkPass = mkPass;
module.exports.exists = exists;
module.exports.decrypt = decrypt;
module.exports.encrypt = encrypt;
