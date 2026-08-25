import { TestBed } from '@angular/core/testing';
import { firstValueFrom } from 'rxjs';
import { LoadingService } from './loading.service';

describe('LoadingService', () => {
  let service: LoadingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LoadingService);
  });

  it('should start with loading false', async () => {
    expect(await firstValueFrom(service.loading$)).toBe(false);
  });

  it('should emit true on show', async () => {
    service.show();
    expect(await firstValueFrom(service.loading$)).toBe(true);
  });

  it('should stay loading while operations are still pending', async () => {
    service.show();
    service.show();
    service.hide();
    expect(await firstValueFrom(service.loading$)).toBe(true);
  });
  
  it('should stop loading when all operations finish', async () => {
    service.show();
    service.show();
    service.hide();
    service.hide();
    expect(await firstValueFrom(service.loading$)).toBe(false);
  });

  it('should not go below zero on an extra hide', async() => {
    service.hide();
    expect(await firstValueFrom(service.loading$)).toBe(false)
  })
});
