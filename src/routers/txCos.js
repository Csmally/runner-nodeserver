var express = require('express')
var fs = require('fs');
var router = express.Router();
var config = require('../../config/txCos.json')
var COS = require('cos-nodejs-sdk-v5');
var multer = require("multer");
var multerMiddleware = multer()  //实例化multer
var cos = new COS({
    SecretId: config.SecretId,
    SecretKey: config.SecretKey
});

router.post('/search', async (req, res, next) => {
    try {
        cos.getBucket({
            Bucket: 'runners-1307290574', /* 必须 */
            Region: 'ap-beijing',     /* 必须 */
            // Prefix: req.path,         /* 非必须 */
        }, function (err, data) {
            console.log(err || data.Contents);
            if (err) {
                res.send({
                    data: err,
                    message: '查询失败。。。'
                })
            } else {
                res.send({
                    data,
                    message: '查询成功！'
                })
            }
        });
    } catch (error) {
        next(error)
    }
})

router.post('/upload', multerMiddleware.single('file'), async (req, res, next) => {
    try {
        cos.putObject({
            Bucket: 'runners-1307290574', /* 填入您自己的存储桶，必须字段 */
            Region: 'ap-beijing',  /* 存储桶所在地域，例如ap-beijing，必须字段 */
            Key: req.body.folder + req.file.originalname,  /* 存储在桶里的对象键（例如1.jpg，a/b/test.txt），必须字段 */
            Body: Buffer.from(req.file.buffer), /* 必须 */
        }, function (err, data) {
            if (err) {
                res.send({
                    data: err,
                    message: '上传失败'
                })
            } else {
                res.send({
                    data,
                    message: '上传成功'
                })
            }
        });
    } catch (error) {
        next(error)
    }
})

module.exports = router