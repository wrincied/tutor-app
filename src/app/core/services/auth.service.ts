import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';

const API = 'http://localhost:3001/api';
/** Совпадает с тем, что ожидает интерцептор и типичный фронт: localStorage.getItem('token'). */
const TOKEN_KEY = 'token';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);

  isLoggedIn = signal<boolean>(!!localStorage.getItem(TOKEN_KEY));

  register(email: string, password: string) {
    return this.http
      .post<{ token: string }>(`${API}/auth/register`, { email, password })
      .pipe(tap((res) => this.saveToken(res.token)));
  }

  login(email: string, password: string) {
    return this.http
      .post<{ token: string }>(`${API}/auth/login`, { email, password })
      .pipe(tap((res) => this.saveToken(res.token)));
  }

  logout() {
    localStorage.removeItem(TOKEN_KEY);
    this.isLoggedIn.set(false);
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  }

  private saveToken(token: string) {
    localStorage.setItem(TOKEN_KEY, token);
    this.isLoggedIn.set(true);
  }
}
