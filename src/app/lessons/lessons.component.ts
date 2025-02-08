import {
  Component,
  ElementRef,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { LessonsService } from '../services/lessons.service';
import { Lesson } from '../models/lesson.model';
import { LessonDetailComponent } from './lesson-detail/lesson-detail.component';

@Component({
  selector: 'lessons',
  imports: [LessonDetailComponent],
  templateUrl: './lessons.component.html',
  styleUrl: './lessons.component.scss',
})
export class LessonsComponent {
  mode = signal<'master' | 'detail'>('master');
  lessons = signal<Lesson[]>([]);
  selectedLesson = signal<Lesson | null>(null);
  lessonsService = inject(LessonsService);
  //   angular signal query - view child
  searchInput = viewChild.required<ElementRef>('search');
  async onSearch() {
    const query: string = this.searchInput()?.nativeElement.value;
    console.log('search query: ', query);
    const results = await this.lessonsService.loadLessons({ query });
    this.lessons.set(results);
  }

  onDetailSelected(lesson: Lesson) {
    this.mode.set('detail');
    this.selectedLesson.set(lesson);
  }

  onCancel() {
    this.mode.set('master');
    // this.selectedLesson.set(null);
  }
  onLessonUpdated(lesson: Lesson) {
    this.lessons.update((lessons) =>
      // by using immutability in our update API, because signal works with immutability
      lessons.map((l) => (l.id == lesson.id ? lesson : l))
    );
  }
}
