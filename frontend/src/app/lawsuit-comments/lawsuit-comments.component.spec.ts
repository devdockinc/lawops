import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LawsuitCommentsComponent } from './lawsuit-comments.component';

describe('LawsuitCommentsComponent', () => {
  let component: LawsuitCommentsComponent;
  let fixture: ComponentFixture<LawsuitCommentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LawsuitCommentsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LawsuitCommentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
