import { Connection } from 'typeorm';
import {
    FangraphsStatsRepository,
    PlayerRepository,
    PlayerSeasonRepository,
    StatcastPlayRepository
} from '../repositories';
import { FangraphsService } from './FangraphsService';

export class ServiceContainer {
    public fangraphsStatsRepository: FangraphsStatsRepository;
    public playerRepository: PlayerRepository;
    public playerSeasonRepository: PlayerSeasonRepository;
    public statcastPlayRepository: StatcastPlayRepository;
    public fangraphsService: FangraphsService;

    private static instance: ServiceContainer;

    private constructor(connection: Connection) {
        const entityManager = connection.manager;

        // Initialize repositories
        this.fangraphsStatsRepository = new FangraphsStatsRepository(entityManager);
        this.playerRepository = new PlayerRepository(entityManager);
        this.playerSeasonRepository = new PlayerSeasonRepository(entityManager);
        this.statcastPlayRepository = new StatcastPlayRepository(entityManager);
        this.fangraphsService = new FangraphsService(this.fangraphsStatsRepository);
    }

    public static initialize(connection: Connection): void {
        ServiceContainer.instance = new ServiceContainer(connection);
    }

    public static getInstance(): ServiceContainer {
        if (!ServiceContainer.instance) {
            throw new Error('ServiceContainer must be initialized before use');
        }
        return ServiceContainer.instance;
    }
}
