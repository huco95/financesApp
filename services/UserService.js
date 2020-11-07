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

async function validateUser(username, password) {
    let user = await User.findOne({ username: username });

    if (!user) {
        console.log("User  " + username + " does not exist.");
        return { success: false, message: 'unknown user' };
    }

    if (!auth.isValidPassword(user, password)){
        console.log("Invalid password.");
        return { success: false, message: 'invalid pass' };
    }

    const token = auth.generateToken(user);

    return { success: true, message: 'OK' , token: token };
}

module.exports =
    { 
        createUser,
        validateUser
    };