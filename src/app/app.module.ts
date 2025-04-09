import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './components/header/header.component';
import { BlogListComponent } from './components/blog-list/blog-list.component';
import { BlogCardComponent } from './components/blog-card/blog-card.component';
import { FooterComponent } from './components/footer/footer.component';
import { BlogDetailComponent } from './components/blog-detail/blog-detail.component';
import { CategoryFilterComponent } from './components/category-filter/category-filter.component';
import { SearchBarComponent } from './components/search-bar/search-bar.component';
import { RouterModule } from '@angular/router';

import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { BlogCreateComponent } from './components/blog-create/blog-create.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BlogService } from './services/blog.service';
import { ThemeService } from './services/theme.service';
import { CommonModule } from '@angular/common';
import { FindPipe } from './pipe/find.pipe';
import { AuthInterceptor } from './auth/auth.interceptor';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { ProfiledropdownComponent } from './components/profiledropdown/profiledropdown.component';
import { ProfileComponent } from './components/profile/profile.component';
import { CommentSectionComponent } from './components/comment-section/comment-section.component';
import { NotificationDropdownComponent } from './components/notification-dropdown/notification-dropdown.component';
import { TimeAgoPipe } from './pipe/timeago.pipe';


@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    BlogListComponent,
    BlogCardComponent,
    FooterComponent,
    BlogDetailComponent,
    CategoryFilterComponent,
    SearchBarComponent,
    BlogCreateComponent,
    FindPipe,
    TimeAgoPipe,
    LoginComponent,
    RegisterComponent,
    ProfiledropdownComponent,
    ProfileComponent,
    CommentSectionComponent,
    NotificationDropdownComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    RouterModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule
  ],
  providers: [BlogService,ThemeService,{
    provide: HTTP_INTERCEPTORS,
    useClass: AuthInterceptor,
    multi: true
  }],
  bootstrap: [AppComponent]
})
export class AppModule { }
