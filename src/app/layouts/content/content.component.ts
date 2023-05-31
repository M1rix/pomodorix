import { Component, Input, OnInit } from '@angular/core';
import {CronJob} from "cron";

@Component({
  selector: 'app-content',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.scss']
})
export class ContentComponent implements OnInit {

  @Input() isSoundsEnabled!: boolean;
  isActive = false;
  count = 0;
  time = 1500;
  message = 'Time to focus!';
  type: 'pomodoro' | 'short' | 'long' = 'pomodoro';
  cronJob: CronJob;

  buttonPressSound = new Audio('./assets/sounds/button-press.wav');
  alarmKitchenSound = new Audio('./assets/sounds/alarm-kitchen.mp3');
  tickingSound = new Audio('./assets/sounds/ticking.mp3');
  clickSound = new Audio('./assets/sounds/click.mp3');
  gongSound = new Audio('./assets/sounds/gong.mp3');

  constructor() {
    this.cronJob = new CronJob('*/1 * * * * *', async () => {
      try {
        await this.handleTime();
      } catch (e) {
        console.error(e);
      }
    });

    if (!this.cronJob.running) {
      this.cronJob.start();
    }
  }

  ngOnInit(): void {
    let localCurrent = localStorage.getItem('current');
  }

  async handleTime(): Promise<void> {
    if (this.isActive) {
      this.time--;
      this.setPageTitle();
      if (this.isSoundsEnabled && this.time === 10) {
        this.tickingSound.play().then(() => setTimeout(() => {
          this.tickingSound.pause();
          this.alarmKitchenSound.play().then(() => setTimeout(() => { this.alarmKitchenSound.pause()}, 3000))
        }, 7000));
      }
      if (this.time === 0){
        this.goForward(true);
      }
    }
    localStorage.setItem('current', JSON.stringify({type: this.type, time: this.time}));
  }

  getMinutes(): string {
    const time = this.time / 60;
    return  time === 0 ? '0' : Math.floor(time).toString();
  }

  getSeconds(): string {
    const time = this.time % 60;
    if (time.toString().length === 1) {
      return '0' + time.toString();
    }
    return time.toString();
  }

  setType(type: 'pomodoro' | 'short' | 'long', fromCron?: boolean): void {
    if(!fromCron){
      this.clickSound.play().then();
      this.setPageTitle();
    }
    if (this.type !== type) {
      const wrapper = document.getElementById('wrapper');
      wrapper?.classList.add('bg-' + type);
      wrapper?.classList.remove('bg-' + this.type);
      this.type = type;
      this.isActive = fromCron ?? true;
      this.time = this.type !== 'pomodoro' ? this.type !== 'short' ? 900 : 300 : 1500;
      this.message = this.type !== 'pomodoro' ? 'Time for a break!' : 'Time to focus!';
    }
  }

  goForward(fromCron?: boolean): void {
    if(this.isSoundsEnabled && fromCron) {
      this.gongSound.play().then();
      setTimeout(() => {
        this.gongSound.pause();
      }, 3000);
    }
    this.isActive = !this.isActive
    if (this.type === 'pomodoro') {
      this.count++;
      if (this.count % 4 === 0) {
        this.setType('long');
        this.isActive = fromCron ?? false;
        this.time = 900;
        return;
      } else {
        this.setType('short', fromCron ?? false);
        return;
      }
    }
    if (this.type === 'short') {
      this.setType('pomodoro', fromCron ?? false);
      this.isActive = fromCron ?? false;
      this.time = 1500;
      return;
    }
    if (this.type === 'long') {
      this.setType('pomodoro', fromCron ?? false);
      this.isActive = fromCron ?? false;
      this.time = 1500;
      return;
    }
  }

  toggleStartStop(isActive: boolean) {
    this.buttonPressSound.play().then();
    this.isActive = !isActive;
    this.setPageTitle();
  }

  setPageTitle(): void {
    window.document.title = this.isActive ? (this.getMinutes() + ':' + this.getSeconds() + ' | Pomodorix') : 'Pomodorix';
  }
}
