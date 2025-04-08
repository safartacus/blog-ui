import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { User, AuthResponse, LoginData, RegisterData } from '../models/user';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/api/auth`;
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();
  private authStateChanged = new BehaviorSubject<boolean>(false);
  authStateChanged$ = this.authStateChanged.asObservable();

  constructor(private http: HttpClient) {
  }

  

  login(loginData: LoginData): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, loginData)
      .pipe(
        tap(response => {
          localStorage.setItem('token', response.token);
          this.currentUserSubject.next(response.user);
          this.authStateChanged.next(true);
          
          // Login sonrası güncel kullanıcı bilgilerini al
          this.getCurrentUser().subscribe({
            next: (user) => {
              console.log('User after login:', user);
              this.currentUserSubject.next(user);
            },
            error: (err) => {
              console.error('Error getting user after login:', err);
            }
          });
        })
      );
  }

  register(registerData: RegisterData): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/register`, registerData)
      .pipe(
        tap(response => {
          localStorage.setItem('token', response.token);
          this.currentUserSubject.next(response.user);
          this.authStateChanged.next(true);
        })
      );
  }

  logout(): void {
    localStorage.removeItem('token');
    this.currentUserSubject.next(null);
    this.authStateChanged.next(false);
  }

  getCurrentUser(): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/me`)
      .pipe(
        tap(user => {
          this.currentUserSubject.next(user);
        })
      );
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }
  getCurrentUserId(): string {
    const currentUser = this.currentUserSubject.getValue();
    return currentUser?._id || '';
  }
  private initializeAuth() {
    const token = this.getToken();
    console.log('Initial token:', token); // Debug için

    if (token) {
      // Token varsa kullanıcı bilgilerini al
      this.getCurrentUser().subscribe({
        next: (user) => {
          console.log('User loaded:', user); // Debug için
          this.currentUserSubject.next(user);
        },
        error: (error) => {
          console.error('Error loading user:', error);
          this.logout();
        }
      });
    }
  }
}