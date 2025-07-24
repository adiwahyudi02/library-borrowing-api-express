export interface CreateBookRequest {
  title: string;
  author: string;
  stock: number;
}

export interface ListBookRequest {
  title?: string;
  author?: string;
  page: number;
  size: number;
}
