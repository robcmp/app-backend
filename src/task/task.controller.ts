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
  Logger,
} from '@nestjs/common';
import { Task } from '../model/task.schema';
import { TaskService } from './task.service';
import { ParseObjectIdPipe } from 'src/utils/parse-object-id-pipe.pipe';

@Controller('/api/v1/task')
export class TaskController {
  logger = new Logger(TaskController.name);

  constructor(private readonly taskService: TaskService) {}

  @Post()
  async createTask(@Res() response, @Body() task: Task) {
    this.logger.log('Creando tarea de usuario');
    const newTask = await this.taskService.createTask(task);
    this.logger.log('Tarea de usuario creada exitosamente...');
    return response.status(HttpStatus.CREATED).json({
      newTask,
    });
  }

  @Get('/:id')
  async getTaskById(
    @Res() response,
    @Param('id', ParseObjectIdPipe) id,
  ): Promise<Object> {
    this.logger.log('Obteniendo tareas de usuario');
    const taskById = await this.taskService.readTaskByUserId(id);
    if (taskById.length <= 0) {
      this.logger.error('Error al obtener tareas de usuario');
      let error = `No task founds for user`;

      return response.status(204).send({
        statusCode: '204',
        message: 'Se han encontrado errores al obtener infomacion',
        errors: [error],
      });
    }
    this.logger.log('Tareas de usuario obtenidas exitosamente');
    return response.status(HttpStatus.OK).json(taskById);
  }

  @Put('/:id')
  async updateByTaskId(
    @Res() response,
    @Param('id', ParseObjectIdPipe) id,
    @Body() task: Task,
  ) {
    this.logger.log('Modificando tarea...');
    const updatedTask = await this.taskService.updateTask(id, task);
    this.logger.log('Tarea modificada exitosamente...');
    return response.status(HttpStatus.OK).json(updatedTask);
  }

  @Delete('/:id')
  async deleteByTaskId(@Res() response, @Param('id', ParseObjectIdPipe) id) {
    this.logger.log('Eliminando tarea de usuario');
    const deletedTask = await this.taskService.deleteTask(id);
    if (deletedTask === null) {
      let error = `Task to delete not found`;

      this.logger.error('Error al eliminar tarea');

      return response.status(404).send({
        statusCode: '404',
        message: 'Ne se ha encontrado la tarea a eliminar',
        errors: [error],
      });
    }
    this.logger.log('Tarea de usuario eliminada exitosamente');
    return response.status(HttpStatus.OK).json(['Task deleted']);
  }
}
