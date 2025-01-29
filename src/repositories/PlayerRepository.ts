import { EntityManager, Repository } from 'typeorm';
import { Player } from '../entity/Player';
import { IPlayerRepository } from './interfaces/IPlayerRepository';

export class PlayerRepository implements IPlayerRepository {
    private repository: Repository<Player>;

    constructor(private entityManager: EntityManager) {
        this.repository = this.entityManager.getRepository(Player);
    }

    async searchPlayers(firstName?: string, lastName?: string, limit: number = 10): Promise<Player[]> {
        const queryBuilder = this.repository.createQueryBuilder('player');

        if (firstName && firstName !== '') {
            queryBuilder.orWhere('player.first_name LIKE :firstName', { firstName: `%${firstName}%` });
        }

        if (lastName && lastName !== '') {
            queryBuilder.orWhere('player.last_name LIKE :lastName', { lastName: `%${lastName}%` });
        }

        return queryBuilder.limit(limit).getMany();
    }
}