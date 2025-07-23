export interface RegisterGuardRequest {
  name: string;
  email: string;
  password: string;
}

export interface LoginGuardRequest {
  email: string;
  password: string;
}

export interface GuardResponse {
  id: number;
  name: string;
  email: string;
  acces_token?: string;
}

export interface UpdateGuardRequest {
  name?: string;
  email?: string;
  password?: string;
}
