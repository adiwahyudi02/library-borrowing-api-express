export interface CreateBorrowingRequest {
  memberId: number;
  bookId: number;
  guardId: number;
  borrowDate: string;
  dueDate: string;
}
