import { Component, linkedSignal, resource, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { users, User } from '../data/users';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss'
})
export class UsersComponent {
  search = signal('');
  // Using resource() to fetch user data
  usersResource = resource({
    loader: async () => {
      // Simulate async operation (e.g., API call)
      await new Promise(resolve => setTimeout(resolve, 100));
      return users;
    }
  });

  protected trackById(index: number, user: User): number {
    return user.id;
  }

  filteredUsers = linkedSignal(() => {
    const users = this.usersResource.value() || [];
    const term = this.search().toLowerCase();
    return users.filter((u: any) => u.name.toLowerCase().includes(term));
  });
}
