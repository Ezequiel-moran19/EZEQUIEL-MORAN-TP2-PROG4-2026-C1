import { Types, Document } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Usuario } from '../../usuarios/schemas/usuario.schema';

export type PublicacionDocument = Publicaciones & Document;

@Schema({ timestamps: true })
export class Publicaciones {

    @Prop({ required: true })
    titulo!: string;

    @Prop({ required: true })
    descripcion!: string;

    @Prop()
    imagen?: string;

    @Prop({ type: Types.ObjectId, ref: Usuario.name, required: true })
    autor!: Types.ObjectId;

    @Prop({ default: true })
    activo!: boolean;

    @Prop({ type: [String], default: [] })
    likes!: string[];

    @Prop({ default: 0 })
    cantidadLikes!: number;
}

export const PublicacionesSchema = SchemaFactory.createForClass(Publicaciones);