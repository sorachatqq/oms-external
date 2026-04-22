import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Post,
  Query,
} from '@nestjs/common';
import {
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Nm1Service } from './nm1.service';
import {
  ExternalCreateNm1Dto,
  ExternalCreateNm1ResponseDto,
  ExternalNm1MasterDataQueryDto,
  ExternalNm1ReferenceResponseDto,
  ExternalNm1SubModalQueryDto,
} from './dto/nm1-create.dto';

@ApiTags('NM1')
@Controller('nm1')
export class Nm1Controller {
  constructor(private readonly nm1Service: Nm1Service) {}

  @Get('master-data')
  @ApiOperation({
    summary: 'ดึง Master Data ก่อนสร้าง น.ม.1',
  })
  @ApiResponse({
    status: 200,
    type: ExternalNm1ReferenceResponseDto,
  })
  async getMasterData(
    @Query() query: ExternalNm1MasterDataQueryDto,
  ): Promise<ExternalNm1ReferenceResponseDto> {
    try {
      return await this.nm1Service.getMasterData(query);
    } catch (error: any) {
      throw new HttpException(
        { status: 'error', message: error.message ?? 'Internal server error' },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('sub-modal/products')
  @ApiOperation({
    summary: 'ดึงข้อมูลผลิตภัณฑ์สำหรับ sub-modal',
  })
  @ApiResponse({
    status: 200,
    type: ExternalNm1ReferenceResponseDto,
  })
  async getProducts(
    @Query() query: ExternalNm1SubModalQueryDto,
  ): Promise<ExternalNm1ReferenceResponseDto> {
    try {
      return await this.nm1Service.getProducts(query);
    } catch (error: any) {
      throw new HttpException(
        { status: 'error', message: error.message ?? 'Internal server error' },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('sub-modal/partners')
  @ApiOperation({
    summary: 'ดึงข้อมูลคู่ค้า (ต้นทาง/ปลายทาง) สำหรับ sub-modal',
  })
  @ApiResponse({
    status: 200,
    type: ExternalNm1ReferenceResponseDto,
  })
  async getPartners(
    @Query() query: ExternalNm1SubModalQueryDto,
  ): Promise<ExternalNm1ReferenceResponseDto> {
    try {
      return await this.nm1Service.getPartners(query);
    } catch (error: any) {
      throw new HttpException(
        { status: 'error', message: error.message ?? 'Internal server error' },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('sub-modal/tanks')
  @ApiOperation({
    summary: 'ดึงข้อมูลถังสำหรับ sub-modal',
  })
  @ApiResponse({
    status: 200,
    type: ExternalNm1ReferenceResponseDto,
  })
  async getTanks(
    @Query() query: ExternalNm1SubModalQueryDto,
  ): Promise<ExternalNm1ReferenceResponseDto> {
    try {
      return await this.nm1Service.getTanks(query);
    } catch (error: any) {
      throw new HttpException(
        { status: 'error', message: error.message ?? 'Internal server error' },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('sub-modal/meters')
  @ApiOperation({
    summary: 'ดึงข้อมูลมาตรวัดสำหรับ sub-modal',
  })
  @ApiResponse({
    status: 200,
    type: ExternalNm1ReferenceResponseDto,
  })
  async getMeters(
    @Query() query: ExternalNm1SubModalQueryDto,
  ): Promise<ExternalNm1ReferenceResponseDto> {
    try {
      return await this.nm1Service.getMeters(query);
    } catch (error: any) {
      throw new HttpException(
        { status: 'error', message: error.message ?? 'Internal server error' },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('create')
  @ApiOperation({
    summary: 'สร้างเอกสาร น.ม.1',
    description:
      'สร้างเอกสาร น.ม.1 พร้อม detail, partners และ product+meter lists — mode "save" = ส่งเอกสาร, "draft" = ฉบับร่าง',
  })
  @ApiBody({ type: ExternalCreateNm1Dto })
  @ApiResponse({ status: 201, type: ExternalCreateNm1ResponseDto })
  @ApiResponse({ status: 400, description: 'ข้อมูลไม่ถูกต้อง' })
  @ApiResponse({ status: 500, description: 'เกิดข้อผิดพลาดภายในระบบ' })
  async createNm1(
    @Body() body: ExternalCreateNm1Dto,
  ): Promise<ExternalCreateNm1ResponseDto> {
    if (!body.mode || !body.code_nm1_no || !body.nm1_detail) {
      throw new HttpException(
        { status: 'error', message: 'mode, code_nm1_no และ nm1_detail จำเป็นต้องระบุ' },
        HttpStatus.BAD_REQUEST,
      );
    }

    try {
      return await this.nm1Service.createNm1(body);
    } catch (error: any) {
      throw new HttpException(
        { status: 'error', message: error.message ?? 'Internal server error' },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
