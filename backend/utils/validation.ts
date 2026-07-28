export class ValidationUtil {
  static isEmail(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  static isPhone(phone: string): boolean {
    return /^[\d\s+\-]{8,15}$/.test(phone);
  }
}
