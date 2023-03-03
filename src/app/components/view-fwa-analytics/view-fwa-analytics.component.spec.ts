import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewFwaAnalyticsComponent } from './view-fwa-analytics.component';

describe('ViewFwaAnalyticsComponent', () => {
  let component: ViewFwaAnalyticsComponent;
  let fixture: ComponentFixture<ViewFwaAnalyticsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewFwaAnalyticsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewFwaAnalyticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
