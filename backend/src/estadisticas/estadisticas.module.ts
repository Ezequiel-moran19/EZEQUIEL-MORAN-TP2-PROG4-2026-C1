import { Module } from '@nestjs/common';
import { EstadisticasService } from './estadisticas.service';
import { EstadisticasController } from './estadisticas.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Publicaciones, PublicacionesSchema } from '../publicaciones/schemas/publicaciones.schema';
import { Comentario, ComentarioSchema } from '../comentarios/schemas/comentario.schema';
import { Usuario, UsuarioSchema } from '../usuarios/schemas/usuario.schema';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    AuthModule,

    MongooseModule.forFeature([
      {
        name: Publicaciones.name,
        schema: PublicacionesSchema,
      },
      {
        name: Comentario.name,
        schema: ComentarioSchema,
      },
      {
        name: Usuario.name,
        schema: UsuarioSchema,
      },
    ]),
  ],

  controllers: [EstadisticasController],

  providers: [
    EstadisticasService,
  ],
})
export class EstadisticasModule {}