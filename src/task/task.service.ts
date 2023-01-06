import {
  Injectable,
  NotFoundException,
  ServiceUnavailableException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Task, TaskDocument } from '../model/task.schema';
import { Request, Response } from 'express';

@Injectable()
export class TaskService {
  constructor(@InjectModel(Task.name) private taskModel: Model<TaskDocument>) {}

  async createTask(task: Task): Promise<Task> {
    const requestBody = {
      createdBy: task.createdBy,
      title: task.title,
      description: task.description,
    };
    const newTask = new this.taskModel(requestBody);
    return newTask.save();
  }

  async readTask(id): Promise<any> {
    if (id.id) {
      return this.taskModel
        .findOne({ _id: id.id })
        .populate('createdBy')
        .exec();
    }
    return this.taskModel.find().populate('createdBy').exec();
  }

  async updateTask(id, task: Task): Promise<Task> {
    return await this.taskModel.findByIdAndUpdate(id, task, { new: true });
  }

  async deleteTask(id): Promise<any> {
    return await this.taskModel.findByIdAndRemove(id);
  }
}
