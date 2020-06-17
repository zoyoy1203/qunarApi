const cp = require('child_process')
const { resolve } = require('path')
const mongoose = require('mongoose')

const CityDetails = mongoose.model('CityDetails')
const AddrDetailImgs = mongoose.model('AddrDetailImgs')

;(async () => {
    //获取数据库所有数据
    let cityDetails = await CityDetails.find({}).exec()
    // console.log(cities)
    // return 0

    let invoked = false
    let script = resolve(__dirname, '../crawler/addrDetail-imgs.js')
    let child = cp.fork(script, [], {execArgv: ['--harmony']})
   

    child.on('error', err => {
        if (invoked) return
        invoked = true
        
        console.log(err)
    })
    
    child.on('exit', code => {
        if (invoked) {
            console.log('完成！')
            return
        }
        invoked = false
        let err = code === 0 ? null : new Error('exit code ' + code)
        
        console.log(err)
    })


    child.on('message', async data => {
       // console.log(data)
       addrDetailImgs = new AddrDetailImgs(data)
       await addrDetailImgs.save()
    })
    
    child.send(cityDetails)

})()