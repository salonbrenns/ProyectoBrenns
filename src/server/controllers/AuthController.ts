// src/server/controllers/AuthController.ts
import { ApiResponse, Usuario } from '@/types';

export class AuthController {
  // Usamos "_" antes del nombre de la variable para decirle a TS que sabemos que no se usa aún
  static async login(_email: string, _password: string): Promise<ApiResponse<{ user: Usuario; token: string }>> {
    try {
      // TODO: Implementar lógica de login real con Prisma y bcrypt
      return {
        success: true,
        data: {
          user: {} as Usuario,
          token: '',
        },
      };
    } catch (_error) {
      return {
        success: false,
        error: 'Error al iniciar sesión',
      };
    }
  }

  static async register(_usuario: Partial<Usuario>, _password: string): Promise<ApiResponse<Usuario>> {
    try {
      // TODO: Implementar lógica de registro real
      return {
        success: true,
        data: {} as Usuario,
      };
    } catch (_error) {
      return {
        success: false,
        error: 'Error al registrar usuario',
      };
    }
  }
}