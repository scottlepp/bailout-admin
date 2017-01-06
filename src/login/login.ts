import { Component } from '@angular/core';
import { AngularFire } from 'angularfire2';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class LoginComponent {
  email;
  pass;

  constructor(private af: AngularFire, private toastr: ToastsManager, private router: Router) {}

  login() {
    this.af.auth.login({ email: this.email, password: this.pass }).then(result => {
      console.log('logged in');
      this.router.navigate(['/bonds']);
    }, error => {
      this.toastr.error(error.message, 'Login Failed');
      console.log(error);
    });
  }

}
