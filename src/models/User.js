import mongoose from "mongoose";
import bcrypt from "bcryptjs"

const userSchema = new mongoose.Schema({
        username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        minLength: 6
    },
    profileImage: {
        type: String,
        default: ""
    }
    },{
        timestamps: true
    });

/**
 * Pre-save middleware to hash the user's password before saving.
 * Only runs if the password field is modified.
 */
userSchema.pre("save", async function(next){
    if(!this.isModified("password")) return next();

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt)

    next();
});

/**
 * Compares a provided password with the user's hashed password.
 */
userSchema.methods.comparePassword = async function(userPassword){
    return await bcrypt.compare(userPassword, this.password)
};


const User = mongoose.model("User", userSchema);
export default User;