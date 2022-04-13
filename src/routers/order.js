const express = require('express')
var router = express.Router();
const models = require('../../models')
const { formatParam } = require('../utils.js')

router.post('/add', async (req, res, next) => {
    try {
        let data = await models[req.body.dbTable].create(req.body)
        res.send({
            data,
            message: '创建成功！'
        })
    } catch (error) {
        next(error)
    }
})

router.post('/search', async (req, res, next) => {
    try {
        let { param } = req.body
        let newParam = formatParam(param)
        let data = await models[req.body.dbTable].findAll({
            where: newParam
        })
        res.send({
            data,
            message: '查询成功！'
        })
    } catch (error) {
        next(error)
    }
})

router.post('/update', async (req, res, next) => {
    try {
        let { searchParams, updateParams, dbTable } = req.body
        let data = await models[dbTable].update(updateParams, {
            where: searchParams
        })
        res.send({
            code: data[0],
            message: data[0] === 0 ? '修改失败！' : '修改成功！'
        })
    } catch (error) {
        next(error)
    }
})

module.exports = router