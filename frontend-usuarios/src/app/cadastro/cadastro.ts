import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { UsuarioService } from '../services/usuario';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-cadastro',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './cadastro.html',
  styleUrls: ['./cadastro.css']
})
export class CadastroComponent implements OnInit {
  form: any;

  constructor(
    private fb: FormBuilder,
    private usuarioService: UsuarioService,
    private http: HttpClient
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
      this.form.patchValue(usuario);
    }
  }

  buscarEndereco() {
    const cep = this.form.value.cep;
    if (!cep || cep.length < 8) return;

    this.http.get(`https://viacep.com.br/ws/${cep}/json/`).subscribe((data: any) => {
      if (data.erro) return;
      this.form.patchValue({
        estado: data.uf,
        cidade: data.localidade,
        bairro: data.bairro,
        logradouro: data.logradouro
      });
    });
  }

  salvar() {
    console.log('Método salvar chamado');
    if (this.form.invalid) {
      alert('Formulário inválido!');
      return;
    }

    const usuario = history.state.usuario;
    if (usuario && usuario.id) {
      this.usuarioService.atualizarUsuario(usuario.id, this.form.value).subscribe(() => {
        alert('Usuário atualizado com sucesso!');
        this.form.reset();
      });
    } else {
      this.usuarioService.criarUsuario(this.form.value).subscribe(() => {
        alert('Usuário cadastrado com sucesso!');
        this.form.reset();
      });
    }
  }
}