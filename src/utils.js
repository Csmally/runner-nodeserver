const { Op } = require('sequelize')

const formatParam = function(param) {
    let newParam = {}
    for (const key in param) {
        if(key[0]==="$"){
            newParam[Op[key.slice(1)]] = param[key]
        }else {
            newParam[key] = param[key]
        }
    }
    return newParam
}

module.exports = { formatParam }