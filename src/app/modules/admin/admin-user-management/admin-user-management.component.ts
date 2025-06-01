import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  OnInit,
  ViewChild,
} from '@angular/core';
import { AdminNavBarComponent } from '../../../shared/components/nav-bar/admin-nav-bar/admin-nav-bar.component';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import {
  MatTable,
  MatTableDataSource,
  MatTableModule,
} from '@angular/material/table';
import { User } from '../../../shared/models/user.model';
import { UserService } from '../../../shared/services/admin/user.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { AdminUserManagementModelComponent } from './admin-user-management-model/admin-user-management-model.component';
import { UserRole } from '../../../shared/models/user-role';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-admin-user-management',
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
  ],
  templateUrl: './admin-user-management.component.html',
  styleUrl: './admin-user-management.component.scss',
})
export class AdminUserManagementComponent implements OnInit, AfterViewInit {
  @ViewChild(MatTable) table!: MatTable<User>;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  displayedColumns: string[] = [
    'name',
    'email',
    'role',
    'view',
    'edit',
    'block',
  ];
  dataSource = new MatTableDataSource<User>([]);
  filteredValue: string = '';
  isLoading: boolean = false;

  constructor(
    private userService: UserService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private cdr: ChangeDetectorRef
  ) {
    this.dataSource.filterPredicate = this.customFilter;
  }

  ngOnInit(): void {
    this.loadUsers();
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  /* Load User */
  loadUsers(): void {
    this.isLoading = true;
    this.userService.getUsers().subscribe({
      next: (transformedUsers) => {
        console.log(transformedUsers, 'this is transformed users');
        this.dataSource.data = transformedUsers;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading the user', error);
        this.isLoading = false;
      },
    });
  }

  /* View, Edit, Create, Block Users */
  viewUser(user: User): void {
    this.dialog.open(AdminUserManagementModelComponent, {
      data: { user: user, mode: 'view' },
      ariaLabel: 'View user details dialog',
      width: '600px',
    });
  }

  editUser(user: User) {
    const dialogRef = this.dialog.open(AdminUserManagementModelComponent, {
      data: { user: { ...user }, mode: 'edit' },
      ariaLabel: 'Edit user dialog',
      width: '600px',
    });

    dialogRef.afterClosed().subscribe((result: User | undefined) => {
      if (result) {
        this.userService.updateUser(result).subscribe({
          next: (updatedUser) => {
            console.log('this is the updated user', updatedUser);
            console.log('this is the updated user id', updatedUser.id);

            this.dataSource.data = this.dataSource.data.map((u) =>
              u.id === updatedUser.id ? updatedUser : u
            );

            this.cdr.detectChanges();
            this.table.renderRows();

            this.snackBar.open('Successfully created user', 'Close', {
              duration: 10000,
              panelClass: ['success-snackbar'],
            });
          },
          error: (error) => {
            this.snackBar.open('Error updating the user', 'Close', {
              duration: 5000,
              panelClass: ['error-snackbar'],
            });
          },
        });
      }
    });
  }

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
            this.dataSource.data = [...this.dataSource.data, result];

            this.snackBar.open('User Created Successfully', 'Close', {
              duration: 3000,
            });
          },
          error: (error) => {
            this.snackBar.open('Error in creating user', 'Close', {
              duration: 5000,
            });
          },
        });
      }
    });
  }

  toggleBlock(user: User) {
    console.log('thisis iuser', user, 'ddddddddddd', user.id);
    const newStatus = !user.isBlocked;

    const currentData = this.dataSource.data;
    const index = currentData.findIndex((u) => u.id === user.id);

    if (index !== -1) {
      currentData[index] = { ...user, isBlocked: newStatus };
      this.dataSource.data = [...currentData];
    }

    this.userService.blockUser(user, newStatus).subscribe({
      next: (updatedUser) => {
        const currentData = this.dataSource.data;
        const index = currentData.findIndex((u) => u.id === updatedUser.id);

        if (index !== -1) {
          currentData[index] = updatedUser;

          this.dataSource.data = [...currentData];
          // this.cdr.detectChanges()
        }
      },
      error: (error) => console.error('Error toggling block user', error),
      complete: () => console.log('Succfully blocked the user'),
    });
  }

  /* Filter */
  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.filteredValue = filterValue;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  /* Custom Filter for Case-Insensitive Search */
  customFilter(data: User, filter: string): boolean {
    let searchString = filter.toLowerCase();
    return (
      data.name.toLowerCase().includes(searchString) ||
      data.email.toLowerCase().includes(searchString) ||
      data.role.toLowerCase().includes(searchString)
    );
  }
}
