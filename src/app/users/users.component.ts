import { Component, linkedSignal, resource, signal, effect, computed } from '@angular/core';
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

  // FIXED: No 'request' property - just read signal directly inside loader
  // Angular tracks it. Plus we force reload via effect below.
  usersResource = resource({
    loader: async () => {
      const term = this.search().toLowerCase(); // <-- signal read here
      await new Promise(r => setTimeout(r, 400)); // fake network delay

      if (!term) return users;
      return users.filter((u: any) => u.name.toLowerCase().includes(term));
    }
  });

  // This is the trick for your Angular version - reload resource when search changes
  constructor() {
    effect(() => {
      // We read search() here to track it
      this.search();
      // Then reload the resource
      this.usersResource.reload();
    });
  }

  filteredUsers = computed(() => this.usersResource.value() || []);
}