// Utilidades del servidor

/**
 * Respuesta exitosa de la API
 */
export const successResponse = <T>(data: T, message?: string) => {
  return {
    success: true,
    data,
    message,
  };
};

/**
 * Respuesta de error de la API
 */
export const errorResponse = (error: string, message?: string) => {
  return {
    success: false,
    error,
    message,
  };
};

/**
 * Validar que un email tenga formato correcto
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validar que una contraseña sea segura
 */
export const isValidPassword = (password: string): boolean => {
  return password.length >= 8;
};
