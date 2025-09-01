import { Routes } from '@angular/router';
import { CadastroComponent } from './cadastro/cadastro';
import { UsuariosComponent } from './usuarios/usuarios';
import { MetricasComponent } from './metricas/metricas';

export const routes: Routes = [
  { path: 'cadastro', component: CadastroComponent },
  { path: 'usuarios', component: UsuariosComponent },
  { path: 'metricas', component: MetricasComponent },
  { path: '', redirectTo: 'usuarios', pathMatch: 'full' }
];