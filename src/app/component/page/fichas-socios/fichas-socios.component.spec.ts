import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FichasSociosComponent } from './fichas-socios.component';

describe('FichasSociosComponent', () => {
  let component: FichasSociosComponent;
  let fixture: ComponentFixture<FichasSociosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FichasSociosComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FichasSociosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
