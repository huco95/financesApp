const express = require("express");
const app = express();
const PORT = 3000;

// Gzip compression
const compression = require('compression');
app.use(compression());

// View engine and public page
app.set('view engine', 'ejs')
app.use(express.static('public'));

//----------------- AUTH -----------------
require("./services/auth/local")(app);

//----------------- VIEWS -----------------
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
