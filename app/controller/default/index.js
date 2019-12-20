"use strict";

const Controller = require("egg").Controller;

class IndexController extends Controller {
  async index() {
    console.time("indextime");
    // this.ctx.service.sendmsg.send('18825239857','000000');
    //轮播图
    let focus = await this.ctx.service.cache.get("index_focus");
    if (!focus) {
      focus = await this.ctx.model.Focus.find({ type: 1 });
      await this.ctx.service.cache.set("index_focus", focus);
    }
    
    //5dd9eede7689ef564defd8aa-电子书
    let dzs_new = await this.ctx.service.cache.get("index_dzs_new");
    if(!dzs_new){

      dzs_new = await this.service.goods.get_category_recommend_goods(
        "5dd9eede7689ef564defd8aa",
        "new",
        8
      );
      await this.ctx.service.cache.set("index_dzs_new", dzs_new);
    }

    let dzs_hot = await this.ctx.service.cache.get("index_dzs_hot");
    if(!dzs_hot){
      dzs_hot = await this.service.goods.get_category_recommend_goods(
        "5dd9eede7689ef564defd8aa",
        "hot",
        8
      );
      await this.ctx.service.cache.set("index_dzs_hot", dzs_hot);
    }
    
    console.timeEnd("indextime");
    await this.ctx.render("default/index", {
      focus: focus,
      dzs_new,
      dzs_hot
    });
  }
}

module.exports = IndexController;
