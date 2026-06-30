import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile, Query, Req } from '@nestjs/common';
import { PublicacionesService } from './publicaciones.service';
import { CreatePublicacionesDto } from './dto/create-publicaciones.dto';
import { UpdatePublicacionesDto } from './dto/update-publicaciones.dto';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from '../config/cloudinary';
import { FileInterceptor } from '@nestjs/platform-express';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

const storage = new CloudinaryStorage({
  cloudinary,
  params: async () => ({ folder: 'publicaciones', allowed_formats: ['jpg', 'jpeg', 'png', 'webp'] }),
});

@Controller('publicaciones')
export class PublicacionesController {
  constructor(private readonly publicacionesService: PublicacionesService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  @UseInterceptors(FileInterceptor('imagen', { storage }))
  create(
    @Body() dto: CreatePublicacionesDto,
    @UploadedFile() archivo: Express.Multer.File,
    @Req() req: any,
  ) {
    return this.publicacionesService.create(
        dto,
        req.user._id,
        archivo,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/like')
  like(@Param('id') id:string, @Req() req:any){
      return this.publicacionesService.like(
          id,
          req.user._id,
      );
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id/like')
  quitarLike(@Param('id') id: string, @Req() req: any){
    return this.publicacionesService.quitarLike(
      id,
      req.user._id,
    );
  }

  @Get()
  findAll(
    @Query('orden') orden?: string,
    @Query('offset') offset?: number,
    @Query('limit') limit?: number,
  ) {
    return this.publicacionesService.findAll(orden, offset, limit);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePublicacioneDto: UpdatePublicacionesDto) {
    return this.publicacionesService.update(+id, updatePublicacioneDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id:string, @Req() req:any){
    return this.publicacionesService.remove(id, req.user._id, req.user.perfil,);
  }

  @Get(':id')
  findOne(@Param('id') id:string){
    return this.publicacionesService.findOne(id);
  }
  
}