import Joi from 'joi';

export const signinSSOFormSchema = Joi.object({
  accessToken: Joi.string().required().messages({
    'any.required': 'AccessToken is required',
    'string.empty': 'AccessToken is required'
  }),
  refreshToken: Joi.string().min(8).required().messages({
    'string.min': 'RefreshToken must be at least 8 characters',
    'any.required': 'RefreshToken is required'
  })
});
