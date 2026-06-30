import { Body, Controller, Get, Param, Post, Put, Query, Req, UseGuards } from '@nestjs/common';
import { ComentariosService } from './comentarios.service';
import { CreateComentarioDto } from './dto/create-comentario.dto';
import { UpdateComentarioDto } from './dto/update-comentario.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('comentarios')
export class ComentariosController {
  constructor( private readonly comentariosService: ComentariosService ) {}

  @UseGuards(JwtAuthGuard)
  @Post(':publicacionId')
  create(@Param('publicacionId') publicacionId: string, @Body() dto: CreateComentarioDto, @Req() req: any) {
    return this.comentariosService.create(publicacionId, dto, req.user._id);
  }

  @Get(':publicacionId')
  findAll(@Param('publicacionId') publicacionId: string, @Query('offset') offset = 0, @Query('limit') limit = 10) {
    return this.comentariosService.findAll(publicacionId, Number(offset), Number(limit),);
  }
  
  @UseGuards(JwtAuthGuard)
  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateComentarioDto, @Req() req: any) {
    return this.comentariosService.update(id, dto, req.user._id);
  }
}