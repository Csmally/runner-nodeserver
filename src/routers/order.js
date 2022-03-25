const express = require('express')
var router = express.Router();
const models = require('../../models')

router.post('/add', async(req, res, next) => {
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

router.post('/search', async(req, res, next) => {
    try {
        let data = await models[req.body.dbTable].findAll({
            where: req.body.param
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