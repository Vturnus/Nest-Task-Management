import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateTaskDTO } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { TaskStatus } from './task-status.enum';
import { Task } from './task.entity';
import { TaskRepository } from './task.respository';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(TaskRepository)
    private taskRespository: TaskRepository,
  ) {}

  async getTasks(filterDto: GetTasksFilterDto): Promise<Task[]> {
    return this.taskRespository.getTasks(filterDto);
  }

  async getTaskById(id: number) {
    const found = await this.taskRespository.findOne(id);

    if (!found) {
      throw new NotFoundException(
        `Requested task with id "${id}" not found...!`,
      );
    }
    return found;
  }

  async createTask(createTaskDto: CreateTaskDTO): Promise<Task> {
    return this.taskRespository.createTask(createTaskDto);
  }

  async updateTaskStatus(id: number, status: TaskStatus): Promise<Task> {
    const task = await this.getTaskById(id);
    task.status = status;
    await task.save();
    return task;
  }

  async deleteTask(id: number): Promise<void> {
    const result = await this.taskRespository.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException(
        `Requested task with id "${id}" not found...!`,
      );
    }
  }
}