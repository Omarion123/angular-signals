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
import { catchError, from, throwError } from 'rxjs';
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
    private readonly messagesService: MessagesService
  ) {
    effect(() => {
      console.log('beginnersList: ', this.beginnersList());
      console.log('beginners courses: ', this.beginnersCourses());
      console.log('advanced courses: ', this.advancedCourses());
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
}
