//web服务
const host = process.env.NODE_ENV == 'production' ? '127.0.0.2' : '127.0.0.19'
const bodyParser = require('body-parser')
const express = require('express')
const app = express()
app.use(bodyParser.json())
const models = require('../models')

app.post('/userInfo_add', async (req, res, next) => {
    try {
        let userInfo = await models.userInfo.create(req.body)
        res.send({
            userInfo,
            message: '创建成功！'
        })
    } catch (error) {
        next(error)
    }
})
app.post('/userInfo_search', async (req, res, next) => {
    try {
        let userInfo = await models.userInfo.findOne({
            where: req.body
        })
        res.send({
            userInfo,
            message: '查询成功！'
        })
    } catch (error) {
        next(error)
    }
})
app.post('/userInfo_update', async (req, res, next) => {
    try {
        let { searchParams, updateParams } = req.body
        let userInfo = await models.userInfo.findOne({
            where: searchParams
        })
        if (userInfo) {
            userInfo = await userInfo.update(updateParams)
        }
        res.send({
            userInfo,
            message: '修改成功！'
        })
    } catch (error) {
        next(error)
    }
})

//上线测试
app.get('/test', async (req, res, next) => {
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
app.listen(8087, host, () => {
    console.log('express服务启动成功啦！')
})


//配置nodemon
// 1、npm install nodemon -D
// 2、修改 package.json 中的启动命令