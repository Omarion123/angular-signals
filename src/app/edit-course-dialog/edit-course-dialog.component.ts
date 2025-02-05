import { Component, effect, inject, signal } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogConfig,
  MatDialogRef,
} from '@angular/material/dialog';
import { Course } from '../models/course.model';
import { EditCourseDialogData } from './edit-course-dialog.data.model';
import { CoursesService } from '../services/courses.service';
import { LoadingIndicatorComponent } from '../loading/loading.component';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { CourseCategoryComboboxComponent } from '../course-category-combobox/course-category-combobox.component';
import { CourseCategory } from '../models/course-category.model';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'edit-course-dialog',
  standalone: true,
  imports: [
    LoadingIndicatorComponent,
    ReactiveFormsModule,
    CourseCategoryComboboxComponent,
  ],
  templateUrl: './edit-course-dialog.component.html',
  styleUrl: './edit-course-dialog.component.scss',
})
export class EditCourseDialogComponent {
  constructor(
    private readonly dialogRef: MatDialogRef<EditCourseDialogComponent, any>
  ) {}
  onClose() {
    // this will help us to close the dialog for edit or create
    // this.dialogRef.close({ title: 'hello world' }); // this is the value that will be emited when closing the dialog
    this.dialogRef.close();
  }
}

// this is utitility function we create we can use anywhere to open dialog,
// for edit and create course
// we make it async, after creating or update course, it's promise will resolve
export async function openEditCourseDialog(
  dialog: MatDialog,
  data: EditCourseDialogData
) {
  const config = new MatDialogConfig();
  config.disableClose = true;
  config.autoFocus = true;
  config.width = '400px';
  config.data = data;
  const closed$ = dialog.open(EditCourseDialogComponent, config).afterClosed();
  // firstValueFrom will wait for the first emition and then, it will return a fulfilled promise
  return firstValueFrom(closed$);
}
