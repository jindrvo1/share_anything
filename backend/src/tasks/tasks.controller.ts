import {
  Controller, Get, Post, Patch, Param, Body, Query,
  UseGuards, Req,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Get()
  findAll(@Query() query: any) {
    return this.tasksService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tasksService.findById(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Req() req: any, @Body() body: any) {
    return this.tasksService.create(req.user.userId, body);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/respond')
  respond(@Param('id') id: string, @Req() req: any) {
    return this.tasksService.respond(id, req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id/fulfill')
  fulfill(@Param('id') id: string, @Req() req: any) {
    return this.tasksService.fulfill(id, req.user.userId);
  }
}
