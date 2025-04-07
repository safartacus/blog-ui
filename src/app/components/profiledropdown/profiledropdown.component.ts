import { Component, OnInit, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/user';

@Component({
  selector: 'app-profiledropdown',
  templateUrl: './profiledropdown.component.html',
  styleUrls: ['./profiledropdown.component.scss']
})
export class ProfiledropdownComponent {
  currentUser: User | null = null;
  isDropdownOpen = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.authService.getCurrentUser().subscribe(user => {
      this.currentUser = user;
    });
  }

  toggleDropdown(): void {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const dropdown = (event.target as HTMLElement).closest('.profile-dropdown');
    if (!dropdown) {
      this.isDropdownOpen = false;
    }
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/']);
  }

  getFullName(): string {
    if (this.currentUser) {
      return `${this.currentUser.firstName} ${this.currentUser.lastName}`;
    }
    return '';
  }
  navigateToLogin(): void {
    this.router.navigate(['/login']);
  }
  navigateToRegister(): void {
    this.router.navigate(['/register']);
  }
}
