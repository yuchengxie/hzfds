"use strict";

let BaseController = require("./base");

class GoodsTypeAttributeController extends BaseController {
  async index() {
    // 获取当前属性的类型id 即分类id
    var cate_id = this.ctx.request.query.id;
    //聚合管道
    var list = await this.ctx.model.GoodsTypeAttribute.aggregate([
      {
        $lookup: {
          from: "goods_type",
          localField: "cate_id",
          foreignField: "_id",
          as: "goods_type"
        }
      },
      {
        $match: {
          cate_id: this.app.mongoose.Types.ObjectId(cate_id)
        }
      }
    ]);
    await this.ctx.render("admin/goodsTypeAttribute/index", {
      list,
      cate_id
    });
  }
  async add() {
    var cate_id = this.ctx.request.query.id;
    //获取类型数据
    var goodsTypes = await this.ctx.model.GoodsType.find();
    await this.ctx.render("admin/goodsTypeAttribute/add", {
      goodsTypes,
      cate_id
    });
  }

  async doAdd() {
    let cate_id = this.ctx.request.body.cate_id;
    var res = new this.ctx.model.GoodsTypeAttribute(this.ctx.request.body);
    await res.save();
    await this.success(
      "/admin/goodsTypeAttribute?id=" + cate_id,
      "增加商品类型属性成功"
    );
  }

  async edit() {
    var _id = this.ctx.request.query.id;
    let list = await this.ctx.model.GoodsTypeAttribute.find({ _id });
    var goodsTypes = await this.ctx.model.GoodsType.find({});
    await this.ctx.render("admin/goodsTypeAttribute/edit", {
      list: list[0],
      goodsTypes
    });
  }

  async doEdit() {
    var _id = this.ctx.request.body._id;
    var cate_id = this.ctx.request.body.cate_id;
    await this.ctx.model.GoodsTypeAttribute.updateOne(
      { _id },
      this.ctx.request.body
    );
    await this.success(
      "/admin/goodsTypeAttribute?id=" + cate_id,
      "修改数据成功"
    );
  }
}

module.exports = GoodsTypeAttributeController;
