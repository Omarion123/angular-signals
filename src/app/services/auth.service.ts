import { HttpClient } from '@angular/common/http';
import { computed, effect, inject, Injectable, signal } from '@angular/core';
import { User } from '../models/user.model';
import { environment } from '../../environments/environment';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import * as CryptoJS from 'crypto-js';

const USER_STORAGE_KEY = 'user';
const ENCRYPTION_KEY = environment.encriptionKey;

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
        const encryptedUser = this.encrypt(JSON.stringify(user));
        localStorage.setItem(USER_STORAGE_KEY, encryptedUser);
      }
    });
  }

  private encrypt(text: string): string {
    return CryptoJS.AES.encrypt(text, ENCRYPTION_KEY).toString();
  }

  private decrypt(encryptedText: string): string {
    const bytes = CryptoJS.AES.decrypt(encryptedText, ENCRYPTION_KEY);
    return bytes.toString(CryptoJS.enc.Utf8);
  }

  loadUserFromLocalStorage() {
    const encryptedUser = localStorage.getItem(USER_STORAGE_KEY);
    if (encryptedUser) {
      try {
        const decryptedUser = this.decrypt(encryptedUser);
        const user: User = JSON.parse(decryptedUser);
        this.#userSignal.set(user);
      } catch (error) {
        console.error('Error decrypting user data:', error);
        localStorage.removeItem(USER_STORAGE_KEY);
      }
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
