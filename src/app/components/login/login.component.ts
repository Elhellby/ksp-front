import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AngularFireAuth } from '@angular/fire/compat/auth'
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginUser: FormGroup;
  loading: boolean = false;
  
  constructor(private fb: FormBuilder,
    private afAuth: AngularFireAuth,
    private toastr: ToastrService,
    private router: Router,
  ) {
    this.loginUser = this.fb.group({
      email: ['', Validators.required],
      password: ['', Validators.required]
    })
  }

  login(){
    const email = this.loginUser.value.email;
    const password = this.loginUser.value.password;

    this.loading = true

    this.afAuth.signInWithEmailAndPassword(email,password)
    .then(user=>{
      localStorage.setItem("user",JSON.stringify(user))
      this.toastr.success("User authenticated","SUCCESS")
      this.router.navigate(['/dashboard'])
    }).catch(error=>{
      this.loading=false;
      this.toastr.error("User/password invalid","Error")
    })
  }
}
