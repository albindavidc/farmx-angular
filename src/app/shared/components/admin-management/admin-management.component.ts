import { Component, Input, Output, EventEmitter } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Community } from '../../models/community.model';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSortModule, Sort } from '@angular/material/sort';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressSpinnerModule, MatSpinner } from '@angular/material/progress-spinner';
import { AdminDialogComponent } from '../admin-dialog/admin-dialog.component';

export interface TableColumn {
  name: string; 
  label: string; 
  isVisible: boolean; 
  sortable?: boolean; 
  type?: 'text' | 'date' | 'number' | 'boolean' | 'image' | 'actions'; 
  format?: (value: any) => any; 
}

export interface TableConfig {
  columns: TableColumn[];
  pageSize: number;
  pageSizeOptions: number[];
  showPaginator: boolean;
  showFilter: boolean;
  filterPlaceholder?: string;
  actionsColumn?: {
    edit?: boolean;
    delete?: boolean;
    view?: boolean;
    custom?: Array<{
      label: string;
      icon: string;
      action: string;
    }>;
  };
}

@Component({
  selector: 'app-admin-management',
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatIconModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatDialogModule,
    MatSnackBarModule,
    MatMenuModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './admin-management.component.html',
  styleUrl: './admin-management.component.scss',
})
export class AdminManagementComponent {
  @Input() title: string = 'Management Table';
  @Input() data: any[] = [];
  @Input() config!: TableConfig;
  @Input() isLoading: boolean = false;
  @Input() totalItems: number = 0;

  @Output() pageChange = new EventEmitter<PageEvent>();
  @Output() sortChange = new EventEmitter<Sort>();
  @Output() filterChange = new EventEmitter<string>();
  @Output() rowAction = new EventEmitter<{ action: string; item: any }>();
  @Output() createNew = new EventEmitter<void>();

  displayedColumns: string[] = [];
  filterValue: string = '';

  constructor(private dialog: MatDialog, private snackBar: MatSnackBar) {}

  ngOnInit(): void {
    this.setupDisplayColumns();

    console.log('Config:', this.config); // Debug
  }

  private setupDisplayColumns(): void {
    this.displayedColumns = this.config.columns
      .filter((column) => column.isVisible)
      .map((column) => column.name);

    // Add actions column if needed
    if (
      this.config.actionsColumn &&
      (this.config.actionsColumn.edit ||
        this.config.actionsColumn.delete ||
        this.config.actionsColumn.view ||
        this.config.actionsColumn.custom?.length)
    ) {
      this.displayedColumns.push('actions');
    }
  }

  onPageChange(event: PageEvent): void {
    this.pageChange.emit(event);
  }

  onSortChange(sort: Sort): void {
    this.sortChange.emit(sort);
  }

  applyFilter(): void {
    this.filterChange.emit(this.filterValue);
  }

  clearFilter(): void {
    this.filterValue = '';
    this.filterChange.emit('');
  }

  onCreateNew(): void {
    // this.createNew.emit();

    // Open the dialog for creating new item
    const dialogRef = this.dialog.open(AdminDialogComponent, {
      width: '500px',
      data: { mode: 'create', item: {} },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.rowAction.emit({ action: 'create', item: result });
        this.showNotification('Item created successfully');
      }
    });
  }

  onEdit(item: any): void {
    const dialogRef = this.dialog.open(AdminDialogComponent, {
      width: '500px',
      data: { mode: 'edit', item: { ...item } },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.rowAction.emit({ action: 'edit', item: result });
        this.showNotification('Item updated successfully');
      }
    });
  }

  onDelete(item: any): void {
    // Confirm dialog could be implemented here
    if (confirm('Are you sure you want to delete this item?')) {
      this.rowAction.emit({ action: 'delete', item });
      this.showNotification('Item deleted successfully');
    }
  }

  onView(item: any): void {
    this.rowAction.emit({ action: 'view', item });
  }

  onCustomAction(action: string, item: any): void {
    this.rowAction.emit({ action, item });
  }

  showNotification(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      horizontalPosition: 'right',
      verticalPosition: 'top',
    });
  }

  getValue(item: any, column: TableColumn): any {
    const value = column.name
      .split('.')
      .reduce((o, i) => (o ? o[i] : null), item);
    return column.format ? column.format(value) : value;
  }

  trackById(index: number, item: any): any {
    return item.id || index;
  }
}
