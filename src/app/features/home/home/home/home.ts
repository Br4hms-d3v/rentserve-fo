import { Component, OnDestroy, OnInit } from '@angular/core';
import { Registration } from '../../../auth/registration/registration/registration';
import { ThemeService } from '../../../../core/services/ThemeService';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-home',
  imports: [Registration],
  templateUrl: './home.html',
  styleUrl: './home.less',
})
export class Home implements OnInit, OnDestroy {
  isDarkMode = false; // Change theme from light to dark
  private sub!: Subscription;

  constructor(private themeService: ThemeService) {}

  ngOnInit() {
    this.isDarkMode = this.themeService.isDarkMode();
    this.sub = this.themeService.darkMode$.subscribe((mode: boolean) => (this.isDarkMode = mode));
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }
}
