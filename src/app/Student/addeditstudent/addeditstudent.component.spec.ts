import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddeditstudentComponent } from './addeditstudent.component';

describe('AddeditstudentComponent', () => {
  let component: AddeditstudentComponent;
  let fixture: ComponentFixture<AddeditstudentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddeditstudentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddeditstudentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
