import { ApiProperty } from '@nestjs/swagger';

export class CreateCandidateDto {
  @ApiProperty({
    description: 'The name of the candidate',
    required: true,
  })
  public name: string;
  @ApiProperty()
  public status: string;
  @ApiProperty()
  public email: string;
}
