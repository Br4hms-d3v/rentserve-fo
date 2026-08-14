import { Component } from '@angular/core';
import { Registration } from '../../../auth/registration/registration/registration';

@Component({
  selector: 'app-home',
  imports: [Registration],
  templateUrl: './home.html',
  styleUrl: './home.less',
})
export class Home {}
