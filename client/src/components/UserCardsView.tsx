import { VirtualizedUsersList } from './VirtualizedUsersList';
import type { QueryParams } from '../types/index';

interface UserCardsViewProps {
  filters: QueryParams;
}

export function UserCardsView({ filters }: UserCardsViewProps) {
  return <VirtualizedUsersList filters={filters} />;
}
