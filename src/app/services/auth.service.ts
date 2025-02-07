import { HttpClient } from '@angular/common/http';
import { computed, effect, inject, Injectable, signal } from '@angular/core';
import { User } from '../models/user.model';
import { environment } from '../../environments/environment';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';

const USER_STORAGE_KEY = 'user';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(
    private readonly http: HttpClient,
    private readonly router: Router
  ) {
    this.loadUserFromLocalStorage();
    effect(() => {
      const user = this.user();
      if (user) {
        localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
      }
    });
  }

  loadUserFromLocalStorage() {
    const userJson = localStorage.getItem(USER_STORAGE_KEY);
    if (userJson) {
      const user: User = JSON.parse(userJson);
      this.#userSignal.set(user);
    }
  }

  #userSignal = signal<User | null>(null);
  user = this.#userSignal.asReadonly();
  isLoggedIn = computed(() => !!this.user());

  async login(email: string, password: string): Promise<User> {
    const login$ = this.http.post<User>(`${environment.apiRoot}/login`, {
      email,
      password,
    });
    const user = await firstValueFrom(login$);
    this.#userSignal.set(user);
    return user;
  }

  async logout() {
    this.#userSignal.set(null);
    localStorage.removeItem(USER_STORAGE_KEY);
    await this.router.navigate(['/login']);
  }
}
