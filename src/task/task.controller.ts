import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Post,
  Put,
  Req,
  Res,
  Query,
} from '@nestjs/common';
import { Task } from '../model/task.schema';
import { TaskService } from './task.service';

@Controller('/api/v1/task')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Post()
  async createTask(@Res() response, @Body() task: Task) {
    const newTask = await this.taskService.createTask(task);
    return response.status(HttpStatus.CREATED).json({
      newTask,
    });
  }

  @Get()
  async read(@Query() id): Promise<Object> {
    return await this.taskService.readTask(id);
  }

  @Put('/:id')
  async update(@Res() response, @Param('id') id, @Body() task: Task) {
    const updatedTask = await this.taskService.updateTask(id, task);
    return response.status(HttpStatus.OK).json(updatedTask);
  }
}
