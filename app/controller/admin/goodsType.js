var BaseController = require("./base.js");
class GoodsTypeController extends BaseController {
  async index() {
    var list = await this.ctx.model.GoodsType.find({});
    await this.ctx.render("admin/goodsType/index", {
      list
    });
  }

  async add() {
    await this.ctx.render("admin/goodsType/add", {});
  }
  async doAdd() {
    //将数据写入数据库
    var goodsType = this.ctx.model.GoodsType(this.ctx.request.body);
    await goodsType.save();
    await this.success("/admin/goodsType", "增加商品类型成功");
  }
  async edit() {
    var _id = this.ctx.query.id;
    var list = await this.ctx.model.GoodsType.find({ _id });
    await this.ctx.render("admin/goodsType/edit", {
      list: list[0]
    });
  }
  async doEdit() {
    var p = this.ctx.request.body;
    var _id = p._id;
    await this.ctx.model.GoodsType.updateOne(
      { _id },
      {
        title: p.title,
        description: p.description
      }
    );
    await this.success("/admin/goodsType", `修改商品类型-${p.title}-成功`);
  }
}

module.exports = GoodsTypeController;
