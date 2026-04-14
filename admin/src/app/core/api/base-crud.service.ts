import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';

import type { PaginatedCollection } from '../../types/collection';

export abstract class BaseCrudService<T> {
  constructor(
    protected http: HttpClient,
    protected apiUrl: string,
  ) {}

  getMany(
    pageIndex = 0,
    pageSize = 20,
    filters?: Record<string, unknown>,
  ): Observable<PaginatedCollection<T>> {
    const cleanedFilters = filters
      ? Object.fromEntries(
          Object.entries(filters).filter(([_, v]) => v !== '' && v !== null && v !== undefined),
        )
      : {};

    return this.http
      .get<PaginatedCollection<T>>(this.apiUrl, {
        params: {
          pageNumber: pageIndex + 1,
          pageSize,
          ...cleanedFilters,
        },
      })
      .pipe(
        map((res) => ({
          ...res,
          meta: {
            ...res.meta,
            pageNumber: res.meta.pageNumber - 1,
          },
        })),
      );
  }

  getOne(id: string): Observable<T> {
    return this.http.get<T>(`${this.apiUrl}/${id}`);
  }

  create(payload: Partial<T>) {
    return this.http.post<T>(this.apiUrl, payload);
  }

  update(id: string, payload: Partial<T>) {
    return this.http.patch<T>(`${this.apiUrl}/${id}`, payload);
  }

  delete(id: string) {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
