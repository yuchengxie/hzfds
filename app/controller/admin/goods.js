"use strict";

var BaseController = require("./base.js");
const fs = require("fs");
const pump = require("mz-modules/pump");

class GoodsController extends BaseController {
  async index() {
    let page = this.ctx.request.query.page || 1;
    let pageSize = this.config.page;
    let keyword = this.ctx.request.query.keyword;

    //正则模糊查询-关键词
    var json = {};
    if (keyword) {
      json = Object.assign({
        title: {
          $regex: new RegExp(keyword)
        }
      });
    }
    let goodsResult = await this.ctx.model.Goods.find(json)
      .skip((page - 1) * pageSize)
      .limit(pageSize);
    let totalNum = await this.ctx.model.Goods.find(json).count();
    await this.ctx.render("admin/goods/index", {
      list: goodsResult,
      totalPages: Math.ceil(totalNum / pageSize),
      page,
      keyword: keyword
    });
  }

  async add() {
    //获取所有颜色值
    var colorResult = await this.ctx.model.GoodsColor.find();
    //获取所有商品类型
    var goodsType = await this.ctx.model.GoodsType.find();
    //获取商品分类
    var goodsCate = await this.ctx.model.GoodsCate.aggregate([{
        $lookup: {
          from: "goods_cate",
          localField: "_id",
          foreignField: "pid",
          as: "items"
        }
      },
      {
        $match: {
          pid: "0"
        }
      }
    ]);
    await this.ctx.render("admin/goods/add", {
      colorResult,
      goodsType,
      goodsCate
    });
  }

  async edit() {
    //获取修改数据的id
    var id = this.ctx.request.query.id;
    //获取所有的颜色值
    var colorResult = await this.ctx.model.GoodsColor.find({});
    // this.ctx.body='edit';
    // 获取所有的商品类型
    var goodsType = await this.ctx.model.GoodsType.find({});
    // //获取商品分类
    var goodsCate = await this.ctx.model.GoodsCate.aggregate([{
        $lookup: {
          from: "goods_cate",
          localField: "_id",
          foreignField: "pid",
          as: "items"
        }
      },
      {
        $match: {
          pid: "0"
        }
      }
    ]);
    // //获取修改的商品
    var goodsResult = await this.ctx.model.Goods.find({
      _id: id
    });
    // console.log("goodsResult:", goodsResult);
    // //获取当前商品的颜色
    // // 5bbb68dcfe498e2346af9e4a,5bbb68effe498e2346af9e4b,5bc067d92e5f889dc864aa96
    let colorArrTemp = [];
    var goodsColorArr = [];
    var goodsColorReulst = [];
    if (goodsResult[0].goods_color) {
      colorArrTemp = goodsResult[0].goods_color.split(",");
      colorArrTemp.forEach(value => {
        goodsColorArr.push({
          _id: value
        });
      });
      goodsColorReulst = await this.ctx.model.GoodsColor.find({
        $or: goodsColorArr
      });
    }
    // console.log("colorArrTemp:", colorArrTemp);

    // console.log("goodsColorReulst:", goodsColorReulst);

    //获取规格信息

    var goodsAttsResult = await this.ctx.model.GoodsAttr.find({
      goods_id: goodsResult[0]._id
    });

    // console.log('goodsAttsResult:',goodsAttsResult);

    var goodsAttsStr = "";

    goodsAttsResult.forEach(async val => {
      if (val.attribute_type == 1) {
        goodsAttsStr += `<li><span>${val.attribute_title}: 　</span><input type="hidden" name="attr_id_list" value="${val.attribute_id}" />  <input type="text" name="attr_value_list"  value="${val.attribute_value}" /></li>`;
      } else if (val.attribute_type == 2) {
        goodsAttsStr += `<li><span>${val.attribute_title}: 　</span><input type="hidden" name="attr_id_list" value="${val.attribute_id}" />  <textarea cols="50" rows="3" name="attr_value_list">${val.attribute_value}</textarea></li>`;
      } else {
        //获取 attr_value  获取可选值列表
        var oneGoodsTypeAttributeResult = await this.ctx.model.GoodsTypeAttribute.find({
          _id: val.attribute_id
        });

        var arr = oneGoodsTypeAttributeResult[0].attr_value.split("\n");

        goodsAttsStr += `<li><span>${val.attribute_title}: 　</span><input type="hidden" name="attr_id_list" value="${val.attribute_id}" />`;

        goodsAttsStr += `<select name="attr_value_list">`;

        for (var j = 0; j < arr.length; j++) {
          if (arr[j] == val.attribute_value) {
            goodsAttsStr += `<option value="${arr[j]}" selected >${arr[j]}</option>`;
          } else {
            goodsAttsStr += `<option value="${arr[j]}" >${arr[j]}</option>`;
          }
        }
        goodsAttsStr += `</select>`;
        goodsAttsStr += `</li>`;
      }
    });

    // console.log("goodsAttsStr:", goodsAttsStr);
    // console.log(' goodsResult[0]._id:', goodsResult[0]._id);

    //商品的图库信息
    var goodsImageResult = await this.ctx.model.GoodsImage.find({
      goods_id: goodsResult[0]._id
    });

    await this.ctx.render("admin/goods/edit", {
      colorResult: colorResult,
      goodsType: goodsType,
      goodsCate: goodsCate,
      goods: goodsResult[0],
      goodsAtts: goodsAttsStr,
      goodsImage: goodsImageResult,
      goodsColor: goodsColorReulst
    });
  }
  async doAdd() {
    let parts = this.ctx.multipart({
      autoFields: true
    });
    let files = {};
    let stream;
    while ((stream = await parts()) != null) {
      if (!stream.filename) {
        break;
      }
      files = await this.service.tools.uploadFile(stream, files);
      // if (!stream.filename) {
      //   break;
      // }
      // let fieldname = stream.fieldname; //file表单的名字
      // //上传图片的目录
      // let dir = await this.service.tools.getUploadFile(stream.filename);
      // let target = dir.uploadDir;
      // let writeStream = fs.createWriteStream(target);
      // await pump(stream, writeStream);
      // files = Object.assign(files, {
      //   [fieldname]: dir.saveDir
      // });
      // this.service.tools.jimpImg(target);
    }
    let formFields = Object.assign(files, parts.field);
    let goods_color = this.ctx.helper.arrToStr(formFields.goods_color);
    formFields.goods_color = goods_color || "";
    //增加商品信息
    let goodsRes = await this.ctx.model.Goods(formFields);
    let result = await goodsRes.save();
    //增加图库信息
    let goods_image_list = formFields.goods_image_list; //须数组类型
    if (result._id && goods_image_list) {
      if (typeof goods_image_list == "string") {
        goods_image_list = new Array(goods_image_list);
      }
      for (let i = 0; i < goods_image_list.length; i++) {
        let goodsImageRes = new this.ctx.model.GoodsImage({
          goods_id: result._id,
          img_url: goods_image_list[i]
        });
        await goodsImageRes.save();
      }
    }
    //增加商品类型信息
    let attr_value_list = formFields.attr_value_list;
    let attr_id_list = formFields.attr_id_list;
    // console.log("attr_value_list:", attr_value_list);
    // console.log("attr_id_list:", attr_id_list);
    if (result._id && attr_value_list && attr_id_list) {
      if (typeof attr_id_list == "string") {
        attr_id_list = new Array(attr_id_list);
        attr_value_list = new Array(attr_value_list);
      }
      for (let i = 0; i < attr_value_list.length; i++) {
        if (attr_value_list[i]) {
          let goodsTypeAttributeRes = await this.ctx.model.GoodsTypeAttribute.find({
            _id: attr_id_list[i]
          });
          // console.log("goodsTypeAttributeRes:", goodsTypeAttributeRes);
          let goodsAttrRes = new this.ctx.model.GoodsAttr({
            goods_id: result._id,
            cate_id: formFields.cate_id,
            attribute_id: attr_id_list[i],
            attribute_type: goodsTypeAttributeRes[0].attr_type,
            attribute_title: goodsTypeAttributeRes[0].title,
            attribute_value: attr_value_list[i]
          });
          // console.log("goodsAttrRes:", goodsAttrRes);
          await goodsAttrRes.save();
        }
      }
    }
    await this.success("/admin/goods", "增加商品数据成功");
  }

