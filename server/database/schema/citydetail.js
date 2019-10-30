const mongoose = require('mongoose')
const Schema = mongoose.Schema


const CityDetailSchema = new Schema({

    cityName:String,
    cityId:String,
    cityDetail:{
        banners:[String],
        icons:[
            {
                img:String,
                keyword:String
            }
        ],
        hostList:[
            {
                id:String,
                img:String,
                title:String,
                price:Number
            }
        ],

        likeList:[
            {
                id:String,
                img:String,
                tag:String,
                title:String,
                score:Number,
                comment_num:String,
                price:Number,
                address:String,
                feature:String
            }
        ],
        weekendTrip:[
            {
                id:String,
                img:String,
                title:String,
                desc:String
            }
        ]

        
        
    },
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

CityDetailSchema.pre('save', function (next) {
    if(this.isNew) {
        this.meta.createdAt = this.meta.updateAt = Date.now()
    } else {
        this.meta.updateAt = Date.now()
    }
    next()
})

mongoose.model('CityDetails',CityDetailSchema)