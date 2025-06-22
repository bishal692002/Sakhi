const express = require('express');
const { 
  saveSymptom, 
  getSymptoms, 
  getSymptomById,
  deleteSymptom 
} = require('../controllers/symptomController');
const { protect } = require('../middleware/auth');
const { validate, symptomSchema } = require('../middleware/validate');

const router = express.Router();

// All routes require authentication
router.use(protect);

router.route('/')
  .post(validate(symptomSchema), saveSymptom)
  .get(getSymptoms);

router.route('/:id')
  .get(getSymptomById)
  .delete(deleteSymptom);

module.exports = router;
