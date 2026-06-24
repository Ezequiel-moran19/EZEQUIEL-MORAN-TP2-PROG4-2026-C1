import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { RegistroDto } from './dto/registro.dto';
import { UsuariosService } from '../usuarios/usuarios.service';
import * as bcrypt from 'bcrypt';
    
@Injectable()
export class AuthService {

  constructor(private readonly usuariosService: UsuariosService) {}

    async registro(crearRegistroDto: RegistroDto, archivo: Express.Multer.File) {

        try {

            await this.validarUsuario(crearRegistroDto);
            this.validarPasswords(crearRegistroDto);
            this.validarFechaNacimiento(crearRegistroDto.fechaNacimiento);

            const hashedPassword = await this.hashearPassword(crearRegistroDto.password);
            const usuario = this.crearUsuario(crearRegistroDto, hashedPassword, archivo );
            const usuarioGuardado = await this.usuariosService.create(usuario);

            return {
                usuario: this.removePassword(usuarioGuardado),
                message: 'Usuario registrado correctamente',
            };

        } catch (error) {

            if (error instanceof HttpException) {
                throw error;
            }

            throw new HttpException('Error al registrar usuario', HttpStatus.INTERNAL_SERVER_ERROR);
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

    private async validarUsuario(dto: RegistroDto) {

        const existeEmail = await this.usuariosService.buscarPorEmail(dto.email);

        if (existeEmail) {
            throw new HttpException('El email ya está registrado', HttpStatus.BAD_REQUEST);
        }

        const existeUsuario = await this.usuariosService.buscarPorNombreUsuario(dto.nombreUsuario);
        if (existeUsuario) {
            throw new HttpException('El nombre de usuario ya está registrado', HttpStatus.BAD_REQUEST);
        }
    }

    private validarPasswords(dto: RegistroDto) {

        if (dto.password !== dto.repetirPassword) {
            throw new HttpException('Las contraseñas no coinciden', HttpStatus.BAD_REQUEST);
        }
    }

    private validarFechaNacimiento(fecha: Date) {

        const fechaNacimiento = new Date(fecha);
        const hoy = new Date();

        if (fechaNacimiento > hoy) {
            throw new HttpException('La fecha de nacimiento no puede ser futura', HttpStatus.BAD_REQUEST);
        }

        let edad = hoy.getFullYear() - fechaNacimiento.getFullYear();

        if ( hoy.getMonth() < fechaNacimiento.getMonth() ||
            (hoy.getMonth() === fechaNacimiento.getMonth() && 
             hoy.getDate() < fechaNacimiento.getDate())) {
            edad--;
        }

        if (edad < 13) {
            throw new HttpException('Debe tener al menos 13 años para registrarse', HttpStatus.BAD_REQUEST);
        }
    }

    private async hashearPassword(password: string) {
        return bcrypt.hash(password, 10);
    }

    private crearUsuario(dto: RegistroDto, hashedPassword: string, archivo?: Express.Multer.File) {

        const { repetirPassword, ...datosUsuario } = dto;
        return {
            ...datosUsuario, password: hashedPassword, imagenPerfil: archivo ? archivo.path : null,
        };
    }
    private removePassword(usuario: any) {
        const { password, ...result } = usuario.toObject();
        return result;
    }
}
