import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DisplayStatusComponent } from './display-status.component';

describe('DisplayStatusComponent', () => {
  let component: DisplayStatusComponent;
  let fixture: ComponentFixture<DisplayStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DisplayStatusComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DisplayStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
