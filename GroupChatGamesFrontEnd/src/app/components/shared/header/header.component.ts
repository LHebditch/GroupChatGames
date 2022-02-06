import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'gcg-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  @Input('header') header: string = '';
  @Input('color') color: string = '#000';

  constructor() { }

  ngOnInit(): void {
  }

}
