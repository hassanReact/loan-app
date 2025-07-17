import { Schema, models, model } from 'mongoose';

const LoanSchema = new Schema(
    {
        user: { type: Schema.Types.ObjectId, ref: 'User' },
        amount: Number,
        reason: String,
        documents: [String],
        status: {
            type: String,
            enum: ['pending', 'approved', 'repaid', 'withdrawn', 'rejected'],
            default: 'pending',
        },
        withdrawn: { type: Boolean, default: false },
        repaidAmount: { type: Number, default: 0 },
        repaidAt: Date,
    },
    { timestamps: true }
);


export const Loan = models.Loan || model('Loan', LoanSchema);
