const bcrypt = require('bcryptjs');

const password = 'admin123';
const hash = bcrypt.hashSync(password, 10);

console.log('Generated hash:', hash);
console.log('Verification:', bcrypt.compareSync(password, hash));

// Test with the specific hash
const testHash = '$2a$10$2G7/zfYzEWgGeMvkkPUewuqB1CpVRGQjtW.ueAfgCaf7k5Z0aBQS.';
console.log('Test hash verification:', bcrypt.compareSync('admin123', testHash));
