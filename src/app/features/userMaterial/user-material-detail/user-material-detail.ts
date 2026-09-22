import { Component, inject, OnInit } from '@angular/core';
import { UserMaterialService } from '../service/user-material-service';
import { UserMaterialDetailModel } from '../model/user-material-detail';

@Component({
  selector: 'app-user-material-detail',
  imports: [],
  templateUrl: './user-material-detail.html',
  styleUrl: './user-material-detail.less',
})
export class UserMaterialDetail implements OnInit {
  private readonly _userMaterialService = inject(UserMaterialService);

  userMaterialDetail!: UserMaterialDetailModel;
  userMaterialId!: number;

  ngOnInit() {
    this.userMaterialId = history.state.userMaterialId;
    // console.log(this.userMaterialId);
    this.getUserMaterialDetail();
  }

  protected getUserMaterialDetail() {
    this._userMaterialService.getUserMaterialDetail(this.userMaterialId).subscribe({
      next: (result) => {
        this.userMaterialDetail = result;
        console.log(this.userMaterialDetail);
      },
    });
  }
}
