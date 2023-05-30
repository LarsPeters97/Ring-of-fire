import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class IsGameOverService {
  isGameOver = new Subject<boolean>();

  constructor() {}

  triggerIsGameOverSubject(isGameOver: boolean) {
    this.isGameOver.next(isGameOver);
  }
}
