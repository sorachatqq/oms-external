import { ApiProperty } from '@nestjs/swagger';

export class ExternalBatchATGDetailDto {
  @ApiProperty({ example: 'BATCH-001' })
  batch_no: string;

  @ApiProperty({ example: '2024-01-15T08:00:00Z' })
  before_recorded_at: string;

  @ApiProperty({ example: '2024-01-15T12:00:00Z' })
  after_recorded_at: string;

  @ApiProperty({ example: 35.5 })
  api_before: number;

  @ApiProperty({ example: 35.2 })
  api_after: number;

  @ApiProperty({ example: 32.0 })
  temp_before: number;

  @ApiProperty({ example: 31.8 })
  temp_after: number;

  @ApiProperty({ example: 10.5 })
  level_before_m: number;

  @ApiProperty({ example: 8.2 })
  level_after_m: number;

  @ApiProperty({ example: 52500.0 })
  system_volume_before_liter: number;

  @ApiProperty({ example: 41000.0 })
  system_volume_after_liter: number;

  @ApiProperty({ example: 11500.0 })
  system_volume_diff_liter: number;

  @ApiProperty({ example: 52450.0 })
  company_volume_before_liter: number;

  @ApiProperty({ example: 40950.0 })
  company_volume_after_liter: number;

  @ApiProperty({ example: 11500.0 })
  company_volume_diff_liter: number;

  @ApiProperty({ example: null, nullable: true })
  remark: string | null;
}

export class ExternalBatchFlushLinesDto {
  @ApiProperty({ example: 1 })
  tank_id: number;

  @ApiProperty({ example: 'TK-001' })
  tank_code: string;

  @ApiProperty({ example: 150.0 })
  qty_atg_liter: number;

  @ApiProperty({ example: 148.5 })
  qty_flowmeter_liter: number;

  @ApiProperty({ type: () => [ExternalBatchATGDetailDto] })
  batch_detail: ExternalBatchATGDetailDto[];
}

export class ExternalBatchATGPrimaryDto {
  @ApiProperty({ type: () => [ExternalBatchATGDetailDto] })
  batch_detail: ExternalBatchATGDetailDto[];
}

export class ExternalBatchATGDto {
  @ApiProperty({ type: () => ExternalBatchATGPrimaryDto })
  primary: ExternalBatchATGPrimaryDto;

  @ApiProperty({ type: () => ExternalBatchFlushLinesDto })
  flush_lines: ExternalBatchFlushLinesDto;
}

export class ExternalBatchFlowMeterDetailDto {
  @ApiProperty({ example: 'BATCH-001' })
  batch_no: string;

  @ApiProperty({ example: '2024-01-15T08:00:00Z' })
  before_recorded_at: string;

  @ApiProperty({ example: '2024-01-15T12:00:00Z' })
  after_recorded_at: string;

  @ApiProperty({ example: 35.5 })
  api_before: number;

  @ApiProperty({ example: 35.2 })
  api_after: number;

  @ApiProperty({ example: 90.5 })
  avg_temp_f: number;

  @ApiProperty({ example: 0.9925 })
  observed_temp_factor: number;

  @ApiProperty({ example: 0.991 })
  standard_temp_factor_86f: number;

  @ApiProperty({ example: 100000 })
  meter_before: number;

  @ApiProperty({ example: 124980 })
  meter_after: number;

  @ApiProperty({ example: 1.00025 })
  meter_factor: number;

  @ApiProperty({ example: 5 })
  meter_factor_version_id: number;

  @ApiProperty({ example: 24986.25 })
  volume_raw_liters: number;

  @ApiProperty({ example: 24780.0 })
  volume_at_60f_liters: number;

  @ApiProperty({ example: 24980.0 })
  volume_industry_std_liters: number;

  @ApiProperty({ example: null, nullable: true })
  remark: string | null;
}

export class ExternalBatchFlowMeterDto {
  @ApiProperty({ example: 'FM-001' })
  flow_meter_code: string;

  @ApiProperty({ example: 24980.0 })
  summary_liters: number;

  @ApiProperty({ type: () => [ExternalBatchFlowMeterDetailDto] })
  batch_detail: ExternalBatchFlowMeterDetailDto[];
}

export class ExternalBatchDto {
  @ApiProperty({ type: () => ExternalBatchATGDto })
  atg: ExternalBatchATGDto;

  @ApiProperty({ type: () => ExternalBatchFlowMeterDto })
  flow_meter: ExternalBatchFlowMeterDto;
}

export class ExternalMeasurementTypeDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'ATG' })
  name: string;
}

export class ExternalMovementTankDto {
  @ApiProperty({ example: 'TK-001' })
  tank_code: string;

  @ApiProperty({ type: () => ExternalMeasurementTypeDto })
  measurement_type: ExternalMeasurementTypeDto;

  @ApiProperty({ example: 25000.5 })
  qty_atg_liter: number;

  @ApiProperty({ example: 24980.0 })
  qty_flowmeter_liter: number;

  @ApiProperty({ example: true })
  is_flush_lines: boolean;

  @ApiProperty({ type: () => ExternalBatchDto })
  batch: ExternalBatchDto;
}

export class ExternalOilMovementDto {
  @ApiProperty({
    description: 'operator_ref_no จาก trx_nm1_detail (nullable ได้)',
    example: '012604190022',
  })
  ref_code: string;

  @ApiProperty({
    description: 'trx_transaction_nm1_id — 1 movement = 1 txn = 1 tank',
    example: 1314,
  })
  movement_id: number;

  @ApiProperty({ type: () => [ExternalMovementTankDto] })
  movement_tank: ExternalMovementTankDto[];
}

export class GetOilMovementRequestDto {
  @ApiProperty({
    description: 'operator_ref_no ของ trx_nm1_detail ที่ต้องการดึง',
    example: ['012604190022', '012604190023'],
    type: [String],
  })
  ref_code: string[];
}

export class GetOilMovementResponseDto {
  @ApiProperty({ enum: ['success', 'fail', 'error'] })
  status: 'success' | 'fail' | 'error';

  @ApiProperty({ type: () => [ExternalOilMovementDto] })
  data: ExternalOilMovementDto[];
}

export class UpdateOilMovementResponseDto {
  @ApiProperty({ enum: ['success', 'fail', 'error'] })
  status: 'success' | 'fail' | 'error';

  @ApiProperty({ example: [{ ref_code: 'REF-2024-0001' }] })
  data: { ref_code: string }[];
}
