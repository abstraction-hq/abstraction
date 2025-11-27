/**
 * @openpass/api-client
 * 
 * TypeScript client SDK for the Abstraction API
 */

export { ApiClient, createApiClient } from './client';
export { ApiError, NotFoundError, ServerError, NetworkError } from './errors';
export type {
  Wallet,
  Transaction,
  Position,
  Address,
  PaginationOptions,
  TransactionListResponse,
  PositionListResponse,
  StatsResponse,
  ApiClientConfig,
  ApiErrorResponse,
  KeyStatus,
  WalletByKeyIdResponse,
} from './types';

// Export default client instance
import { createApiClient } from './client';
export default createApiClient();
