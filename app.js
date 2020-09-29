require('dotenv').config();

if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;

// CORS
const cors = require("cors");
const corsOptions = {
    origin: [ "http://localhost:4200", "http://192.168.1.109:4200", "https://huco95.github.io" ]
};
app.use(cors(corsOptions));

// Gzip compression
const compression = require('compression');
app.use(compression());

// View engine and public page
app.set('view engine', 'ejs')
app.use(express.static('public'));

//----------------- AUTH -----------------
require("./services/auth/local")(app);
require("./services/auth/jwt")(app);

//----------------- VIEWS -----------------
app.use(express.json());
app.use(require('./routes'));

// Configure mongoose
require("./config/mongoose")().then(() => {
    // Start server only if mongo is connected
    app.listen(PORT, () => console.log('App is running on ' + PORT));
})
.catch((err) => {
    console.error('Unable to connect to mongo.')
    console.error(err);
});
