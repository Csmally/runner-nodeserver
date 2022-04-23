const { Op } = require('sequelize')
var request = require('request');
var serviceAccountConfig = require('../config/serviceAccount.json')
var wxKeysConfig = require('../config/wxKeysConfig.json');

const formatParam = function (param) {
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

function getToken(type) {
    return new Promise((resolve, reject) => {
        request(`https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${type === 'miniProgram' ? wxKeysConfig.appid : serviceAccountConfig.appid}&secret=${type === 'miniProgram' ? wxKeysConfig.appsecret : serviceAccountConfig.appsecret}`, function (err, response, body) {
            if (!err && response.statusCode == 200) {
                resolve(JSON.parse(body).access_token)
            }else{
                reject()
            }
        })
    })
}

module.exports = { formatParam, getToken }