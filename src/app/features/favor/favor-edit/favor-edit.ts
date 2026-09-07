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

  getFavor() {}
}
