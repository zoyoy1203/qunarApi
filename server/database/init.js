const mongoose = require('mongoose')
const db = 'mongodb://localhost/qunar'
const glob = require('glob')
const { resolve } = require('path')
mongoose.Promise = global.Promise

exports.initSchemas = () => {
    glob.sync(resolve(__dirname, './schema/', '**/*.js')).forEach(require)
}

exports.connect = () => {
    let maxConnectTimes = 0

    return new Promise((resolve, reject) => {
        if(process.env.NODE_ENV !== 'production') {
            mongoose.set('debug', true)
        }
    
        mongoose.connect(db,{ useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true})
    
        // 断开连接后 重连
        mongoose.connection.on('disconnected', () => {
            maxConnectTimes++
            if (maxConnectTimes < 5){
                mongoose.connect(db,{ useNewUrlParser: true, useUnifiedTopology: true , useCreateIndex: true})
            }else {
                throw new Error('数据库挂了，快去修！！！')
            }
         
        })
    
        mongoose.connection.on('error', err => {
            maxConnectTimes++
            if (maxConnectTimes < 5){
                mongoose.connect(db,{ useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true})
            }else {
                throw new Error('数据库挂了，快去修！！！')
            }
        })
    
        mongoose.connection.on('open', () => {
            
            //存储数据

            resolve()
            console.log('MongoDB Connected successfully!')
        })


    })

    

}