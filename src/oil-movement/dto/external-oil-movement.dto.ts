import { ApiProperty } from '@nestjs/swagger';

export class ExternalBatchATGDetailDto {
  @ApiProperty({ example: 'BATCH-001', nullable: true })
  batch_no?: string | null;

  @ApiProperty({ example: '2024-01-15T08:00:00Z', nullable: true })
  before_recorded_at: string | null;

  @ApiProperty({ example: '2024-01-15T12:00:00Z', nullable: true })
  after_recorded_at: string | null;

  @ApiProperty({ example: 35.5, nullable: true })
  api_before: number | null;

  @ApiProperty({ example: 35.2, nullable: true })
  api_after: number | null;

  @ApiProperty({ example: '2024-01-15T07:00:00Z', nullable: true })
  open_tank_date_before: string | null;

  @ApiProperty({ example: '2024-01-15T13:00:00Z', nullable: true })
  open_tank_date_after: string | null;

  @ApiProperty({ example: '2024-01-15T07:30:00Z', nullable: true })
  open_dispense_date_before: string | null;

  @ApiProperty({ example: '2024-01-15T12:30:00Z', nullable: true })
  open_dispense_date_after: string | null;

  @ApiProperty({ example: 32.0, nullable: true })
  temp_before: number | null;

  @ApiProperty({ example: 31.8, nullable: true })
  temp_after: number | null;

  @ApiProperty({ example: 10.5, nullable: true })
  level_before_m: number | null;

  @ApiProperty({ example: 8.2, nullable: true })
  level_after_m: number | null;

  @ApiProperty({ example: 52450.0, nullable: true })
  company_volume_before_liter: number | null;

  @ApiProperty({ example: 40950.0, nullable: true })
  company_volume_after_liter: number | null;

  @ApiProperty({ example: 11500.0, nullable: true })
  company_volume_diff_liter: number | null;

  @ApiProperty({ example: null, nullable: true })
  remark: string | null;
}

export class ExternalBatchFlushLinesDto {
  @ApiProperty({ example: 1, nullable: true })
  tank_id: number | null;

  @ApiProperty({ example: 'TK-001', nullable: true })
  tank_code: string | null;

  @ApiProperty({ example: 150.0, nullable: true })
  qty_atg_liter: number | null;

  @ApiProperty({ example: 148.5, nullable: true })
  qty_flowmeter_liter: number | null;

  @ApiProperty({ type: () => [ExternalBatchATGDetailDto], nullable: true })
  batch_detail: ExternalBatchATGDetailDto[] | null;
}

export class ExternalBatchATGPrimaryDto {
  @ApiProperty({ type: () => [ExternalBatchATGDetailDto], nullable: true })
  batch_detail: ExternalBatchATGDetailDto[] | null;
}

export class ExternalBatchATGDto {
  @ApiProperty({ type: () => ExternalBatchATGPrimaryDto })
  primary: ExternalBatchATGPrimaryDto;

  @ApiProperty({ type: () => ExternalBatchFlushLinesDto })
  flush_lines: ExternalBatchFlushLinesDto;
}

export class ExternalBatchFlowMeterDetailDto {
  @ApiProperty({ example: 'BATCH-001', nullable: true })
  batch_no?: string | null;

  @ApiProperty({ example: '2024-01-15T08:00:00Z', nullable: true })
  before_recorded_at: string | null;

  @ApiProperty({ example: '2024-01-15T12:00:00Z', nullable: true })
  after_recorded_at: string | null;

  @ApiProperty({ example: '2024-01-15T07:00:00Z', nullable: true })
  open_tank_date_before: string | null;

  @ApiProperty({ example: '2024-01-15T13:00:00Z', nullable: true })
  open_tank_date_after: string | null;

  @ApiProperty({ example: '2024-01-15T07:30:00Z', nullable: true })
  open_dispense_date_before: string | null;

