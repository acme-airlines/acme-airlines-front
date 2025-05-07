export interface TokenResponse {
  accessToken: string;
    token_type: string;
    id_token?: string;
    expires_in: number;
    scope: string;
  }