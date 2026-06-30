import { Module } from '@nestjs/common';
import { ComentariosService } from './comentarios.service';
import { ComentariosController } from './comentarios.controller';
import { UsuariosModule } from '../usuarios/usuarios.module';
import { PublicacionesModule } from '../publicaciones/publicaciones.module';
import { MongooseModule } from '@nestjs/mongoose';
import { Comentario, ComentarioSchema } from './schemas/comentario.schema';
import { Publicaciones, PublicacionesSchema } from '../publicaciones/schemas/publicaciones.schema';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Comentario.name,
        schema: ComentarioSchema
      },
      {
        name: Publicaciones.name,
        schema: PublicacionesSchema,
      },
    ]),
    UsuariosModule,
    PublicacionesModule,
    AuthModule
  ],
  controllers: [ComentariosController],
  providers: [ComentariosService],
})
export class ComentariosModule {}
