import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComunasComponent } from './comunas.component';

describe('ComunasComponent', () => {
  let component: ComunasComponent;
  let fixture: ComponentFixture<ComunasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ComunasComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ComunasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
