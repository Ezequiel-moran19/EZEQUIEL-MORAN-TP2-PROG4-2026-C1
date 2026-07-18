import { Body, Controller, Post, UploadedFile, UseInterceptors, Res, Req, UnauthorizedException } from '@nestjs/common';
import type { Request, Response } from 'express';
import { RegistroDto } from './dto/registro.dto';
import { LoginDto } from './dto/login.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { crearStorage } from '../config/cloudinary.storage';
import { AuthService } from './auth.service';
import { crearCookie } from './auth.utils';

@Controller('auth')
export class AuthController {

  constructor(private readonly authService: AuthService) {}
  
  @Post('registro')
  @UseInterceptors(FileInterceptor('imagenPerfil', { storage: crearStorage('usuarios') }))
  async registro(@Body() dto: RegistroDto, @UploadedFile() archivo: Express.Multer.File, @Res({ passthrough: true }) res: Response) {
    // const respuesta = await this.authService.registro(dto, archivo);
    // crearCookie(res, respuesta.token);

    // return respuesta;
    const respuesta = await this.authService.registro(dto, archivo);

    crearCookie(res, respuesta.token);

    return { usuario: respuesta.usuario, message: respuesta.message };
  }

  @Post('login')
  async login(@Body() dto: LoginDto, @Res({ passthrough: true }) res: Response) {
    const respuesta = await this.authService.login(
      dto.usuario,
      dto.password,
    );

    crearCookie(res, respuesta.token);

    // return respuesta;
    return { usuario: respuesta.usuario, message: respuesta.message };
  }

  @Post('autorizar')
  autorizar(@Req() req: Request) {
    console.log(req.cookies);
    console.log(req.headers.cookie);
    const token = req.cookies?.token;
    console.log(req.cookies.token);
    if(!token){
      throw new UnauthorizedException();
    }
    return this.authService.autorizar(token);
  }

  @Post('refrescar')
  async refrescar(@Req() req: Request, @Res({ passthrough:true }) res: Response){
      const respuesta = await this.authService.refrescar(req.cookies.token);
      crearCookie(res, respuesta.token); 
      // return respuesta;
      return { message: 'Token actualizado' };
  }

  @Post('logout')
  logout(@Res({ passthrough: true }) res: Response) {

    res.clearCookie('token', {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
    });

    return {
      mensaje: 'Sesion cerrada',
    };
  }
}

// @Post('logout')
  // logout(@Res() res: Response){

  //   res.clearCookie('token', {
  //     httpOnly:true,
  //     sameSite:'lax'
  //   });

  //   return res.json({
  //     mensaje:'Sesion cerrada'
  //   });

  // }