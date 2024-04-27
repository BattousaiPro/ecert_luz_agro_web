import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TemplateFichaSocioComponent } from './template-ficha-socio.component';

describe('TemplateFichaSocioComponent', () => {
  let component: TemplateFichaSocioComponent;
  let fixture: ComponentFixture<TemplateFichaSocioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TemplateFichaSocioComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TemplateFichaSocioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
