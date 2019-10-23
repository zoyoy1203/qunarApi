
const Router = require('koa-router')
const mongoose = require('mongoose')

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


// 获取对应城市id 首页数据
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

module.exports = router