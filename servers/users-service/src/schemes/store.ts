import Joi, { ObjectSchema } from 'joi';

const storeSchema: ObjectSchema = Joi.object().keys({
  _id: Joi.string().optional(),
  fullName: Joi.string().required().messages({
    'string.base': 'Fullname must be of type string',
    'string.empty': 'Fullname is required',
    'any.required': 'Fullname is required'
  }),
  id: Joi.string().optional(),
  username: Joi.string().optional(),
  email: Joi.string().optional(),
  description: Joi.string().required().messages({
    'string.base': 'Please add a store description',
    'string.empty': 'Seller description is required',
    'any.required': 'Seller description is required'
  }),
  responseTime: Joi.number().required().greater(0).messages({
    'string.base': 'Please add a response time',
    'string.empty': 'Response time is required',
    'any.required': 'Response time is required',
    'number.greater': 'Response time must be greater than zero'
  }),
  socialLinks: Joi.array().optional().allow(null, ''),
  ratingsCount: Joi.number().optional(),
  ratingCategories: Joi.object({
    five: { value: Joi.number(), count: Joi.number() },
    four: { value: Joi.number(), count: Joi.number() },
    three: { value: Joi.number(), count: Joi.number() },
    two: { value: Joi.number(), count: Joi.number() },
    one: { value: Joi.number(), count: Joi.number() }
  }).optional(),
  ratingSum: Joi.number().optional(),
  completedOrders: Joi.number().optional(),
  cancelledOrders: Joi.number().optional(),
  totalEarnings: Joi.number().optional(),
  totalProducts: Joi.number().optional(),
  createdAt: Joi.string().optional()
});

export { storeSchema };
