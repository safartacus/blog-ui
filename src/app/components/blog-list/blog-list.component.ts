import { Component, HostListener, OnInit } from '@angular/core';
import { BlogService } from '../../services/blog.service';
import { Blog } from '../../models/blog';
import { Router } from '@angular/router';
import { Category } from 'src/app/models/category';
import { CategoryService } from 'src/app/services/categoryService';

@Component({
  selector: 'app-blog-list',
  templateUrl: './blog-list.component.html',
  styleUrls: ['./blog-list.component.scss']
})
export class BlogListComponent implements OnInit {
  blogs: Blog[] = [];
  loading = false;
  error: string | null = null;
  selectedCategoryId: string | null = null;
  showDeleteModal = false;
  blogToDelete: string | null = null;

  visibleCategories: Category[] = [];
  hiddenCategories: Category[] = [];
  showDropdown = false;
  readonly VISIBLE_CATEGORY_COUNT = 5;

  // Kategori listesi
  categories :Category[] = [];

  constructor(
    private router: Router,
    private blogService: BlogService,
    private categoryService: CategoryService
  ) {}

  ngOnInit(): void {
    this.loadBlogs();
    this.loadCategories();
  }

  loadCategories(): void {
    this.categoryService.getCategories().subscribe({
      next: (categories) => {
        this.categories = categories;
        // İlk 5 kategoriyi görünür yap, diğerlerini dropdown'a al
        this.visibleCategories = categories.slice(0, this.VISIBLE_CATEGORY_COUNT);
        this.hiddenCategories = categories.slice(this.VISIBLE_CATEGORY_COUNT);
      },
      error: (error) => {
        console.error('Kategori yükleme hatası:', error);
      }
    });
  }
  toggleDropdown(): void {
    this.showDropdown = !this.showDropdown;
  }

  // Dropdown dışına tıklandığında kapat
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const dropdown = (event.target as HTMLElement).closest('.category-dropdown');
    if (!dropdown) {
      this.showDropdown = false;
    }
  }

  loadBlogs(): void {
    this.loading = true;
    this.error = null;

    this.blogService.blogs$.subscribe({
      next: (blogs) => {
        this.blogs = blogs;
        this.loading = false;
      },
      error: (err) => {
        console.error('Blog yükleme hatası:', err);
        this.error = 'Bloglar yüklenirken bir hata oluştu';
        this.loading = false;
      }
    });
  }

  onCategorySelect(categoryId: string | null): void {
    this.selectedCategoryId = categoryId;
    this.blogService.filterByCategory(categoryId);
    this.showDropdown = false; // Seçim yapıldığında dropdown'ı kapat
  }


  // Blog silme işlemleri
  onDeleteBlog(blogId: string): void {
    this.blogToDelete = blogId;
    this.showDeleteModal = true;
  }

  cancelDelete(): void {
    this.blogToDelete = null;
    this.showDeleteModal = false;
  }

  confirmDelete(): void {
    if (this.blogToDelete) {
      this.blogService.deleteBlog(this.blogToDelete).subscribe({
        next: () => {
          // Blog listesini güncelle
          this.blogs = this.blogs.filter(blog => blog._id !== this.blogToDelete);
          this.showDeleteModal = false;
          this.blogToDelete = null;
        },
        error: (err) => {
          console.error('Blog silme hatası:', err);
          this.error = 'Blog silinirken bir hata oluştu';
        }
      });
    }
  }

  // Yazar kontrolü (gerçek uygulamada auth service kullanılmalı)
  isAuthor(blog: Blog): boolean {
    // Şimdilik hep true dönüyor, gerçek uygulamada kullanıcı kontrolü yapılmalı
    return true;
  }

  // Tarih formatı için yardımcı fonksiyon
  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  // Okuma süresi formatı için yardımcı fonksiyon
  formatReadTime(minutes: number): string {
    return `${minutes} dk okuma`;
  }

  // Özet metni kısaltma için yardımcı fonksiyon
  truncateText(text: string, maxLength: number = 150): string {
    if (text.length <= maxLength) return text;
    return text.substr(0, maxLength) + '...';
  }

  navigateToCreate(): void {
    this.router.navigate(['/create']);
  }
}