import { Module } from '@nestjs/common';
import { UsuariosService } from './usuarios.service';
import { UsuariosController } from './usuarios.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Usuario, UsuarioSchema } from './schemas/usuario.schema';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Usuario.name, schema: UsuarioSchema }
    ]),
    JwtModule.register({
      secret: process.env.JWT_SECRET!,
    }),
  ],

  controllers: [UsuariosController],

  providers: [
    UsuariosService,
    JwtAuthGuard,
  ],

  exports: [
    UsuariosService,
  ],
})
export class UsuariosModule {}