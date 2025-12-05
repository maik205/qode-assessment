export interface IApiResponse<T, E = unknown> {
  data: T | null;
  error: E | null;
}
