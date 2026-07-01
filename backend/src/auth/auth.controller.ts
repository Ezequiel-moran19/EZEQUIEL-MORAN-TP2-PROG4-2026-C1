import { Body, Controller, Post, UploadedFile, UseInterceptors, Res, Req, UnauthorizedException } from '@nestjs/common';
import type { Request, Response } from 'express';
import { RegistroDto } from './dto/registro.dto';
import { LoginDto } from './dto/login.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { storage } from '../config/cloudinary.storage';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  private crearCookie(res: Response, token: string){
    res.cookie('token', token, {
      httpOnly:true,
      maxAge:15 * 60 * 1000,
      sameSite:'lax'
    });
  }
  
  @Post('registro')
  @UseInterceptors(FileInterceptor('imagenPerfil', { storage }))
  async registro(@Body() dto: RegistroDto, @UploadedFile() archivo: Express.Multer.File, @Res({ passthrough: true }) res: Response) {
    const respuesta = await this.authService.registro(dto, archivo);
    this.crearCookie(res, respuesta.token);

    return respuesta;
  }

  @Post('login')
  async login(@Body() dto: LoginDto, @Res({ passthrough: true }) res: Response) {
    const respuesta = await this.authService.login(
      dto.usuario,
      dto.password,
    );

    this.crearCookie(res, respuesta.token);

    return respuesta;
  }

  @Post('autorizar')
  autorizar(@Req() req: Request) {

    const token = req.cookies?.token;

    if(!token){
      throw new UnauthorizedException();
    }

    return this.authService.autorizar(token);
  }

  @Post('refrescar')
  async refrescar(@Req() req: Request, @Res({ passthrough:true }) res: Response){
      const respuesta = await this.authService.refrescar(req.cookies.token);
      this.crearCookie(res, respuesta.token); 
      return respuesta;
  }

  @Post('logout')
  logout(@Res() res: Response){

    res.clearCookie('token', {
      httpOnly:true,
      sameSite:'lax'
    });

    return res.json({
      mensaje:'Sesion cerrada'
    });

  }
}

  // res.cookie('token', token, {
  //   httpOnly: true,
  //   maxAge: 20 * 1000,
  //   sameSite: 'lax'
  // });