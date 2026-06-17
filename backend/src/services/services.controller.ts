import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { ServicesService } from './services.service';
import { CreateServiceDto } from './dto/service.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('services')
export class ServicesController {
  constructor(private readonly servicesService: ServicesService) {}

  @Post()
  create(@Body() createDto: CreateServiceDto) {
    return this.servicesService.create(createDto);
  }

  @Get()
  findAll() {
    return this.servicesService.findAll();
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateDto: any) {
    return this.servicesService.update(+id, updateDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.servicesService.remove(+id);
  }
}
