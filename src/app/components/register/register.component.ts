import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AngularFireAuth } from '@angular/fire/compat/auth'
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  registerUser: FormGroup;
  loading: boolean = false;

  constructor(private fb: FormBuilder,
    private afAuth: AngularFireAuth,
    private toastr: ToastrService,
    private router: Router,
  ) {
    this.registerUser = this.fb.group({
      email: ['', Validators.required],
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required]
    })
  }

  register() {
    const email = this.registerUser.value.email;
    const password = this.registerUser.value.password;
    const confirmPassword = this.registerUser.value.confirmPassword;

    if (password != confirmPassword) {
      this.toastr.error("Password is not equals", "Error")
      return
    }

    this.loading = true

    this.afAuth.createUserWithEmailAndPassword(email, password)
      .then(() => {
        this.toastr.success("Registered user successfully", "Success")
        this.router.navigate(['/login'])
      })
      .catch(error => {
        this.loading = false
        this.toastr.error(this.firebaseError(error.code), "ERROR")
      })

  }

  firebaseError(code: string) {
    switch (code) {
      case 'auth/email-already-in-use':
        return "This user already exist"
      case 'auth/weak-password':
        return "The password length should be mayor to 6 char"
      default:
        return "Unknown error"
    }
  }


}
