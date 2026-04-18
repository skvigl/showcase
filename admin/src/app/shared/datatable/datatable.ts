import { Component, computed, input, output, Signal, signal } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule } from '@angular/material/paginator';
import { PaginatedCollection } from '../../types/collection';
import { MatMenuModule } from '@angular/material/menu';

export interface DatatableColumn<T> {
  key: Extract<keyof T, string>;
  header: string;
  cell?: (item: T) => string | number | null;
}

export interface DatatableAction<T> {
  icon?: string;
  label: string;
  onClick: (item: T) => void;
}

export const EMPTY_COLLECTION: PaginatedCollection<never> = {
  meta: {
    pageNumber: 0,
    pageSize: 10,
    totalItems: 0,
    totalPages: 0,
  },
  items: [],
};

@Component({
  selector: 'app-datatable',
  imports: [MatTableModule, MatPaginatorModule, MatMenuModule, MatButtonModule, MatIconModule],
  templateUrl: './datatable.html',
  styleUrl: './datatable.scss',
})
export class Datatable<T extends { id: string }> {
  columns = input<DatatableColumn<T>[]>([]);
  actions = input<DatatableAction<T>[]>([]);
  data = input<PaginatedCollection<T> | undefined>(undefined);
  pageSizeOptions = input<number[]>([10, 20, 50, 100]);

  pageChange = output<{ pageIndex: number; pageSize: number }>();

  private fallback = signal<PaginatedCollection<T>>(EMPTY_COLLECTION);
  private safeData = computed(() => this.data() ?? this.fallback());

  dataSource = computed(() => this.safeData().items);
  meta = computed(() => this.safeData().meta);

  displayedColumns = computed(() => {
    const cols = this.columns().map((c) => c.key);
    const actions = this.actions();

    return actions.length > 0 ? [...cols, 'actions'] : cols;
  });

  onPageChange(e: { pageIndex: number; pageSize: number }) {
    this.pageChange.emit(e);
  }
}
