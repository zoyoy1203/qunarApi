const mongoose = require('mongoose')
const Schema = mongoose.Schema


const citiesSchema = new Schema({

    cityList:{
        domestic:[
            {
                title:String,
                cities:[{
                    city_name:String,
                }]
            },
        ],
        foreign:[
            {
                title:String,
                cities:[{
                    city_name:String,
                }]
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

citiesSchema.pre('save', function (next) {
    if(this.isNew) {
        this.meta.createdAt = this.meta.updateAt = Date.now()
    } else {
        this.meta.updateAt = Date.now()
    }
    next()
})

mongoose.model('Cities',citiesSchema)