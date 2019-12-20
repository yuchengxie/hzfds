module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;
  var d = new Date();

  const GoodsTypeAttributeSchema = new Schema({
    cate_id: { type: Schema.Types.ObjectId },
    title: { type: String },
    attr_type: { type: String },
    attr_value: { type: String },
    status: { type: Number, default: 1 },
    add_time: {
      type: Number,
      default: d.getTime()
    }
  });
  return mongoose.model(
    "GoodsTypeAttribute",
    GoodsTypeAttributeSchema,
    "goods_type_attribute"
  );
};
