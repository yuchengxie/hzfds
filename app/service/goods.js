"use strict";

const Service = require("egg").Service;

/**
 * 根据商品分类获取推荐商品
 */
class GoodsService extends Service {
  async hello() {
    console.log("service hello");
  }

  async get_category_recommend_goods(cate_id, type, limit) {
    try {
      //获取分类下面的所有子分类 5dd9eeee7689ef564defd8ab
      let cateIdResult = await this.ctx.model.GoodsCate.find(
        {
          pid: this.app.mongoose.Types.ObjectId("5dd9eede7689ef564defd8aa")
        },
        "_id"
      );
      if (cateIdResult.length == 0) {
        cateIdResult = [{ _id: cate_id }];
      }
      let cateIdsArr = [];
      cateIdResult.forEach(value => {
        cateIdsArr.push({
          cate_id: value._id
        });
      });
      //查找条件
      var findJson = {
        $or: cateIdsArr
      };

      //判断类型
      switch (type) {
        case "hot":
          findJson = Object.assign(findJson, { is_hot: 1 });
          break;
        case "best":
          findJson = Object.assign(findJson, { is_best: 1 });
        case "new":
          findJson = Object.assign(findJson, { is_new: 1 });
          break;
        default:
            findJson = Object.assign(findJson, { is_hot: 1 });
      }
      var limitSize = limit || 10;
      return await this.ctx.model.Goods.find(findJson).limit(limitSize);
    } catch (error) {
      return [];
    }
  }

  strToArray(str){
      
    try {
        var tempIds=[];  
        if(str){
            var idsArr=str.replace(/，/g,',').split(','); 
            for(var i=0;i<idsArr.length;i++){
                tempIds.push({
                    "_id":this.app.mongoose.Types.ObjectId(idsArr[i])            
                });
            }        
            
        }else{
            tempIds=[{"1":-1}]

        }
        return tempIds;    
        
        
    } catch (error) {
        return [{"1":-1}];   //返回一个不成立的条件
    }
  } 
}

module.exports = GoodsService;

