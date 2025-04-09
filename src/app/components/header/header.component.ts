import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { debounceTime, distinctUntilChanged, filter, Subject, takeUntil, switchMap } from 'rxjs';
import { Blog } from 'src/app/models/blog';
import { User } from 'src/app/models/user';
import { AuthService } from 'src/app/services/auth.service';
import { BlogService } from 'src/app/services/blog.service';
import { ThemeService } from 'src/app/services/theme.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  isMenuOpen = false;
  isDarkMode$ = this.themeService.isDarkMode$;
  searchTerm: string = '';
  searchResults: Blog[] = [];
  showDropdown = false;
  loading = false;
  private searchSubject = new Subject<string>();
  private destroy$ = new Subject<void>();
  currentUser: User | null = null;
  
  constructor(
    private themeService: ThemeService, 
    private blogService: BlogService,
    private router: Router,
    private authService: AuthService
  ) {}

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  toggleTheme() {
    this.themeService.toggleTheme();
  }

  ngOnInit() {

    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });

    this.searchSubject.pipe(
      takeUntil(this.destroy$),
      debounceTime(300),
      distinctUntilChanged(),
      filter(term => term.length >= 3 || term.length === 0)
    ).subscribe(term => {
      this.loading = true;
      this.blogService.searchBlogs(term).subscribe({
        next: (blogs) => {
          this.searchResults = blogs;
          this.showDropdown = true;
          this.loading = false;
        },
        error: () => {
          this.loading = false;
          this.showDropdown = false;
        }
      });
    });

    

    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });

    // Sayfa yüklendiğinde kullanıcı bilgilerini kontrol et
    if (this.authService.isLoggedIn()) {
      this.loadUserProfile();
    }

    // Auth state değişikliklerini takip et
    this.authService.authStateChanged$.subscribe(() => {
      this.loadUserProfile();
    });
  }

  isLoggedIn() {
    return this.currentUser !== null;
  }

  loadUserProfile() {
    if (this.authService.isLoggedIn()) {
      this.authService.getCurrentUser().subscribe({
        next: (user) => {
          this.currentUser = user;
        },
        error: (error) => {
          console.error('Kullanıcı bilgileri yüklenemedi:', error);
          this.authService.logout(); // Hata durumunda logout
        }
      });
    }
  
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onSearch(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.searchTerm = target.value;
    if (!this.searchTerm.trim()) {
      this.showDropdown = false;
      return;
    }
    this.searchSubject.next(this.searchTerm);
  }

  navigateToLogin(): void {
    this.router.navigate(['/login']);
  }

  navigateToRegister(): void {
    this.router.navigate(['/register']);
  }
}