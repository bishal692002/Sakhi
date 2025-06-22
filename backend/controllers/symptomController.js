const Symptom = require('../models/Symptom');

// @desc    Save symptom data
// @route   POST /api/symptoms
// @access  Private
exports.saveSymptom = async (req, res, next) => {
  try {
    const { date, mood, cramps, flow, headache, backache, bloating, notes } = req.body;
    
    // Check if a symptom log already exists for this day
    const existingSymptom = await Symptom.findOne({ 
      user: req.user.id,
      date: {
        $gte: new Date(new Date(date).setHours(0, 0, 0, 0)),
        $lte: new Date(new Date(date).setHours(23, 59, 59, 999))
      }
    });
    
    if (existingSymptom) {
      // Update existing symptom
      const updatedSymptom = await Symptom.findByIdAndUpdate(
        existingSymptom._id,
        { mood, cramps, flow, headache, backache, bloating, notes },
        { new: true, runValidators: true }
      );
      
      return res.status(200).json({
        success: true,
        data: updatedSymptom
      });
    }
    
    // Create new symptom
    const symptom = await Symptom.create({
      date,
      mood,
      cramps,
      flow,
      headache,
      backache,
      bloating,
      notes,
      user: req.user.id
    });
    
    res.status(201).json({
      success: true,
      data: symptom
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get symptom history for user
// @route   GET /api/symptoms
// @access  Private
exports.getSymptoms = async (req, res, next) => {
  try {
    const { startDate, endDate } = req.query;
    
    let query = { user: req.user.id };
    
    // Add date range if provided
    if (startDate && endDate) {
      query.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }
    
    const symptoms = await Symptom.find(query)
      .sort({ date: -1 });
      
    res.status(200).json({
      success: true,
      count: symptoms.length,
      data: symptoms
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get symptom by ID
// @route   GET /api/symptoms/:id
// @access  Private
exports.getSymptomById = async (req, res, next) => {
  try {
    const symptom = await Symptom.findById(req.params.id);
    
    if (!symptom) {
      return res.status(404).json({
        success: false,
        message: 'Symptom not found'
      });
    }
    
    // Make sure user owns the symptom
    if (symptom.user.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to access this symptom'
      });
    }
    
    res.status(200).json({
      success: true,
      data: symptom
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Delete symptom
// @route   DELETE /api/symptoms/:id
// @access  Private
exports.deleteSymptom = async (req, res, next) => {
  try {
    const symptom = await Symptom.findById(req.params.id);
    
    if (!symptom) {
      return res.status(404).json({
        success: false,
        message: 'Symptom not found'
      });
    }
    
    // Make sure user owns the symptom
    if (symptom.user.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to delete this symptom'
      });
    }
    
    await symptom.deleteOne();
    
    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};
