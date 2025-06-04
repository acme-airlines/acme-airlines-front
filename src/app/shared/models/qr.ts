export interface Qr {
  codigoQr: string;
  dateCreatedQr: string;   // vendrá como ISO string (p. ej. "2025-06-01")
  dateExpiredQr: string;   // idem
  imagenQr: string;        // base64-encoded (Jackson serializa byte[] como base64)
}
