const Period = require('../models/Period');

// @desc    Save period data
// @route   POST /api/period
// @access  Private
exports.savePeriodData = async (req, res, next) => {
  try {
    const { startDate, cycleLength, periodLength } = req.body;
    
    const period = await Period.create({
      startDate,
      cycleLength,
      periodLength,
      user: req.user.id
    });
    
    res.status(201).json({
      success: true,
      data: period
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get latest period data for user
// @route   GET /api/period/latest
// @access  Private
exports.getLatestPeriod = async (req, res, next) => {
  try {
    const period = await Period.findOne({ user: req.user.id })
      .sort({ startDate: -1 });
      
    if (!period) {
      return res.status(404).json({
        success: false,
        message: 'No period data found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: period
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Predict next period and fertile window
// @route   GET /api/period/predict
// @access  Private
exports.predictNextPeriod = async (req, res, next) => {
  try {
    const period = await Period.findOne({ user: req.user.id })
      .sort({ startDate: -1 });
      
    if (!period) {
      return res.status(404).json({
        success: false,
        message: 'No period data found to make predictions'
      });
    }

    // Calculate next period date
    const lastPeriodDate = new Date(period.startDate);
    const nextPeriodDate = new Date(lastPeriodDate);
    nextPeriodDate.setDate(lastPeriodDate.getDate() + period.cycleLength);
    
    // Calculate fertile window (typically 14 days before next period, ±4 days)
    const fertileStart = new Date(nextPeriodDate);
    fertileStart.setDate(nextPeriodDate.getDate() - 18); // 14 + 4 days before
    
    const fertileEnd = new Date(nextPeriodDate);
    fertileEnd.setDate(nextPeriodDate.getDate() - 10); // 14 - 4 days before
    
    // Calculate period end date
    const periodEndDate = new Date(nextPeriodDate);
    periodEndDate.setDate(nextPeriodDate.getDate() + (period.periodLength - 1));
    
    res.status(200).json({
      success: true,
      data: {
        lastPeriod: lastPeriodDate,
        nextPeriod: {
          startDate: nextPeriodDate,
          endDate: periodEndDate,
          cycleLength: period.cycleLength,
          periodLength: period.periodLength
        },
        fertileWindow: {
          startDate: fertileStart,
          endDate: fertileEnd
        }
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};
