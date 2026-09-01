import {
  ChangeDetectionStrategy,
  Component,
  inject,
  Input,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { MaterialService } from '../service/material-service';
import { MaterialDetailModel } from '../model/material-detail';
import { TuiHeader } from '@taiga-ui/layout';
import { TuiTitle } from '@taiga-ui/core';

@Component({
  selector: 'app-material-by-id',
  imports: [TuiHeader, TuiTitle],
  templateUrl: './material-by-id.html',
  styleUrl: './material-by-id.less',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MaterialById implements OnChanges {
  // Get data id from MaterialList
  @Input() materialId!: number;
  material?: MaterialDetailModel;

  private readonly _materialService = inject(MaterialService);

  ngOnChanges(changes: SimpleChanges) {
    if (changes['materialId']) {
      this.getMaterialById();
    }
  }

  private getMaterialById() {
    this._materialService.getMaterial(this.materialId).subscribe({
      next: (data) => {
        this.material = data;
      },
    });
  }
}
