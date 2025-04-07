export interface IUser {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    profileImage: ProfileImage;
    role: 'user' | 'admin';
  }
  export class User implements IUser {
    _id!: string;
    firstName!: string;
    lastName!: string;
    email!: string;
    profileImage!: ProfileImage;
    role!: 'user' | 'admin';
  }

  export interface IAuthResponse {
    token: string;
    user: User;
  }
  export class AuthResponse implements IAuthResponse {
    token!: string;
    user!: User;
  }
  
  export interface ILoginData {
    email: string;
    password: string;
  }
  export class LoginData implements ILoginData {
    email!: string;
    password!: string;
  }
  
  export interface IRegisterData {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
  }
  export class RegisterData implements IRegisterData {
    firstName!: string;
    lastName!: string;
    email!: string;
    password!: string;
  }

  export interface IProfileImage {
    url: string;
    publicId: string;
  }
  export class ProfileImage  implements IProfileImage {
    url!: string;
    publicId!: string;
  }
export class UpdateUserDto implements IUpdateUserDto {
    firstName?: string;
    lastName?: string;
    currentPassword?: string;
    newPassword?: string;
    profileImage?: string; // base64 string olarak göndereceğiz
  }
  export interface IUpdateUserDto {
    firstName?: string;
    lastName?: string;
    currentPassword?: string;
    newPassword?: string;
    profileImage?: string; // base64 string olarak göndereceğiz
  }