import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubmitFwaComponent } from './submit-fwa.component';

describe('SubmitFwaComponent', () => {
  let component: SubmitFwaComponent;
  let fixture: ComponentFixture<SubmitFwaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SubmitFwaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SubmitFwaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
