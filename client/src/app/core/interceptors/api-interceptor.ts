import { HttpInterceptorFn } from '@angular/common/http';

export const apiInterceptor: HttpInterceptorFn = (req, next) => {
  console.log(`[API] ${req.method} ${req.url}`);

  return next(req);
};
