const { Op } = require('sequelize')

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

module.exports = { formatParam }