import { Response } from 'express';

export function crearCookie(res: Response, token:string){
  res.cookie('token', token, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge: 15 * 60 * 1000,
  });
}   