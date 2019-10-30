const mongoose = require('mongoose')
const Schema = mongoose.Schema


const hostListSchema = new Schema({

    cityName:String,
    cityId:String,
    imgbg:String,
    toptitle:String,
    sightGroup:[{
        id:String,
        img:String,
        title:String,
        like_num:Number,
        comment_num:Number,
        price:Number,
        comment_item:{
            name:String,
            date:String,
            comment_text:String,
            comment_img:[String]
        }
    }],
    daytripGroup:[{
        id:String,
        img:String,
        title:String,
        like_num:Number,
        comment_num:Number,
        price:Number,
        comment_item:{
            name:String,
            date:String,
            comment_text:String,
            comment_img:[String]
        }
    }],
 
    meta: {
        createdAt: {
            type: Date,
            default: Date.now()
        },
        updateAt: {
            type: Date,
            default: Date.now()
        }
    }

})

hostListSchema.pre('save', function (next) {
    if(this.isNew) {
        this.meta.createdAt = this.meta.updateAt = Date.now()
    } else {
        this.meta.updateAt = Date.now()
    }
    next()
})

mongoose.model('HostList',hostListSchema)