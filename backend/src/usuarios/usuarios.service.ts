import { Injectable } from '@nestjs/common';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Usuario } from './entities/usuario.entity';
import { Model } from 'mongoose';

@Injectable()
export class UsuariosService {

  constructor(
    @InjectModel(Usuario.name)
    private usuarioModel: Model<Usuario>
  ) {}

  create(createUsuarioDto: CreateUsuarioDto) {
    const usuarioCreado = new this.usuarioModel(createUsuarioDto);
    return usuarioCreado.save();
  }

  async findAll() {
    return this.usuarioModel.find();
  }

  findOne(id: number) {
    return `This action returns a #${id} usuario`;
  }

  update(id: number, updateUsuarioDto: UpdateUsuarioDto) {
    return `This action updates a #${id} usuario`;
  }

  remove(id: number) {
    return `This action removes a #${id} usuario`;
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
}
