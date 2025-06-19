import mongoose,{Schema} from "mongoose";

const eventSchema=new Schema({
    eventName:{
        type:String,
        required:true,
        lowercase:true,
        index:true,
        trim:true,

    },
    userId:{
        type:Schema.Types.ObjectId,
        ref:"User",
        index:true
    },
    timestamp:{
        type:Date,
        default:true,
        index:true
    },
    userAgent:{
        type:String,
        maxlength:600
    },
      page: {
    type: String,
    maxlength: 500
  },
   ip: {
    type: String,
    maxlength: 45
  },
  customProperties: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  }
}, {
  timestamps: true
});

// Compound indexes for better query performance
eventSchema.index({ eventName: 1, timestamp: -1 });
eventSchema.index({ timestamp: -1, eventName: 1 });
eventSchema.index({ userId: 1, timestamp: -1 });
eventSchema.index({ sessionId: 1, timestamp: -1 });


export const Event=mongoose.model("Event",eventSchema)