import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  @Output() toggleSounds = new EventEmitter();
  @Input() isSoundsEnabled!: boolean;
  isSettingsOpen = false;

  constructor() { }

  ngOnInit(): void {
  }

}
