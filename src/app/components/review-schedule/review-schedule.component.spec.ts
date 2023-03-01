import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReviewScheduleComponent } from './review-schedule.component';

describe('ReviewScheduleComponent', () => {
  let component: ReviewScheduleComponent;
  let fixture: ComponentFixture<ReviewScheduleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReviewScheduleComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReviewScheduleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
