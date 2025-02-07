import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { MessagesService } from '../messages/messages.service';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'login',
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  constructor(
    private readonly fb: FormBuilder,
    private readonly messagesService: MessagesService,
    private readonly authService: AuthService,
    private readonly router: Router
  ) {}
  form = this.fb.group({
    email: [''],
    password: [''],
  });
  async onLogin() {
    try {
      const { email, password } = this.form.value;
      if (!email || !password) {
        this.messagesService.showMessage(
          'Please provide email and password...',
          'warning'
        );
      } else {
        await this.authService.login(email, password);
        await this.router.navigate(['/home']); // router is promise based
      }
    } catch (err) {
      console.log(err);
      this.messagesService.showMessage('Logging in failed, try again', 'error');
    }
  }
}
