//web服务
const host = process.env.NODE_ENV == 'production' ? '0.0.0.0' : '127.0.0.19'
const bodyParser = require('body-parser')
const express = require('express')
const app = express()
app.use(bodyParser.json())
const models = require('../models')

//微信支付
var request = require('request');
var xmlreader = require("xmlreader");
var wxpay = require('./wxpayUtils');
var wxKeysConfig = require('../config/wxKeysConfig');
var appid = wxKeysConfig.appid// 小程序的appid
var mch_id = wxKeysConfig.mch_id; // 微信商户号
var mchkey = wxKeysConfig.mchkey;  // 微信商户的key 32位
var notify_url = wxKeysConfig.notify_url //通知地址
var url = 'https://api.mch.weixin.qq.com/pay/unifiedorder';//微信支付统一调用接口

app.post('/userInfo_add', async (req, res, next) => {
    try {
        let userInfo = await models.userInfo.create(req.body)
        res.send({
            userInfo,
            message: '创建成功！'
        })
    } catch (error) {
        next(error)
    }
})
app.post('/userInfo_search', async (req, res, next) => {
    try {
        let userInfo = await models.userInfo.findOne({
            where: req.body
        })
        res.send({
            userInfo,
            message: '查询成功！'
        })
    } catch (error) {
        next(error)
    }
})
app.post('/userInfo_update', async (req, res, next) => {
    try {
        let { searchParams, updateParams } = req.body
        let userInfo = await models.userInfo.findOne({
            where: searchParams
        })
        if (userInfo) {
            userInfo = await userInfo.update(updateParams)
        }
        res.send({
            userInfo,
            message: '修改成功！'
        })
    } catch (error) {
        next(error)
    }
})


app.post("/wxpay", async (req,res) => {
    let out_trade_no = new Date().getTime()
    let money = req.body.money
    let openid = req.body.openid
    let nonce_str = wxpay.createNonceStr();
    let timestamp = wxpay.createTimeStamp();
    let body ='测试微信支付';
    let total_fee = wxpay.getmoney(money);
    let spbill_create_ip = req.connection.remoteAddress; // 服务ip
    let trade_type = 'JSAPI'  // 小程序： 'JSAPI'
    let sign = wxpay.paysignjsapi(appid,openid,body,mch_id,nonce_str,notify_url,out_trade_no,spbill_create_ip,total_fee,trade_type,mchkey)
    //组装xml数据
    var formData = "<xml>";
        formData += "<appid>" + appid + "</appid>"; 
        formData += "<body><![CDATA[" + "测试微信支付" + "]]></body>";
        formData += "<mch_id>" + mch_id + "</mch_id>";  
        formData += "<nonce_str>" + nonce_str + "</nonce_str>";
        formData += "<notify_url>" + notify_url + "</notify_url>";
        formData += "<openid>" + openid + "</openid>";
        formData += "<out_trade_no>" + out_trade_no + "</out_trade_no>";
        formData += "<spbill_create_ip>" + spbill_create_ip + "</spbill_create_ip>";
        formData += "<total_fee>" + total_fee + "</total_fee>";
        formData += "<trade_type>JSAPI</trade_type>";
        formData += "<sign>" + sign + "</sign>";
        formData += "</xml>";
      // 请求微信统一支付接口
    request({ url: url, method: 'POST', body: formData }, function (err, response, body) {
        if (!err && response.statusCode == 200) {
            xmlreader.read(body.toString("utf-8"), function (errors, response) {
            if (null !== errors) {
                return;
            }
            var prepay_id = response.xml.prepay_id.text();
            let package = "prepay_id=" + prepay_id;
            let signType = "MD5";
            let minisign = wxpay.paysignjsapix(appid, nonce_str, package, signType, timestamp, mchkey);
            // 返回数据到前端
            res.send({ 
                        status: '200',
                        data: { 
                            'appId': appid,
                            'mchid': mch_id,
                            'prepayId': prepay_id,
                            'nonceStr': nonce_str,
                            'timeStamp': timestamp,
                            'package':package,
                            'paySign': minisign
                        }
                  });
            });
        }
    });
})

app.post('/wxpayresult', async (req, res, next) => {
    try {
        res.send({
            wxPayResult: req.body
        })
    } catch (error) {
        next(error)
    }
})
//上线测试
app.get('/test', async (req, res, next) => {
    try {
        res.send({
            env: process.env.NODE_ENV,
            message: '上线测试成功！'
        })
    } catch (error) {
        next(error)
    }
})
app.use((err, req, res, next) => {
    if (err) {
        res.status(500).json({
            message: err.message
        })
    }
})
app.listen(8087, host, () => {
    console.log('express服务启动成功啦！')
})


//配置nodemon
// 1、npm install nodemon -D
// 2、修改 package.json 中的启动命令