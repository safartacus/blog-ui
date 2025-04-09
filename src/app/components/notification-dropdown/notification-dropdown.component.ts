import { Component, OnInit } from '@angular/core';
import { NotificationService } from '../../services/notification.service';
import { Notification } from '../../models/notification';
import { AuthService } from 'src/app/services/auth.service';
import { User } from 'src/app/models/user';

@Component({
  selector: 'app-notification-dropdown',
  templateUrl: './notification-dropdown.component.html',
  styleUrls: ['./notification-dropdown.component.scss']
})
export class NotificationDropdownComponent implements OnInit {
  notifications: Notification[] = [];
  unreadCount = 0;
  isLoading = false;
  showDropdown = false;
  currentUser: User | null = null;
  constructor(private notificationService: NotificationService, private authService: AuthService) {}

  ngOnInit(): void {
    this.notificationService.unreadCount$.subscribe(
      count => this.unreadCount = count
    );
    this.loadUnreadNotifications();
  }

  loadUnreadNotifications(): void {
    
    if(this.currentUser == null){
      this.authService.currentUser$.subscribe(user => {
        this.currentUser = user;
      });
    }
    if(this.currentUser == undefined){
      return;
    }

    this.isLoading = true;
    this.notificationService.getUnreadNotifications().subscribe({
      next: (response) => {
        this.notifications = response.data;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Bildirimler yüklenirken hata:', error);
        this.isLoading = false;
      }
    });
  }

  toggleDropdown(): void {
    this.showDropdown = !this.showDropdown;
    if (this.showDropdown) {
      this.loadUnreadNotifications();
    }
  }

  markAsRead(notification: Notification): void {
    if (!notification.read) {
      this.notificationService.markAsRead(notification._id).subscribe({
        next: () => {
          notification.read = true;
          this.notificationService.updateUnreadCount();
        },
        error: (error) => {
          console.error('Bildirim okundu işaretlenirken hata:', error);
        }
      });
    }
  }

  markAllAsRead(): void {
    this.notificationService.markAllAsRead().subscribe({
      next: () => {
        this.notifications.forEach(n => n.read = true);
        this.notificationService.updateUnreadCount();
      },
      error: (error) => {
        console.error('Tüm bildirimler okundu işaretlenirken hata:', error);
      }
    });
  }
}