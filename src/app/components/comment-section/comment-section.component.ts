import { Component, Input, OnInit } from '@angular/core';
import { CommentService } from '../../services/comment.service';
import { AuthService } from '../../services/auth.service';
import { Comment } from '../../models/comment';

@Component({
  selector: 'app-comment-section',
  templateUrl: './comment-section.component.html',
  styleUrls: ['./comment-section.component.scss']
})
export class CommentSectionComponent implements OnInit {
  @Input() blogId!: string;
  comments: Comment[] = [];
  newComment: string = '';
  isLoading = false;

  constructor(
    private commentService: CommentService,
    public authService: AuthService
  ) {}

  ngOnInit() {
    this.loadComments();
  }

  loadComments() {
    this.isLoading = true;
    this.commentService.getComments(this.blogId).subscribe({
      next: (comments) => {
        this.comments = comments;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Yorumlar yüklenirken hata:', error);
        this.isLoading = false;
      }
    });
  }

  addComment() {
    if (!this.newComment.trim()) return;

    this.commentService.createComment(this.blogId, this.newComment).subscribe({
      next: (comment) => {
        this.comments.unshift(comment);
        this.newComment = '';
      },
      error: (error) => console.error('Yorum eklenirken hata:', error)
    });
  }

  deleteComment(commentId: string) {
    this.commentService.deleteComment(commentId).subscribe({
      next: () => {
        this.comments = this.comments.filter(c => c._id !== commentId);
      },
      error: (error) => console.error('Yorum silinirken hata:', error)
    });
  }

  toggleLike(comment: Comment) {
    this.commentService.toggleLike(comment._id).subscribe({
      next: (updatedComment) => {
        const index = this.comments.findIndex(c => c._id === comment._id);
        if (index !== -1) {
          this.comments[index] = updatedComment;
        }
      },
      error: (error) => console.error('Beğeni işlemi başarısız:', error)
    });
  }

  isCommentOwner(comment: Comment): boolean {
    return this.authService.getCurrentUserId() === comment.author._id;
  }

  hasLiked(comment: Comment): boolean {
    return comment.likes.includes(this.authService.getCurrentUserId());
  }
}