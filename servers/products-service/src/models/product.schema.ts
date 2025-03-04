import { IProductDocument } from '@cngvc/shopi-shared';
import mongoose, { Model, Schema, model } from 'mongoose';
const { default: slugify } = require('slugify');

const productSchema: Schema = new Schema(
  {
    storeId: { type: mongoose.Schema.Types.ObjectId, index: true },
    name: {
      type: String,
      required: true,
      index: 'text'
    },
    description: { type: String, required: true },
    slug: {
      type: String
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
        rec.id = rec._id;
        delete rec._id;
        return rec;
      }
    }
  }
);

productSchema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

productSchema.virtual('id').get(function () {
  return this._id;
});

const ProductModel: Model<IProductDocument> = model<IProductDocument>('Product', productSchema, 'Product');
export { ProductModel };
