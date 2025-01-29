import { Player } from '../../entity';

export interface IPlayerRepository {
    searchPlayers(firstName?: string, lastName?: string, limit?: number): Promise<Player[]>;
}
