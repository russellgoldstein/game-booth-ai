import { Entity, Column, PrimaryGeneratedColumn, Index } from 'typeorm';

export enum BattingSide {
  LEFT = 'L',
  RIGHT = 'R',
  SWITCH = 'S'
}

export enum ThrowingHand {
  LEFT = 'L',
  RIGHT = 'R',
  SWITCH = 'S'
}

@Entity({ name: 'players' })
export class Player {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ nullable: true })
  @Index({ unique: true })
  key_mlbam!: number;

  @Column()
  name_last!: string;

  @Column()
  name_first!: string;

  @Column({ nullable: true })
  @Index({ unique: true })
  key_retro!: string;

  @Column({ nullable: true })
  @Index({ unique: true })
  key_bbref!: string;

  @Column({ nullable: true })
  @Index({ unique: true })
  key_fangraphs!: number;

  @Column({ type: 'float', nullable: true })
  @Index()
  mlb_played_first!: number;

  @Column({ type: 'float', nullable: true })
  @Index()
  mlb_played_last!: number;

  @Column({
    type: 'enum',
    enum: BattingSide,
    nullable: true
  })
  bats!: BattingSide;

  @Column({
    type: 'enum',
    enum: ThrowingHand,
    nullable: true
  })
  throws!: ThrowingHand;
}
