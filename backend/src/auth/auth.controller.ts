import { Body, Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { RegistroDto } from './dto/registro.dto';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { FileInterceptor } from '@nestjs/platform-express';

import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from '../config/cloudinary';

const storage = new CloudinaryStorage({
  cloudinary,
  params: async () => ({
    folder: 'usuarios',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
  }),
});

@Controller('auth')
export class AuthController {

  constructor(private readonly authService: AuthService) {}

  @Post('registro')
  @UseInterceptors(FileInterceptor('imagenPerfil', { storage }))
  registro(@Body() dto: RegistroDto, @UploadedFile() archivo: Express.Multer.File) {
    return this.authService.registro(dto, archivo);
 }

  @Post('login')
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto.usuario, dto.password);
  }
}