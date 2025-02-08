import {
  afterNextRender,
  afterRender,
  Component,
  computed,
  effect,
  ElementRef,
  inject,
  Injector,
  signal,
  viewChild,
} from '@angular/core';
import { CoursesService } from '../services/courses.service';
import { Course, sortCoursesBySeqNo } from '../models/course.model';
import { MatTab, MatTabGroup } from '@angular/material/tabs';
import { CoursesCardListComponent } from '../courses-card-list/courses-card-list.component';
import { MatDialog } from '@angular/material/dialog';
import { MessagesService } from '../messages/messages.service';
import { catchError, from, interval, startWith, throwError } from 'rxjs';
import {
  toObservable,
  toSignal,
  outputToObservable,
  outputFromObservable,
} from '@angular/core/rxjs-interop';
import { CoursesServiceWithFetch } from '../services/courses-fetch.service';
import { openEditCourseDialog } from '../edit-course-dialog/edit-course-dialog.component';
import { LoadingService } from '../loading/loading.service';

@Component({
  selector: 'home',
  imports: [MatTabGroup, MatTab, CoursesCardListComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  #courses = signal<Course[]>([]);
  // we can also query component itself
  beginnersList = viewChild<CoursesCardListComponent>('beginnersList');

  // if we want Dom element of the component
  // beginnersList = viewChild('beginnersList', {
  //   read: ElementRef,
  // });

  // if we want to query the directive
  // beginnersList = viewChild('beginnersList', {
  //   read: MatTooltip,
  // });

  constructor(
    private readonly coursesServiceWithFetch: CoursesServiceWithFetch,
    private readonly coursesService: CoursesService,
    private readonly dialog: MatDialog,
    private readonly loadingService: LoadingService,
    private readonly messagesService: MessagesService,
    private readonly injector: Injector
  ) {
    effect(() => {
      // console.log('beginnersList: ', this.beginnersList());
      // console.log('beginners courses: ', this.beginnersCourses());
      // console.log('advanced courses: ', this.advancedCourses());
    });

    afterNextRender(() => {
      this.loadCourses().then(() => console.log(this.#courses()));
    });
  }

  beginnersCourses = computed(() => {
    const courses = this.#courses();
    return courses.filter((course) => course.category === 'BEGINNER');
  });

  advancedCourses = computed(() => {
    const courses = this.#courses();
    return courses.filter((course) => course.category === 'ADVANCED');
  });

  async loadCourses() {
    try {
      const apiCourses = await this.coursesService.loadAllCourses();
      if (apiCourses && apiCourses?.length > 0) {
        this.#courses.set(apiCourses.sort(sortCoursesBySeqNo));
      }
    } catch (error) {
      this.messagesService.showMessage('Error loading courses', 'error');
      console.error(error);
    }
  }

  onCourseUpdated(updatedCourse: Course) {
    const courses = this.#courses();
    const newCourses = courses.map((course) =>
      course.id === updatedCourse.id ? updatedCourse : course
    );
    this.#courses.set(newCourses);
  }

  async onCourseDeleted(courseId: string) {
    try {
      await this.coursesService.deleteCourse(courseId);
      const courses = this.#courses();
      const newCourses = courses.filter((course) => course.id !== courseId);
      this.#courses.set(newCourses);
    } catch (err) {
      this.messagesService.showMessage('Error deleting courses', 'error');
      alert('Error deleting course.');
    }
  }

  async addCourse() {
    const newCourse = await openEditCourseDialog(this.dialog, {
      mode: 'create',
      title: 'Create New Course',
    });

    if (!newCourse) {
      return;
    }

    const newCourses = [...this.#courses(), newCourse];
    this.#courses.set(newCourses);
  }

  // onToSignal() {
  //   const timer$ = interval(1000).pipe(startWith(0));
  //   const numbers = toSignal(timer$, {
  //     injector: this.injector,
  //     // initialValue: 0, // when you want to set initial value explicitly
  //     requireSync: true, // when you want to force observable to provide initial value
  //   });

  //   effect(
  //     () => {
  //       console.log('timer: ', numbers());
  //     },
  //     {
  //       injector: this.injector,
  //     }
  //   );
  // }

  // onToObservable() {
  //   // toObservalbe can on be used in injection context like constructor,
  //   // but using it in function like this, we will need to provide enjection context
  //   const courses$ = toObservable(this.#courses, { injector: this.injector });
  //   courses$.subscribe((courses) =>
  //     console.log('courses observable: ', courses)
  //   );
  // }

  onToObservable() {
    const numbers = signal(0);
    numbers.set(1);
    numbers.set(2);
    numbers.set(3);

    const numbers$ = toObservable(numbers, {
      injector: this.injector,
    });

    numbers.set(4);
    numbers$.subscribe((val) => console.log('numbers$: ', val));
    // will log only this: numbers$ 5; because angular waits for value of the signal
    // to stabilize at the the end of change detection cycle before...
    // triggering any dependent effect or compute
    numbers.set(5);
  }
  courses$ = from(this.coursesService.loadAllCourses());
  onToSignal() {
    // the reason we need to use that injector, is because:
    // angular internaly subscribe to that observable in order to make the signal
    // which means that angular we will be able to clean that subscription when component get's detroyed
    // in order to avoid memory leaks
    const courses = toSignal(this.courses$, { injector: this.injector });
    effect(
      () => {
        console.log('courses signal: ', courses());
      },
      // same thing for this effect, it needs to be cleaned up when component destroyed
      { injector: this.injector }
    );
  }
}
