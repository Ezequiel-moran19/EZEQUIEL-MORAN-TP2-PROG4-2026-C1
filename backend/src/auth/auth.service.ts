import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { RegistroDto } from './dto/registro.dto';
import { UsuariosService } from '../usuarios/usuarios.service';
import * as bcrypt from 'bcrypt';
    
@Injectable()
export class AuthService {

  constructor(private readonly usuariosService: UsuariosService) {}

    async registro(crearRegistroDto: RegistroDto, archivo: Express.Multer.File) {

        try {

            const existeEmail = await this.usuariosService.buscarPorEmail(crearRegistroDto.email,);
            if (existeEmail) {
                throw new HttpException( 'El email ya está registrado', HttpStatus.BAD_REQUEST);
            }

            const existeUsuario = await this.usuariosService.buscarPorNombreUsuario(crearRegistroDto.nombreUsuario);
            if (existeUsuario) {
                throw new HttpException('El nombre de usuario ya está registrado', HttpStatus.BAD_REQUEST);
            }

            if (crearRegistroDto.password !== crearRegistroDto.repetirPassword) {
                throw new HttpException('Las contraseñas no coinciden', HttpStatus.BAD_REQUEST);
            }

            const hashedPassword = await bcrypt.hash(crearRegistroDto.password, 10);
            const {repetirPassword, ...datosUsuario} = crearRegistroDto;
            const usuario = { ...datosUsuario, password: hashedPassword, imagenPerfil: archivo ? archivo.path : null,};
            const usuarioGuardado = await this.usuariosService.create(usuario);

            return {
                usuario: this.removePassword(usuarioGuardado),
                message: 'Usuario registrado correctamente',
            };

            } catch (error) {

                if (error instanceof HttpException) {
                    throw error;
                }
            }
    }

    async login(email: string, password: string) {

        const usuario = await this.usuariosService.buscarPorUsuarioOEmail(email);
        if (!usuario) {
            throw new HttpException('Credenciales inválidas', HttpStatus.UNAUTHORIZED,);
        }

        const esPasswordValida = await bcrypt.compare(password, usuario.password);
        if (!esPasswordValida) {
            throw new HttpException('Credenciales inválidas', HttpStatus.UNAUTHORIZED,);
        }

        return {
            usuario: this.removePassword(usuario),
            message: 'Login correcto',
        };
    }

    private removePassword(usuario: any) {
        const { password, ...result } = usuario.toObject();
        return result;
    }
}
