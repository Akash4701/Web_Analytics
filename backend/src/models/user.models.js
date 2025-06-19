import mongoose,{Schema} from "mongoose";

const UserSchema=new Schema({
    UserId:{
        type:String,
        required:true,
        lowercase:true,
        unique:true,
        index:true,
        trim:true
    },
       


      username:{
        type:String,
        required:true,
       
        lowercase:true,
        trim:true,
        index:true
    },
     fullName:{
        type:String,
        required:true,
        trim:true,
        index:true
    },
  
}, {
  timestamps: true
});




export const User=mongoose.model("User",UserSchema)