import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, Index, Unique } from "typeorm";
import { PlayerSeason } from "./PlayerSeason";

export enum StatcastEvent {
    STRIKEOUT = 'strikeout',
    FIELD_OUT = 'field_out',
    FIELD_ERROR = 'field_error',
    WALK = 'walk',
    SINGLE = 'single',
    FORCE_OUT = 'force_out',
    DOUBLE_PLAY = 'double_play',
    TRIPLE = 'triple',
    HOME_RUN = 'home_run',
    HIT_BY_PITCH = 'hit_by_pitch',
    INTENT_WALK = 'intent_walk',
    DOUBLE = 'double',
    GROUNDED_INTO_DOUBLE_PLAY = 'grounded_into_double_play',
    SAC_BUNT = 'sac_bunt',
    SAC_FLY = 'sac_fly',
    TRUNCATED_PA = 'truncated_pa',
    FIELDERS_CHOICE = 'fielders_choice',
    FIELDERS_CHOICE_OUT = 'fielders_choice_out',
    STRIKEOUT_DOUBLE_PLAY = 'strikeout_double_play',
    SAC_FLY_DOUBLE_PLAY = 'sac_fly_double_play',
    CATCHER_INTERF = 'catcher_interf',
    TRIPLE_PLAY = 'triple_play',
    SAC_BUNT_DOUBLE_PLAY = 'sac_bunt_double_play',
    STRIKEOUT_TRIPLE_PLAY = 'strikeout_triple_play'
}

export enum HandednessType {
    RIGHT = 'R',
    LEFT = 'L'
}

export enum BatBallType {
    GROUND_BALL = 'ground_ball',
    FLY_BALL = 'fly_ball',
    LINE_DRIVE = 'line_drive',
    POPUP = 'popup'
}

