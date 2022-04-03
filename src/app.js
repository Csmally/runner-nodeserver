//web服务
const host = process.env.NODE_ENV == 'production' ? '0.0.0.0' : '192.168.1.7'
const bodyParser = require('body-parser')
const express = require('express')
const fs = require('fs')
const https = require('https')
const http = require('http')
const httpsOptions = {
    cert: fs.readFileSync('./https/1_www.runners.ink_bundle.crt', 'utf8'),
    key: fs.readFileSync('./https/2_www.runners.ink.key', 'utf8')
}
const path = require('path')
const app = express()
app.use(bodyParser.json())
const models = require('../models')

//微信支付
var request = require('request');
var xmlreader = require("xmlreader");
var wxpay = require('./wxpayUtils');
var wxKeysConfig = require('../config/wxKeysConfig');
var appid = wxKeysConfig.appid // 小程序的appid
var mch_id = wxKeysConfig.mch_id; // 微信商户号
var mchkey = wxKeysConfig.mchkey; // 微信商户的key 32位
var notify_url = wxKeysConfig.notify_url //通知地址
var url = 'https://api.mch.weixin.qq.com/pay/unifiedorder'; //微信支付统一调用接口

//访问微信服务器获取用户信息
app.post('/wx/getUeserInfoFromWx', async (req, res, next) => {
    try {
        request('https://api.weixin.qq.com/sns/jscode2session?appid=' + req.body.appid + '&secret=' + req.body.secret + '&js_code=' + req.body.js_code + '&grant_type=authorization_code', function (err, response, body) {
            if (!err && response.statusCode == 200) {
                res.send({
                    data: { ...JSON.parse(body), message: '获取成功！' }
                })
            }
        })
    } catch (error) {
        next(error)
    }
})

app.use('/wx/txCos', require('./routers/txCos.js'))
app.use('/wx/userInfo', require('./routers/userInfo.js'));
app.use('/wx/campus', require('./routers/campus.js'));
app.use('/wx/order', require('./routers/order.js'));
//微信支付
app.post("/wx/wxpay", async (req, res) => {
    try {
        let out_trade_no = new Date().getTime()
        let money = req.body.price
        let openid = req.body.openid
        let nonce_str = wxpay.createNonceStr();
        let timestamp = wxpay.createTimeStamp();
        let body = '测试微信支付';
        let total_fee = wxpay.getmoney(money);
        let spbill_create_ip = req.connection.remoteAddress; // 服务ip
        let trade_type = 'JSAPI' // 小程序： 'JSAPI'
        let sign = wxpay.paysignjsapi(appid, openid, body, mch_id, nonce_str, notify_url, out_trade_no, spbill_create_ip, total_fee, trade_type, mchkey)
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
                            'package': package,
                            'paySign': minisign
                        }
                    });
                });
            }
        });
    } catch (error) {
        next(error)
    }
})

app.post('/wx/wxpayresult', async (req, res, next) => {
    try {
        res.send({
            wxPayResult: req.body
        })
    } catch (error) {
        next(error)
    }
})
//上线测试
app.get('/wx/test', async (req, res, next) => {
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

const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
io.on('connection', (socket) => {
    const { id } = socket;
    console.log('a user connected', id);
    socket.on("userData", async (data) => {
        let findData = await models.sockets.findOne({
            where: { openid: data.openid }
        })
        if (findData) {
            await models.sockets.update({ socketid: data.socketid, type: data.type }, {
                where: { openid: data.openid }
            })
        } else {
            await models.sockets.create(data)
        }
        // await models.sockets.create(data)
        console.log("服务器通过id发送注册消息", data);
    });
    socket.on("isChatLogTable", async (data) => {
        let findChatLog = await models.chatlogs.findOne({
            where: { orderid: data.orderid }
        })
        if (findChatLog) {
            socket.emit("getAllChatLog", { allChatLog: JSON.parse(findChatLog.content) })
        } else {
            await models.chatlogs.create({ orderid: data.orderid, content: "[]" })
        }
    })
    socket.on('sendMessage', async (data) => {
        let findData = await models.sockets.findOne({
            where: { openid: data.toopenid }
        })
        if (findData && findData.type === "1") {
            socket.to(findData.socketid).emit("message", { msgData: data.msgData })
        } else {
            console.log('9898走公众号')
        }
        let findChatLog = await models.chatlogs.findOne({
            where: { orderid: data.msgData.orderid }
        })
        let newContentArr = JSON.parse(findChatLog.content)
        newContentArr.push(data.msgData)
        let newContentStr = JSON.stringify(newContentArr)
        await models.chatlogs.update({ content: newContentStr }, {
            where: { orderid: data.msgData.orderid }
        })
    })
    socket.on('disconnect', () => {
        console.log('9898断开了')
    })
});
server.listen(8087, host)


//配置nodemon
// 1、npm install nodemon -D
// 2、修改 package.json 中的启动命令