import { Controller, Get, Post, Body, Patch, Param, Delete, UploadedFile, UseInterceptors } from '@nestjs/common';
import { UsuariosService } from './usuarios.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { EditarPerfilDto } from './dto/editar-perfil.dto';
import { storage } from '../config/cloudinary.storage';

@Controller('usuarios')
export class UsuariosController {
  constructor(private readonly usuariosService: UsuariosService) {}

  @Get()
  findAll() {
    return this.usuariosService.findAll();
  }

  @Patch(':id')
  @UseInterceptors(FileInterceptor('imagenPerfil', { storage }))
  editarPerfil(
    @Param('id') id: string,
    @Body() dto: EditarPerfilDto,
    @UploadedFile() archivo?: Express.Multer.File,
  ) {
    return this.usuariosService.editarPerfil(id, dto, archivo);
  }

}