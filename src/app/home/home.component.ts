import { afterNextRender, computed, EffectRef } from '@angular/core';
import { Component, effect, inject, Injector, signal } from '@angular/core';
import { CoursesService } from '../services/courses.service';
import { Course, sortCoursesBySeqNo } from '../models/course.model';
import { MatTab, MatTabGroup } from '@angular/material/tabs';
import { CoursesCardListComponent } from '../courses-card-list/courses-card-list.component';
import { MatDialog } from '@angular/material/dialog';
import { MessagesService } from '../messages/messages.service';
import { catchError, from, throwError } from 'rxjs';
import {
  toObservable,
  toSignal,
  outputToObservable,
  outputFromObservable,
} from '@angular/core/rxjs-interop';

type Counter = {
  value: number;
};
@Component({
  selector: 'home',
  imports: [MatTabGroup, MatTab, CoursesCardListComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  counter = signal(0);
  effectRef: EffectRef | null = null;

  constructor() {
    this.effectRef = effect((onCleanup) => {
      const counter = this.counter(); // we compute logic outside any block code or conditional blocks
      const timeout = setTimeout(() => {
        console.log(`couner value: ${counter}`);
      }, 1000);

      onCleanup(() => {
        // with this we are clearing the timeout
        // before the excution of the next effect to run
        console.log('calling clean up');
        clearTimeout(timeout);
      });
    });
  }

  tenXCounter = computed(() => {
    const val = this.counter();
    return val * 10;
  });

  hundredXCounter = computed(() => {
    const val = this.tenXCounter();
    return val * 10;
  });

  increment() {
    this.counter.set(this.counter() + 1);
  }

  clean() {
    this.effectRef?.destroy();
  }
}
