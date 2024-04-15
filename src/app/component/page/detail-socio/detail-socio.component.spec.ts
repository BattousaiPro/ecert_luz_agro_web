import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailSocioComponent } from './detail-socio.component';

describe('DetailSocioComponent', () => {
  let component: DetailSocioComponent;
  let fixture: ComponentFixture<DetailSocioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetailSocioComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DetailSocioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
