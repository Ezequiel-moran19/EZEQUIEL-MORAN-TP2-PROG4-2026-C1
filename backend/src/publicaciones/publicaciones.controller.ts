import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile, Query } from '@nestjs/common';
import { PublicacionesService } from './publicaciones.service';
import { CreatePublicacionesDto } from './dto/create-publicaciones.dto';
import { UpdatePublicacionesDto } from './dto/update-publicaciones.dto';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from '../config/cloudinary';
import { FileInterceptor } from '@nestjs/platform-express';

const storage = new CloudinaryStorage({
  cloudinary,
  params: async () => ({
    folder: 'publicaciones',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
  }),
});

@Controller('publicaciones')
export class PublicacionesController {
  constructor(private readonly publicacionesService: PublicacionesService) {}

  @Post()
  @UseInterceptors(FileInterceptor('imagen', { storage }))
  create(
    @Body() dto: CreatePublicacionesDto,
    @UploadedFile() archivo: Express.Multer.File
  ) {
    return this.publicacionesService.create(dto, archivo);
  }

  @Post(':id/like')
  like(
  @Param('id') id:string,
  @Body() body:{usuarioId:string}
  ){
    return this.publicacionesService.like(id, body.usuarioId);
  }

  @Delete(':id/like')
  quitarLike(
    @Param('id') id:string,
    @Body() body:{usuarioId:string}
  ){
    return this.publicacionesService.quitarLike(id,body.usuarioId);
  }

  @Get()
  findAll(
    @Query('orden') orden?: string,
    @Query('usuario') usuario?: string,
    @Query('offset') offset?: number,
    @Query('limit') limit?: number,
  ) {
    return this.publicacionesService.findAll(orden, usuario, offset, limit);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePublicacioneDto: UpdatePublicacionesDto) {
    return this.publicacionesService.update(+id, updatePublicacioneDto);
  }

  @Delete(':id')
  remove(
    @Param('id') id: string,
    @Body() body: {
      usuarioId: string;
      perfil: string;
    }
  ) {
    return this.publicacionesService.remove(
      id,
      body.usuarioId,
      body.perfil,
    );
  }
}
