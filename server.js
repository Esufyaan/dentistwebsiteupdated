const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');
const cors = require('cors');
const Appointment = require('./appointments'); // Import your Appointment model
const Patient = require('./patients'); // Import your Patient model

const app = express();
const PORT = process.env.PORT || 3000;

// MongoDB connection to local instance
mongoose.connect('mongodb://localhost:27017/dental')
    .then(() => console.log('MongoDB connected on localhost:27017'))
    .catch(err => console.error('MongoDB connection error:', err));

// Middleware
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Serve HTML files
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Endpoint to handle appointment booking
app.post('/submit_appointment', async (req, res) => {
    const { name, email, phone, appointment_type, date, time, comments } = req.body;

    // Find the patient by name and email
    const patient = await Patient.findOne({ name, email });

    if (!patient) {
        // Create a new patient if not found
        const newPatient = new Patient({ name, email });
        await newPatient.save();
        patient = newPatient;
    }

    const newAppointment = new Appointment({
        name,
        email,
        phone,
        appointment_type,
        date: new Date(date), // Ensure date is a Date object
        time,
        comments,
        patient: patient._id // Associate the appointment with the patient
    });

    try {
        await newAppointment.save(); // Save appointment to the database
        patient.appointments.push(newAppointment._id); // Add the appointment to the patient's appointments
        await patient.save(); // Save the updated patient
        res.json({ message: 'Appointment booked successfully' }); // Send a success message
    } catch (err) {
        console.error('Error saving appointment:', err);
        res.status(500).send('Error booking appointment');
    }
});

// Endpoint to fetch future appointments for staff
app.get('/staff/future-appointments', async (req, res) => {
    const currentDate = new Date();
    try {
        const futureAppointments = await Appointment.find({ date: { $gte: currentDate } }).populate('patient'); // Populate the patient field
        res.json(futureAppointments);
    } catch (err) {
        console.error('Error fetching future appointments:', err);
        res.status(500).send('Error fetching future appointments');
    }
});

// Endpoint to fetch past appointments for staff
app.get('/staff/past-appointments', async (req, res) => {
    const currentDate = new Date();
    try {
        const pastAppointments = await Appointment.find({ date: { $lt: currentDate } }).populate('patient'); // Populate the patient field
        res.json(pastAppointments);
    } catch (err) {
        console.error('Error fetching past appointments:', err);
        res.status(500).send('Error fetching past appointments');
    }
});

// Endpoint to fetch all patients
app.get('/patients', async (req, res) => {
    try {
        const patients = await Patient.find({}).populate('appointments'); // Populate the appointments field
        res.json(patients);
    } catch (err) {
        console.error('Error fetching patients:', err);
        res.status(500).send('Error fetching patients');
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});