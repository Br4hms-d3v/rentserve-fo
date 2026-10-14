import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject,
  OnInit,
} from '@angular/core';
import { UserService } from '../service/user-service';
import { ThemeService } from '../../../core/services/ThemeService';
import { NgClass } from '@angular/common';
import { UserRoleModel } from '../model/UserRoleModel';
import { TuiTable, TuiTableDirective } from '@taiga-ui/addon-table';
import { TuiChevron, TuiDataListWrapper, TuiPagination, TuiSelect } from '@taiga-ui/kit';
import {
  TuiButton,
  TuiDialogService,
  TuiDropdown,
  TuiIcon,
  TuiInput,
  TuiLabel,
  TuiTextfield,
} from '@taiga-ui/core';
import { FormsModule } from '@angular/forms';
import { PolymorpheusComponent } from '@taiga-ui/polymorpheus';
import { UserRole } from '../user-role/user-role';

@Component({
  selector: 'app-user-list',
  imports: [
    NgClass,
    FormsModule,
    TuiTable,
    TuiTableDirective,
    TuiPagination,
    TuiButton,
    TuiDropdown,
    TuiInput,
    TuiLabel,
    TuiTextfield,
    TuiChevron,
    TuiSelect,
    TuiDataListWrapper,
    TuiIcon,
  ],
  templateUrl: './user-list.html',
  styleUrl: './user-list.less',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserList implements OnInit {
  private _userService = inject(UserService); // Call the service to get a list of users
  private themeService = inject(ThemeService); // Call the service to change color theme
  private _cdr = inject(ChangeDetectorRef);

  isDarkMode = false; // Change theme from light to dark
  protected userRoleList: UserRoleModel[] = [];
  role = 'MEMBER';
  protected readonly roles = ['MEMBER', 'MODERATOR', 'ADMIN'];

  // Pagination
  protected index = 0;
  protected length = 0;
  protected size = 15;

  // Filter
  searchName = '';
  filteredUsersRole: UserRoleModel[] = [];
  protected sortAscending: boolean = true;

  ngOnInit() {
    this.usersRole();
    this.changeTheme();
  }

  protected usersRole() {
    this._userService.getUserRole(this.role).subscribe({
      next: (usersRole) => {
        this.userRoleList = usersRole.map((user, index) => ({
          position: index + 1,
          id: user.id,
          name: user.name,
          firstName: user.firstName,
          pseudo: user.pseudo,
          role: user.role,
          createdAt: user.createdAt,
        }));

        //All users are in this table filter
        this.filteredUsersRole = [...this.userRoleList];
        this.updatePagination();

        // Calculate the length for the size of table
        this.length = Math.ceil(this.filteredUsersRole.length / this.size);
        this._cdr.detectChanges();
      },
      error: (err) => {},
    });
  }

  // Change the role inside the dropdown
  protected onChangeRole(value: string) {
    if (!this.roles.includes(value)) {
      return;
    }

    this.role = value;
    this.index = 0;
    this.usersRole();
  }

  // Search only by name
  protected onSearchName(value: string) {
    this.searchName = value;
    this.index = 0;
    this.applyFilters();
  }

  // Filter and sort
  protected applyFilters() {
    const searchName = this.normalize(this.searchName.trim());

    this.filteredUsersRole = this.userRoleList
      .filter((user) => this.normalize(user.name).includes(searchName))
      .sort((a, b) => {
        const result = a.name.localeCompare(b.name, 'fr', { sensitivity: 'base' });
        return this.sortAscending ? result : -result;
      });

    this.updatePagination();
  }

  // Ignore the characters and accents
  private normalize(value: string): string {
    return value
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLocaleLowerCase('fr');
  }

  // Inverse the order alphabet
  protected sortByName(): void {
    this.sortAscending = !this.sortAscending;
    this.applyFilters();
  }

  protected paginationUSerRole(): UserRoleModel[] {
    const start = this.index * this.size;
    return this.filteredUsersRole.slice(start, start + this.size);
  }
  // Change the size of pagination
  updatePagination() {
    this.length = Math.ceil(this.filteredUsersRole.length / this.size);
  }

  changeTheme() {
    this.isDarkMode = this.themeService.isDarkMode(); // Get current theme
    this.themeService.darkMode$.subscribe((mode: boolean) => (this.isDarkMode = mode)); // Watch changes in dark mode (reactive)
  }

  // MODAL
  private readonly dialogs = inject(TuiDialogService);

  openRoleModal(event: MouseEvent, user: any): void {
    event.preventDefault();

    this.dialogs
      .open(new PolymorpheusComponent(UserRole), {
        label: 'Modifier le rôle de : ' +user.name ,
        size: 'm',
        data: user,
      })
      .subscribe(() =>{
          this.usersRole();
      });
  }
}
