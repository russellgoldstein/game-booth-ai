import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, Index, Unique } from "typeorm";
import { Player } from "./Player";
import { HandednessType } from "./StatcastPlay";

@Entity({ name: 'statcast_pitching_rates_handedness' })
@Unique(['pitcher', 'game_year', 'p_throws'])
export class StatcastPitchingRatesHandedness {
    @PrimaryGeneratedColumn()
    id!: number;

    @ManyToOne(() => Player)
    @JoinColumn({ name: 'pitcher', referencedColumnName: 'id' })
    pitcherPlayer!: Player;

    @Column({ nullable: false })
    @Index()
    pitcher!: number;

    @Column({ type: 'int', nullable: false })
    @Index()
    game_year!: number;

    @Column({
        type: 'enum',
        enum: HandednessType,
        nullable: false
    })
    @Index()
    p_throws!: HandednessType;

    @Column({ type: 'float', nullable: false })
    strikeout_rate!: number;

    @Column({ type: 'float', nullable: false })
    walk_rate!: number;

    @Column({ type: 'float', nullable: false })
    home_run_rate!: number;

    @Column({ type: 'float', nullable: false })
    ground_ball_rate!: number;

    @Column({ type: 'float', nullable: false })
    fly_ball_rate!: number;

    @Column({ type: 'float', nullable: false })
    line_drive_rate!: number;

    @Column({ type: 'int', nullable: false })
    total_batters_faced!: number;
}