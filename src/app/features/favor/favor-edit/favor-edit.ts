import { Component, inject, OnInit, signal } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { TuiBreadcrumbs, TuiDataListWrapperComponent, TuiSwitch } from '@taiga-ui/kit';
import {
  TuiButton,
  TuiDropdown,
  TuiFilterByInputPipe,
  TuiInputDirective,
  TuiLabel,
  TuiNotificationTemplate,
  TuiTextfieldComponent,
  TuiTextfieldOptionsDirective,
} from '@taiga-ui/core';
import { FavorService } from '../service/favor-service';
import { ThemeService } from '../../../core/services/ThemeService';
import { CategoryService } from '../../category/service/category-service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FavorDetailModel } from '../model/favorlDetail';
import { NgClass } from '@angular/common';
import { FavorForm } from '../model/FavorForm';

@Component({
  selector: 'app-favor-edit',
  imports: [
    NgClass,
    FormsModule,
    RouterLink,
    ReactiveFormsModule,
    TuiBreadcrumbs,
    TuiButton,
    TuiDataListWrapperComponent,
    TuiFilterByInputPipe,
    TuiInputDirective,
    TuiLabel,
    TuiDropdown,
    TuiNotificationTemplate,
    TuiSwitch,
    TuiTextfieldComponent,
    TuiTextfieldOptionsDirective,
  ],
  templateUrl: './favor-edit.html',
  styleUrl: './favor-edit.less',
})
export class FavorEdit implements OnInit {
  private favorService = inject(FavorService); // Service to call update and get favor
  private themeService = inject(ThemeService); // Call the service to change color theme
  private readonly _categoryService = inject(CategoryService); // Service to call list of category
  private readonly _router = inject(Router); // Tool to navigate
  private readonly _route = inject(ActivatedRoute); // Get the id of the material (by url)s

  isDarkMode = false; // Change theme from light to dark
  protected readonly show = signal(false); // Show notification
  protected readonly isSuccess = signal(false); // Change color Green for success or Red error

  favorId!: number;
  favorModel!: FavorDetailModel;
  categoriesList: string[] = [];
  protected messageError = '';
  protected messageSuccess = '';
  title = 'Modification';

  // Breadcrumbs
  protected links = [
    {
      caption: "Page d\'accueil",
      routerLink: '/dashboard',
    },
    {
      caption: 'Liste des services',
      routerLink: '/all-favour',
    },
    {
      caption: 'Modification du service',
    },
  ];

  ngOnInit() {
    this.getRoute();
    this.getFavor();
    this.getCategories();
    this.changeTheme();
  }

  protected editFavorForm = new FormGroup({
    category: new FormControl('', Validators.required),
    nameFavor: new FormControl('', Validators.required),
    isAvailable: new FormControl<boolean>(false, Validators.required),
  });

  getRoute() {
    this._route.params.subscribe((params) => {
      this.favorId = params['id'];
    });
  }

  getFavor() {
    this.favorService.getFavor(this.favorId).subscribe({
      next: (result) => {
        this.favorModel = result;
        this.editFavorForm.get('category')?.patchValue(this.favorModel.nameCategory);
        this.editFavorForm.get('nameFavor')?.patchValue(this.favorModel.nameFavor);
        this.editFavorForm.get('isAvailable')?.patchValue(this.favorModel.isAvailable);
      },

      error: (err) => {
        console.error(err);
      },
    });
  }

  getCategories() {
    this._categoryService.getCategories().subscribe({
      next: (listCat) => {
        this.categoriesList = listCat
          .map((category) => category.nameCategory)
          .sort((a, b) => a.localeCompare(b, 'fr'));
      },
      error: (err) => {
        if (!typeof err.error) {
          this.messageError = err.error.message;
        } else if (err.error?.message) {
          this.messageError = err.error.message;
        } else {
          this.messageError = "Erreur d'inscription";
        }
      },
    });
  }

  onSubmitEditFavor() {
    this.editFavorForm.markAllAsTouched();
    if (this.editFavorForm.invalid) {
      this.messageError = 'Il y a une erreur dans le formulaire';
    }
    this.favorService.editFavor(this.favorId, <FavorForm>this.editFavorForm.value).subscribe({
      next: (data) => {
        this.editFavorForm.patchValue(data);
        this.messageSuccess = 'La mise à jour a été effectué avec sucès';
        this.isSuccess.set(true);
        this.show.set(true);

        setTimeout(() => {
          this._router.navigate(['favor', 'all-favour']);
        }, 2000);
      },
      error: (err) => {
        if (!typeof err.error) {
          this.messageError = err.error.message;
          this.isSuccess.set(false);
          this.show.set(true);
        } else if (err.error?.message) {
          this.messageError = err.error.message;
          this.isSuccess.set(false);
          this.show.set(true);
        } else {
          this.messageError = "Erreur d'inscription";
          this.isSuccess.set(false);
          this.show.set(true);
        }
      },
    });
  }

  changeTheme() {
    this.isDarkMode = this.themeService.isDarkMode(); // Get current theme
    this.themeService.darkMode$.subscribe((mode: boolean) => (this.isDarkMode = mode)); // Watch changes in dark mode (reactive)
  }
}
