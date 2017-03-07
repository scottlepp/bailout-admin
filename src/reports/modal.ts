import { Component } from '@angular/core';

@Component({
  selector: 'app-modal',
  template: `
  <div class="modal fade" tabindex="-1" [ngClass]="{'in': visibleAnimate}"
       [ngStyle]="{'display': visible ? 'block' : 'none', 'opacity': visibleAnimate ? 1 : 0}">
    <div class="modal-dialog">
      <div class="modal-content">
        <a href="javascript:;" class="modal-close icon-x" (click)="hide()"></a>
        <div class="modal-header">
          <ng-content select=".va-modal-header"></ng-content>
        </div>
        <div class="modal-body">
          <ng-content select=".va-modal-body"></ng-content>
        </div>
        <div class="modal-footer">
          <ng-content select=".va-modal-footer"></ng-content>
        </div>
      </div>
    </div>
  </div>
  `,
  styleUrls: ['./modal.css']
})
export class ModalComponent {

  public visible = false;
  public visibleAnimate = false;

  public show(): void {
    this.visible = true;
    setTimeout(() => this.visibleAnimate = true);
  }

  public hide(immediate?: boolean): void {
    this.visibleAnimate = false;
    if (immediate) {
      this.visible = false;
    }
    setTimeout(() => this.visible = false, 300);
  }
}