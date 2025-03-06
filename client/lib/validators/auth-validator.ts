import Joi from 'joi';

export const signinFormSchema = Joi.object({
  username: Joi.string().required().messages({
    'any.required': 'Username is required',
    'string.empty': 'Username is required'
  }),
  password: Joi.string().min(8).required().messages({
    'string.min': 'Password must be at least 8 characters',
    'any.required': 'Password is required'
  })
});

export const signupFormSchema = Joi.object({
  username: Joi.string().required().messages({
    'any.required': 'Username is required',
    'string.empty': 'Username is required'
  }),
  password: Joi.string().min(8).required().messages({
    'string.min': 'Password must be at least 8 characters',
    'any.required': 'Password is required'
  }),
  confirmPassword: Joi.string().min(8).required().messages({
    'string.min': 'Confirm password must be at least 8 characters',
    'any.required': 'Confirm password is required'
  }),
  email: Joi.string().email().required().messages({
    'string.email': 'Invalid email address',
    'any.required': 'Email is required'
  })
}).custom((data, helpers) => {
  if (data.password !== data.confirmPassword) {
    return helpers.error('any.invalid', { message: "Password don't match" });
  }
  return data;
});
