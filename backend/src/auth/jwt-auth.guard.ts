import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import type { Request } from 'express';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean {
    const request: Request = context.switchToHttp().getRequest();

    let token: string | undefined;

    token = request.cookies?.token;

    if (!token) {
      throw new UnauthorizedException('Token no enviado');
    }

    try {
      const payload = this.jwtService.verify(token);

      (request as any).user = {
        _id: payload.sub,
        email: payload.email,
        nombreUsuario: payload.nombreUsuario,
        perfil: payload.perfil,
      };

      return true;
    } catch {
      throw new UnauthorizedException('Token inválido');
    }
  }
}
