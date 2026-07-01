import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AdminGuard } from '../auth/admin.guard';
import { EstadisticasService } from './estadisticas.service';
import { Query } from '@nestjs/common';

@Controller('estadisticas')
@UseGuards(JwtAuthGuard, AdminGuard)
export class EstadisticasController {

  constructor(
    private readonly estadisticasService: EstadisticasService,
  ) {}

 @Get('publicaciones-por-usuario')
  publicacionesPorUsuario(
  @Query('desde') desde:string,
  @Query('hasta') hasta:string
  ){
  return this.estadisticasService.publicacionesPorUsuario(desde,hasta);
  }

  @Get('comentarios')
  comentarios(
  @Query('desde') desde:string,
  @Query('hasta') hasta:string
  ){
  return this.estadisticasService.comentariosPorFecha(desde,hasta);
  }

  @Get('comentarios-por-publicacion')
  comentariosPorPublicacion(
  @Query('desde') desde:string,
  @Query('hasta') hasta:string
  ){
  return this.estadisticasService.comentariosPorPublicacion(desde,hasta);
  }
}