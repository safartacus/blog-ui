import { Component, OnInit } from '@angular/core';
import { CategoryService } from '../../services/categoryService';
import { BlogService } from '../../services/blog.service';
import { Category } from '../../models/category';

@Component({
  selector: 'app-category-filter',
  templateUrl: './category-filter.component.html',
  styleUrls: ['./category-filter.component.scss']
})
export class CategoryFilterComponent implements OnInit {
  categories$ = this.categoryService.categories$;
  selectedCategoryId: string | null = null;

  constructor(
    private categoryService: CategoryService,
    private blogService: BlogService
  ) {}

  ngOnInit() {}

  onCategorySelect(categoryId: string | null) {
    this.selectedCategoryId = categoryId;
    this.blogService.filterByCategory(categoryId);
  }
}