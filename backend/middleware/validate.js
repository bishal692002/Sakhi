const Joi = require('joi');

// Validate request body based on schema
const validate = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);
    
    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message
      });
    }
    
    next();
  };
};

// Auth validation schema
const registerSchema = Joi.object({
  name: Joi.string().required().max(50),
  email: Joi.string().email().required(),
  password: Joi.string().required().min(6)
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
});

// Period validation schema
const periodSchema = Joi.object({
  startDate: Joi.date().required(),
  cycleLength: Joi.number().min(20).max(45).default(28),
  periodLength: Joi.number().min(1).max(10).default(5)
});

// Symptom validation schema
const symptomSchema = Joi.object({
  date: Joi.date().default(Date.now),
  mood: Joi.string().valid('happy', 'sad', 'angry', 'anxious', 'neutral', 'other'),
  cramps: Joi.string().valid('none', 'mild', 'moderate', 'severe'),
  flow: Joi.string().valid('none', 'light', 'medium', 'heavy'),
  headache: Joi.boolean().default(false),
  backache: Joi.boolean().default(false),
  bloating: Joi.boolean().default(false),
  notes: Joi.string().max(500)
});

module.exports = {
  validate,
  registerSchema,
  loginSchema,
  periodSchema,
  symptomSchema
};
