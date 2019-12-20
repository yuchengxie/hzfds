"use strict";

const path = require("path");
const fs = require("fs");

const pump = require("mz-modules/pump");
let OSS = require("ali-oss");
/*
1、安装mz-modules

https://github.com/node-modules/mz-modules

https://github.com/mafintosh/pump
*/

var BaseController = require("./base.js");
class FocusController extends BaseController {
  async index() {
    //获取轮播图的数据
    var result = await this.ctx.model.Focus.find({});
    await this.ctx.render("admin/focus/index", {
      list: result
    });
  }

  async add() {
    await this.ctx.render("admin/focus/add");
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
      // //从这里开始不再存本地-存两份，一份本地，一份阿里云云盘，数据库存放阿里云路径
      // let target = dir.uploadDir;
      // let ossDir = dir.ossDir;
      // console.log("阿里云ossDir:", ossDir);
      // //备份一份到本地--临时文件（方案）
      // let writeStream = fs.createWriteStream(target);
      // await pump(stream, writeStream);
      // //这里再上传一份到阿里云oss
      // let client = new OSS({
      //   region: this.config.OSSAliyun.region,
      //   accessKeyId: this.config.OSSAliyun.accessKeyId,
      //   accessKeySecret: this.config.OSSAliyun.accessKeySecret,
      //   bucket: this.config.OSSAliyun.bucket
      // });
      // try {
      //   let result = await client.put(ossDir, target);
      //   var saveDir = result.res.requestUrls[0];
      //   files = Object.assign(files, {
      //     [fieldname]: saveDir
      //   });
      // } catch (e) {
      //   console.log('err:',e);
      // }
    }
    let focus = new this.ctx.model.Focus(Object.assign(files, parts.field));
    await focus.save();
    await this.success("/admin/focus", "增加轮播图成功");
  }

  async edit() {
    var id = this.ctx.request.query.id;

    var result = await this.ctx.model.Focus.find({ _id: id });

    await this.ctx.render("admin/focus/edit", {
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

      // // console.log("dir.saveDir:", this.config.Res_Host + dir.saveDir.slice(13));

      // console.log("fieldname:", fieldname);

      // files = Object.assign(files, {
      //   [fieldname]: dir.saveDir
      // });
    }

    //修改操作

    var id = parts.field.id;

    var updateResult = Object.assign(files, parts.field);

    let result = await this.ctx.model.Focus.updateOne(
      { _id: id },
      updateResult
    );

    await this.success("/admin/focus", "修改轮播图成功");
  }
}

module.exports = FocusController;
