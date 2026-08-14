import { Component } from '@angular/core';
import { TuiForm } from '@taiga-ui/layout';
import { TuiButton } from '@taiga-ui/core';
import { Registration } from '../../../auth/registration/registration/registration';

@Component({
  selector: 'app-home',
  imports: [TuiForm, TuiButton, Registration],
  templateUrl: './home.html',
  styleUrl: './home.less',
})
export class Home {}
