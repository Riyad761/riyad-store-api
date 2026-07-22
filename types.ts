export interface StoreCommand {
  id: number;
  _id?: string;
  name: string;
  version: string;
  author: string;
  category: string;
  description: string;
  rawCode: string;
  downloads: number;
  likes: number;
  isFeatured?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  meta?: {
    total?: number;
    page?: number;
    limit?: number;
    totalPages?: number;
  };
  errors?: any;
}

export interface HealthCheck {
  status: string;
  app: string;
  version: string;
  timestamp: string;
  database: {
    isConnected: boolean;
    connectionState: number;
    host: string;
  };
}
