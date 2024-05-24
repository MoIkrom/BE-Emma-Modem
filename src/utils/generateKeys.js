const crypto = require("crypto");

const accessKey = crypto.randomBytes(32);
const refreshKey = crypto.randomBytes(32);

console.table({ accessKey, refreshKey });
