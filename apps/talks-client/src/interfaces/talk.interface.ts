import { User } from './user.interface';

export interface Talk {
  id: string;
  title: string;
  details: string;
  speakers?: User[];
  location: string;
}
