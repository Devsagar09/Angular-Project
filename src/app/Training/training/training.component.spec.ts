import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TraningComponent } from './training.component';

describe('TraningComponent', () => {
  let component: TraningComponent;
  let fixture: ComponentFixture<TraningComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TraningComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TraningComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
