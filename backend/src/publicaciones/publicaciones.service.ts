import { Injectable } from '@nestjs/common';
import { CreatePublicacionesDto } from './dto/create-publicaciones.dto';
import { UpdatePublicacionesDto } from './dto/update-publicaciones.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Publicaciones } from './schemas/publicaciones.schema';
import { Model } from 'mongoose';
import { ForbiddenException, NotFoundException } from '@nestjs/common';

@Injectable()
export class PublicacionesService {

  constructor(@InjectModel(Publicaciones.name) private publicacionesModel: Model<Publicaciones>) { }

  create(dto: CreatePublicacionesDto, archivo?: Express.Multer.File) {
    const nuevaPublicacion = {
      ...dto,
      ...(archivo && { imagen: archivo.path })
    };
    return new this.publicacionesModel(nuevaPublicacion).save();
  }

  async findAll(orden?: string, offset = 0, limit = 10) {

    const filtro: any = { activo: true };

    let query = this.publicacionesModel.find(filtro).populate('autor','nombre apellido nombreUsuario imagenPerfil');

    if (orden === 'likes') {
      query = query.sort({
        cantidadLikes: -1
      });

    } else if (orden === 'antiguas') {
      query = query.sort({
        createdAt: 1
      });

    } else {
      query = query.sort({
        createdAt: -1
      });

    }

    return query.skip(offset).limit(limit);
  }

  update(id: number, updatePublicacionesDto: UpdatePublicacionesDto) {
    return `This action updates a #${id} publicacione`;
  }

  async like(id: string, usuarioId: string) {

    const publicacion = await this.publicacionesModel.findById(id);

    if (!publicacion) {
      throw new NotFoundException('Publicación no encontrada');
    }

    if (publicacion.likes.includes(usuarioId)) {
      return publicacion;
    }

    publicacion.likes.push(usuarioId);
    publicacion.cantidadLikes = publicacion.likes.length;
    return publicacion.save();
  }

  async quitarLike(id: string, usuarioId: string) {

    const publicacion = await this.publicacionesModel.findById(id);

    if (!publicacion) {
      throw new NotFoundException('Publicación no encontrada');
    }

    publicacion.likes = publicacion.likes.filter(id => id !== usuarioId);
    publicacion.cantidadLikes = publicacion.likes.length;

    return publicacion.save();
  }

  async remove(id: string, usuarioId: string, perfil: string) {

    const publicacion = await this.publicacionesModel.findById(id);

    if (!publicacion) {
      throw new NotFoundException('Publicación no encontrada');
    }

    if (publicacion.autor.toString() !== usuarioId && perfil !== 'administrador') {
      throw new ForbiddenException('No autorizado');
    }

    publicacion.activo = false;
    return publicacion.save();
  }
}