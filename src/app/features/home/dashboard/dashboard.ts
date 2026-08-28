import { Component, OnInit } from '@angular/core';
import { ThemeService } from '../../../core/services/ThemeService';
import { NgClass } from '@angular/common';
import { CategoryMaterial } from '../../category/category-material/category-material';

@Component({
  selector: 'app-dashboard',
  imports: [NgClass, CategoryMaterial],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.less',
})
export class Dashboard implements OnInit {
  isDarkMode = false; // Change theme from light to dark

  constructor(private themeService: ThemeService) {}

  ngOnInit() {
    this.isDarkMode = this.themeService.isDarkMode(); // Get current theme
    this.themeService.darkMode$.subscribe((mode: boolean) => (this.isDarkMode = mode)); // Watch changes in dark mode (reactive)
  }

}
