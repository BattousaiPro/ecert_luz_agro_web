import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArchivosSociosComponent } from './archivos-socios.component';

describe('ArchivosSociosComponent', () => {
  let component: ArchivosSociosComponent;
  let fixture: ComponentFixture<ArchivosSociosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ArchivosSociosComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ArchivosSociosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
