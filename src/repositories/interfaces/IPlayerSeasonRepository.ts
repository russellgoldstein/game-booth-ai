export interface IPlayerSeasonRepository {
    findByIds(ids: number[]): Promise<PlayerSeason[]>;
}
