import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateComentarioDto } from './dto/create-comentario.dto';
import { UpdateComentarioDto } from './dto/update-comentario.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Comentario } from './schemas/comentario.schema';
import { Publicaciones } from '../publicaciones/schemas/publicaciones.schema';

@Injectable()
export class ComentariosService {
  constructor(
    @InjectModel(Comentario.name) private comentarioModel: Model<Comentario>,
    @InjectModel(Publicaciones.name) private publicacionesModel: Model<Publicaciones> ) {}

  async create(publicacionId: string, dto: CreateComentarioDto, usuarioId: string) {
    const comentario = await new this.comentarioModel({ mensaje: dto.mensaje, autor: usuarioId, publicacion: publicacionId,}).save();

    await this.publicacionesModel.findByIdAndUpdate(
      publicacionId,
      {
        $inc: {
          cantidadComentarios: 1,
        },
      },
    );

    return comentario.populate('autor', 'nombre apellido nombreUsuario imagenPerfil');
  }

  async findAll(publicacionId: string, offset: number, limit: number) {
    return this.comentarioModel
      .find({ publicacion: publicacionId })
      .populate('autor', 'nombre apellido nombreUsuario imagenPerfil')
      .sort({ createdAt: -1 })
      .skip(offset)
      .limit(limit);
  }

  async update(id: string, dto: UpdateComentarioDto, usuarioId: string) {
    const comentario = await this.comentarioModel.findById(id);

    if (!comentario) {
      throw new NotFoundException('Comentario no encontrado');
    }

    if (comentario.autor.toString() !== usuarioId) {
      throw new ForbiddenException(
        'No puede modificar este comentario',
      );
    }

    comentario.mensaje = dto.mensaje;
    comentario.modificado = true;

    return comentario.save();
  }
}

