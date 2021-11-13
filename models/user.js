const {Schema, model} = require('mongoose')

const userSchema = new Schema({
    email: {
        type:String,
        required: true
    },
    name : String,
    password : {
        type: String,
        required: true
    },
    avatarUrl: String,
    basket: {
        items: [
            {
                count: {
                    type: Number,
                    required: true,
                    default: 1
                },
                courseId:{
                    type: Schema.Types.ObjectId,
                    ref: 'Course',
                    required: true
                }
            }
        ]
    }
})


userSchema.methods.addToCart = function (course) {
    const cloneItems = [...this.basket.items]
    const idx = cloneItems.findIndex(c => {
        return c.courseId.toString() === course._id.toString()
    })

    if(idx >= 0) {
        cloneItems[idx].count = cloneItems[idx].count + 1
    }else {
        cloneItems.push({
            courseId: course._id,
            count: 1
        })
    }

    const newCart = {items: cloneItems};
    this.basket = newCart
    return this.save();
}




userSchema.methods.removeFromBasket = function (id){
    let cloneItems = [...this.basket.items]
    const idx = cloneItems.findIndex(c => {
        return c.courseId.toString() === id.toString()
    })

    if(cloneItems[idx].count === 1){
        cloneItems = cloneItems.filter(c => c.courseId.toString() !== id.toString() )
    }else{
        cloneItems[idx].count--
    }

    this.basket = {items: cloneItems}
    return this.save();

}



userSchema.methods.clearBasket = function (){
    this.basket = {items: []}
    return this.save();
}

module.exports = model('User', userSchema)