// In server/routes/complaints.js
const express = require('express');
const router = express.Router();
const Complaint = require('../models/complaint');
const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');

// --- Multer Storage Configuration ---
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/'); // Make sure this 'uploads' directory exists
    },
    filename: function (req, file, cb) {
        // Create a unique filename to avoid overwriting files
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

// --- UPDATED: POST a new complaint with file upload ---
router.post('/', upload.single('attachment'), async (req, res) => {
    try {
        const { name, email, type, description } = req.body;

        const newComplaint = new Complaint({
            name,
            email,
            complaintType: type,
            description,
            // If a file was uploaded, save its path
            attachment: req.file ? req.file.path : null 
        });

        const savedComplaint = await newComplaint.save();
        res.status(201).json({
            message: "Complaint submitted successfully!",
            trackingId: savedComplaint._id
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

// GET all complaints
router.get('/', async (req, res) => {
  try {
    const complaints = await Complaint.find().sort({ submittedAt: -1 });
    res.json(complaints);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// Check status by ID or Email
router.post('/status', async (req, res) => {
    const { identifier } = req.body;
    try {
        let complaints = [];
        if (mongoose.Types.ObjectId.isValid(identifier)) {
            const complaintById = await Complaint.findById(identifier);
            if (complaintById) {
                complaints.push(complaintById);
            }
        }
        if (complaints.length === 0) {
            const complaintsByEmail = await Complaint.find({ email: identifier }).sort({ submittedAt: -1 });
            complaints = complaintsByEmail;
        }
        if (complaints.length === 0) {
            return res.status(404).json({ message: 'No complaints found.' });
        }
        res.json(complaints);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// UPDATE a complaint's status
// In server/routes/complaints.js

// --- UPDATED: UPDATE a complaint's status or reopen reason ---
router.put('/:id', async (req, res) => {
    try {
        const { status, reopenReason } = req.body;
        const updateData = {};

        if (status) {
            updateData.status = status;
        }
        if (reopenReason) {
            updateData.reopenReason = reopenReason;
            updateData.status = 'Reopened'; // Automatically set status to Reopened
        }

        const updatedComplaint = await Complaint.findByIdAndUpdate(
            req.params.id,
            { $set: updateData },
            { new: true } // This option returns the updated document
        );

        if (!updatedComplaint) {
            return res.status(404).json({ message: 'Complaint not found' });
        }
        res.json(updatedComplaint);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// DELETE a complaint
router.delete('/:id', async (req, res) => {
    try {
        const complaint = await Complaint.findByIdAndDelete(req.params.id);
        if (!complaint) {
            return res.status(404).json({ message: 'Complaint not found' });
        }
        res.json({ message: 'Complaint deleted successfully' });
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

module.exports = router;