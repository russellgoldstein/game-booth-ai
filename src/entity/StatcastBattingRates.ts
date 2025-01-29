import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, Index, Unique } from "typeorm";
import { Player } from "./Player";

@Entity({ name: 'statcast_batting_rates' })
@Unique(['batter', 'game_year'])
export class StatcastBattingRates {
    @PrimaryGeneratedColumn()
    id!: number;

    @ManyToOne(() => Player)
    @JoinColumn({ name: 'batter', referencedColumnName: 'id' })
    batterPlayer!: Player;

    @Column({ nullable: false })
    @Index()
    batter!: number;

    @Column({ type: 'int', nullable: false })
    @Index()
    game_year!: number;

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
    total_plate_appearances!: number;
}