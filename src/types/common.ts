export interface Dictionary<T = any> {
  [key: string]: T;
}

export type SortDirection = 'asc' | 'desc';

export type PickUnion<T> = { [K in keyof T]: Pick<T, K> }[keyof T];

export interface PaginationParams {
  page: number;
  limit: number;
  sort?: {
    [key: string]: SortDirection;
  };
  search?: string | null;
  searchBy?: string | null;
}

export interface HttpResponse<T = any> {
  data: T | null;
  message: string;
  statusCode?: number;
  success?: boolean
}

export type FilterType = {
  filter?: { [key: string]: string };
};

export type SortType = {
  sort?: { [key: string]: SortDirection };
};

export type PaginationType = {
  page: number;
  limit: number;
  totalPage: number;
  total: number;
};

export enum FilterOperator {
  equals = 'equals',
  not = 'not',
  gt = 'gt',
  gte = 'gte',
  lt = 'lt',
  lte = 'lte',
  contains = 'contains',
  startsWith = 'startsWith',
  endsWith = 'endsWith',
  in = 'in',
  notIn = 'notIn',
  some = 'some',
  every = 'every',
  none = 'none',
}

export type FilterOperatorType = {
  operator: FilterOperator; // Add more operators as needed
  value: string | number;
};

export type QueryPayloadType = {
  page?: number;
  limit?: number;
  keyword?: string | null;
  orderBy?: string | null;
  direction?: string | null;
  filter?: {
    [key: string]: FilterOperatorType | any;
  };
} & Omit<PaginationType, 'totalPage' | 'total'>;

export type DataPaginationType<T = any> = {
  items: T[];
} & PaginationType;

export type FilterParamsType = {
  sort?: SortType['sort'] | null;
  searchBy?: string | null;
} & Omit<PaginationType, 'totalPage' | 'total'>;

export type DeleteAllType = Pick<QueryPayloadType, 'keyword' | 'filter'>;

export type UploadImage = {
  id: string;
  media: {
    id: string;
    fileName: string;
    fileUrl: string;
    fileSize: number;
    createdAt?: string;
    updatedAt?: string;
  };
  mediaId: string;
};

export type ErrorResponse = {
  message: string;
  statusCode: number;
};
