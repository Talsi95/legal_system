const bcrypt = require('bcryptjs');
const password = "123456";
bcrypt.hash(password, 10, (err, hash) => {
    console.log("This is your hashed password:", hash);
});