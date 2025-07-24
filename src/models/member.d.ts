export interface CreateMemberRequest {
  name: string;
  email: string;
  phone: string;
}

export interface ListMemberRequest {
  name?: string;
  email?: string;
  phone?: string;
  page: number;
  size: number;
}
