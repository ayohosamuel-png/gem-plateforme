export class StorageService {
  /**
   * Interface Cloudflare R2 Bucket
   */
  static getR2BucketName(type: 'pdf' | 'certificate'): string {
    return type === 'pdf' ? 'imhotep-memoires-pdfs' : 'imhotep-memoires-certificates';
  }

  static generatePresignedUrl(thesisId: string, fileName: string): string {
    return `/api/theses/${thesisId}/download?file=${encodeURIComponent(fileName)}`;
  }
}
