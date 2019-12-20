"use strict";

// https://www.npmjs.com/package/svg-captcha

var svgCaptcha = require("svg-captcha"); //引入验证
var md5 = require("md5");
var sd = require("silly-datetime");
var Jimp = require("jimp");
var path = require("path");
var mkdirp = require("mz-modules/mkdirp");
var Service = require("egg").Service;
var OSS = require("ali-oss");
var fs = require("fs");
var pump = require("mz-modules/pump");

class ToolsService extends Service {
  //生成验证码
  async captcha(width, height) {
    width = width ? width : 100;
    height = height ? height : 32;
    var captcha = svgCaptcha.create({
      size: 4,
      fontSize: 50,
      width: width,
      height: height,
      background: "#cc9966"
    });
    return captcha;
  }

  async md5(str) {
    return md5(str);
  }

  async getDay() {
    var day = sd.format(new Date(), "YYYYMMDD");
    return day;
  }

  async getTime() {
    var d = new Date();

    return d.getTime();
  }

  async uploadFile(stream,files) {
    // var files = {};
    let fieldname = stream.fieldname; //file表单的名字

    //上传图片的目录
    let dir = await this.service.tools.getUploadFile(stream.filename);
    //从这里开始不再存本地-存两份，一份本地，一份阿里云云盘，数据库存放阿里云路径
    let target = dir.uploadDir;
    let ossDir = dir.ossDir;
    console.log("阿里云ossDir:", ossDir);
    //备份一份到本地--临时文件（方案）
    let writeStream = fs.createWriteStream(target);
    await pump(stream, writeStream);
    //这里再上传一份到阿里云oss
    let client = new OSS({
      region: this.config.OSSAliyun.region,
      accessKeyId: this.config.OSSAliyun.accessKeyId,
      accessKeySecret: this.config.OSSAliyun.accessKeySecret,
      bucket: this.config.OSSAliyun.bucket
    });
    try {
      let result = await client.put(ossDir, target);
      var saveDir = result.res.requestUrls[0];
      files = Object.assign(files, {
        [fieldname]: saveDir
      });
      return files;
    } catch (e) {
      console.log("oss upload err:", e);
    }
  }

  async getUploadFile(filename) {
    // 1、获取当前日期     20180920
    var day = sd.format(new Date(), "YYYYMMDD");
    //2、创建图片保存的路径
    var dir = path.join(this.config.uploadDir, day);
    await mkdirp(dir);
    var d = await this.getTime(); /*毫秒数*/
    //返回图片保存的路径
    var uploadDir = path.join(dir, d + path.extname(filename));
    var osspath = await this.getOSSPath(uploadDir);
    return {
      uploadDir: uploadDir, //本地存储
      ossDir: osspath //云盘存储
    };
  }

  async getOSSPath(p) {
    var t = p.split("/");
    var s = "";
    var index = 0;
    for (var i = 0; i < t.length; i++) {
      if (t[i] == "upload") {
        index = i;
        break;
      }
    }
    for (var i = index; i < t.length; i++) {
      s += "/" + t[i];
    }
    return s;
  }

  //生成缩略图的公共方法
  async jimpImg(target) {
    //上传图片成功以后生成缩略图
    Jimp.read(target, (err, lenna) => {
      if (err) throw err;
      for (var i = 0; i < this.config.jimpSize.length; i++) {
        var w = this.config.jimpSize[i].width;
        var h = this.config.jimpSize[i].height;
        lenna
          .resize(w, h) // resize
          .quality(90) // set JPEG quality
          .write(target + "_" + w + "x" + h + path.extname(target));
      }
    });
  }

  async getRandomNum() {
    var random_str = "";
    for (var i = 0; i < 4; i++) {
      random_str += Math.floor(Math.random() * 10);
    }
    return random_str;
  }

  async getOrderId() {
    //订单如何生成
    var nowTime = await this.getTime();
    var randomNum = await this.getRandomNum();
    return nowTime.toString() + randomNum.toString();
  }
}

module.exports = ToolsService;
