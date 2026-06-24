import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

export type PublicacioneDocument = Publicaciones & Document;

@Schema({timestamps: true})
export class Publicaciones {
    @Prop({ required: true })
    titulo!: string;

    @Prop({ required: true })
    descripcion!: string;

    @Prop()
    imagen?: string;

    @Prop({ required: true })
    autorId!: string;

    @Prop({ default: true })
    activo!: boolean;

    @Prop({ type: [String], default: [] })
    likes!: string[];

    @Prop({ default: 0 })
    cantidadLikes!: number;
}

export const PublicacionesSchema = SchemaFactory.createForClass(Publicaciones);