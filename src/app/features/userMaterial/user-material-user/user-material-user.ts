import { Component, inject, OnInit } from '@angular/core';
import { AuthService } from '../../auth/service/auth-service';
import { UserMaterialService } from '../service/user-material-service';
import { UserMaterialModel } from '../model/userMaterial';
import { TuiTable } from '@taiga-ui/addon-table';
import { TuiStatus } from '@taiga-ui/kit';
import { TuiButton } from '@taiga-ui/core';
import { NgOptimizedImage } from '@angular/common';

@Component({
  selector: 'app-user-material-user',
  imports: [TuiTable, TuiStatus, TuiButton, NgOptimizedImage],
  templateUrl: './user-material-user.html',
  styleUrl: './user-material-user.less',
})
export class UserMaterialUser implements OnInit {
  private readonly _authService = inject(AuthService); // Get the id from user connected
  private readonly _userMaterialService = inject(UserMaterialService); // Get all materials from user ID

  protected userId!: number;
  userMaterialList: UserMaterialModel[] = [];
  protected messageSuccess = '';
  protected messageError = '';

  ngOnInit() {
    this.getIdUser();
  }

  protected getIdUser() {
    this._authService.currentUser$.subscribe((user) => {
      if (user) {
        this.userId = user.id;
        // console.log(this.userId);
        this.getUserMaterialById();
      }
    });
  }

  protected getUserMaterialById() {
    this._userMaterialService.getUserMaterialByUser(this.userId).subscribe({
      next: (userMaterials) => {
        setTimeout(() => {
          this.userMaterialList = userMaterials;
        });
        // this.userMaterialList = userMaterials;
        // console.log(this.userMaterialList);
      },
      error: (err) => {
        // console.log(err.error.message);
      },
    });
  }
}
