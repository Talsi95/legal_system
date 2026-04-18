import mongoose, { Schema, Document } from 'mongoose';

export interface IUpdate {
  date: Date;
  title: string;
  description: string;
}

export interface IDeadline {
  dueDate: Date;
  task: string;
  isCompleted: boolean;
}

export interface ICase extends Document {
  title: string;
  lawyer: mongoose.Types.ObjectId;
  client: mongoose.Types.ObjectId;
  status: 'open' | 'in-progress' | 'closed';
  timeline: IUpdate[];
  deadlines: IDeadline[];
}

const CaseSchema: Schema = new Schema({
  title: { type: String, required: true },
  lawyer: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  client: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  status: { type: String, enum: ['open', 'in-progress', 'closed'], default: 'open' },
  timeline: [{
    date: { type: Date, default: Date.now },
    title: String,
    description: String
  }],
  deadlines: [{
    dueDate: Date,
    task: String,
    isCompleted: { type: Boolean, default: false },
    notification: Boolean
  }]
});

export default mongoose.model<ICase>('Case', CaseSchema);