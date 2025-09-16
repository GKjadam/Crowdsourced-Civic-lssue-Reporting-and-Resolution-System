const Complaint = require('../models/Complaint');
const { v4: uuidv4 } = require('uuid');

// Create new complaint
exports.createComplaint = async (req, res) => {
  try {
    const { userId, location, description, staffId } = req.body;
    const image = req.file ? req.file.filename : null;

    const complaint = new Complaint({
      complaintId: uuidv4(),
      userId,
      location,
      image,
      description,
      staffId
    });

    await complaint.save();
    res.status(201).json(complaint);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create complaint' });
  }
};

// Get all complaints
exports.getAllComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find();
    res.json(complaints);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch complaints' });
  }
};

// Get complaint by ID
exports.getComplaintById = async (req, res) => {
  try {
    const complaint = await Complaint.findOne({ complaintId: req.params.id });
    if (!complaint) return res.status(404).json({ error: 'Complaint not found' });
    res.json(complaint);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch complaint' });
  }
};

// Update complaint
exports.updateComplaint = async (req, res) => {
  try {
    const { description, location, staffId } = req.body;
    const updateFields = {
      updatedAt: new Date()
    };

    if (description) updateFields.description = description;
    if (location) updateFields.location = location;
    if (staffId) updateFields.staffId = staffId;

    const updatedComplaint = await Complaint.findOneAndUpdate(
      { complaintId: req.params.id },
      updateFields,
      { new: true }
    );

    if (!updatedComplaint) return res.status(404).json({ error: 'Complaint not found' });

    res.json(updatedComplaint);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update complaint' });
  }
};

// Delete complaint
exports.deleteComplaint = async (req, res) => {
  try {
    const result = await Complaint.findOneAndDelete({ complaintId: req.params.id });
    if (!result) return res.status(404).json({ error: 'Complaint not found' });
    res.json({ message: 'Complaint deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete complaint' });
  }
};
