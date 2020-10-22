const User = require("../schemas/UserSchema");
const auth = require("../services/auth/utils");

async function createUser(username, password) {
    let user = await User.findOne({ username: username }).exec();

    if (user) {
        console.log("User  " + username + " is already registered");
        return { success: false, message: 'duplicate' };
    }

    let newUser = new User();
    newUser.username = username;
    newUser.password = auth.createHash(password);

    // save the user
    newUser = await newUser.save();
    if (newUser) {
        console.log("New user registered: " + newUser.username);
        return { success: true, message: 'OK' };
    }
}

module.exports =
    { 
        createUser
    };