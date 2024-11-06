import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LawsuitActivityComponent } from './lawsuit-activity.component';

describe('LawsuitActivityComponent', () => {
  let component: LawsuitActivityComponent;
  let fixture: ComponentFixture<LawsuitActivityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LawsuitActivityComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LawsuitActivityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
