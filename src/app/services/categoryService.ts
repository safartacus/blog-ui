import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { Category } from '../models/category';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private apiUrl = `${environment.apiUrl}/api/categories`;
  
  private categoriesSubject = new BehaviorSubject<Category[]>([]);
  categories$ = this.categoriesSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadCategories();
  }

  private loadCategories() {
    this.http.get<Category[]>(this.apiUrl).subscribe({
      next: (categories) => {
        this.categoriesSubject.next(categories);
      },
      error: (error) => {
        console.error('Kategori yükleme hatası:', error);
      }
    });
  }

  getCategories(): Observable<Category[]> {
    return this.categories$;
  }
}