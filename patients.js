const mongoose = require('mongoose');

// Define the Patient schema
const patientSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: true 
    },
    appointments: [
        { 
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'Appointment' 
        }
    ]
});

// Export the Patient model
module.exports = mongoose.model('Patient', patientSchema);