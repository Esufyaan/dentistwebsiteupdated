// models/Appointment.js
const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
    patientName: { type: String, required: true },
    appointmentDate: { type: Date, required: true },
    contactNumber: { type: String, required: true },
    email: { type: String, required: true },
});

const Appointment = mongoose.model('Appointment', appointmentSchema);
module.exports = Appointment;
