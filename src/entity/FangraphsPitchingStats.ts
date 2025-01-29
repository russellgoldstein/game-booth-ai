import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, Unique, OneToOne } from "typeorm";
import { PlayerSeason } from "./PlayerSeason";
import { MlbTeamPlayer } from "./MlbTeamPlayer";

@Entity()
@Unique(["playerSeasonId"])
export class FangraphsPitchingStats {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ name: 'player_season_id' })
    playerSeasonId!: number;

    @OneToOne(
        () => PlayerSeason,
        playerSeason => playerSeason.fangraphsPitchingStats,
        { onDelete: 'CASCADE' }
    )
    @JoinColumn({ name: 'player_season_id' })
    playerSeason!: PlayerSeason;

    @Column()
    Age!: number;

    @Column()
    W!: number;

    @Column()
    L!: number;

    @Column({ type: "float" })
    WAR!: number;

    @Column({ type: "float" })
    ERA!: number;

    @Column()
    G!: number;

    @Column()
    GS!: number;

    @Column()
    CG!: number;

    @Column()
    ShO!: number;

    @Column()
    SV!: number;

    @Column()
    BS!: number;

    @Column({ type: "float" })
    IP!: number;

    @Column()
    TBF!: number;

    @Column()
    H!: number;

    @Column()
    R!: number;

    @Column()
    ER!: number;

    @Column()
    HR!: number;

    @Column()
    BB!: number;

    @Column()
    IBB!: number;

    @Column()
    HBP!: number;

    @Column()
    WP!: number;

    @Column()
    BK!: number;

    @Column()
    SO!: number;

    @Column()
    GB!: number;

    @Column()
    FB!: number;

    @Column()
    LD!: number;

    @Column()
    IFFB!: number;

    @Column()
    Balls!: number;

    @Column()
    Strikes!: number;

    @Column()
    Pitches!: number;

    @Column()
    RS!: number;

    @Column()
    IFH!: number;

    @Column()
    BU!: number;

    @Column()
    BUH!: number;

    @Column({ type: "float" })
    "K/9"!: number;

    @Column({ type: "float" })
    "BB/9"!: number;

    @Column({ type: "float" })
    "K/BB"!: number;

    @Column({ type: "float" })
    "H/9"!: number;

    @Column({ type: "float" })
    "HR/9"!: number;

    @Column({ type: "float" })
    AVG!: number;

    @Column({ type: "float" })
    WHIP!: number;

    @Column({ type: "float" })
    BABIP!: number;

    @Column({ type: "float" })
    "LOB%"!: number;

    @Column({ type: "float" })
    FIP!: number;

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

    @Column({ type: "float", name: "Starting-IP" })
    Starting!: number;

    @Column({ type: "float", name: "Start-IP" })
    "Start-IP"!: number;

    @Column({ type: "float", name: "Relieving-IP" })
    Relieving!: number;

    @Column({ type: "float", name: "Relief-IP" })
    "Relief-IP"!: number;

    @Column({ type: "float" })
    RAR!: number;

    @Column({ type: "float" })
    tERA!: number;

    @Column({ type: "float" })
    xFIP!: number;

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

    @Column({ type: "float" })
    inLI!: number;

    @Column({ type: "float" })
    gmLI!: number;

    @Column({ type: "float" })
    exLI!: number;

    @Column()
    Pulls!: number;

    @Column({ type: "float" })
    "WPA/LI"!: number;

    @Column({ type: "float" })
    Clutch!: number;

    @Column({ type: "float" })
    "FB% 2"!: number;

    @Column({ type: "float" })
    FBv!: number;

    @Column({ type: "float" })
    "SL%"!: number;

    @Column({ type: "float" })
    SLv!: number;

    @Column({ type: "float" })
    "CT%"!: number;

    @Column({ type: "float" })
    CTv!: number;

    @Column({ type: "float" })
    "CB%"!: number;

    @Column({ type: "float" })
    CBv!: number;

    @Column({ type: "float" })
    "CH%"!: number;

    @Column({ type: "float" })
    CHv!: number;

    @Column({ type: "float" })
    "SF%"!: number;

    @Column({ type: "float" })
    SFv!: number;

    @Column({ type: "float" })
    "KN%"!: number;

    @Column({ type: "float" })
    KNv!: number;

    @Column({ type: "float" })
    "XX%"!: number;

    @Column({ type: "float" })
    "PO%"!: number;

    @Column({ type: "float" })
    wFB!: number;

    @Column({ type: "float" })
    wSL!: number;

    @Column({ type: "float" })
    wCT!: number;

    @Column({ type: "float" })
    wCB!: number;

    @Column({ type: "float" })
    wCH!: number;

    @Column({ type: "float" })
    wSF!: number;

    @Column({ type: "float" })
    wKN!: number;

    @Column({ type: "float" })
    "wFB/C"!: number;

    @Column({ type: "float" })
    "wSL/C"!: number;

    @Column({ type: "float" })
    "wCT/C"!: number;

    @Column({ type: "float" })
    "wCB/C"!: number;

    @Column({ type: "float" })
    "wCH/C"!: number;

    @Column({ type: "float" })
    "wSF/C"!: number;

    @Column({ type: "float" })
    "wKN/C"!: number;

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

    @Column()
    HLD!: number;

    @Column()
    SD!: number;

    @Column()
    MD!: number;

    @Column({ type: "float" })
    "ERA-"!: number;

    @Column({ type: "float" })
    "FIP-"!: number;

    @Column({ type: "float" })
    "xFIP-"!: number;

    @Column({ type: "float" })
    "K%"!: number;

    @Column({ type: "float" })
    "BB%"!: number;

    @Column({ type: "float" })
    SIERA!: number;

    @Column({ type: "float" })
    Pace!: number;

    @Column({ type: "float" })
    "RA9-WAR"!: number;

    @Column({ type: "float" })
    "BIP-Wins"!: number;

    @Column({ type: "float" })
    "LOB-Wins"!: number;

    @Column({ type: "float" })
    "FDP-Wins"!: number;

    @Column()
    "Age Rng"!: string;

    @Column({ type: "float" })
    "K-BB%"!: number;

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

    @Column({ type: "float" })
    FRM!: number;

    @Column({ type: "float" })
    "K/9+"!: number;

    @Column({ type: "float" })
    "BB/9+"!: number;

    @Column({ type: "float" })
    "K/BB+"!: number;

    @Column({ type: "float" })
    "H/9+"!: number;

    @Column({ type: "float" })
    "HR/9+"!: number;

    @Column({ type: "float" })
    "AVG+"!: number;

    @Column({ type: "float" })
    "WHIP+"!: number;

    @Column({ type: "float" })
    "BABIP+"!: number;

    @Column({ type: "float" })
    "LOB%+"!: number;

    @Column({ type: "float" })
    "K%+"!: number;

    @Column({ type: "float" })
    "BB%+"!: number;

    @Column({ type: "float" })
    "LD%+"!: number;

    @Column({ type: "float" })
    "GB%+"!: number;

    @Column({ type: "float" })
    "FB%+"!: number;

    @Column({ type: "float" })
    "HR/FB%+"!: number;

    @Column({ type: "float" })
    "Pull%+"!: number;

    @Column({ type: "float" })
    "Cent%+"!: number;

    @Column({ type: "float" })
    "Oppo%+"!: number;

    @Column({ type: "float" })
    "Soft%+"!: number;

    @Column({ type: "float" })
    "Med%+"!: number;

    @Column({ type: "float" })
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
    "Stf+ FS"!: number;

    @Column({ type: "float" })
    "Loc+ FS"!: number;

    @Column({ type: "float" })
    "Pit+ FS"!: number;

    @Column({ type: "float" })
    "Stuff+"!: number;

    @Column({ type: "float" })
    "Location+"!: number;

    @Column({ type: "float" })
    "Pitching+"!: number;

    @Column({ type: "float" })
    "Stf+ FO"!: number;

    @Column({ type: "float" })
    "Loc+ FO"!: number;

    @Column({ type: "float" })
    "Pit+ FO"!: number;
}
