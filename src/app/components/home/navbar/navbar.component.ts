import { Component, Input } from '@angular/core';
import { NgToastService } from 'ng-angular-popup';
import { UserDetails } from 'src/app/models/user.requests';
import { JwtService } from 'src/app/services/jwt/jwt.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent {
  @Input() userName: string | undefined;

  link: string = '';
  userDetails!: UserDetails;
  isManager: boolean = false;
  isPatient: boolean = false;

  constructor(
    private jwtService: JwtService,
    private userService: UserService,
    private ngToast: NgToastService
  ) {}

  ngOnInit() {
    this.userDetails = this.jwtService.getUserDetails()!;
    if (this.userDetails.role === 'USER') {
      this.link = '/userhome';
      this.isPatient = true;
    } else if (this.userDetails.role === 'MANAGER') {
      this.link = '/managerhome';
      this.isManager = true;
    } else {
      this.link = '/adminhome';
    }
  }

  logout() {
    this.userService.logout(this.userDetails.emailId).subscribe(
      (response) => {
        this.jwtService.clearToken();
        location.reload();
      },
      (error) => {
        this.ngToast.error({
          detail: "Sorry! Coudn't logout due to server error",
          summary: 'Try again.',
          duration: 5000,
        });
      }
    );
  }
}
