const { Op } = require('sequelize')
var request = require('request');
var serviceAccountConfig = require('../config/serviceAccount.json')
var wxKeysConfig = require('../config/wxKeysConfig.json');
var models = require('../models')

function formatParam(param) {
    if (typeof param === "object") {
        //引用类型
        if (Array.isArray(param)) {
            //数组Array
            for (const item of param) {
                formatParam(item)
            }
        } else {
            //对象Object
            for (const key in param) {
                if (key[0] === "$") {
                    param[Op[key.slice(1)]] = param[key]
                    delete param[key]
                    formatParam(param[Op[key.slice(1)]])
                } else {
                    formatParam(param[key])
                }
            }
        }
    }
}

function setDBTableContact() {
    //此处应该建立关联关系表，暂时开发方便写死
    models["qinghua_orders"].hasMany(models["qinghua_orderchats"], { sourceKey: "orderid", foreignKey: "orderid", as: "chatList" })
    models["qinghua_orderchats"].belongsTo(models["qinghua_orders"], { targetKey: "orderid", foreignKey: "orderid", as: "chatList" })

    models["qinghua_orders"].hasOne(models["users"],{ sourceKey: "publisherOpenid", foreignKey: "openid", as: "publisherInfo" })
    models["users"].belongsTo(models["qinghua_orders"],{ targetKey: "publisherOpenid", foreignKey: "openid", as: "publisherInfo" })
    models["qinghua_orders"].hasOne(models["users"],{ sourceKey: "runnerOpenid", foreignKey: "openid", as: "runnerInfo" })
    models["users"].belongsTo(models["qinghua_orders"],{ targetKey: "runnerOpenid", foreignKey: "openid", as: "runnerInfo" })

    models["qinghua_orders"].hasOne(models["qinghua_chatlogs"], { sourceKey: "orderid", foreignKey: "orderid", as: "chatLogs" })
    models["qinghua_chatlogs"].belongsTo(models["qinghua_orders"], { targetKey: "orderid", foreignKey: "orderid", as: "chatLogs" })
}

function getToken(type) {
    return new Promise((resolve, reject) => {
        request(`https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${type === 'miniProgram' ? wxKeysConfig.appid : serviceAccountConfig.appid}&secret=${type === 'miniProgram' ? wxKeysConfig.appsecret : serviceAccountConfig.appsecret}`, function (err, response, body) {
            if (!err && response.statusCode == 200) {
                resolve(JSON.parse(body).access_token)
            } else {
                reject()
            }
        })
    })
}

module.exports = { formatParam, getToken, setDBTableContact }