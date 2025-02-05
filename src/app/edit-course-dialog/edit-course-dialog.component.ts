import {
  afterRender,
  Component,
  effect,
  Inject,
  inject,
  signal,
} from '@angular/core';
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
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
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
  data: EditCourseDialogData = inject(MAT_DIALOG_DATA);
  form: FormGroup;
  constructor(
    private readonly dialogRef: MatDialogRef<EditCourseDialogComponent, any>,
    // @Inject(MAT_DIALOG_DATA) public data: EditCourseDialogData,
    private readonly fb: FormBuilder,
    private readonly courseService: CoursesService
  ) {
    this.form = this.fb.group({
      title: [''],
      longDescription: [''],
      category: [''],
      iconUrl: [''],
    });

    this.form.patchValue({
      title: this.data?.course?.title,
      longDescription: this.data?.course?.longDescription,
      category: this.data?.course?.category,
      iconUrl: this.data?.course?.iconUrl,
    });
  }

  ngOnInit() {
    this.form.valueChanges.subscribe((values) => {
      console.log({ 'form values: ': values, 'data: ': this.data });
    });
  }

  async onSave() {
    const courseProps = this.form.value as Partial<Course>;

    if (this.data.mode === 'update') {
      await this.saveCourse(this.data?.course!.id, courseProps);
    } else if (this.data.mode === 'create') {
      await this.createCourse(courseProps);
    }
  }

  async createCourse(course: Partial<Course>) {
    try {
      const newCourse = await this.courseService.createCourse(course);
      this.dialogRef.close(newCourse);
    } catch (err) {
      console.error(err);
      alert('Error creating course');
    }
  }

  async saveCourse(courseId: string, changes: Partial<Course>) {
    try {
      const updatedCourse = await this.courseService.saveCourse(
        courseId,
        changes
      );
      this.dialogRef.close(updatedCourse);
    } catch (err) {
      console.error(err);
      alert('failed to update course');
    }
  }

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
