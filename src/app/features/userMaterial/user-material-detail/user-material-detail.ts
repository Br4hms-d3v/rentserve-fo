import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { UserMaterialService } from '../service/user-material-service';
import { UserMaterialDetailModel } from '../model/user-material-detail';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-user-material-detail',
  imports: [],
  templateUrl: './user-material-detail.html',
  styleUrl: './user-material-detail.less',
})
export class UserMaterialDetail implements OnInit {
  private readonly _userMaterialService = inject(UserMaterialService);
  private readonly _route = inject(ActivatedRoute); // Get the id of the material (by url)s
  private readonly _cdr = inject(ChangeDetectorRef);

  userMaterialDetail: UserMaterialDetailModel | null = null;
  userMaterialId!: number;

  ngOnInit() {
    this.userMaterialId = Number(this._route.snapshot.paramMap.get('id'));
    this.userMaterialOwner();
  }

  protected userMaterialOwner() {
    this._userMaterialService.getUserMaterialDetail(this.userMaterialId).subscribe({
      next: (result) => {
        this.userMaterialDetail = result;

        this._cdr.detectChanges();
      },
    });
  }
}
