const express = require('express');
const app = express();
const port = 4000;
const bodyParser = require('body-parser');
console.log('Initializing server...');

// Connect to database
require('./db');
console.log('Database connection initialized');

// Load models
console.log('Loading models...');
require('./model/User');
require('./model/Ask');
require('./model/Donate');
require('./model/Contact');
require('./model/MedicineRequest');
console.log('Models loaded successfully');

// Configure middleware
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));
const cors = require("cors");
app.use(cors({ origin: true, credentials: true }));
app.use(express.json({ limit: '50mb' }));

// Load route modules
console.log('Configuring routes...');
const authRoutes = require('./routes/authRoutes');
const requireToken = require('./middleware/authTokenRequired');
const askRoutes = require("./routes/askRoutes");
const donateRoutes = require("./routes/donateRoutes");
const contactRoutes = require("./routes/contactRoutes");
const medicineRequestRoutes = require("./routes/medicineRequestRoutes");
const ocrRoutes = require("./routes/ocrRoutes");
const geminiRoutes = require("./routes/geminiRoutes");

// Serve uploaded files
console.log('Configuring static file serving...');
app.use('/uploads', express.static('uploads'));
console.log('Static file serving configured successfully');

// Register routes
console.log('Registering routes...');
app.use(authRoutes);
app.use(askRoutes);
app.use(donateRoutes);
app.use(contactRoutes);
app.use(medicineRequestRoutes);
app.use(ocrRoutes);
app.use(geminiRoutes);
console.log('Routes registered successfully');

// Test route
app.get('/',(req,res) => {
    res.send({ message: 'Server is running' });
    console.log('Home route accessed');
});

// Start server
app.listen(port, () => {
    console.log('Server running on port ' + port);
    console.log('API Base URL: http://localhost:' + port);
});
