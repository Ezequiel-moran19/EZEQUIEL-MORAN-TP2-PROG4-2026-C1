import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PublicacionesModule } from './publicaciones/publicaciones.module';
import { EstadisticasModule } from './estadisticas/estadisticas.module';
import { ComentariosModule } from './comentarios/comentarios.module';
import { AuthModule } from './auth/auth.module';
import { UsuariosModule } from './usuarios/usuarios.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import dns from 'dns';

dns.setServers(["1.1.1.1", "8.8.8.8"]);

@Module({
imports: [
    ConfigModule.forRoot(),
    PublicacionesModule,
    UsuariosModule,
    AuthModule,
    EstadisticasModule,
    ComentariosModule,

    MongooseModule.forRoot(
      process.env.MONGO_URL as string,
      {
        serverSelectionTimeoutMS: 5000,
      },
    ),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
