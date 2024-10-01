const mongoose = require('mongoose');

// Define the Appointment schema
const appointmentSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: true 
    },
    email: { 
        type: String, 
        required: true,
        match: /.+\@.+\..+/ // Simple email validation regex
    },
    phone: { 
        type: String, 
        required: true,
        match: /^\d{10}$/ // Example: valid for 10-digit phone numbers
    },
    appointment_type: { 
        type: String, 
        required: true 
    },
    date: { 
        type: Date, 
        required: true,
        index: true // Indexing the date field for faster queries
    },
    time: { 
        type: String, 
        required: true 
    },
    comments: { 
        type: String, 
        required: false 
    },
    patient: { // Add a patient field to associate appointments with patients
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Patient'
    }
}, { timestamps: true }); // Enable timestamps

// Export the Appointment model
module.exports = mongoose.model('Appointment', appointmentSchema);