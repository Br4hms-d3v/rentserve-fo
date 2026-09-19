import { Component, EventEmitter, inject, Input, Output, output, signal } from '@angular/core';
import { TuiButton, TuiNotificationTemplate } from '@taiga-ui/core';
import { CategoryService } from '../service/category-service';

@Component({
  selector: 'app-category-delete',
  imports: [TuiButton, TuiNotificationTemplate],
  templateUrl: './category-delete.html',
  styleUrl: './category-delete.less',
})
export class CategoryDelete {
  private readonly _categoryService = inject(CategoryService); // Call the service to get the id of category and update the category

  isDarkMode = false; // Change theme from light to dark
  protected show = signal(false); // Show notification
  protected readonly isSuccess = signal(false); // Change color Green for success or Red error
  protected messageError = '';
  protected messageSuccess = '';

  @Input({ required: true }) id!: number;
  @Input() message = 'Voulez-vous vraiment supprimer cette catégorie ?';

  @Output() confirmed = new EventEmitter<void>();
  @Output() cancelled = new EventEmitter<void>();

  protected onConfirm() {
    this._categoryService.deleteCategory(this.id).subscribe({
      next: () => {
        this.confirmed.emit();
        this.messageError = "La suppression s'est déroulée avec succès";
        this.show.set(true);
        this.isSuccess.set(true);
      },
      error: (err) => {
        this.messageError = 'impossible de suppprimer cette categorie';
        this.show.set(true);
        this.isSuccess.set(false);
        console.log(err);
      },
    });
  }
}
