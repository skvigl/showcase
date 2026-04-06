import { Component, input, output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';

@Component({
  selector: 'app-form-page-toolbar',
  imports: [MatToolbarModule, MatButtonModule, MatIconModule],
  templateUrl: './form-page-toolbar.html',
  styleUrl: './form-page-toolbar.scss',
})
export class FormPageToolbar {
  title = input<string | undefined>('');
  mode = input<'view' | 'edit'>('view');
  form = input<FormGroup | null>(null);

  back = output<void>();
  edit = output<void>();
  save = output<void>();
  cancel = output<void>();
}
