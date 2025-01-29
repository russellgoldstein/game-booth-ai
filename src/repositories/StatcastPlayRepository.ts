import { EntityManager, Repository } from 'typeorm';
import { BatBallType, StatcastPlay } from '../entity/StatcastPlay';
import { IStatcastPlayRepository } from './interfaces/IStatcastPlayRepository';

export class StatcastPlayRepository implements IStatcastPlayRepository {
    private repository: Repository<StatcastPlay>;

    constructor(private entityManager: EntityManager) {
        this.repository = entityManager.getRepository(StatcastPlay);
    }
}
