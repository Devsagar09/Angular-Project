import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrainingtypeComponent } from './trainingtype.component';

describe('TrainingtypeComponent', () => {
  let component: TrainingtypeComponent;
  let fixture: ComponentFixture<TrainingtypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TrainingtypeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TrainingtypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
