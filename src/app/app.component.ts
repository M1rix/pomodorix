import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'Pomodorix';
  isSoundsEnabled = true;

  ngOnInit(): void {
    let localSoundsEnabled = localStorage.getItem('isSoundsEnabled');
    if(localSoundsEnabled){
      this.isSoundsEnabled = JSON.parse(localSoundsEnabled);
    }
  }

  toggleSounds(): void {
    this.isSoundsEnabled = !this.isSoundsEnabled;
    localStorage.setItem('isSoundsEnabled', JSON.stringify(this.isSoundsEnabled));
  }
}
