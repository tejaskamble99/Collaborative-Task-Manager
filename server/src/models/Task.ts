import mongoose, { Schema, Document } from 'mongoose';

export enum TaskPriority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  URGENT = 'URGENT'
}

export enum TaskStatus { // Fixed spelling from "TaskSatus"
  TODO = 'To Do',
  IN_PROGRESS = 'In Progress',
  REVIEW = 'Review',
  COMPLETED = 'Completed'
}

export interface ITask extends Document {
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate?: Date;
  creatorId: mongoose.Types.ObjectId;
  assignedToId?: mongoose.Types.ObjectId; // <--- This was likely missing in the interface
  createdAt: Date;
  updatedAt: Date;
}

const TaskSchema: Schema = new Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  
  status: { 
    type: String, 
    enum: Object.values(TaskStatus), 
    default: TaskStatus.TODO 
  },
  
  priority: { 
    type: String, 
    enum: Object.values(TaskPriority), 
    default: TaskPriority.MEDIUM 
  },
  
  dueDate: { type: Date },
  
  creatorId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },

  // 👇 THIS IS THE MISSING PART CAUSING THE ERROR
  assignedToId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User',
    default: null
  }

}, { timestamps: true });

export default mongoose.model<ITask>('Task', TaskSchema);