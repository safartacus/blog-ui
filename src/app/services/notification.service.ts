import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { environment } from '../environments/environment';
import { Notification } from '../models/notification';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private apiUrl = `${environment.notificationApiUrl}/api/notifications`;
  private unreadCount = new BehaviorSubject<number>(0);

  constructor(private http: HttpClient) {
    this.loadUnreadCount();
  }

  // Okunmamış bildirim sayısını takip et
  get unreadCount$(): Observable<number> {
    return this.unreadCount.asObservable();
  }

  // Okunmamış bildirimleri getir
  getUnreadNotifications(): Observable<{ data: Notification[] }> {
    return this.http.get<{ data: Notification[] }>(`${this.apiUrl}/unread`);
  }

  // Tüm bildirimleri getir (sayfalama ile)
  getNotifications(page: number = 1, limit: number = 10): Observable<{
    data: Notification[];
    total: number;
    currentPage: number;
    pages: number;
  }> {
    return this.http.get<any>(`${this.apiUrl}?page=${page}&limit=${limit}`);
  }

  // Bildirimi okundu olarak işaretle
  markAsRead(id: string): Observable<{ data: Notification }> {
    return this.http.patch<{ data: Notification }>(`${this.apiUrl}/${id}/read`, {});
  }

  // Tüm bildirimleri okundu olarak işaretle
  markAllAsRead(): Observable<any> {
    return this.http.patch(`${this.apiUrl}/mark-all-read`, {});
  }

  // Bildirimi sil
  deleteNotification(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  // Okunmamış bildirim sayısını güncelle
  private loadUnreadCount(): void {
    this.getUnreadNotifications().subscribe({
      next: (response) => {
        this.unreadCount.next(response.data.length);
      },
      error: (error) => {
        console.error('Bildirim sayısı yüklenirken hata:', error);
      }
    });
  }

  // Bildirim sayısını güncelle
  updateUnreadCount(): void {
    this.loadUnreadCount();
  }
}