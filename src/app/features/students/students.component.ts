import { Component, inject, signal, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { StudentService, Student } from '../../core/services/student.service';

@Component({
  selector: 'app-students',
  imports: [FormsModule],
  templateUrl: './students.component.html',
  styleUrl: './students.component.scss',
})
export class StudentsComponent implements OnInit {
  private svc = inject(StudentService);

  students = signal<Student[]>([]);
  loading = signal(true);
  showForm = signal(false);
  editTarget = signal<Student | null>(null);

  form = { name: '', rate_per_hour: 0, timezone: 'Europe/Moscow' };

  ngOnInit() {
    this.load();
  }

  load() {
    this.svc.getAll().subscribe({
      next: (data) => { this.students.set(data); this.loading.set(false); },
      error: () => this.loading.set(false),
    });
  }

  openCreate() {
    this.form = { name: '', rate_per_hour: 0, timezone: 'Europe/Moscow' };
    this.editTarget.set(null);
    this.showForm.set(true);
  }

  openEdit(s: Student) {
    this.form = { name: s.name, rate_per_hour: s.rate_per_hour, timezone: s.timezone };
    this.editTarget.set(s);
    this.showForm.set(true);
  }

  save() {
    const target = this.editTarget();
    if (target) {
      this.svc.update(target._id, this.form).subscribe(() => { this.showForm.set(false); this.load(); });
    } else {
      this.svc.create(this.form).subscribe(() => { this.showForm.set(false); this.load(); });
    }
  }

  remove(id: string) {
    if (!confirm('Удалить ученика?')) return;
    this.svc.remove(id).subscribe(() => this.load());
  }

  topup(id: string) {
    const n = Number(prompt('Сколько уроков добавить?'));
    if (!n || n < 1) return;
    this.svc.topup(id, n).subscribe(() => this.load());
  }
}
