const cp = require('child_process')
const { resolve } = require('path')
const mongoose = require('mongoose')

const Cities = mongoose.model('Cities')
const CityDetails = mongoose.model('CityDetails')

;(async () => {
    //获取数据库所有数据
    let cities = await Cities.find({
        _id:'5daeff860901966168310c70'
    },['cityList'])

    // console.log(cities)

    // return 0

    let invoked = false
    let script = resolve(__dirname, '../crawler/citydetail')
    let child = cp.fork(script, [], {execArgv: ['--harmony']})
   

    child.on('error', err => {
        if (invoked) return
        invoked = true
        
        console.log(err)
    })
    
    child.on('exit', code => {
        if (invoked) return
        invoked = false
        let err = code === 0 ? null : new Error('exit code ' + code)
        
        console.log(err)
    })


    child.on('message', async data => {
    
       // console.log(data)
       cityDetails = new CityDetails(data)
       await cityDetails.save()
    })
    
    child.send(cities)

})()