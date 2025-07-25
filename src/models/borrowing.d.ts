export interface CreateBorrowingRequest {
  memberId: number;
  bookId: number;
  guardId: number;
  borrowDate: string;
  dueDate: string;
}

export interface ListBorrowingRequest {
  search?: string;
  status?: "borrowed" | "returned";
  borrowDate?: string;
  dueDate?: string;
  returnDate?: string;
  page: number;
  size: number;
}
