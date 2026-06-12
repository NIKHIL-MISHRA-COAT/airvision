import mongoose from"mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true // Ensure email is unique
    },
    password: {
        type: String,
        required: true
    },
    age: {
        type: Number,
        required: false
    },
    lastLogin: { type: Date, default: null },
    

    
    // imagePath: {
    //     type: String,
    //     importd: false
    // }
    
});

const UserModel = mongoose.model('User', userSchema);

export default  UserModel;
