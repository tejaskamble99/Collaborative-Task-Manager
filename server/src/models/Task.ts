import mongoose, { Document, Schema } from "mongoose";

export enum TaskPriority {
  LOW = "LOW",
  MEDIUM = "MEDIUM",
  HIGH = "HIGH",
  URGENT = "URGENT",
}

export enum TaskStatus {
  TODO = "To Do",
  IN_PROGRESS = "In Progress",
  REVIEW = "Review",
  COMPLETED = "Completed",
}

export interface ITask extends Document {
  title: string;
  description: string;
  dueDate: Date;
  priority: TaskPriority;
  status: TaskStatus;
  creatorId: mongoose.Schema.Types.ObjectId;
  assignedToId: mongoose.Schema.Types.ObjectId;
}

const TaskSchema: Schema = new Schema({
  title: {
    type: String,
    requird: true,
    maxlenght: 100,
  },
  description:{
     type: String,
    requird: true,
  },
  dueDate:{
     type: Date,
    requird: true,
  },
  priority:{
     type: String,
    enum: Object.values(TaskPriority),
    default: TaskPriority.MEDIUM,
  },
  status: {
    type: String,
    enum:Object.values(TaskStatus),
    default: TaskStatus.TODO,
  },
  creatorId: {
    type: Schema.Types.ObjectId,
    ref:'User',
    requird: true,
  },
  assingedToId:{
     type: Schema.Types.ObjectId,
    ref:'User',
    requird: true,
  },
},
{
  timestamps: true,
}
);
const Task = mongoose.model<ITask>('Task', TaskSchema);
export default Task;
