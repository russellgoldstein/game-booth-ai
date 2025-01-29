import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, Unique } from "typeorm";
import { PlayerSeason } from "./PlayerSeason";

@Entity('pitching_platoon_splits')
@Unique(["playerSeasonId", "splitType", "split"])
export class PitchingPlatoonSplits {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ name: 'player_season_id' })
    playerSeasonId!: number;

    @ManyToOne(() => PlayerSeason)
    @JoinColumn({ name: 'player_season_id' })
    playerSeason!: PlayerSeason;

    @Column({ name: 'split_type' })
    splitType!: string;

    @Column({ name: 'split' })
    split!: string;

    @Column({ type: 'int', nullable: true })
    G!: number;

    @Column({ type: 'int', nullable: true })
    PA!: number;

    @Column({ type: 'int', nullable: true })
    AB!: number;

    @Column({ type: 'int', nullable: true })
    R!: number;

    @Column({ type: 'int', nullable: true })
    H!: number;

    @Column({ type: 'int', nullable: true })
    doubles!: number;

    @Column({ type: 'int', nullable: true })
    triples!: number;

    @Column({ type: 'int', nullable: true })
    HR!: number;

    @Column({ type: 'int', nullable: true })
    SB!: number;

    @Column({ type: 'int', nullable: true })
    CS!: number;

    @Column({ type: 'int', nullable: true })
    BB!: number;

    @Column({ type: 'int', nullable: true })
    SO!: number;

    @Column({ name: 'SO_W', type: 'decimal', precision: 5, scale: 2, nullable: true })
    SOW!: number;

    @Column({ type: 'decimal', precision: 5, scale: 3, nullable: true })
    BA!: number;

    @Column({ type: 'decimal', precision: 5, scale: 3, nullable: true })
    OBP!: number;

    @Column({ type: 'decimal', precision: 5, scale: 3, nullable: true })
    SLG!: number;

    @Column({ type: 'decimal', precision: 5, scale: 3, nullable: true })
    OPS!: number;

    @Column({ type: 'int', nullable: true })
    TB!: number;

    @Column({ type: 'int', nullable: true })
    GDP!: number;

    @Column({ type: 'int', nullable: true })
    HBP!: number;

    @Column({ type: 'int', nullable: true })
    SH!: number;

    @Column({ type: 'int', nullable: true })
    SF!: number;

    @Column({ type: 'int', nullable: true })
    IBB!: number;

    @Column({ type: 'int', nullable: true })
    ROE!: number;

    @Column({ type: 'decimal', precision: 5, scale: 3, nullable: true })
    BAbip!: number;

    @Column({ name: 'tOPS_plus', type: 'int', nullable: true })
    tOPSPlus!: number;

    @Column({ name: 'sOPS_plus', type: 'int', nullable: true })
    sOPSPlus!: number;

    @Column({ type: 'int', nullable: true })
    singles!: number;
}