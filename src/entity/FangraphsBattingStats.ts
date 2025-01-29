import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, Unique, OneToOne } from "typeorm";
import { PlayerSeason } from "./PlayerSeason";

@Entity()
@Unique(["playerSeasonId"])
export class FangraphsBattingStats {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ name: 'player_season_id' })
    playerSeasonId!: number;

    @OneToOne(
        () => PlayerSeason,
        playerSeason => playerSeason.fangraphsBattingStats,
        { onDelete: 'CASCADE' }
    )
    @JoinColumn({ name: 'player_season_id' })
    playerSeason!: PlayerSeason;

    @Column()
    Age!: number;

    @Column()
    G!: number;

    @Column()
    AB!: number;

    @Column()
    PA!: number;

    @Column()
    H!: number;

    @Column()
    "1B"!: number;

    @Column()
    "2B"!: number;

    @Column()
    "3B"!: number;

    @Column()
    HR!: number;

    @Column()
    R!: number;

    @Column()
    RBI!: number;

    @Column()
    BB!: number;

    @Column()
    IBB!: number;

    @Column()
    SO!: number;

    @Column()
    HBP!: number;

    @Column()
    SF!: number;

    @Column()
    SH!: number;

    @Column()
    GDP!: number;

    @Column()
    SB!: number;

    @Column()
    CS!: number;

    @Column({ type: "float" })
    AVG!: number;

    @Column()
    GB!: number;

    @Column()
    FB!: number;

    @Column()
    LD!: number;

    @Column()
    IFFB!: number;

    @Column()
    Pitches!: number;

    @Column()
    Balls!: number;

    @Column()
    Strikes!: number;

    @Column()
    IFH!: number;

    @Column()
    BU!: number;

    @Column()
    BUH!: number;

    @Column({ type: "float" })
    "BB%"!: number;

    @Column({ type: "float" })
    "K%"!: number;

    @Column({ type: "float" })
    "BB/K"!: number;

    @Column({ type: "float" })
    OBP!: number;

    @Column({ type: "float" })
    SLG!: number;

    @Column({ type: "float" })
    OPS!: number;

    @Column({ type: "float" })
    ISO!: number;

    @Column({ type: "float" })
    BABIP!: number;

    @Column({ type: "float" })
    "GB/FB"!: number;

    @Column({ type: "float" })
    "LD%"!: number;

    @Column({ type: "float" })
    "GB%"!: number;

    @Column({ type: "float" })
    "FB%"!: number;

    @Column({ type: "float" })
    "IFFB%"!: number;

    @Column({ type: "float" })
    "HR/FB"!: number;

    @Column({ type: "float" })
    "IFH%"!: number;

    @Column({ type: "float" })
    "BUH%"!: number;

    @Column({ type: "float" })
    wOBA!: number;

    @Column({ type: "float" })
    wRAA!: number;

    @Column({ type: "float" })
    wRC!: number;

    @Column({ type: "float" })
    Bat!: number;

    @Column({ type: "float" })
    Rep!: number;

    @Column({ type: "float" })
    Pos!: number;

    @Column({ type: "float" })
    RAR!: number;

    @Column({ type: "float" })
    WAR!: number;

    @Column({ type: "float" })
    Spd!: number;

    @Column()
    "wRC+"!: number;

    @Column({ type: "float" })
    WPA!: number;

    @Column({ type: "float" })
    "-WPA"!: number;

    @Column({ type: "float" })
    "+WPA"!: number;

    @Column({ type: "float" })
    RE24!: number;

    @Column({ type: "float" })
    REW!: number;

    @Column({ type: "float" })
    pLI!: number;

    @Column()
    PH!: number;

    @Column({ type: "float" })
    "WPA/LI"!: number;

    @Column({ type: "float" })
    Clutch!: number;

    @Column({ type: "float" })
    "O-Swing%"!: number;

    @Column({ type: "float" })
    "Z-Swing%"!: number;

    @Column({ type: "float" })
    "Swing%"!: number;

    @Column({ type: "float" })
    "O-Contact%"!: number;

    @Column({ type: "float" })
    "Z-Contact%"!: number;

    @Column({ type: "float" })
    "Contact%"!: number;

    @Column({ type: "float" })
    "Zone%"!: number;

    @Column({ type: "float" })
    "F-Strike%"!: number;

    @Column({ type: "float" })
    "SwStr%"!: number;

    @Column({ type: "float" })
    BsR!: number;

    @Column({ type: "float" })
    UBR!: number;

    @Column()
    "Age Rng"!: string;

    @Column({ type: "float" })
    Off!: number;

    @Column({ type: "float" })
    Lg!: number;

    @Column({ type: "float" })
    wGDP!: number;

    @Column({ type: "float" })
    "Pull%"!: number;

    @Column({ type: "float" })
    "Cent%"!: number;

    @Column({ type: "float" })
    "Oppo%"!: number;

    @Column({ type: "float" })
    "Soft%"!: number;

    @Column({ type: "float" })
    "Med%"!: number;

    @Column({ type: "float" })
    "Hard%"!: number;

    @Column()
    "BB%+"!: number;

    @Column()
    "K%+"!: number;

    @Column()
    "OBP+"!: number;

    @Column()
    "SLG+"!: number;

    @Column()
    "ISO+"!: number;

    @Column()
    "BABIP+"!: number;

    @Column()
    "LD+%"!: number;

    @Column()
    "GB%+"!: number;

    @Column()
    "FB%+"!: number;

    @Column()
    "HR/FB%+"!: number;

    @Column()
    "Pull%+"!: number;

    @Column()
    "Cent%+"!: number;

    @Column()
    "Oppo%+"!: number;

    @Column()
    "Soft%+"!: number;

    @Column()
    "Med%+"!: number;

    @Column()
    "Hard%+"!: number;

    @Column({ type: "float" })
    EV!: number;

    @Column({ type: "float" })
    LA!: number;

    @Column()
    Barrels!: number;

    @Column({ type: "float" })
    "Barrel%"!: number;

    @Column({ type: "float" })
    maxEV!: number;

    @Column()
    HardHit!: number;

    @Column({ type: "float" })
    "HardHit%"!: number;

    @Column()
    Events!: number;

    @Column({ type: "float" })
    "CStr%"!: number;

    @Column({ type: "float" })
    "CSW%"!: number;

    @Column({ type: "float" })
    xBA!: number;

    @Column({ type: "float" })
    xSLG!: number;

    @Column({ type: "float" })
    xwOBA!: number;

    @Column({ type: "float" })
    "L-WAR"!: number;
}
