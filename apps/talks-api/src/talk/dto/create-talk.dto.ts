import {
  IsDateString,
  IsNotEmpty,
  IsOptional,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateTalkDto {
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(100)
  title: string;

  @IsOptional()
  @MinLength(2)
  details: string;

  @IsOptional()
  location: string;

  @IsOptional()
  @IsDateString()
  date: string;
}
