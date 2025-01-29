import { EntityManager, Repository } from 'typeorm';
import { PlayerSeason } from '../entity/PlayerSeason';
import { IPlayerSeasonRepository } from './interfaces/IPlayerSeasonRepository';

export class PlayerSeasonRepository implements IPlayerSeasonRepository {
    private repository: Repository<PlayerSeason>;

    constructor(private entityManager: EntityManager) {
        this.repository = entityManager.getRepository(PlayerSeason);
    }

    async findByIds(ids: number[]): Promise<PlayerSeason[]> {
        return this.repository.findByIds(ids);
    }
}
