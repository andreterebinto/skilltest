import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Usuario } from 'src/app/model/usuario';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  constructor(private router: Router) {}
  usuario = new Usuario();
  ngOnInit(){

  }

  login(){
    if((this.usuario.nome == "admin") && (this.usuario.password == "123456")){
      localStorage.setItem('userTest', JSON.stringify(this.usuario));
      this.router.navigate(['/dashboard']);
    }else{
      alert("Usuário ou senha Inválido");
    }
  }

}
