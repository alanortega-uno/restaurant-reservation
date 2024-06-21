import { TableState } from './tables/tables.reducer';
import { AuthenticationState } from './authentication/authentication.reducer';

export interface AppState {
  authentication: AuthenticationState;
  tables: TableState;
}
