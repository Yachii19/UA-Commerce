const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Course Name is Required'],
        trim: true,
        maxlength: [100, 'Name cannot exceed 100 characters']
    },
    description: {
        type: String,
        required: [true, 'Course Description is Required'],
        trim: true,
        maxlength: [500, 'Description cannot exceed 500 characters']
    },
    price: {
        type: Number,
        required: [true, 'Course Price is Required'],
        min: [0, 'Price cannot be negative']
    },
    imageUrl: {
        type: String,
        validate: {
            validator: function(v) {
                return /^https?:\/\/.+\.(jpg|jpeg|png|webp)(\?.*)?$/i.test(v);
            },
            message: props => `${props.value} is not a valid image URL!`
        },
        default: 'https://via.placeholder.com/150'
    },
    isActive: {
        type: Boolean,
        default: true
    },
    createdOn: {
        type: Date,
        default: Date.now
    },
    updatedOn: {
        type: Date,
        default: Date.now
    }
});

// Update the updatedOn field before saving
productSchema.pre('save', function(next) {
    this.updatedOn = new Date();
    next();
});

module.exports = mongoose.model('Product', productSchema);