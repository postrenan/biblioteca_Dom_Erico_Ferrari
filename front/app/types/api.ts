export enum Role {
  STUDENT = 'STUDENT',
  TEACHER = 'TEACHER',
  LIBRARIAN = 'LIBRARIAN',
  ADMIN = 'ADMIN'
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  matricula?: string;
  serie?: string;
  createdAt?: string;
}

export interface AuthResponse {
  access_token: string;
  user: User;
}

export interface BookCopy {
  id: string;
  bookId: string;
  copyCode: string;
  customLabel?: string;
  status: 'AVAILABLE' | 'LOANED' | 'LOST' | 'RESERVED';
  book?: Book;
}

export interface Category {
  id: string;
  name: string;
  _count?: {
    books: number;
  };
}

export interface Book {
  id: string;
  title: string;
  author: string;
  description: string;
  coverUrl?: string;
  isbn?: string;
  publicationDate?: string;
  genre?: string;
  categoryId?: string;
  categories?: Category[];
  labelType?: 'AUTO' | 'MANUAL';
  category?: Category;
  categoryName?: string;
  totalCopies: number;
  availableCopies: number;
}

export interface Fine {
  id: string;
  userId: string;
  loanId?: string;
  value: number;
  reason: string;
  status: 'PENDING' | 'PAID';
  createdAt: string;
  paidAt?: string;
  loan?: Loan;
}

export interface Loan {
  id: string;
  bookCopyId: string;
  userId: string;
  loanDate: string;
  dueDate: string;
  returnDate?: string;
  renewCount: number;
  status: 'ACTIVE' | 'RETURNED' | 'OVERDUE';
  bookCopy?: BookCopy;
  user?: User;
}
