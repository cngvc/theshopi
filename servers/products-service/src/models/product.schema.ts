import { IProductDocument } from '@cngvc/shopi-types';
import { Model, Schema, model } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
const { default: slugify } = require('slugify');

const productSchema: Schema = new Schema(
  {
    productPublicId: { type: String, unique: true, index: true, default: uuidv4 },
    storePublicId: { type: String, required: true, index: true },
    name: {
      type: String,
      required: true
    },
    description: { type: String, required: true },
    slug: {
      type: String,
      unique: true
    },
    quantity: {
      type: Number,
      required: true
    },
    thumb: {
      type: String
    },
    isPublished: {
      type: Boolean,
      default: false,
      select: false
    },
    tags: [{ type: String }],
    categories: [{ type: String }],
    ratingsCount: { type: Number, default: 0 },
    ratingSum: { type: Number, default: 0 },
    ratingCategories: {
      five: { value: { type: Number, default: 0 }, count: { type: Number, default: 0 } },
      four: { value: { type: Number, default: 0 }, count: { type: Number, default: 0 } },
      three: { value: { type: Number, default: 0 }, count: { type: Number, default: 0 } },
      two: { value: { type: Number, default: 0 }, count: { type: Number, default: 0 } },
      one: { value: { type: Number, default: 0 }, count: { type: Number, default: 0 } }
    },
    price: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now },
    attributes: {
      type: Schema.Types.Mixed
    }
  },
  {
    versionKey: false,
    toJSON: {
      transform(_doc, rec) {
        delete rec._id;
        return rec;
      }
    }
  }
);

productSchema.pre('validate', async function (next) {
  if (!this.productPublicId) {
    this.productPublicId = uuidv4();
  }
  let slug = slugify(this.name, { lower: true });
  let counter = 1;
  while (await ProductModel.findOne({ slug: slug })) {
    slug = `${slug}-${counter}`;
    counter++;
  }
  this.slug = slug;
  next();
});

const ProductModel: Model<IProductDocument> = model<IProductDocument>('Product', productSchema, 'Product');
export { ProductModel };
