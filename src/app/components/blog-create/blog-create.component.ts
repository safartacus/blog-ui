import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BlogService } from '../../services/blog.service';
import { CreateBlogDto } from '../../models/blog';
import { Category } from 'src/app/models/category';
import { CategoryService } from 'src/app/services/categoryService';

@Component({
  selector: 'app-blog-create',
  templateUrl: './blog-create.component.html',
  styleUrls: ['./blog-create.component.scss']
})
export class BlogCreateComponent implements OnInit {
  blogForm!: FormGroup; // Form başlangıçta undefined olabilir
  selectedImage: File | null = null;
  imagePreview: string | null = null;
  loading = false;
  error: string | null = null;
  submitted = false; // Form submit durumunu takip etmek için

  categories: Category[] = [];

  constructor(
    private fb: FormBuilder,
    private blogService: BlogService,
    private router: Router,
    private categoryService: CategoryService
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadCategories();
  }

  private initForm(): void {
    this.blogForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(5)]],
      excerpt: ['', [Validators.required, Validators.minLength(10)]],
      content: ['', [Validators.required, Validators.minLength(50)]],
      category: ['', Validators.required],
      readTime: [5, [Validators.required, Validators.min(1)]]
    });
  }
  loadCategories(): void {
    this.categoryService.getCategories().subscribe({
      next: (categories) => {
        this.categories = categories;
      },
      error: (error) => {
        console.error('Kategori yükleme hatası:', error);
      }
    });
  }

  onImageSelect(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      this.selectedImage = file;
      
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  onSubmit(): void {

    if (this.blogForm.valid && this.selectedImage) {
      this.loading = true;
      this.error = null;

      const blogData: CreateBlogDto = {
        ...this.blogForm.value,
        image: this.selectedImage
      };

      this.blogService.createBlog(blogData).subscribe({
        next: () => {
          this.loading = false;
          this.router.navigate(['/blogs']);
        },
        error: (err) => {
          this.loading = false;
          this.error = 'Blog oluşturulurken bir hata oluştu';
          console.error('Blog creation error:', err);
          this.submitted = false; // Hata durumunda tekrar submit edilebilir
        }
      });
    } else {
      this.error = 'Lütfen tüm alanları doldurun ve bir resim seçin';
      this.submitted = false; // Form geçersizse tekrar submit edilebilir
    }
  }
}