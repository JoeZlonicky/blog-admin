import type { JwtPayload } from 'jwt-decode';

interface AuthorPayload extends JwtPayload {
  id: number;
  username: string;
  firstName: string;
  lastName: string;
}

export type { AuthorPayload };
