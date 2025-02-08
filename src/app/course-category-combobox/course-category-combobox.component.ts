import { Component, contentChild, contentChildren, effect, ElementRef, input, model } from '@angular/core';
import { CourseCategory } from '../models/course-category.model';

@Component({
  selector: 'course-category-combobox',
  standalone: true,
  imports: [],
  templateUrl: './course-category-combobox.component.html',
  styleUrl: './course-category-combobox.component.scss',
})
export class CourseCategoryComboboxComponent {
  label = input.required<string>();
  value = model.required<CourseCategory>();
  // we can also projected component but this time we are querying the projected dom element
  // it works similar to viewChild/ viewChildren but it works only for projected content
  // viewChild/ viewChildren but it works only for child component dom element only

  // title = contentChild<ElementRef>('title');
  titles = contentChildren<ElementRef>('title');

  constructor() {
    effect(() => {
      // console.log('title: ', this.title());
      console.log('viewchildren titles: ', this.titles());
    })
  }

  onCategoryChange(category: string) {
    this.value.set(category as CourseCategory);
  }
}
