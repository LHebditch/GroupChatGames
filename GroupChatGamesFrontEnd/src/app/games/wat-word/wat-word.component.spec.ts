import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WatWordComponent } from './wat-word.component';

describe('WatWordComponent', () => {
  let component: WatWordComponent;
  let fixture: ComponentFixture<WatWordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WatWordComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WatWordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
