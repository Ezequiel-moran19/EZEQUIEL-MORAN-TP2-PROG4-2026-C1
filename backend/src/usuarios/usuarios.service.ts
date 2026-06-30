import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Usuario } from './schemas/usuario.schema';
import { Model } from 'mongoose';
import { EditarPerfilDto } from './dto/editar-perfil.dto';

@Injectable()
export class UsuariosService {

  constructor(@InjectModel(Usuario.name) private usuarioModel: Model<Usuario>) {}

  async create(datos: Partial<Usuario>) {
    const usuario = new this.usuarioModel(datos);
    return usuario.save();
  }

  async findAll() {
    return this.usuarioModel.find();
  }

  async editarPerfil(id: string, dto: EditarPerfilDto, archivo?: Express.Multer.File,) {
    const datos = { ...dto, ...(archivo && { imagenPerfil: archivo.path }),};
    return this.usuarioModel.findByIdAndUpdate(id, datos, { new: true },);
  }

  async buscarPorEmail(email: string) {
    return this.usuarioModel.findOne({ email });
  }

  async buscarPorNombreUsuario(nombreUsuario: string) {
    return this.usuarioModel.findOne({ nombreUsuario });
  }

  async buscarPorUsuarioOEmail(usuario: string) {
    return this.usuarioModel.findOne({
      $or: [
        { email: usuario },
        { nombreUsuario: usuario }
      ]
    });
  }
  
  async buscarPorId(id: string) {
    return this.usuarioModel.findById(id);
  }
}