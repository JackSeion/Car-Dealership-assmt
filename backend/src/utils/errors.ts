export interface HttpError extends Error {
  status?: number;
}

export const createHttpError = (message: string, status?: number): HttpError => {
  const err = new Error(message) as HttpError;
  if (status) err.status = status;
  return err;
};

export const isHttpError = (value: unknown): value is HttpError => {
  return !!value && typeof value === 'object' && 'status' in value;
};
