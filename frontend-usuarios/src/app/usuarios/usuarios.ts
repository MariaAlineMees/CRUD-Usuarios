import { Component, OnInit } from '@angular/core';
import { UsuarioService } from '../services/usuario';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [CommonModule], // ← Adicionado aqui!
  templateUrl: './usuarios.html',
  styleUrls: ['./usuarios.css']
})
export class UsuariosComponent implements OnInit {
  usuarios: any[] = [];

  constructor(private usuarioService: UsuarioService, private router: Router) {}

  ngOnInit(): void {
    this.usuarioService.getUsuarios().subscribe(data => {
      this.usuarios = data;
    });
  }

  editar(usuario: any) {
    this.router.navigate(['/cadastro'], { state: { usuario } });
  }

  excluir(id: string) {
    if (confirm('Deseja realmente excluir?')) {
      this.usuarioService.deletarUsuario(id).subscribe(() => {
        this.usuarios = this.usuarios.filter(u => u.id !== id);
      });
    }
  }
}