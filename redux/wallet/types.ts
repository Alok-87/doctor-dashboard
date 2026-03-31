export interface LedgerItem {
  id?: string;
  type?: string;
  amount?: string | number;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
  [key: string]: any;
}

export interface WalletItem {
  id?: string;
  balance?: string | number;
  total_earnings?: string | number;
  total_withdrawn?: string | number;
  createdAt?: string;
  updatedAt?: string;
  [key: string]: any;
}

export interface PayoutPayload {
  amount: number | string;
  note?: string;
  bank_account_id?: string;
}

export interface PaginationMeta {
  page?: number;
  limit?: number;
  total?: number;
  totalPages?: number;
  [key: string]: any;
}

export interface WalletResponse {
  data?: WalletItem | WalletItem[];
  meta?: PaginationMeta;
  [key: string]: any;
}

export interface LedgerResponse {
  data?: LedgerItem[];
  meta?: PaginationMeta;
  [key: string]: any;
}