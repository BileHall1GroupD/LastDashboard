import { timeStamp } from "console";
import mongoose from "mongoose";

const paymentSchema = mongoose.Schema({
    amount:{
        type:Number,
        required:true
    },
    payment_date:{
        type:Date,
        required:true
    },
    status:{
        type:String,
        required:true
    },
},
{
    timeStamp:true,
}
)