const cp = require('child_process')
const { resolve } = require('path')
const mongoose = require('mongoose')

const Cities = mongoose.model('Cities')
const HostList = mongoose.model('HostList')

;(async () => {
    //获取数据库所有数据
    let cities = await Cities.find({
        _id:'5daeff860901966168310c70'
    },['cityList'])

    // console.log(cities)

    // return 0

    let invoked = false
    let script = resolve(__dirname, '../crawler/hostList.js')
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
       hostList = new HostList(data)
       await hostList.save()
    })
    
    child.send(cities)

})()