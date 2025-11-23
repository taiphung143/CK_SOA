const Joi = require('joi');

const validate = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body, { abortEarly: false });
    
    if (error) {
      const errors = error.details.map(detail => ({
        field: detail.path[0],
        message: detail.message
      }));

      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors
      });
    }

    next();
  };
};

// Validation schemas
const registerSchema = Joi.object({
  full_name: Joi.string().min(2).max(100).required(),
  name: Joi.string().min(2).max(100).optional(),
  username: Joi.string().alphanum().min(3).max(50).optional(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required()
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
});

const forgotPasswordSchema = Joi.object({
  email: Joi.string().email().required()
});

const resetPasswordSchema = Joi.object({
  password: Joi.string().min(6).required()
});

const updateProfileSchema = Joi.object({
  name: Joi.string().min(2).max(100),
  phone_number: Joi.string().max(20),
  birth: Joi.date(),
  avatar: Joi.string().uri()
}).min(1);

const changePasswordSchema = Joi.object({
  currentPassword: Joi.string().required(),
  newPassword: Joi.string().min(6).required()
});

const addressSchema = Joi.object({
  recipient_name: Joi.string().min(2).max(100).required(),
  phone: Joi.string().max(20).required(),
  street_address: Joi.string().max(255).required(),
  city: Joi.string().max(100).required(),
  state: Joi.string().max(100),
  postal_code: Joi.string().max(20),
  country: Joi.string().max(100),
  is_default: Joi.boolean()
});

module.exports = {
  validate,
  registerSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  updateProfileSchema,
  changePasswordSchema,
  addressSchema
};
