import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/user';
import { UpdateUserDto } from '../../models/user';
import { ProfileService } from 'src/app/services/profile.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  user: User | null = null;
  profileForm: FormGroup;
  loading = false;
  updateSuccess = false;
  updateError = '';
  imagePreview: string | null = null;
  selectedImage: File | null = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private profileService: ProfileService
  ) {
    this.profileForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: [{ value: '', disabled: true }],
      currentPassword: [''],
      newPassword: [''],
      confirmPassword: ['']
    });
  }

  ngOnInit(): void {
    this.loadUserProfile();
  }

  loadUserProfile(): void {
    this.authService.getCurrentUser().subscribe({
      next: (user) => {
        this.user = user;
        this.profileForm.patchValue({
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email
        });
        this.imagePreview = user.profileImage?.url;
      },
      error: (error) => {
        console.error('Profil yükleme hatası:', error);
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

  async onSubmit(): Promise<void> {
    if (this.profileForm.valid) {
      this.loading = true;
      this.updateSuccess = false;
      this.updateError = '';

      try {
        const updateDto: UpdateUserDto = {
          firstName: this.profileForm.get('firstName')?.value,
          lastName: this.profileForm.get('lastName')?.value
        };

        // Şifre değişikliği varsa ekle
        const currentPassword = this.profileForm.get('currentPassword')?.value;
        const newPassword = this.profileForm.get('newPassword')?.value;
        if (currentPassword && newPassword) {
          updateDto.currentPassword = currentPassword;
          updateDto.newPassword = newPassword;
        }

        // Resim seçildiyse base64'e çevir ve ekle
        if (this.selectedImage) {
          const base64Image = await this.convertFileToBase64(this.selectedImage);
          updateDto.profileImage = base64Image;
        }

        this.profileService.updateProfile(updateDto).subscribe({
          next: (updatedUser) => {
            this.loading = false;
            this.updateSuccess = true;
            this.user = updatedUser;
            // Şifre alanlarını temizle
            this.profileForm.patchValue({
              currentPassword: '',
              newPassword: '',
              confirmPassword: ''
            });
          },
          error: (error) => {
            this.loading = false;
            this.updateError = error.error.message || 'Profil güncellenirken bir hata oluştu';
          }
        });
      } catch (error) {
        this.loading = false;
        this.updateError = 'Resim dönüştürme hatası';
      }
    }
  }

  private convertFileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const base64String = reader.result as string;
        resolve(base64String);
      };
      reader.onerror = () => reject(reader.error);
      reader.readAsDataURL(file);
    });
  }

  // Şifre eşleşme kontrolü
  passwordsMatch(): boolean {
    const newPassword = this.profileForm.get('newPassword')?.value;
    const confirmPassword = this.profileForm.get('confirmPassword')?.value;
    return newPassword === confirmPassword;
  }
}