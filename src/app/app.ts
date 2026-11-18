import { Component, signal } from '@angular/core';
import { Header } from './shared/layouts/header/header/header';
import { Nav } from './shared/layouts/nav/nav/nav';
import { TuiRoot } from '@taiga-ui/core';
import { RouterOutlet } from '@angular/router';
import { Footer } from './shared/layouts/footer/footer/footer';

@Component({
  selector: 'app-root',
  imports: [TuiRoot, RouterOutlet, Header, Nav, Footer],
  templateUrl: './app.html',
  styleUrl: './app.less',
})
export class App {
  protected readonly title = signal('TFE_RentServe_Frontend');
}
