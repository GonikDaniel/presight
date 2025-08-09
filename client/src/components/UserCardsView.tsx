import { VirtualizedUsersList } from './VirtualizedUsersList';
import type { QueryParams } from '../types/index';

interface UserCardsViewProps {
  filters: QueryParams;
}

export default function UserCardsView({ filters }: UserCardsViewProps) {
  return <VirtualizedUsersList filters={filters} />;
}
