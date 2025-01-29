import { EntityManager, Repository } from 'typeorm';
import { BatBallType, StatcastPlay } from '../entity/StatcastPlay';
import { IStatcastPlayRepository } from './interfaces/IStatcastPlayRepository';

export class StatcastPlayRepository implements IStatcastPlayRepository {
    private repository: Repository<StatcastPlay>;

    constructor(private entityManager: EntityManager) {
        this.repository = this.entityManager.getRepository(StatcastPlay);
    }

    async findByHitterAndBatBallType(
        hitterPlayerSeasonId: number,
        year: number,
        bbType: BatBallType
    ): Promise<StatcastPlay[]> {
        return this.repository.find({
            where: {
                hitterPlayerSeasonId,
                game_year: year,
                bb_type: bbType,
            },
        });
    }

    async findDistinctTeamsByYear(year: number): Promise<string[]> {
        const result = await this.repository
            .createQueryBuilder('statcast_plays')
            .select('DISTINCT home_team')
            .where('game_year = :year', { year })
            .getRawMany();

        return result.map(item => item.home_team);
    }
}
