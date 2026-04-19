import { Body, Controller, Post, Patch } from '@nestjs/common';
import {
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { OilMovementService } from './oil-movement.service';
import {
  ExternalOilMovementDto,
  GetOilMovementRequestDto,
  GetOilMovementResponseDto,
  UpdateOilMovementResponseDto,
} from './dto/external-oil-movement.dto';

@ApiTags('Oil Movement')
@Controller('oil-movements')
export class OilMovementController {
  constructor(
    private readonly oilMovementService: OilMovementService,
  ) {}

  @Post('get')
  @ApiOperation({
    summary: 'ดึงข้อมูลปริมาณน้ำมัน',
    description:
      'ดึงข้อมูล batch ทุก transaction ใน NM1 header — ref_code[] map กับ trx_nm1_header.ref_document_id',
  })
  @ApiBody({ type: GetOilMovementRequestDto })
  @ApiResponse({ status: 200, type: GetOilMovementResponseDto })
  async getOilMovements(@Body() body: GetOilMovementRequestDto) {
    return this.oilMovementService.getOilMovements(body.ref_code);
  }

  @Patch('update')
  @ApiOperation({
    summary: 'บันทึกข้อมูลปริมาณน้ำมัน',
    description:
      'ส่งข้อมูล batch ไปบันทึกใน web-api — รองรับหลาย movement พร้อมกัน, upsert ด้วย batch_no',
  })
  @ApiBody({ type: [ExternalOilMovementDto] })
  @ApiResponse({ status: 200, type: UpdateOilMovementResponseDto })
  async updateOilMovement(@Body() body: ExternalOilMovementDto[]) {
    return this.oilMovementService.updateOilMovement(body);
  }
}
