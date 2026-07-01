import { Controller, Get, Post, Body, Patch, Param, Delete, UploadedFile, UseInterceptors, UseGuards } from '@nestjs/common';
import { UsuariosService } from './usuarios.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { EditarPerfilDto } from './dto/editar-perfil.dto';
import { storage } from '../config/cloudinary.storage';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AdminGuard } from '../auth/admin.guard';
import { CreateUsuarioAdminDto } from './dto/reate-usuario-admin.dto';
import { AuthService } from '../auth/auth.service';

@Controller('usuarios')
export class UsuariosController {
  
  constructor(private readonly usuariosService: UsuariosService ){}

  @UseGuards(JwtAuthGuard, AdminGuard)
  @Post()
  crearUsuario(@Body() dto: CreateUsuarioAdminDto) {
    return this.usuariosService.crearUsuarioAdmin(dto);
  }
  
  @UseGuards(JwtAuthGuard, AdminGuard)
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

  @UseGuards(JwtAuthGuard, AdminGuard)
  @Delete(':id')
  deshabilitar(@Param('id') id: string) {
    return this.usuariosService.deshabilitar(id);
  }

  @UseGuards(JwtAuthGuard,AdminGuard)
  @Post(':id/rehabilitar')
  habilitar(@Param('id') id:string){
    return this.usuariosService.habilitar(id);
  }
}