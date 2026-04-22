import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ExternalNm1DetailDto {
  @ApiProperty({ example: '2026-03-21T17:10:00', description: 'วันเวลาที่ดำเนินการ' })
  operated_date: string;

  @ApiProperty({ example: 1, description: 'ID ประเภทการเคลื่อนไหว (รับเข้า/จ่ายออก)' })
  mst_movement_type_id: number;

  @ApiProperty({ example: 1, description: 'ID ประเภทภาษี' })
  mst_tax_payment_type_id: number;

  @ApiProperty({ example: 1, description: 'ID แบบรายการภาษี' })
  tax_inform_type_id: number;

  @ApiProperty({ example: 1, description: 'ID ประเภทขนส่ง' })
  mst_shipment_type_id: number;

  @ApiProperty({ example: 'เรือ ทางท่อ รถยนต์', description: 'รายละเอียดการขนส่ง' })
  shipment_desc: string;

  @ApiProperty({ example: '0126/001', required: false, description: 'เที่ยวที่' })
  code_shipment_no?: string;

  @ApiProperty({ example: '012604050039', required: false, description: 'เลขที่อ้างอิงจากระบบผู้ประกอบอุตสาหกรรม' })
  operator_ref_no?: string;

  @ApiProperty({ example: '0126', required: false, description: 'เลขที่แบบ' })
  form_no?: string;

  @ApiProperty({ example: '123131.00', required: false, description: 'ปริมาณรวม (ลิตร)' })
  total_volume_liter_qty?: string;
}

export class ExternalNm1PartnerCompanyDto {
  @ApiProperty({ example: 1 })
  mst_company_id: number;

  @ApiProperty({ example: '50.00' })
  volume_litter_percentage_qty: string;

  @ApiProperty({ example: '1000.00' })
  volume_litter_qty: string;
}

export class ExternalNm1PartnersDto {
  @ApiProperty({ example: 1, description: 'ID ผลิตภัณฑ์' })
  mst_product_id: number;

  @ApiProperty({ example: 1, description: 'Ref Product Version ID' })
  ref_product_version_id: number;

  @ApiProperty({ example: '100.00', description: 'ปริมาณรับเข้า (ลิตร)' })
  volume_in_qty: string;

  @ApiProperty({ type: () => [ExternalNm1PartnerCompanyDto], description: 'รายการบริษัทผู้รับน้ำมัน' })
  company_lists: ExternalNm1PartnerCompanyDto[];
}

export class ExternalNm1FlushLineDto {
  @ApiProperty({ example: 1 })
  flush_mst_product_id: number;

  @ApiProperty({ example: 1 })
  flush_ref_product_version_id: number;

  @ApiProperty({ example: 1 })
  flush_mst_tank_master_id: number;

  @ApiProperty({ example: 1 })
  flush_ref_tank_version_id: number;
}

export class ExternalNm1MeterEntryDto {
  @ApiProperty({ example: 1, description: 'ประเภทมาตรวัด' })
  mst_meter_type_id: number;

  @ApiProperty({ example: [101, 102], description: 'รายการเลขที่มาตรวัด' })
  trx_meter_ids: number[];
}

export class ExternalNm1ProductDetailDto {
  @ApiProperty({ example: 1, description: 'ID ผลิตภัณฑ์' })
  mst_product_id: number;

  @ApiProperty({ example: 1, description: 'Ref Product Version ID' })
  ref_product_version_id: number;

  @ApiProperty({ example: '100.00', description: 'ปริมาณที่จ่ายออก (ลิตร)' })
  volume_out_qty: string;

  @ApiProperty({ example: 1, description: 'ID ถังหลัก' })
  mst_tank_master_id: number;

  @ApiProperty({ example: 1, description: 'Ref Tank Version ID' })
  ref_tank_version_id: number;

  @ApiProperty({ example: 1, required: false, description: 'ID ประเภทมิเตอร์' })
  mst_meter_type_id?: number;

  @ApiProperty({ type: () => [ExternalNm1MeterEntryDto], description: 'รายการมาตรวัดแบ่งตามประเภท' })
  meter_groups: ExternalNm1MeterEntryDto[];

  @ApiProperty({ type: () => ExternalNm1FlushLineDto, required: false, description: 'ข้อมูล Flush Line (เฉพาะจ่ายออก)' })
  flush_line?: ExternalNm1FlushLineDto;
}

export class ExternalCreateNm1Dto {
  @ApiProperty({ enum: ['save', 'draft'], example: 'save', description: '"save" = ส่งเอกสาร, "draft" = ฉบับร่าง' })
  mode: 'save' | 'draft';

  @ApiProperty({ example: 'NM1260326001', description: 'เลขที่รับแบบ น.ม.1' })
  code_nm1_no: string;

  @ApiProperty({ example: '2026-03-23', description: 'วันที่เอกสาร' })
  document_date: string;

  @ApiProperty({ example: 1, description: 'รหัสผู้บันทึกคำร้อง' })
  recorded_by_user_id: number;

  @ApiProperty({ example: 'สุรียะ แก้วนิล', description: 'ชื่อผู้บันทึกคำร้อง' })
  recorded_by_user_name: string;

  @ApiProperty({ example: '-', required: false, description: 'หมายเหตุ' })
  remark?: string;

  @ApiProperty({ type: () => ExternalNm1DetailDto, description: 'ข้อมูล Detail น.ม.1' })
  nm1_detail: ExternalNm1DetailDto;

  @ApiProperty({ type: () => ExternalNm1PartnersDto, description: 'ข้อมูล Partner' })
  nm1_partners: ExternalNm1PartnersDto;

  @ApiProperty({ type: () => [ExternalNm1ProductDetailDto], description: 'รายการ Tank+Meter แบ่งตามประเภท' })
  nm1_product_detail_lists: ExternalNm1ProductDetailDto[];
}

export class ExternalCreateNm1ResponseDto {
  @ApiProperty({ enum: ['success', 'error'] })
  status: 'success' | 'error';

  @ApiProperty()
  data?: any;

  @ApiProperty({ required: false })
  message?: string;
}

export class ExternalNm1MasterDataQueryDto {
  @ApiPropertyOptional({
    enum: ['IN', 'OUT'],
    description:
      'ระบุเพื่อดึง tax type เฉพาะทิศทาง ถ้าไม่ส่งจะได้ทั้ง IN และ OUT',
  })
  tax_type?: 'IN' | 'OUT';
}

export class ExternalNm1SubModalQueryDto {
  @ApiPropertyOptional({ example: 1 })
  page?: number;

  @ApiPropertyOptional({ example: 10 })
  per_page?: number;

  @ApiPropertyOptional({
    example: '[{"field":"name","search":"ดีเซล"}]',
  })
  fields?: string;

  @ApiPropertyOptional({ example: 'name' })
  sort_by?: string;

  @ApiPropertyOptional({ enum: ['asc', 'desc'], example: 'asc' })
  sort_order?: 'asc' | 'desc';

  @ApiPropertyOptional({
    example: 1,
    description:
      'company id สำหรับ endpoint product manager scope',
  })
  company_id?: number;
}

export class ExternalNm1ReferenceResponseDto {
  @ApiProperty({ enum: ['success', 'error'] })
  status: 'success' | 'error';

  @ApiProperty()
  data: any;

  @ApiPropertyOptional()
  opts?: any;

  @ApiPropertyOptional()
  message?: string;
}
