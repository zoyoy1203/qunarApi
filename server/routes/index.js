
const Router = require('koa-router')
const mongoose = require('mongoose')

// 伪造请求头
const fs = require('fs');
const path = require('path');
const request = require('../util/request')

const router = new Router()
// 获取所有城市数据
router.get('/cities', async (ctx, next) => {
    const Cities = mongoose.model('Cities')
    const cities = await Cities.find({})

    ctx.body = {
        cities
    }
})
// 获取所有城市首页数据
router.get('/cityDetail', async (ctx, next) => {
    const CityDetails = mongoose.model('CityDetails')
    const cities = await CityDetails.find({})

    ctx.body = {
        cities
    }
})


//获取指定城市首页数据
router.get('/cityDetail/cityid/:cityid', async (ctx, next) => {
    const CityDetails = mongoose.model('CityDetails')
    const cityDetail = await CityDetails.find({
        cityId: ctx.params.cityid
    })

    ctx.body = {
        cityDetail
    }
})

// 获取对应城市名 首页数据
router.get('/cityDetail/cityname/:cityName', async (ctx, next) => {
    const CityDetails = mongoose.model('CityDetails')
    const cityDetail = await CityDetails.find({
        cityName: ctx.params.cityName
    })

    ctx.body = {
        cityDetail
    }
})


// 获取对应城市id 本周热门榜单
router.get('/hostList/cityid/:cityid', async (ctx, next) => {
    const HostList = mongoose.model('HostList')
    const hostList = await HostList.find({
        cityId: ctx.params.cityid
    })

    ctx.body = {
        hostList
    }
})

// 获取对应城市名 本周热门榜单
router.get('/hostList/cityname/:cityName', async (ctx, next) => {
    const HostList = mongoose.model('HostList')
    const hostList = await HostList.find({
        cityName: ctx.params.cityName
    })

    ctx.body = {
        hostList
    }

})

// 获取对应景点 详情数据
router.get('/addrDetail/id/:id', async (ctx, next) => {
    const AddrDetail = mongoose.model('AddrDetail')
    const addrDetail = await AddrDetail.find({
        id: ctx.params.id
    })

    ctx.body = {
        addrDetail
    }

})


// 将module里的文件循环读出
fs.readdirSync(path.join(__dirname, '../module')).reverse().forEach(file => {
    if(!(/\.js$/i.test(file))) return;   //正则表达式判断文件名是否符合
    //拼接出url
    let route = '/' + file.replace(/\.js$/i, '').replace(/_/g, '/');
    //将module里的文件内容赋导出
    let p = path.resolve(__dirname,'../');
    console.log(p)
    let question = require(path.join(__dirname,'../module', file));

    console.log('route='+ route);
    console.log('question='+ question);

    router.get(route, async (ctx, next) => {
         //Object.assign()对象合并
         let query = Object.assign({}, ctx.request.query, ctx.request.body, {cookie:ctx.request.cookies});
         console.log(query);
         await question(query, request)
         .then(answer => {
             ctx.body = {
                answer
            }
         })
         .catch(answer => {
            ctx.body = {
                answer
            }   
         })
    
    })

})


module.exports = router