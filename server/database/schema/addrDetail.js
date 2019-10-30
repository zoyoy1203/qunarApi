const mongoose = require('mongoose')
const Schema = mongoose.Schema


const addrDetailSchema = new Schema({

    id:String,
    title:String,
    imgbg:String,
    baseinfo:{
        score:Number,
        desc:String,
        comment_num:String,
        raiders_num:String,
        address:String
    },
    ticketRecommend:[{
        title:String,
        tags:[String],
        price:Number,
        category:String
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

addrDetailSchema.pre('save', function (next) {
    if(this.isNew) {
        this.meta.createdAt = this.meta.updateAt = Date.now()
    } else {
        this.meta.updateAt = Date.now()
    }
    next()
})

mongoose.model('AddrDetail',addrDetailSchema)