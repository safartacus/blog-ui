import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BehaviorSubject, catchError, map, Observable, tap } from 'rxjs';
import { Blog, CreateBlogDto } from '../models/blog';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BlogService {
  private apiUrl = `${environment.apiUrl}/api/blogs`;

  private blogsSubject = new BehaviorSubject<Blog[]>([]);
  blogs$ = this.blogsSubject.asObservable();

  private allBlogs: Blog[] = [];


  constructor(private http: HttpClient) {
    this.loadBlogs();
   }

   private loadBlogs() {
    this.http.get<Blog[]>(this.apiUrl).subscribe({
      next: (blogs) => {
        this.allBlogs = blogs; // Orijinal listeyi sakla
        this.blogsSubject.next(blogs); // Tüm blogları yayınla
      },
      error: (error) => {
        console.error('Blog yükleme hatası:', error);
      }
    });
  }

  // Tüm blogları getir
  getBlogs(): Observable<Blog[]> {
    return this.http.get<Blog[]>(this.apiUrl);
  }

  // ID'ye göre blog getir
  getBlogById(id: string): Observable<Blog> {
    return this.http.get<Blog>(`${this.apiUrl}/${id}`)
      .pipe(
        map((blog: Blog) => ({
          ...blog,
          likes: blog.likes || [],
          dislikes: blog.dislikes || []
        }))
      );
  }

  // Yeni blog oluştur
  createBlog(blog: CreateBlogDto): Observable<Blog> {
    console.log('BlogService: Creating blog with data:', blog);
    
    const formData = new FormData();
    
    // Blog verilerini FormData'ya ekle
    formData.append('title', blog.title);
    formData.append('excerpt', blog.excerpt);
    formData.append('content', blog.content);
    formData.append('category', blog.category);
    formData.append('readTime', blog.readTime.toString());
    
    // Resmi 'image' adıyla gönder (backend'de multer bu ismi bekliyor)
    if (blog.image) {
      formData.append('image', blog.image);
    }

    // FormData içeriğini kontrol et
    formData.forEach((value, key) => {
      console.log(`FormData ${key}:`, value);
    });

    return this.http.post<Blog>(this.apiUrl, formData).pipe(
      tap(response => console.log('Blog created:', response)),
      catchError(error => {
        console.error('Error creating blog:', error);
        throw error;
      })
    );
  }

  // Kategoriye göre blogları getir
  getBlogsByCategory(category: string): Observable<Blog[]> {
    return this.http.get<Blog[]>(`${this.apiUrl}?category=${category}`);
  }

  // Blog güncelle
  updateBlog(id: string, blog: Partial<CreateBlogDto>): Observable<Blog> {
    const formData = new FormData();
    
    Object.keys(blog).forEach(key => {
      if (key === 'image' && blog.image) {
        formData.append('image', blog.image);
      } else {
        formData.append(key, blog[key as keyof CreateBlogDto]?.toString() || '');
      }
    });

    return this.http.put<Blog>(`${this.apiUrl}/${id}`, formData);
  }

  // Blog sil
  deleteBlog(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  searchBlogs(term: string): Observable<Blog[]> {
    const params = new HttpParams().set('term', term);
    
    return this.http.get<Blog[]>(`${this.apiUrl}/search`, { params }).pipe(
      tap(blogs => console.log('Arama sonuçları:', blogs)),
      catchError(error => {
        console.error('Arama hatası:', error);
        return [];
      })
    );
  }
  filterByCategory(categoryId: string | null) {
    if (!categoryId) {
      // Kategori seçili değilse tüm blogları göster
      this.blogsSubject.next(this.allBlogs);
      return;
    }

    // Backend'e istek at
    const params = new HttpParams().set('category', categoryId);
    
    this.http.get<Blog[]>(`${this.apiUrl}/filter`, { params }).subscribe({
      next: (filteredBlogs) => {
        console.log('Filtrelenmiş bloglar:', filteredBlogs);
        this.blogsSubject.next(filteredBlogs);
      },
      error: (error) => {
        console.error('Blog filtreleme hatası:', error);
        // Hata durumunda client-side filtreleme yap
        const filtered = this.allBlogs.filter(blog => blog.category._id === categoryId);
        this.blogsSubject.next(filtered);
      }
    });
  }
  hasLiked(blog: Blog, userId: string): boolean {
    return blog?.likes?.some(user => user._id === userId) ?? false;
  }

  // Beğenmeme durumunu kontrol et
  hasDisliked(blog: Blog, userId: string): boolean {
    return blog?.dislikes?.some(user => user._id === userId) ?? false;
  }

  // Beğeni ekle/kaldır
  toggleLike(blogId: string): Observable<Blog> {
    return this.http.post<Blog>(`${this.apiUrl}/${blogId}/like`, {});
  }

  // Beğenmeme ekle/kaldır
  toggleDislike(blogId: string): Observable<Blog> {
    return this.http.post<Blog>(`${this.apiUrl}/${blogId}/dislike`, {});
  }
}