import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BlogService } from '../../services/blog.service';
import { Blog } from '../../models/blog';
import { Title, Meta } from '@angular/platform-browser';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-blog-detail',
  templateUrl: './blog-detail.component.html',
  styleUrls: ['./blog-detail.component.scss']
})
export class BlogDetailComponent implements OnInit {
  blog: Blog | null = null;
  loading = true;
  error: string | null = null;
  showDeleteModal = false;
  isAuthor = true; // Gerçek uygulamada auth service'den kontrol edilmeli

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private blogService: BlogService,
    private titleService: Title,
    private metaService: Meta,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadBlog();
  }

  loadBlog(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.error = 'Blog ID bulunamadı';
      this.loading = false;
      return;
    }

    this.loading = true;
    this.error = null;

    this.blogService.getBlogById(id).subscribe({
      next: (blog) => {
        this.blog = blog;
        this.loading = false;
        this.updateMetaTags();
      },
      error: (err) => {
        console.error('Blog yükleme hatası:', err);
        this.error = 'Blog yüklenirken bir hata oluştu';
        this.loading = false;
      }
    });
  }

  updateMetaTags(): void {
    if (this.blog) {
      this.titleService.setTitle(this.blog.title);
      this.metaService.updateTag({ name: 'description', content: this.blog.excerpt });
      this.metaService.updateTag({ property: 'og:title', content: this.blog.title });
      this.metaService.updateTag({ property: 'og:description', content: this.blog.excerpt });
      this.metaService.updateTag({ property: 'og:image', content: this.blog.imageUrl });
    }
  }

  onEdit(): void {
    if (this.blog) {
      this.router.navigate(['/blog/edit', this.blog._id]);
    }
  }

  onDelete(): void {
    this.showDeleteModal = true;
  }

  confirmDelete(): void {
    if (this.blog) {
      this.blogService.deleteBlog(this.blog._id).subscribe({
        next: () => {
          this.router.navigate(['/blogs']);
        },
        error: (err) => {
          console.error('Blog silme hatası:', err);
          this.error = 'Blog silinirken bir hata oluştu';
        }
      });
    }
    this.showDeleteModal = false;
  }

  shareOnTwitter(): void {
    if (this.blog) {
      const text = encodeURIComponent(this.blog.title);
      const url = encodeURIComponent(window.location.href);
      window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, '_blank');
    }
  }

  shareOnLinkedIn(): void {
    if (this.blog) {
      const url = encodeURIComponent(window.location.href);
      window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}`, '_blank');
    }
  }

  copyLink(): void {
    navigator.clipboard.writeText(window.location.href)
      .then(() => {
        // Burada bir toast message gösterilebilir
        alert('Link kopyalandı!');
      })
      .catch(err => {
        console.error('Link kopyalama hatası:', err);
      });
  }
  toggleLike(): void {
    if (!this.blog) return;
    
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/auth/login']);
      return;
    }

    this.blogService.toggleLike(this.blog._id).subscribe({
      next: (updatedBlog) => {
        this.blog = updatedBlog;
      },
      error: (error) => {
        console.error('Like hatası:', error);
      }
    });
  }

  toggleDislike(): void {
    if (!this.blog) return;
    
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/auth/login']);
      return;
    }

    this.blogService.toggleDislike(this.blog._id).subscribe({
      next: (updatedBlog) => {
        this.blog = updatedBlog;
      },
      error: (error) => {
        console.error('Dislike hatası:', error);
      }
    });
  }

  hasLiked(): boolean {
    if (!this.blog) return false;
    return this.blogService.hasLiked(this.blog, this.authService.getCurrentUserId());
  }

  hasDisliked(): boolean {
    if (!this.blog) return false;
    return this.blogService.hasDisliked(this.blog, this.authService.getCurrentUserId());
  }
}