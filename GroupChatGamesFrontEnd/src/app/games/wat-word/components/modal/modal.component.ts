import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'gcg-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss']
})
export class WinModalComponent {
  @Input('title') title: string;
  @Output('onClose') onClose: EventEmitter<void> = new EventEmitter<void>();

  constructor() { }

  public close() {
    this.onClose.emit();
  }
}
