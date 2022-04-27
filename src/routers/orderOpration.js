const express = require('express')
var router = express.Router();
const models = require('../../models')
const { formatParam } = require('../utils.js')

router.post('/add', async (req, res, next) => {
    try {
        let { param, dbTable } = req.body
        formatParam(param)
        let data = await models[dbTable].create(param)
        res.send({
            message: '操作成功！'
        })
    } catch (error) {
        next(error)
    }
})

router.post('/search', async (req, res, next) => {
    try {
        let { param, dbTable } = req.body
        formatParam(param)
        let data = await models[dbTable].findAll({
            where: param
        })
        res.send({
            data,
            message: '查询成功！'
        })
    } catch (error) {
        next(error)
    }
})

module.exports = router