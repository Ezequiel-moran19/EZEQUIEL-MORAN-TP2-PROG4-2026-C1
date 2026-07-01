import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { RegistroDto } from './dto/registro.dto';
import { UsuariosService } from '../usuarios/usuarios.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {

  constructor(private readonly usuariosService: UsuariosService, private readonly jwtService: JwtService) {}

  async registro(crearRegistroDto: RegistroDto, archivo: Express.Multer.File) {
    try {
      const existeEmail = await this.usuariosService.buscarPorEmail(crearRegistroDto.email,);
      if (existeEmail) {
        throw new HttpException('El email ya está registrado',  HttpStatus.BAD_REQUEST);
      }

      const existeUsuario = await this.usuariosService.buscarPorNombreUsuario(crearRegistroDto.nombreUsuario);
      if (existeUsuario) {
        throw new HttpException('El nombre de usuario ya está registrado', HttpStatus.BAD_REQUEST);
      }

      if (crearRegistroDto.password !== crearRegistroDto.repetirPassword) {
        throw new HttpException('Las contraseñas no coinciden', HttpStatus.BAD_REQUEST,);
      }

      const hashedPassword = await bcrypt.hash(crearRegistroDto.password, 10);
      const { ...datosUsuario } = crearRegistroDto;
      const usuario = {
        ...datosUsuario,
        password: hashedPassword,
        perfil:'usuario',
        ...(archivo && { imagenPerfil: archivo.path }),
      };
      const usuarioGuardado = await this.usuariosService.create(usuario);
      const token = this.generarToken(usuarioGuardado);
      return {
        usuario: this.removePassword(usuarioGuardado),
        token,
        message: 'Usuario registrado correctamente',
      };

    } catch (error) {

      if (error instanceof HttpException) {
        throw error;
      }

      throw new HttpException('Error interno del servidor', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async login(email: string, password: string) {

    try {

      const usuario = await this.usuariosService.buscarPorUsuarioOEmail(email);
      if (!usuario) {
        throw new HttpException('Credenciales inválidas', HttpStatus.UNAUTHORIZED);
      }

      if (!usuario.activo) {
        throw new HttpException(
          'Usuario deshabilitado',
          HttpStatus.UNAUTHORIZED,
        );
      }

      const esPasswordValida = await bcrypt.compare(password, usuario.password);
      if (!esPasswordValida) {
        throw new HttpException('Credenciales inválidas', HttpStatus.UNAUTHORIZED);
      }

      const token = this.generarToken(usuario);

      return {
        usuario: this.removePassword(usuario),
        token,
        message:'Login correcto'
      };

    } catch(error){

      throw error;
    }

  }

  private generarToken(usuario: any): string {

    const payload = { sub: usuario._id, email: usuario.email, nombreUsuario: usuario.nombreUsuario, perfil: usuario.perfil };

    return this.jwtService.sign(payload);
  }

  async autorizar(token: string) {
    try {

      const payload = this.jwtService.verify(token);

      const usuario = await this.usuariosService.buscarPorId(payload.sub);

      if (!usuario) {
        throw new HttpException('Usuario no encontrado', HttpStatus.UNAUTHORIZED);
      }

      return this.removePassword(usuario);

    } catch {
      throw new HttpException('Token inválido o expirado', HttpStatus.UNAUTHORIZED);
    }
  }

  async refrescar(token: string) {
    try {

      const payload = this.jwtService.verify(token);

      const nuevoToken = this.jwtService.sign({
        sub: payload.sub,
        email: payload.email,
        nombreUsuario: payload.nombreUsuario,
        perfil: payload.perfil,
      });

      return {
        token: nuevoToken,
      };

    } catch {
      throw new HttpException('Token inválido o expirado', HttpStatus.UNAUTHORIZED);
    }
  }

  private removePassword(usuario:any){
    const objeto = usuario.toObject ? usuario.toObject() : usuario;
    const {password, ...result} = objeto;
    return result;
  }
}