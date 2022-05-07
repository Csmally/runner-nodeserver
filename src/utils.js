const { Op } = require('sequelize')
var request = require('request');
var serviceAccountConfig = require('../config/serviceAccount.json')
var wxKeysConfig = require('../config/wxKeysConfig.json');
const { models } = require('../models')

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

function getServiceAccountUserInfo(serviceOpenid, access_token) {
    return new Promise((resolve, reject) => {
        request(`https://api.weixin.qq.com/cgi-bin/user/info?access_token=${access_token}&openid=${serviceOpenid}`, function (err, response, body) {
            if (!err && response.statusCode == 200) {
                resolve(JSON.parse(body))
            } else {
                reject()
            }
        })
    })
}

async function serviceAccountCB(xmlData, access_token) {
    let msgType = xmlData.msgtype[0]
    switch (msgType) {
        case "event": {
            if (xmlData.event[0] === "subscribe") {
                let serviceAccountUserData = await getServiceAccountUserInfo(xmlData.fromusername[0], access_token)
                let userData = await models.users.findOne({
                    where: { unionid: serviceAccountUserData.unionid }
                })
                if (userData) {
                    await models.users.update({ serviceOpenid: serviceAccountUserData.openid }, {
                        where: { unionid: userData.unionid }
                    })
                } else {
                    await models.users.create({ unionid: serviceAccountUserData.unionid, serviceOpenid: serviceAccountUserData.openid })
                }
            }
            if (xmlData.event[0] === "unsubscribe") {
                await models.users.update({ serviceOpenid: null }, {
                    where: { serviceOpenid: serviceAccountUserData.openid }
                })
            }
            break
        }
    }
}

module.exports = { formatParam, getToken, serviceAccountCB, getServiceAccountUserInfo }