import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CodeBreakerGameBoardComponent } from './game-board.component';

describe('GameBoardComponent', () => {
  let component: CodeBreakerGameBoardComponent;
  let fixture: ComponentFixture<CodeBreakerGameBoardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CodeBreakerGameBoardComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CodeBreakerGameBoardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
