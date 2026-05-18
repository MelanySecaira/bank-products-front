import { TestBed } from '@angular/core/testing';
import { CanActivateFn, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { authGuard } from './auth-guard';

describe('authGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) =>
    TestBed.runInInjectionContext(() => authGuard(...guardParameters));

  let route: ActivatedRouteSnapshot;
  let state: RouterStateSnapshot;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    route = {} as ActivatedRouteSnapshot;
    state = { url: '/test-route' } as RouterStateSnapshot;
  });

  it('should allow activation', () => {
    const result = executeGuard(route, state);

    expect(result).toBe(true);
  });

  it('should execute as a CanActivateFn', () => {
    expect(executeGuard).toBeTruthy();
    expect(executeGuard(route, state)).toBe(true);
  });
});
