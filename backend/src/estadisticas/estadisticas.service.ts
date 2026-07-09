import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Publicaciones } from '../publicaciones/schemas/publicaciones.schema';
import { Comentario } from '../comentarios/schemas/comentario.schema';
import { Usuario } from '../usuarios/schemas/usuario.schema';
import { Model } from 'mongoose';

@Injectable()
export class EstadisticasService {

  constructor(
    @InjectModel(Publicaciones.name)
    private publicacionesModel: Model<Publicaciones>,

    @InjectModel(Comentario.name)
    private comentariosModel: Model<Comentario>,

    @InjectModel(Usuario.name)
    private usuariosModel: Model<Usuario>,
  ) {
  }

  async publicacionesPorUsuario(desde?: string, hasta?: string) {

    const match: any = {};

    if (desde && hasta) {
      match.createdAt = {
        $gte: new Date(desde),
        $lte: new Date(hasta)
      };
    }

    return this.publicacionesModel.aggregate([

      {
        $match: match
      },

      {
        $addFields: {
          autorObj: {
            $toObjectId: '$autor'
          }
        }
      },

      {
        $lookup: {
          from: 'usuarios',
          localField: 'autorObj',
          foreignField: '_id',
          as: 'usuario'
        }
      },

      {
        $unwind: '$usuario'
      },

      {
        $group: {
          _id: '$usuario.nombreUsuario',
          cantidad: {
            $sum: 1
          }
        }
      },

      {
        $project: {
          _id: 0,
          usuario: '$_id',
          cantidad: 1
        }
      }

    ]);

  }

  async comentariosPorFecha(desde?: string, hasta?: string) {

    const match: any = {};

    if (desde && hasta) {

      match.createdAt = {
        $gte: new Date(desde),
        $lte: new Date(hasta)
      }
    }

    return this.comentariosModel.aggregate([

      {
        $match: match
      },

      {
        $group: {
          _id: {
            $dateToString: {
              format: '%Y-%m-%d',
              date: '$createdAt'
            }
          },

          cantidad: {
            $sum: 1
          }
        }
      },

      {
        $sort: {
          _id: 1
        }
      }

    ]);

  }

  async comentariosPorPublicacion(desde?: string, hasta?: string) {

    const match: any = {};

    if (desde && hasta) {
      match.createdAt = {
        $gte: new Date(desde),
        $lte: new Date(hasta)
      }
    }

    return this.comentariosModel.aggregate([

      {
        $match: match
      },

      {
        $addFields: {
          publicacionObj: {
            $toObjectId: '$publicacion'
          }
        }
      },

      {
        $group: {
          _id: '$publicacionObj',
          cantidad: {
            $sum: 1
          }
        }
      },

      {
        $lookup: {
          from: 'publicaciones',
          localField: '_id',
          foreignField: '_id',
          as: 'publicacion'
        }
      },

      {
        $unwind: '$publicacion'
      },

      {
        $project: {
          _id: 0,
          publicacion: '$publicacion.descripcion',
          cantidad: 1
        }
      }

    ]);

  }
}