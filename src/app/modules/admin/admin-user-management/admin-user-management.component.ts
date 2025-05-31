import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { AdminNavBarComponent } from '../../../shared/components/nav-bar/admin-nav-bar/admin-nav-bar.component';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { User } from '../../../shared/models/user.model';
import { UserService } from '../../../shared/services/admin/user.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

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
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  displayedColumns: string[] = ['name', 'email', 'role', 'edit', 'block'];
  dataSource = new MatTableDataSource<User>([]);
  filteredValue: string = '';
  isLoading: boolean = false;

  constructor(private userService: UserService) {
    this.dataSource.filterPredicate = this.customFilter
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
      next: (users) => {
        this.dataSource.data = users;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading the user', error);
        this.isLoading = false;
      },
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

  /* Create, Edit, Block Users */
  toggleBlock(user: User) {}
  editUser(user: User){};
}
