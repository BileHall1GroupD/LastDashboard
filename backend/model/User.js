import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const { Schema } = mongoose;

const UserSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        trim: true,
        lowercase: true
    },
  
    password: {
        type: String,
        required: true 
    },
    
    token: {
        type: String,
    },
  
   
    allowed_urls: {
        type: [String], // Using an array of strings
        default: []
    }
},
{
    timestamps:true
}
);

// Schema method to compare password
UserSchema.methods.comparePassword = async function (passwords) {
    return bcrypt.compare(passwords, this.password);
};


UserSchema.pre('save', async function (next) {
    if (this.isModified('password')) {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
    }
    next();
});

const User = mongoose.model('User', UserSchema);
export default User;
