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
        let data = await models[dbTable].findByPk(searchParams.id)
        if (data && data.status === 1) {
            await models[dbTable].update(updateParams, {
                where: searchParams
            })
            res.send({
                code: "1",
                message: '修改成功！'
            })
        } else {
            if (data) {
                res.send({
                    code: "2",
                    message: '不可修改！'
                })
            } else {
                res.send({
                    code: "3",
                    message: '未找到数据！'
                })
            }
        }
    } catch (error) {
        next(error)
    }
})

module.exports = router