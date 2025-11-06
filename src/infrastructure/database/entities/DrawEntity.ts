import { Entity, PrimaryColumn, Column, Index, CreateDateColumn } from 'typeorm';

@Entity('draws')
@Index(['contestNumber'], { unique: true })
@Index(['drawDate'])
export class DrawEntity {
  @PrimaryColumn({ type: 'int', unsigned: true })
  contestNumber: number;

  @Column({ type: 'date' })
  drawDate: Date;

  @Column({ type: 'simple-array' })
  numbers: number[];

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  constructor(contestNumber: number, drawDate: Date, numbers: number[]) {
    this.contestNumber = contestNumber;
    this.drawDate = drawDate;
    this.numbers = numbers;
    this.createdAt = new Date();
  }

  // Convert to domain entity
  toDomain(): { contestNumber: number; drawDate: Date; numbers: number[] } {
    return {
      contestNumber: this.contestNumber,
      drawDate: this.drawDate,
      numbers: this.numbers,
    };
  }

  // Create from domain entity
  static fromDomain(draw: { contestNumber: number; drawDate: Date; numbers: number[] }): DrawEntity {
    return new DrawEntity(draw.contestNumber, draw.drawDate, draw.numbers);
  }
}
