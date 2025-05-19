import { Component } from '@angular/core';
import { AdminNavBarComponent } from '../../../shared/components/nav-bar/admin-nav-bar/admin-nav-bar.component';
import {
  AdminManagementComponent,
  TableConfig,
} from '../../../shared/components/admin-management/admin-management.component';
import { CommonModule } from '@angular/common';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Community } from '../../../shared/models/community.model';
import {
  CommunityService,
  PaginatedResponse,
} from '../../../shared/services/admin/community.service';
import { PageEvent } from '@angular/material/paginator';
import { Sort } from '@angular/material/sort';

@Component({
  selector: 'app-admin-community-management',
  imports: [
    AdminManagementComponent,
    AdminNavBarComponent,
    CommonModule,
    MatSnackBarModule,
    AdminManagementComponent,
  ],
  templateUrl: './admin-community-management.component.html',
  styleUrl: './admin-community-management.component.scss',
})
export class AdminCommunityManagementComponent {
  communities: Community[] = [];
  isLoading: boolean = false;
  totalItems: number = 0;

  // Pagination and sorting state
  currentPage: number = 1;
  pageSize: number = 10;
  sortField: string = 'creationDate';
  sortDirection: 'asc' | 'desc' = 'desc';
  filterValue: string = '';

  // Table configuration
  tableConfig: TableConfig = {
    columns: [
      { name: 'imageUrl', label: 'Image', isVisible: true, type: 'image' },
      { name: 'name', label: 'Name', isVisible: true, sortable: true },
      { name: 'description', label: 'Description', isVisible: true },
      {
        name: 'createdAt',
        label: 'Created On',
        isVisible: true,
        sortable: true,
        type: 'date',
        format: (value) => new Date(value),
      },
      {
        name: 'membersCount',
        label: 'Members',
        isVisible: true,
        sortable: true,
        type: 'number',
      },
      {
        name: 'isActive',
        label: 'Status',
        isVisible: true,
        type: 'boolean',
      },
    ],
    pageSize: this.pageSize,
    pageSizeOptions: [5, 10, 25, 50],
    showPaginator: true,
    showFilter: true,
    filterPlaceholder: 'Search communities...',
    actionsColumn: {
      edit: true,
      delete: true,
      view: true,
      custom: [
        {
          label: 'Export',
          icon: 'file_download',
          action: 'export',
        },
        {
          label: 'Send Notification',
          icon: 'notifications',
          action: 'notify',
        },
      ],
    },
  };

  constructor(
    private communityService: CommunityService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadCommunities();

    this.communityService
      .getCommunities(1, 10, 'creationDate', 'desc', '') // Example parameters
      .subscribe({
        next: (response: PaginatedResponse<Community>) => {
          console.log('Communities Data:', response); // Log the entire response
          console.log('Communities List:', response.items); // Log just the communities array (adjust based on PaginatedResponse structure)
        },
        error: (error) => {
          console.error('Error fetching communities:', error); // Log any errors
        },
        complete: () => {
          console.log('Community data fetch completed'); // Optional: Log completion
        }
      });
    
  }

  loadCommunities(): void {
    this.isLoading = true;

    this.communityService
      .getCommunities(
        this.currentPage,
        this.pageSize,
        this.sortField,
        this.sortDirection,
        this.filterValue
      )
      .subscribe({
        next: (response: PaginatedResponse<Community>) => {
          this.communities = response.items;
          this.totalItems = response.totalItems;
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error loading communities:', error);
          this.showNotification('Failed to load communities');
          this.isLoading = false;
        },
      });
  }

  onPageChange(event: PageEvent): void {
    this.currentPage = event.pageIndex + 1;
    this.pageSize = event.pageSize;
    this.loadCommunities();
  }

  onSortChange(sort: Sort): void {
    this.sortField = sort.active || 'creationDate';
    this.sortDirection = (sort.direction as 'asc' | 'desc') || 'desc';
    this.loadCommunities();
  }

  onFilterChange(filter: string): void {
    this.filterValue = filter;
    this.currentPage = 1; // Reset to first page when filtering
    this.loadCommunities();
  }

  onCreateNew(): void {
    // This will be handled by the management table component
    // Dialog will emit the new community via rowAction event
  }

  onRowAction(event: { action: string; item: any }): void {
    const { action, item } = event;

    switch (action) {
      case 'create':
        this.createCommunity(item);
        break;
      case 'edit':
        this.updateCommunity(item);
        break;
      case 'delete':
        this.deleteCommunity(item);
        break;
      case 'view':
        this.viewCommunity(item);
        break;
      case 'export':
        this.exportCommunity(item);
        break;
      case 'notify':
        this.notifyCommunity(item);
        break;
      default:
        console.warn(`Unhandled action: ${action}`);
    }
  }

  createCommunity(community: Community): void {
    this.communityService.createCommunity(community).subscribe({
      next: () => {
        this.showNotification('Community created successfully');
        this.loadCommunities();
      },
      error: (error) => {
        console.error('Error creating community:', error);
        this.showNotification('Failed to create community');
      },
    });
  }

  updateCommunity(community: Community): void {
    if (!community.id) {
      this.showNotification('Community ID is missing');
      return;
    }

    this.communityService.updateCommunity(community.id, community).subscribe({
      next: () => {
        this.showNotification('Community updated successfully');
        this.loadCommunities();
      },
      error: (error) => {
        console.error('Error updating community:', error);
        this.showNotification('Failed to update community');
      },
    });
  }

  deleteCommunity(community: Community): void {
    if (!community.id) {
      this.showNotification('Community ID is missing');
      return;
    }

    this.communityService.deleteCommunity(community.id).subscribe({
      next: () => {
        this.showNotification('Community deleted successfully');
        this.loadCommunities();
      },
      error: (error) => {
        console.error('Error deleting community:', error);
        this.showNotification('Failed to delete community');
      },
    });
  }

  viewCommunity(community: Community): void {
    // Navigate to community details page or show in a modal
    console.log('View community details:', community);
    // For example:
    // this.router.navigate(['/communities', community._id]);
  }

  exportCommunity(community: Community): void {
    // Example of custom action
    console.log('Export community:', community);
    this.showNotification(`Exporting ${community.name} data...`);
    // Implement export functionality
  }

  notifyCommunity(community: Community): void {
    // Example of custom action
    console.log('Send notification to community:', community);
    this.showNotification(`Sending notification to ${community.name}...`);
    // Implement notification functionality
  }

  showNotification(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      horizontalPosition: 'right',
      verticalPosition: 'top',
    });
  }
}