  async doEdit() {
    let parts = this.ctx.multipart({
      autoFields: true
    });
    let files = {};
    let stream;
    while ((stream = await parts()) != null) {
      if (!stream.filename) {
        break;
      }
      files = await this.service.tools.uploadFile(stream, files);
      // if (!stream.filename) {
      //   break;
      // }
      // let fieldname = stream.fieldname; //file表单的名字
      // //上传图片的目录
      // let dir = await this.service.tools.getUploadFile(stream.filename);
      // let target = dir.uploadDir;
      // let writeStream = fs.createWriteStream(target);
      // await pump(stream, writeStream);
      // files = Object.assign(files, {
      //   [fieldname]: dir.saveDir
      // });
      // this.service.tools.jimpImg(target);
    }
    let formFields = Object.assign(files, parts.field);
    formFields.goods_color =
      this.ctx.helper.arrToStr(formFields.goods_color) || "";
    // console.log('formFields:',formFields,formFields.goods_color);
    //修改商品信息
    let goods_id = formFields.id;
    await this.ctx.model.Goods.updateOne({
      _id: goods_id
    }, formFields);
    //修改图库信息 (增加操作)
    let goods_image_list = formFields.goods_image_list; //须数组类型
    if (goods_id && goods_image_list) {
      if (typeof goods_image_list == "string") {
        goods_image_list = new Array(goods_image_list);
      }
      for (let i = 0; i < goods_image_list.length; i++) {
        let goodsImageRes = new this.ctx.model.GoodsImage({
          goods_id: goods_id,
          img_url: goods_image_list[i]
        });
        await goodsImageRes.save();
      }
    }
    //修改商品类型数据
    //1.删除以前的数据
    await this.ctx.model.GoodsAttr.deleteMany({
      goods_id: goods_id
    }); //没有删掉
    //2.增加修改的数据
    //增加商品类型信息
    let attr_value_list = formFields.attr_value_list;
    let attr_id_list = formFields.attr_id_list;
    if (goods_id && attr_value_list && attr_id_list) {
      if (typeof attr_id_list == "string") {
        attr_id_list = new Array(attr_id_list);
        attr_value_list = new Array(attr_value_list);
      }
      for (let i = 0; i < attr_value_list.length; i++) {
        // if (attr_value_list[i]) {
        let goodsTypeAttributeRes = await this.ctx.model.GoodsTypeAttribute.find({
          _id: attr_id_list[i]
        });
        let goodsAttrRes = new this.ctx.model.GoodsAttr({
          goods_id: goods_id,
          cate_id: formFields.cate_id,
          attribute_id: attr_id_list[i],
          attribute_type: goodsTypeAttributeRes[0].attr_type,
          attribute_title: goodsTypeAttributeRes[0].title,
          attribute_value: attr_value_list[i]
        });
        // console.log("goodsAttrRes:", goodsAttrRes);
        await goodsAttrRes.save();
        // }
      }
    }
    // await this.success("/admin/goods", "修改商品数据成功");
    await this.success("/admin/goods", "修改商品数据成功");
  }

