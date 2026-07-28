import { Response } from 'express';

export class ApiResponse {
  static success(res: Response, data: any, message = 'Opération réussie', statusCode = 200) {
    return res.status(statusCode).json({
      success: true,
      message,
      data,
      timestamp: new Date().toISOString()
    });
  }

  static error(res: Response, message = 'Une erreur est survenue', statusCode = 400, errors: any = null) {
    return res.status(statusCode).json({
      success: false,
      message,
      errors,
      timestamp: new Date().toISOString()
    });
  }
}
