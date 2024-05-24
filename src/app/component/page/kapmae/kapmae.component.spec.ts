import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KapmaeComponent } from './kapmae.component';

describe('KapmaeComponent', () => {
  let component: KapmaeComponent;
  let fixture: ComponentFixture<KapmaeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [KapmaeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(KapmaeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
