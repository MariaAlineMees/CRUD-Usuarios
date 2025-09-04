import { ComponentFixture, TestBed } from '@angular/core/testing';
<<<<<<< HEAD
import { UsuariosComponent } from './usuarios';

describe('UsuariosComponent', () => {
  let component: UsuariosComponent;
  let fixture: ComponentFixture<UsuariosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UsuariosComponent] // Standalone component
    })
    .compileComponents();

    fixture = TestBed.createComponent(UsuariosComponent);
=======

import { Usuarios } from './usuarios';

describe('Usuarios', () => {
  let component: Usuarios;
  let fixture: ComponentFixture<Usuarios>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Usuarios]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Usuarios);
>>>>>>> 993e2dbee4de8a918a4f0e4349848cf8ba9dd054
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
<<<<<<< HEAD
});
=======
});
>>>>>>> 993e2dbee4de8a918a4f0e4349848cf8ba9dd054
