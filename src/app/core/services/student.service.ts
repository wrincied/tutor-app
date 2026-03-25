import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

export interface Student {
  _id: string;
  name: string;
  rate_per_hour: number;
  balance_lessons: number;
  timezone: string;
  auto_debit_enabled: boolean;
  bot_active: boolean;
  createdAt: string;
}

const API = 'http://localhost:3000/api/students';

@Injectable({ providedIn: 'root' })
export class StudentService {
  private http = inject(HttpClient);

  getAll()                           { return this.http.get<Student[]>(API); }
  getOne(id: string)                 { return this.http.get<Student>(`${API}/${id}`); }
  create(data: Partial<Student>)     { return this.http.post<Student>(API, data); }
  update(id: string, data: Partial<Student>) { return this.http.put<Student>(`${API}/${id}`, data); }
  remove(id: string)                 { return this.http.delete(`${API}/${id}`); }
  topup(id: string, lessons: number) { return this.http.post<Student>(`${API}/${id}/topup`, { lessons }); }
}
