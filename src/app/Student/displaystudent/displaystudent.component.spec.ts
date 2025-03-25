import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DisplaystudentComponent } from './displaystudent.component';

describe('DisplaystudentComponent', () => {
  let component: DisplaystudentComponent;
  let fixture: ComponentFixture<DisplaystudentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DisplaystudentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DisplaystudentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