@Entity({ name: 'statcast_plays' })
@Unique(['game_pk', 'at_bat_number'])
@Index(["game_year", "home_team"])
@Index(["game_year", "away_team"])
export class StatcastPlay {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: 'varchar', nullable: true })
    pitch_type!: string;

    @Column({ type: 'date', nullable: false })
    game_date!: Date;

    @Column({ type: 'float', nullable: true })
    release_speed!: number;

    @Column({ type: 'float', nullable: true })
    release_pos_x!: number;

    @Column({ type: "float", nullable: true })
    release_pos_z!: number;

    @ManyToOne(() => PlayerSeason)
    @JoinColumn({ name: 'hitter_player_season_id', referencedColumnName: 'id' })
    hitterPlayerSeason!: PlayerSeason;

    @Column({ nullable: false })
    @Index()
    hitterPlayerSeasonId!: number;

    @ManyToOne(() => PlayerSeason)
    @JoinColumn({ name: 'pitcher_player_season_id', referencedColumnName: 'id' })
    pitcherPlayerSeason!: PlayerSeason;

    @Column({ nullable: false })
    @Index()
    pitcherPlayerSeasonId!: number;

    @Column({
        type: 'enum',
        enum: StatcastEvent,
        nullable: true
    })
    events!: StatcastEvent;

    @Column({ nullable: true })
    description!: string;

    @Column({ nullable: true })
    spin_dir!: string;

    @Column({ nullable: true })
    spin_rate_deprecated!: number;

    @Column({ nullable: true })
    break_angle_deprecated!: number;

    @Column({ nullable: true })
    break_length_deprecated!: number;

    @Column({ nullable: true })
    zone!: number;

    @Column({ nullable: true })
    game_type!: string;

    @Column({
        type: 'enum',
        enum: HandednessType,
        nullable: true
    })
    stand!: HandednessType;

    @Column({
        type: 'enum',
        enum: HandednessType,
        nullable: false
    })
    @Index()
    p_throws!: HandednessType;

    @Column({ nullable: false })
    @Index()
    home_team!: string;

    @Column({ nullable: false })
    @Index()
    away_team!: string;

    @Column({ nullable: true })
    type!: string;

    @Column({ nullable: true })
    hit_location!: number;

    @Column({
        type: 'enum',
        enum: BatBallType,
        nullable: true
    })
    bb_type!: BatBallType;

    @Column({ nullable: true })
    balls!: number;

    @Column({ nullable: true })
    strikes!: number;

    @Column({ type: 'int', nullable: false })
    @Index()
    game_year!: number;

    @Column({ type: "float", nullable: true })
    pfx_x!: number;

    @Column({ type: "float", nullable: true })
    pfx_z!: number;

    @Column({ type: "float", nullable: true })
    plate_x!: number;

    @Column({ type: "float", nullable: true })
    plate_z!: number;

    @Column({ nullable: true })
    on_3b!: number;

    @Column({ nullable: true })
    on_2b!: number;

    @Column({ nullable: true })
    on_1b!: number;

    @Column({ nullable: false })
    outs_when_up!: number;

    @Column({ nullable: false })
    @Index()
    inning!: number;

    @Column({ nullable: false })
    inning_topbot!: string;

    @Column({ type: "float", nullable: true })
    hc_x!: number;

    @Column({ type: "float", nullable: true })
    hc_y!: number;

    @Column({ nullable: true })
    fielder_2!: number;

    @Column({ nullable: true })
    umpire!: string;

    @Column({ nullable: true })
    sv_id!: string;

    @Column({ type: "float", nullable: true })
    vx0!: number;

    @Column({ type: "float", nullable: true })
    vy0!: number;

    @Column({ type: "float", nullable: true })
    vz0!: number;

    @Column({ type: "float", nullable: true })
    ax!: number;

    @Column({ type: "float", nullable: true })
    ay!: number;

    @Column({ type: "float", nullable: true })
    az!: number;

    @Column({ type: "float", nullable: true })
    sz_top!: number;

    @Column({ type: "float", nullable: true })
    sz_bot!: number;

    @Column({ nullable: true })
    hit_distance_sc!: number;

    @Column({ type: "float", nullable: true })
    launch_speed!: number;

    @Column({ type: "float", nullable: true })
    launch_angle!: number;

    @Column({ type: "float", nullable: true })
    effective_speed!: number;

    @Column({ nullable: true })
    release_spin_rate!: number;

    @Column({ type: "float", nullable: true })
    release_extension!: number;

    @Column({ nullable: false })
    game_pk!: number;

    @Column({ nullable: true })
    pitcher_1!: number;

    @Column({ nullable: true })
    fielder_2_1!: number;

    @Column({ nullable: true })
    fielder_3!: number;

    @Column({ nullable: true })
    fielder_4!: number;

    @Column({ nullable: true })
    fielder_5!: number;

    @Column({ nullable: true })
    fielder_6!: number;

    @Column({ nullable: true })
    fielder_7!: number;

    @Column({ nullable: true })
    fielder_8!: number;

    @Column({ nullable: true })
    fielder_9!: number;

    @Column({ type: "float", nullable: true })
    release_pos_y!: number;

    @Column({ type: "float", nullable: true })
    estimated_ba_using_speedangle!: number;

    @Column({ type: "float", nullable: true })
    estimated_woba_using_speedangle!: number;

    @Column({ type: "float", nullable: true })
    woba_value!: number;

    @Column({ nullable: true })
    woba_denom!: number;

    @Column({ type: "float", nullable: true })
    babip_value!: number;

    @Column({ type: "float", nullable: true })
    iso_value!: number;

    @Column({ nullable: true })
    launch_speed_angle!: number;

    @Column({ nullable: false })
    at_bat_number!: number;

    @Column({ nullable: false })
    pitch_number!: number;

    @Column({ nullable: false })
    home_score!: number;

    @Column({ nullable: false })
    away_score!: number;

    @Column({ nullable: true })
    bat_score!: number;

    @Column({ nullable: true })
    fld_score!: number;

    @Column({ nullable: true })
    post_away_score!: number;

    @Column({ nullable: true })
    post_home_score!: number;

    @Column({ nullable: true })
    post_bat_score!: number;

    @Column({ nullable: true })
    post_fld_score!: number;

    @Column({ nullable: true })
    if_fielding_alignment!: string;

    @Column({ nullable: true })
    of_fielding_alignment!: string;

    @Column({ nullable: true })
    spin_axis!: number;

    @Column({ type: "float", nullable: true })
    delta_home_win_exp!: number;

    @Column({ type: "float", nullable: true })
    delta_run_exp!: number;

    @Column({ type: "float", nullable: true })
    bat_speed!: number;

    @Column({ type: "float", nullable: true })
    swing_length!: number;
}
