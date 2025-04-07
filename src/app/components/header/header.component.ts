import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { debounceTime, distinctUntilChanged, filter, Subject, takeUntil, switchMap } from 'rxjs';
import { Blog } from 'src/app/models/blog';
import { BlogService } from 'src/app/services/blog.service';
import { ThemeService } from 'src/app/services/theme.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  isMenuOpen = false;
  isDarkMode$ = this.themeService.isDarkMode$;
  searchTerm: string = '';
  searchResults: Blog[] = [];
  showDropdown = false;
  loading = false;
  private searchSubject = new Subject<string>();
  private destroy$ = new Subject<void>();

  constructor(
    private themeService: ThemeService, 
    private blogService: BlogService,
    private router: Router
  ) {}

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  toggleTheme() {
    this.themeService.toggleTheme();
  }

  ngOnInit() {
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