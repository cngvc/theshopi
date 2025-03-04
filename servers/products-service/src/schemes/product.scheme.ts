import Joi, { ObjectSchema } from 'joi';

const productCreateSchema: ObjectSchema = Joi.object().keys({
  storeId: Joi.string().required().messages({
    'string.base': 'Store Id must be of type string',
    'string.empty': 'Store Id is required',
    'any.required': 'Store Id is required'
  }),
  thumb: Joi.string().optional().allow(null, ''),
  name: Joi.string().required().messages({
    'string.base': 'Please add a product title',
    'string.empty': 'Product title is required',
    'any.required': 'Product title is required'
  }),
  description: Joi.string().required().messages({
    'string.base': 'Please add a product description',
    'string.empty': 'Product description is required',
    'any.required': 'Product description is required'
  }),
  price: Joi.number().required().greater(0.99).messages({
    'string.base': 'Please add a product price',
    'string.empty': 'Product price is required',
    'any.required': 'Product price is required',
    'number.greater': 'Product price must be greater than $0.99'
  }),
  quantity: Joi.number().required().greater(0).messages({
    'string.base': 'Please add a quantity',
    'string.empty': 'Quantity is required',
    'any.required': 'Quantity is required',
    'number.greater': 'Quantity must be greater than 0'
  }),
  categories: Joi.array().items(Joi.string()).optional(),
  tags: Joi.array().items(Joi.string()).optional()
});

const productUpdateSchema: ObjectSchema = Joi.object().keys({
  thumb: Joi.string().optional().allow(null, ''),
  name: Joi.string().required().messages({
    'string.base': 'Please add a product title',
    'string.empty': 'Product title is required',
    'any.required': 'Product title is required'
  }),
  description: Joi.string().required().messages({
    'string.base': 'Please add a product description',
    'string.empty': 'Product description is required',
    'any.required': 'Product description is required'
  }),
  price: Joi.number().required().greater(0.99).messages({
    'string.base': 'Please add a product price',
    'string.empty': 'Product price is required',
    'any.required': 'Product price is required',
    'number.greater': 'Product price must be greater than $0.99'
  }),
  quantity: Joi.number().required().greater(0).messages({
    'string.base': 'Please add a quantity',
    'string.empty': 'Quantity is required',
    'any.required': 'Quantity is required',
    'number.greater': 'Quantity must be greater than 0'
  })
});

export { productCreateSchema, productUpdateSchema };
