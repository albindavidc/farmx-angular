import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import {
  MatPaginator,
  MatPaginatorModule,
  PageEvent,
} from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort, MatSortModule, Sort } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Subject, debounceTime, distinctUntilChanged, takeUntil } from 'rxjs';
import { AdminNavBarComponent } from '../../../shared/components/nav-bar/admin-nav-bar/admin-nav-bar.component';
import { UserQueryParams } from '../../../shared/models/user/user-query-params.model';
import { UserRole } from '../../../shared/models/user/user-role';
import { User } from '../../../shared/models/user/user.model';
import { UserService } from '../../../shared/services/admin/user.service';
import { AdminUserManagementModelComponent } from './admin-user-management-model/admin-user-management-model.component';
import { MatTooltip } from '@angular/material/tooltip';

@Component({
  selector: 'app-admin-user-management',
  standalone: true,
  imports: [
    AdminNavBarComponent,
    CommonModule,
    FormsModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatPaginatorModule,
    MatSortModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './admin-user-management.component.html',
  styleUrl: './admin-user-management.component.scss',
})
export class AdminUserManagementComponent
  implements OnInit, AfterViewInit, OnDestroy
{
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  displayedColumns: string[] = [
    'name',
    'email',
    'role',
    'communitiesCount',
    'postsCount',
    'createdAt',
    'view',
    'edit',
    'block',
  ];

  dataSource = new MatTableDataSource<User>([]);
  isLoading = false;

  // Pagination state
  totalItems = 0;
  pageSize = 10;
  currentPage = 1;
  pageSizeOptions = [5, 10, 20, 50];

  // Sort state
  sortBy = 'createdAt';
  sortDirection: 'asc' | 'desc' = 'desc';

  // Search state
  private searchSubject = new Subject<string>();
  searchValue = '';

  // Cleanup
  private destroy$ = new Subject<void>();

  constructor(
    private userService: UserService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.setupSearchDebounce();
    this.loadUsers();
  }

  ngAfterViewInit(): void {
    // Disable client-side sorting and pagination
    this.dataSource.sort = null;
    this.dataSource.paginator = null;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Setup debounced search
   */
  private setupSearchDebounce(): void {
    this.searchSubject
      .pipe(
        debounceTime(500), // Wait 500ms after user stops typing
        distinctUntilChanged(),
        takeUntil(this.destroy$)
      )
      .subscribe((searchTerm) => {
        this.searchValue = searchTerm;
        this.currentPage = 1; // Reset to first page on search
        this.loadUsers();
      });
  }

  /**
   * Load users from server with current params
   */
  loadUsers(): void {
    this.isLoading = true;

    const params: UserQueryParams = {
      page: this.currentPage,
      limit: this.pageSize,
      sortBy: this.sortBy,
      sortDirection: this.sortDirection,
      search: this.searchValue,
    };

    this.userService
      .getUsers(params)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.dataSource.data = response.items;
          this.totalItems = response.totalItems;
          this.isLoading = false;
          this.cdr.detectChanges();
        },
        error: (error) => {
          console.error('Error loading users:', error);
          this.showErrorMessage('Failed to load users');
          this.isLoading = false;
        },
      });
  }

  /**
   * Handle pagination changes
   */
  onPageChange(event: PageEvent): void {
    this.pageSize = event.pageSize;
    this.currentPage = event.pageIndex + 1; // MatPaginator is 0-indexed
    this.loadUsers();
  }

  /**
   * Handle sort changes
   */
  onSortChange(sort: Sort): void {
    if (sort.active && sort.direction) {
      this.sortBy = sort.active;
      this.sortDirection = sort.direction as 'asc' | 'desc';
      this.currentPage = 1; // Reset to first page on sort
      this.loadUsers();
    }
  }

  /**
   * Handle search input
   */
  onSearchChange(event: Event): void {
    const searchTerm = (event.target as HTMLInputElement).value;
    this.searchSubject.next(searchTerm);
  }

  /**
   * Clear search
   */
  clearSearch(): void {
    this.searchValue = '';
    this.searchSubject.next('');
  }

  /**
   * View user details
   */
  viewUser(user: User): void {
    this.dialog.open(AdminUserManagementModelComponent, {
      data: { user, mode: 'view' },
      ariaLabel: 'View user details dialog',
      width: '600px',
    });
  }

  /**
   * Edit user
   */
  editUser(user: User): void {
    const dialogRef = this.dialog.open(AdminUserManagementModelComponent, {
      data: { user: { ...user }, mode: 'edit' },
      ariaLabel: 'Edit user dialog',
      width: '600px',
    });

    dialogRef.afterClosed().subscribe((result: User | undefined) => {
      if (result) {
        console.log(result, 'this is the user');
        this.userService.updateUser(result).subscribe({
          next: (updatedUser) => {
            // Update the specific user in the current view
            this.dataSource.data = this.dataSource.data.map((u) =>
              u.id === updatedUser.id ? updatedUser : u
            );
            this.showSuccessMessage('User updated successfully');
          },
          error: (error) => {
            this.showErrorMessage('Failed to update user');
          },
        });
      }
    });
  }

  /**
   * Create new user
   */
  createUser(): void {
    const dialogRef = this.dialog.open(AdminUserManagementModelComponent, {
      data: {
        user: {
          id: '',
          name: '',
          email: '',
          password: '',
          phone: '',
          role: UserRole.USER,
          isVerified: false,
          isBlocked: false,
          isFarmer: false,
          farmerRegId: '',
          experience: 0,
          qualification: '',
          expertise: [],
          awards: [],
          farmerStatus: null,
        },
        mode: 'create',
      },
      ariaLabel: 'Create user dialog',
      width: '600px',
    });

    dialogRef.afterClosed().subscribe((result: User | undefined) => {
      if (result) {
        this.userService.createUser(result).subscribe({
          next: () => {
            this.showSuccessMessage('User created successfully');
            // Reload to show new user
            this.loadUsers();
          },
          error: (error) => {
            this.showErrorMessage('Failed to create user');
          },
        });
      }
    });
  }

  /**
   * Toggle user block status
   */
  toggleBlock(user: User): void {
    const newStatus = !user.isBlocked;

    // Optimistic update
    const currentData = [...this.dataSource.data];
    const index = currentData.findIndex((u) => u.id === user.id);

    if (index !== -1) {
      currentData[index] = { ...currentData[index], isBlocked: newStatus };
      this.dataSource.data = currentData;
    }

    this.userService.blockUser(user, newStatus).subscribe({
      next: (updatedUser) => {
        // Confirm update with server response
        const data = [...this.dataSource.data];
        const idx = data.findIndex((u) => u.id === updatedUser.id);
        if (idx !== -1) {
          data[idx] = updatedUser;
          this.dataSource.data = data;
        }
        this.showSuccessMessage(
          `User ${newStatus ? 'blocked' : 'unblocked'} successfully`
        );
      },
      error: (error) => {
        // Revert on error
        this.loadUsers();
        this.showErrorMessage('Failed to update user status');
      },
    });
  }

  /**
   * Refresh data
   */
  refresh(): void {
    this.loadUsers();
  }

  /**
   * Show success message
   */
  private showSuccessMessage(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      panelClass: ['success-snackbar'],
    });
  }

  /**
   * Show error message
   */
  private showErrorMessage(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 5000,
      panelClass: ['error-snackbar'],
    });
  }
}
