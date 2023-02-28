import {Component, OnInit} from '@angular/core';
import {CronJob} from "cron";

@Component({
  selector: 'app-content',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.scss']
})
export class ContentComponent implements OnInit {

  isActive = false;
  count = 0;
  time = 1500;
  message = 'Time to focus!';
  type: 'pomodoro' | 'short' | 'long' = 'pomodoro';
  cronJob: CronJob;

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
  }

  async handleTime(): Promise<void> {
    if (this.isActive) {
      this.time--;
      this.setPageTitle();
      if (this.time === 0){
        this.goForward(true);
      }
    }
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
    if (this.type !== type) {
      const wrapper = document.getElementById('wrapper');
      wrapper?.classList.add('bg-' + type);
      wrapper?.classList.remove('bg-' + this.type);
      this.type = type;
      this.isActive = !!fromCron;
      this.time = this.type !== 'pomodoro' ? this.type !== 'short' ? 900 : 300 : 1500;
      this.message = this.type !== 'pomodoro' ? 'Time for a break!' : 'Time to focus!';
    }
  }

  goForward(fromCron?: boolean): void {
    this.isActive = !this.isActive
    if (this.type === 'pomodoro') {
      this.count++;
      if (this.count % 4 === 0) {
        this.setType('long');
        this.isActive = false;
        this.time = 900;
        return;
      } else {
        this.setType('short', fromCron);
        return;
      }
    }
    if (this.type === 'short') {
      this.setType('pomodoro', fromCron);
      this.isActive = false;
      this.time = 1500;
      return;
    }
    if (this.type === 'long') {
      this.setType('pomodoro', fromCron);
      this.isActive = false;
      this.time = 1500;
      return;
    }
  }

  toggleStartStop(isActive: boolean) {
    this.isActive = !isActive;
    this.setPageTitle();
  }

  setPageTitle(): void {
    window.document.title = this.isActive ? (this.getMinutes() + ':' + this.getSeconds() + ' | Pomodorix') : 'Pomodorix';
  }
}