  // api 请求
  async goodsTypeAttribute() {
    // let cate_id = this.ctx.request.query.id;
    let cate_id = this.ctx.request.query.cate_id;
    // console.log("cate_id:", cate_id);
    if (cate_id == "0") {
      this.ctx.body = {
        result: ""
      };
    } else {
      let goodsTypeAttribute = await this.ctx.model.GoodsTypeAttribute.find({
        cate_id
      });
      this.ctx.body = {
        result: goodsTypeAttribute
      };
    }
  }

  //上传商品详情的图片
  async goodsUploadImage() {
    let parts = this.ctx.multipart({
      autoFields: true
    });
    let files = {};
    let stream;
    while ((stream = await parts()) != null) {
      if (!stream.filename) {
        break;
      }
      files = await this.service.tools.uploadFile(stream, files);
      // if (!stream.filename) {
      //   break;
      // }
      // let fieldname = stream.fieldname; //file表单的名字
      // //上传图片的目录
      // let dir = await this.service.tools.getUploadFile(stream.filename);
      // let target = dir.uploadDir;
      // let writeStream = fs.createWriteStream(target);
      // await pump(stream, writeStream);
      // files = Object.assign(files, {
      //   [fieldname]: dir.saveDir
      // });
    }
    //图片的地址转化成 {link: 'path/to/image.jpg'}
    this.ctx.body = {
      link: files.file
    };
  }

  //上传商品相册图片
  async goodsUploadPhoto() {
    let parts = this.ctx.multipart({
      autoFields: true
    });
    let files = {};
    let stream;
    while ((stream = await parts()) != null) {
      if (!stream.filename) {
        break;
      }
      files = await this.service.tools.uploadFile(stream, files);
      // if (!stream.filename) {
      //   break;
      // }
      // let fieldname = stream.fieldname; //file表单的名字
      // //上传图片的目录---这里不需要压缩
      // let dir = await this.service.tools.getUploadFile(stream.filename);
      // let target = dir.uploadDir;
      // let writeStream = fs.createWriteStream(target);
      // await pump(stream, writeStream);
      // files = Object.assign(files, {
      //   [fieldname]: dir.saveDir
      // });
      // //生成缩略图
      // this.service.tools.jimpImg(target);
    }
    //图片的地址转化成 {link: 'path/to/image.jpg'}
    this.ctx.body = {
      link: files.file
    };
  }

  async changeGoodsImageColor() {
    var color_id = this.ctx.request.body.color_id;
    var goods_image_id = this.ctx.request.body.goods_image_id;
    if (color_id) {
      color_id = this.app.mongoose.Types.ObjectId(color_id);
    }
    let reulst = await this.ctx.model.GoodsImage.updateOne({
      _id: goods_image_id
    }, {
      color_id: color_id
    });
    if (result) {
      this.ctx.body = {
        success: true,
        message: "更新数据成功"
      };
    } else {
      this.ctx.body = {
        success: false,
        message: "更新数据失败"
      };
    }
  }

  async goodsImageRemove() {
    // this.ctx.body={"success":true,"message":"图片删除成功"};
    let goods_image_id = this.ctx.request.body.goods_image_id;
    console.log("goods_image_id:", goods_image_id);
    let res = await this.ctx.model.GoodsImage.deleteOne({
      _id: goods_image_id
    });
    if (res) {
      this.ctx.body = {
        success: true,
        message: "图片删除成功"
      };
    } else {
      this.ctx.body = {
        success: false,
        message: "图片删除失败"
      };
    }
  }
}

module.exports = GoodsController;