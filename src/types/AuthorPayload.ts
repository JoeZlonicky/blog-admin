import type { JwtPayload } from 'jwt-decode';

interface AuthorPayload extends JwtPayload {
  id: string;
  username: string;
  firstName: string;
  lastName: string;
}

export type { AuthorPayload };
