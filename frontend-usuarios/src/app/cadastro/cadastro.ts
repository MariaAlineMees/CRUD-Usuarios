import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { UsuarioService } from '../services/usuario';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cadastro',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './cadastro.html',
  styleUrls: ['./cadastro.css']
})
export class CadastroComponent implements OnInit {
  form: any;
  editando = false;
  usuarioId: string | null = null;

  constructor(
    private fb: FormBuilder,
    private usuarioService: UsuarioService,
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      nome: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      dataNascimento: ['', Validators.required],
      genero: ['', Validators.required],
      renda: [null, [Validators.required, Validators.min(0)]],
      escolaridade: this.fb.group({
        nivel: ['', Validators.required],
        situacao: ['', Validators.required]
      }),
      cep: ['', [Validators.required, Validators.minLength(8)]],
      estado: [''],
      cidade: [''],
      bairro: [''],
      logradouro: ['']
    });

    const usuario = history.state.usuario;
    if (usuario) {
      this.editando = true;
      this.usuarioId = usuario.id;
      this.form.patchValue(usuario);
    }
  }

  buscarEndereco() {
    const cep = this.form.get('cep')?.value;
    if (!cep || cep.length < 8) return;

    this.http.get(`https://viacep.com.br/ws/${cep}/json/`).subscribe({
      next: (data: any) => {
        if (data.erro) {
          alert('CEP não encontrado ou inválido.');
          return;
        }
        this.form.patchValue({
          estado: data.uf,
          cidade: data.localidade,
          bairro: data.bairro,
          logradouro: data.logradouro
        });
      },
      error: () => {
        alert('Erro ao buscar o CEP. Tente novamente.');
      }
    });
  }

  salvar() {
    console.log('Método salvar chamado');
    if (this.form.invalid) {
      alert('Por favor, preencha todos os campos obrigatórios!');
      return;
    }

    const usuarioData = this.form.value;

    if (this.editando && this.usuarioId) {
      this.usuarioService.atualizarUsuario(this.usuarioId, usuarioData).subscribe({
        next: () => {
          alert('Usuário atualizado com sucesso!');
          this.form.reset();
          this.router.navigate(['/usuarios']);
        },
        error: (err) => {
          console.error(err);
          alert('Erro ao atualizar o usuário.');
        }
      });
    } else {
      this.usuarioService.criarUsuario(usuarioData).subscribe({
        next: () => {
          alert('Usuário cadastrado com sucesso!');
          this.form.reset();
          this.router.navigate(['/usuarios']);
        },
        error: (err) => {
          console.error(err);
          alert('Erro ao cadastrar o usuário. Verifique se o servidor está rodando.');
        }
      });
    }
  }
}