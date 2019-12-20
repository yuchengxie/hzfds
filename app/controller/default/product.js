"use strict";

const Controller = require("egg").Controller;

class ProductController extends Controller {
  async list() {
    /*
    1、获取分类id   cid
    2、根据分类id获取当前的分类信息
    3、判断是否是顶级分类
    4、如果是二级分类自己获取二级分类下面的数据          如果是顶级分类 获取顶级分类下面的二级分类  根据二级分类获取下面所有的数据
    */
    var cid = this.ctx.request.query.cid;
    //根据分类id获取当前的分类新
    var curentCate = await this.ctx.model.GoodsCate.find({ _id: cid });
    //判断是否是顶级分类
    if (curentCate[0].pid != 0) {
      // 二级分类
      var goodsList = await this.ctx.model.Goods.find(
        { cate_id: cid },
        "_id title price sub_title goods_img shop_price"
      );
      //  console.log(goodsList);
    } else {
      //顶级分类  获取当前顶级分类下面的所有的子分类
      var subCatesIds = await this.ctx.model.GoodsCate.find(
        { pid: this.app.mongoose.Types.ObjectId(cid) },
        "_id"
      );

      var tempArr = [];
      for (var i = 0; i < subCatesIds.length; i++) {
        tempArr.push({
          cate_id: subCatesIds[i]._id
        });
      }
      var goodsList = await this.ctx.model.Goods.find(
        {
          $or: tempArr
        },
        "_id title price sub_title goods_img shop_price"
      );
    }
    var tpl = curentCate[0].template
      ? curentCate[0].template
      : "default/product_list.html";
    await this.ctx.render(tpl, {
      goodsList: goodsList
    });
  }

  async info() {
    // 1、获取商品信息
    var id = this.ctx.request.query.id;
    var productInfo = await this.ctx.model.Goods.find({ _id: id });
    // console.log(productInfo);
    //2、关联商品
    var relationGoodsIds = this.ctx.service.goods.strToArray(
      productInfo[0].relation_goods
    );

    var relationGoods = await this.ctx.model.Goods.find(
      {
        $or: relationGoodsIds
      },
      "title goods_version shop_price"
    );
    //3、获取关联颜色
    var goodsColorIds = this.ctx.service.goods.strToArray(
      productInfo[0].goods_color
    );
    var goodsColor = await this.ctx.model.GoodsColor.find({
      $or: goodsColorIds
    });

    //4、关联赠品
    var goodsGiftIds = this.ctx.service.goods.strToArray(
      productInfo[0].goods_gift
    );
    var goodsGift = await this.ctx.model.Goods.find({
      $or: goodsGiftIds
    });

    //5、关联配件
    var goodsFittingIds = this.ctx.service.goods.strToArray(
      productInfo[0].goods_fitting
    );
    var goodsFitting = await this.ctx.model.Goods.find({
      $or: goodsFittingIds
    });
    //6、当前商品关联的图片
    var goodsImageResult=await this.ctx.model.GoodsImage.find({"goods_id":id}).limit(8);
    //7、获取规格参数信息
    var goodsAttr=await this.ctx.model.GoodsAttr.find({"goods_id":id});
    // console.log('productInfo:',productInfo[0]);
    console.log('goodsColor:',goodsColor);
    await this.ctx.render("default/product_info.html", {
      productInfo: productInfo[0],
      relationGoods: relationGoods,
      goodsColor: goodsColor,
      goodsGift: goodsGift,
      goodsFitting: goodsFitting,
      goodsImageResult:goodsImageResult,
      goodsAttr:goodsAttr
    });
  }

  async getImagelist() {
    try {
      let color_id = this.ctx.request.query.color_id;
      let goods_id = this.ctx.request.query.goods_id;
      console.log(goods_id, color_id);
      let goodsImages = await this.ctx.model.GoodsImage.find({
        goods_id: goods_id,
        color_id: this.app.mongoose.Types.ObjectId(color_id)
      });
      if(goodsImages.length==0){
        goodsImages=await this.ctx.model.GoodsImage.find({"goods_id":goods_id}).limit(8);
      }
      this.ctx.body = { success: true, result: goodsImages };
    } catch (error) {
      this.ctx.body = { success: false, result: [] };
    }
  }
}

module.exports = ProductController;
