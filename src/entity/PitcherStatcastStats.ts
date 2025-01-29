import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, Unique, Index } from "typeorm";
import { PlayerSeason } from "./PlayerSeason";
import { HandednessType } from "./StatcastPlay";

@Entity({ name: 'pitcher_statcast_stats' })
@Unique(['playerSeasonId', 'opponent_hand'])
@Index(['season'])
export class PitcherStatcastStats {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    @Index()
    playerSeasonId!: number;

    @ManyToOne(() => PlayerSeason)
    @JoinColumn({ name: 'playerSeasonId' })
    playerSeason!: PlayerSeason;

    @Column()
    season!: number;

    @Column({
        type: 'enum',
        enum: HandednessType
    })
    opponent_hand!: HandednessType;

    // Event rates
    @Column({ type: 'float', nullable: true })
    ground_ball_rate!: number;

    @Column({ type: 'float', nullable: true })
    fly_ball_rate!: number;

    @Column({ type: 'float', nullable: true })
    line_drive_rate!: number;

    @Column({ type: 'float', nullable: true })
    home_run_rate!: number;

    @Column({ type: 'float', nullable: true })
    walk_rate!: number;

    @Column({ type: 'float', nullable: true })
    strikeout_rate!: number;

    // Averages of other relevant columns
    @Column({ type: 'float', nullable: true })
    avg_launch_speed!: number;

    @Column({ type: 'float', nullable: true })
    avg_launch_angle!: number;

    @Column({ type: 'float', nullable: true })
    avg_release_speed!: number;

    @Column({ type: 'float', nullable: true })
    avg_spin_rate!: number;

    @Column({ type: 'float', nullable: true })
    avg_release_extension!: number;

    // Add other averages as needed

    @Column({ type: 'int' })
    total_plate_appearances!: number;

    @Column({ type: 'int' })
    balls_in_play!: number;
} 