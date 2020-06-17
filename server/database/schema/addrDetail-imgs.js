const mongoose = require('mongoose')
const Schema = mongoose.Schema


const addrDetailImgsSchema = new Schema({
    sightId:Number,
    imgs:[String],
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

addrDetailImgsSchema.pre('save', function (next) {
    if(this.isNew) {
        this.meta.createdAt = this.meta.updateAt = Date.now()
    } else {
        this.meta.updateAt = Date.now()
    }
    next()
})

mongoose.model('AddrDetailImgs',addrDetailImgsSchema)