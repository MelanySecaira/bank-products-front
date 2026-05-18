import { TestBed } from '@angular/core/testing';
import { HttpInterceptorFn, HttpRequest, HttpResponse, HttpHandlerFn } from '@angular/common/http';
import { firstValueFrom, of } from 'rxjs';

import { apiInterceptor } from './api-interceptor';

describe('apiInterceptor', () => {
  const interceptor: HttpInterceptorFn = (req, next) =>
    TestBed.runInInjectionContext(() => apiInterceptor(req, next));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(interceptor).toBeTruthy();
  });

  it('should log request info and forward the request to the next handler', async () => {
    const request = new HttpRequest('GET', '/api/test');
    const response = new HttpResponse({ status: 200 });
    const next: HttpHandlerFn = (req) => {
      expect(req).toBe(request);
      return of(response);
    };

    const logs: string[] = [];
    const originalLog = console.log;
    (console as any).log = (message: unknown) => logs.push(String(message));

    try {
      const event = await firstValueFrom(interceptor(request, next));
      expect(event).toBe(response);
      expect(logs).toContain('[API] GET /api/test');
    } finally {
      console.log = originalLog;
    }
  });
});
