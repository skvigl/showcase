import { Component, HostBinding, input } from '@angular/core';

@Component({
  selector: 'app-form-row',
  imports: [],
  templateUrl: './form-row.html',
  styleUrl: './form-row.scss',
})
export class FormRow {
  cols = input<1 | 2 | 3 | 4>(1);
  gap = input<number>(16);

  @HostBinding('style.--cols')
  get _cols() {
    return this.cols();
  }

  @HostBinding('style.--gap.px')
  get _gap() {
    return this.gap();
  }
}
