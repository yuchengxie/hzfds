"use strict";

const path = require("path");
const fs = require("fs");
const pump = require("mz-modules/pump");

var BaseController = require("./base.js");

class GoodsCateController extends BaseController {
  async index() {
    var result = await this.ctx.model.GoodsCate.aggregate([
      {
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
    await this.ctx.render("admin/goodsCate/index", {
      list: result
    });
  }

  async add() {
    var result = await this.ctx.model.GoodsCate.find({ pid: "0" });
    await this.ctx.render("admin/goodsCate/add", {
      cateList: result
    });
  }

  async doAdd() {
    let parts = this.ctx.multipart({ autoFields: true });
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

      //这里看后面的需求，app这个可以忽略，如果是网站，就要考虑裁剪性能
      // this.service.tools.jimpImg(target);
    }

    if (parts.field.pid != 0) {
      parts.field.pid = this.app.mongoose.Types.ObjectId(parts.field.pid); //调用mongoose里面的方法把字符串转换成ObjectId
    }

    let goodsCate = new this.ctx.model.GoodsCate(
      Object.assign(files, parts.field)
    );
    await goodsCate.save();

    await this.success("/admin/goodsCate", "增加分类成功");
  }
  async edit() {
    var _id = this.ctx.request.query.id;
    let cateList = await this.ctx.model.GoodsCate.find({ pid: "0" });
    let result = await this.ctx.model.GoodsCate.find({ _id });
    await this.ctx.render("admin/goodsCate/edit", {
      cateList,
      list: result[0]
    });
  }

  async doEdit() {
    let parts = this.ctx.multipart({ autoFields: true });
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

    if (parts.field.pid != 0) {
      parts.field.pid = this.app.mongoose.Types.ObjectId(parts.field.pid); //调用mongoose里面的方法把字符串转换成ObjectId
    }
    var _id = parts.field.id;
    var updateResult = Object.assign(files, parts.field);
    await this.ctx.model.GoodsCate.updateOne({ _id }, updateResult);
    await this.success("/admin/goodsCate", "商品分类修改成功");
  }
}

module.exports = GoodsCateController;
