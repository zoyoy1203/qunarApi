const Koa = require('koa')
const mongoose = require('mongoose')

const { resolve } = require('path')
const { connect, initSchemas } = require('./database/init')




const router = require('./routes')

;(async () => {
    await connect()
    initSchemas()

    // const Movie = mongoose.model('Movie')
    // const movies = await Movie.find({})
    // console.log(movies)
    // require('./tasks/cities')
    // require('./tasks/citydetail')
    // require('./tasks/hostList')
    // require('./tasks/addrDetail')
    // require('./tasks/addrDetail-Imgs')
})()

const app = new Koa()

app
    .use(router.routes())
    .use(router.allowedMethods)




app.listen(4000)