import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, Index, Unique } from "typeorm";
import { PlayerSeason } from "./PlayerSeason";

@Entity({ name: 'mlb_team_players' })
@Unique(['playerSeasonId', 'team'])
@Index(['playerSeasonId'])
export class MlbTeamPlayer {
    @PrimaryGeneratedColumn()
    id!: number;

    @ManyToOne(() => PlayerSeason)
    @JoinColumn({ name: 'player_season_id' })
    playerSeason!: PlayerSeason;

    @Column({ name: 'player_season_id' })
    playerSeasonId!: number;

    @Column({ type: 'varchar', length: 3 })
    @Index()
    team!: string;
}
