export interface RegisterRequest {
  email: string;
  password: string;
  name?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  data?: {
    user: {
      id: string;
      email: string;
      name?: string;
    };
    token: string;
  };
  message?: string;
}

export interface JwtPayload {
  userId: string;
  email: string;
}