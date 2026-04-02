import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import type { Student } from '@interfaces';

export type { Student } from '@interfaces';

const API = 'http://localhost:3001/api/students';

@Injectable({ providedIn: 'root' })
export class StudentService {
  private http = inject(HttpClient);

  getAll() {
    return this.http.get<Student[]>(API);
  }
  getOne(id: string) {
    return this.http.get<Student>(`${API}/${id}`);
  }
  create(data: Partial<Student>) {
    return this.http.post<Student>(API, data);
  }
  update(id: string, data: Partial<Student>) {
    return this.http.put<Student>(`${API}/${id}`, data);
  }
  remove(id: string) {
    return this.http.delete(`${API}/${id}`);
  }
  topup(id: string, lessons: number) {
    return this.http.post<Student>(`${API}/${id}/topup`, { lessons });
  }
}
