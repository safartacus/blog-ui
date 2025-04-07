import { environment } from '../environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { UpdateUserDto, User } from '../models/user';
@Injectable({
    providedIn: 'root'
  })
  export class ProfileService {
    private currentUserSubject = new BehaviorSubject<User | null>(null);
    public currentUser$ = this.currentUserSubject.asObservable();
    private apiUrl = `${environment.apiUrl}/api/users`;

    constructor(private http: HttpClient) {
      }
    

      updateProfile(updateDto: UpdateUserDto): Observable<User> {
        return this.http.put<User>(`${this.apiUrl}/profile`, updateDto);
      }
}