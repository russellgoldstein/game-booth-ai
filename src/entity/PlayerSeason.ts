import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToOne, JoinColumn, Unique } from "typeorm";
import { Player } from "./Player";
import { FangraphsBattingStats } from "./FangraphsBattingStats";
import { FangraphsPitchingStats } from "./FangraphsPitchingStats";

@Entity('player_seasons')
@Unique(["playerId", "year"])
export class PlayerSeason {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ name: 'player_id' })
    playerId!: number;

    @Column({ name: 'year' })
    year!: number;

    @ManyToOne(() => Player)
    @JoinColumn({ name: 'player_id' })
    player!: Player;

    @OneToOne(
        () => FangraphsBattingStats,
        fangraphsBattingStats => fangraphsBattingStats.playerSeason,
        { eager: false }
    )
    fangraphsBattingStats!: FangraphsBattingStats;

    @OneToOne(
        () => FangraphsPitchingStats,
        fangraphsPitchingStats => fangraphsPitchingStats.playerSeason,
        { eager: false }
    )
    fangraphsPitchingStats!: FangraphsPitchingStats;
}