  @ApiProperty({ example: '2024-01-15T12:30:00Z', nullable: true })
  open_dispense_date_after: string | null;

  @ApiProperty({ example: 35.5, nullable: true })
  api_before: number | null;

  @ApiProperty({ example: 35.2, nullable: true })
  api_after: number | null;

  @ApiProperty({ example: 90.5, nullable: true })
  avg_temp_f: number | null;

  @ApiProperty({ example: 0.9925, nullable: true })
  observed_temp_factor: number | null;

  @ApiProperty({ example: 0.991, nullable: true })
  standard_temp_factor_86f: number | null;

  @ApiProperty({ example: 100000, nullable: true })
  meter_before: number | null;

  @ApiProperty({ example: 124980, nullable: true })
  meter_after: number | null;

  @ApiProperty({ example: 1.00025, nullable: true })
  meter_factor: number | null;

  @ApiProperty({ example: 5, nullable: true })
  meter_factor_version_id: number | null;

  @ApiProperty({ example: 24986.25, nullable: true })
  volume_raw_liters: number | null;

  @ApiProperty({ example: 24780.0, nullable: true })
  volume_at_60f_liters: number | null;

  @ApiProperty({ example: 24980.0, nullable: true })
  volume_industry_std_liters: number | null;

  @ApiProperty({ example: null, nullable: true })
  remark: string | null;
}

export class ExternalBatchFlowMeterDto {
  @ApiProperty({ example: 'FM-001', nullable: true })
  flow_meter_code: string | null;

  @ApiProperty({ example: 24980.0, nullable: true })
  summary_liters: number | null;

  @ApiProperty({ type: () => [ExternalBatchFlowMeterDetailDto], nullable: true })
  batch_detail: ExternalBatchFlowMeterDetailDto[] | null;

  @ApiProperty({ type: () => ExternalBatchFlushLinesDto, nullable: true })
  flush_lines: ExternalBatchFlushLinesDto | null;
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

  @ApiProperty({ example: 25000.5, nullable: true })
  qty_atg_liter: number | null;

  @ApiProperty({ example: 24980.0, nullable: true })
  qty_flowmeter_liter: number | null;

  @ApiProperty({ example: true, nullable: true })
  is_flush_lines: boolean | null;

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

  @ApiProperty({
    description: 'ประเภทการเคลื่อนไหว — IN = รับเข้า, OUT = จ่ายออก',
    enum: ['IN', 'OUT'],
    example: 'IN',
  })
  transaction_type: 'IN' | 'OUT';

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

// ─── Header-level DTOs ───────────────────────────────────────────────────────

export class ExternalHeaderOilMovementDto {
  @ApiProperty({
    description: 'ref_document_id จาก trx_nm1_header',
    example: 'NM1-2024-00001',
  })
  ref_document_id: string;

  @ApiProperty({
    description: 'รายการ movement ทั้งหมดภายใต้ header นี้',
    type: () => [ExternalOilMovementDto],
  })
  movements: ExternalOilMovementDto[];
}

export class GetOilMovementByHeaderRequestDto {
  @ApiProperty({
    description: 'ref_document_id ของ trx_nm1_header ที่ต้องการดึง',
    example: ['NM1-2024-00001'],
    type: [String],
  })
  ref_document_id: string[];
}

export class GetOilMovementByHeaderResponseDto {
  @ApiProperty({ enum: ['success', 'fail', 'error'] })
  status: 'success' | 'fail' | 'error';

  @ApiProperty({ type: () => [ExternalHeaderOilMovementDto] })
  data: ExternalHeaderOilMovementDto[];
}

export class UpdateOilMovementByHeaderResponseDto {
  @ApiProperty({ enum: ['success', 'fail', 'error'] })
  status: 'success' | 'fail' | 'error';

  @ApiProperty({ example: [{ ref_document_id: 'NM1-2024-00001' }] })
  data: { ref_document_id: string }[];
}
