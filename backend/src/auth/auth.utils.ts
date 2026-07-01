import { Response } from 'express';

export function crearCookie(res: Response, token:string){

  res.cookie('token', token, {
    httpOnly:true,
    maxAge:15 * 60 * 1000,
    sameSite:'lax'
  });

}