import { NextFunction, Request, Response } from 'express';

export const asyncHandler = <TRequest extends Request>(
  fn: (req: TRequest, res: Response, next: NextFunction) => Promise<void>
) => {
  return (req: TRequest, res: Response, next: NextFunction): void => {
    fn(req, res, next).catch(next);
  };
};
