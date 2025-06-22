const express = require('express');
const { 
  savePeriodData, 
  getLatestPeriod, 
  predictNextPeriod 
} = require('../controllers/periodController');
const { protect } = require('../middleware/auth');
const { validate, periodSchema } = require('../middleware/validate');

const router = express.Router();

// All routes require authentication
router.use(protect);

router.post('/', validate(periodSchema), savePeriodData);
router.get('/latest', getLatestPeriod);
router.get('/predict', predictNextPeriod);

module.exports = router;
