import mongoose from 'mongoose';
import db from '../core/db'
// const { loadBalancingServiceDatabase } = db
const { Schema, Types : { ObjectId, Map }} = mongoose;
import mongoosePaginate from 'mongoose-paginate-v2'

const TransactionSchema = new Schema({
    tx_ref: { type: String, required: true, unique: true },
    type: { type: String },
    amount: { type: Number },
    description: { type: String },
    label: { type: String, required: true },
}, {
	timestamps: { createdAt: 'created_at',  updatedAt: 'updated_at' },
	autoIndex: false,
	toObject: { virtuals: true },
    toJSON: { virtuals: true }
})

TransactionSchema.statics = {

    
}

TransactionSchema.plugin(mongoosePaginate)
const Transaction = mongoose.model('Transaction', TransactionSchema)

export default Transaction;