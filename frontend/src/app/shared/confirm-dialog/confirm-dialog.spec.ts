import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ConfirmDialog } from './confirm-dialog';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

describe('ConfirmDialog', () => {
  let component: ConfirmDialog;
  let fixture: ComponentFixture<ConfirmDialog>;
  const dialogMock = { close: vi.fn() };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfirmDialog],
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: { message: 'Test message' } },
        { provide: MatDialogRef, useValue: dialogMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ConfirmDialog);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should show a message', () => {
    expect(component.data.message).toBe('Test message');
  });
  it('should call with true on confirm', () => {
    component.onConfirm();
    expect(dialogMock.close).toHaveBeenCalledWith(true);
  });
  it('should call with false on cancel', () => {
    component.onCancel();
    expect(dialogMock.close).toHaveBeenCalledWith(false);
  });
});
