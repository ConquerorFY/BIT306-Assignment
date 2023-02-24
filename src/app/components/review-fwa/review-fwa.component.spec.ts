import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReviewFwaComponent } from './review-fwa.component';

describe('ReviewFwaComponent', () => {
  let component: ReviewFwaComponent;
  let fixture: ComponentFixture<ReviewFwaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReviewFwaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReviewFwaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
