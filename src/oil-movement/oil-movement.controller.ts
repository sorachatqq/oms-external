import { Body, Controller, Post, Patch, BadRequestException } from '@nestjs/common';
import {
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { OilMovementService } from './oil-movement.service';
import {
  ExternalOilMovementDto,
  ExternalHeaderOilMovementDto,
  GetOilMovementRequestDto,
  GetOilMovementResponseDto,
  GetOilMovementByHeaderRequestDto,
  GetOilMovementByHeaderResponseDto,
  UpdateOilMovementResponseDto,
  UpdateOilMovementByHeaderResponseDto,
} from './dto/external-oil-movement.dto';

@ApiTags('Oil Movement')
@Controller('oil-movements')
export class OilMovementController {
  constructor(
    private readonly oilMovementService: OilMovementService,
  ) {}

  // ─── Header-level (primary) ───────────────────────────────────────────────────

  @Post('get')
  @ApiOperation({
    summary: 'ดึงข้อมูลปริมาณน้ำมันระดับ Header',
    description:
      'ดึงข้อมูล batch ทุก transaction ใน NM1 header — ref_document_id[] map กับ trx_nm1_header.ref_document_id',
  })
  @ApiBody({ type: GetOilMovementByHeaderRequestDto })
  @ApiResponse({ status: 200, type: GetOilMovementByHeaderResponseDto })
  async getOilMovementsByHeader(
    @Body() body: GetOilMovementByHeaderRequestDto,
  ) {
    const refDocIds = body?.ref_document_id;
    if (!Array.isArray(refDocIds) || refDocIds.length === 0) {
      throw new BadRequestException('ref_document_id must be a non-empty array');
    }
    return this.oilMovementService.getOilMovementsByHeader(refDocIds);
  }

  @Patch('update')
  @ApiOperation({
    summary: 'บันทึกข้อมูลปริมาณน้ำมันระดับ Header',
    description:
      'ส่งข้อมูล batch จัดกลุ่มตาม ref_document_id ไปบันทึกใน web-api — รองรับหลาย header พร้อมกัน, upsert ด้วย batch_no',
  })
  @ApiBody({ type: [ExternalHeaderOilMovementDto] })
  @ApiResponse({ status: 200, type: UpdateOilMovementByHeaderResponseDto })
  async updateOilMovementByHeader(
    @Body() body: ExternalHeaderOilMovementDto[],
  ) {
    if (!Array.isArray(body) || body.length === 0) {
      throw new BadRequestException('body must be a non-empty array');
    }
    return this.oilMovementService.updateOilMovementByHeader(body);
  }

  // ─── Detail-level (by operator_ref_no) ───────────────────────────────────────

  @Post('detail/get')
  @ApiOperation({
    summary: 'ดึงข้อมูลปริมาณน้ำมันระดับ Detail',
    description:
      'ดึงข้อมูล batch ทุก transaction อ้างอิงจาก operator_ref_no — ref_code[] map กับ trx_nm1_detail.operator_ref_no',
  })
  @ApiBody({ type: GetOilMovementRequestDto })
  @ApiResponse({ status: 200, type: GetOilMovementResponseDto })
  async getOilMovements(@Body() body: GetOilMovementRequestDto) {
    const refCodes = body?.ref_code;
    if (!Array.isArray(refCodes) || refCodes.length === 0) {
      throw new BadRequestException('ref_code must be a non-empty array');
    }
    return this.oilMovementService.getOilMovements(refCodes);
  }

  @Patch('detail/update')
  @ApiOperation({
    summary: 'บันทึกข้อมูลปริมาณน้ำมันระดับ Detail',
    description:
      'ส่งข้อมูล batch ไปบันทึกใน web-api อ้างอิงจาก operator_ref_no — รองรับหลาย movement พร้อมกัน, upsert ด้วย batch_no',
  })
  @ApiBody({ type: [ExternalOilMovementDto] })
  @ApiResponse({ status: 200, type: UpdateOilMovementResponseDto })
  async updateOilMovement(@Body() body: ExternalOilMovementDto[]) {
    if (!Array.isArray(body) || body.length === 0) {
      throw new BadRequestException('body must be a non-empty array');
    }
    return this.oilMovementService.updateOilMovement(body);
  }
}
