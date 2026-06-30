import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();

    let token: string | undefined;

    token = request.cookies?.token;

    if (!token) {
      const authHeader = request.headers.authorization;

      if (authHeader?.startsWith('Bearer ')) {
        token = authHeader.replace('Bearer ', '');
      }
    }

    if (!token) {
      throw new UnauthorizedException('Token no enviado');
    }

    try {
      const payload = this.jwtService.verify(token);

      request.user = {
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