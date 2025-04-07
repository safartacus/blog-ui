import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfiledropdownComponent } from './profiledropdown.component';

describe('ProfiledropdownComponent', () => {
  let component: ProfiledropdownComponent;
  let fixture: ComponentFixture<ProfiledropdownComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ProfiledropdownComponent]
    });
    fixture = TestBed.createComponent(ProfiledropdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
