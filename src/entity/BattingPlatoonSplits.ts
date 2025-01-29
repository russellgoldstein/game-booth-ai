import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, Unique } from "typeorm";
import { PlayerSeason } from "./PlayerSeason";

@Entity('batting_platoon_splits')
@Unique(["playerSeasonId", "splitType", "split"])
export class BattingPlatoonSplits {
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
    GS!: number;

    @Column({ type: 'int', nullable: true })
    PA!: number;

    @Column({ type: 'int', nullable: true })
    AB!: number;

    @Column({ type: 'int', nullable: true })
    R!: number;

    @Column({ type: 'int', nullable: true })
    H!: number;

    @Column({ type: 'int', nullable: true })
    doubles!: number; // Named 'doubles' since '2B' is not a valid property name

    @Column({ type: 'int', nullable: true })
    triples!: number; // Named 'triples' since '3B' is not a valid property name

    @Column({ type: 'int', nullable: true })
    HR!: number;

    @Column({ type: 'int', nullable: true })
    RBI!: number;

    @Column({ type: 'int', nullable: true })
    SB!: number;

    @Column({ type: 'int', nullable: true })
    CS!: number;

    @Column({ type: 'int', nullable: true })
    BB!: number;

    @Column({ type: 'int', nullable: true })
    SO!: number;

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

    @Column({ name: 'singles', type: 'int', nullable: true })
    singles!: number;
}