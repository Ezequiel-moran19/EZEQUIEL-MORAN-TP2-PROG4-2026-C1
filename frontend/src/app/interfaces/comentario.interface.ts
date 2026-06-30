export interface Comentario {
  _id:string;
  mensaje:string;

  autor:{
    _id:string;
    nombre:string;
    apellido:string;
    nombreUsuario:string;
  };
  publicacion:string;
  modificado:boolean;
  createdAt:string;
}