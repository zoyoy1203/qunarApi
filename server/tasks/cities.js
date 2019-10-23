const cp = require('child_process')
const { resolve} = require('path')
const mongoose = require('mongoose')
const Cities = mongoose.model('Cities')

;(async () => {
    const script = resolve(__dirname, '../crawler/cities.js')
    const child = cp.fork(script,[], {execArgv: ['--harmony']})

    let invoked = false
    
    child.on('error', err => {
        if(invoked) return
        invoked = true
        console.log(err)
    })

    child.on('exit', code => {
        if(invoked) return

        invoked = true
        
        let err = code === 0 ? null : new Error('exit code'+ code)

        console.log(err)

    })

    child.on('message',async data => {

        // console.log(data)
        citiesModel = new Cities(data)
        await citiesModel.save()

    })


})()