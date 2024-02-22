import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from './message.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private router: Router,
    private _messageService: MessageService
  ) { }

  public isAuthenticated(): boolean {
    const userData = sessionStorage.getItem('token');
    if (userData) {
      return true;
    
    } else {
      return false;
    }
  }

  public async logout() {
    // logout actions
    await sessionStorage.clear();
    setTimeout(() => {
      /**
       * Update isLoggedIn flag for navbar
       */
      this._messageService.sendMessage('sign-out');
      this.router.navigate(['auth', 'sign-in']);
    }, 1000);
    return true;
  }
}
