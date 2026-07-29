export interface HttpError extends Error {
  status?: number;
}

export const createHttpError = (message: string, status?: number): HttpError => {
  const err: HttpError = new Error(message);
  if (status !== undefined) err.status = status;
  return err;
};

export const isHttpError = (value: unknown): value is HttpError => {
  return !!value && typeof value === 'object' && 'status' in value;
};
