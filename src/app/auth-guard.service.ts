import { Injectable }     from '@angular/core';
import { CanActivate, Router }    from '@angular/router';
import { AngularFire} from 'angularfire2';

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(public af: AngularFire, private router: Router) {}

  canActivate() {
    return this.checkLogin();
  }

  checkLogin() {
    // let connected = this.af.database.object('.info/connected');
    let connected = this.af.auth;
    return connected.map(resp => {
      if (resp === null) {
        this.router.navigate(['/login']);
        return false;
      } else {
        return true;
      }
    });

  }
}
