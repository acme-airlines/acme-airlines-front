export interface TokenResponse {
    access_token: string;
    token_type: string;
    id_token?: string;
    expires_in: number;
    scope: string;
  }