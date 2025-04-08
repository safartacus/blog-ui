import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Comment } from '../models/comment';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CommentService {
  private apiUrl = `${environment.apiUrl}/api/comments`;

  constructor(private http: HttpClient) {}

  getComments(blogId: string): Observable<Comment[]> {
    return this.http.get<Comment[]>(`${this.apiUrl}/blog/${blogId}`);
  }

  createComment(blogId: string, content: string): Observable<Comment> {
    return this.http.post<Comment>(`${this.apiUrl}/blog/${blogId}`, { content });
  }

  deleteComment(commentId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${commentId}`);
  }

  toggleLike(commentId: string): Observable<Comment> {
    return this.http.post<Comment>(`${this.apiUrl}/${commentId}/like`, {});
  }
  isLikedByUser(comment: Comment, userId: string): boolean {
    return comment.likes.includes(userId);
  }
}