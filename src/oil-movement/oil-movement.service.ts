import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import {
  ExternalOilMovementDto,
  GetOilMovementResponseDto,
  UpdateOilMovementResponseDto,
} from './dto/external-oil-movement.dto';

@Injectable()
export class OilMovementService {
  private readonly logger = new Logger(OilMovementService.name);
  private readonly baseUrl: string;

  constructor(private readonly httpService: HttpService) {
    this.baseUrl =
      process.env.WEB_API_BASE_URL ?? 'http://localhost:3000';
  }

  async getOilMovements(
    refCodes: string[],
  ): Promise<GetOilMovementResponseDto> {
    const url = `${this.baseUrl}/api/oil-movements/get`;
    this.logger.log(`POST ${url} ref_codes=${refCodes.join(',')}`);

    const { data } = await firstValueFrom(
      this.httpService.post<GetOilMovementResponseDto>(url, {
        ref_code: refCodes,
      }),
    );

    return data;
  }

  async updateOilMovement(
    payloads: ExternalOilMovementDto[],
  ): Promise<UpdateOilMovementResponseDto> {
    const normalized = payloads.map((p) => this.normalizePayload(p));
    const url = `${this.baseUrl}/api/oil-movements/update`;
    this.logger.log(
      `PATCH ${url} ref_codes=${normalized.map((p) => p.ref_code).join(',')}`,
    );

    const { data } = await firstValueFrom(
      this.httpService.patch<UpdateOilMovementResponseDto>(url, normalized),
    );

    return data;
  }

  private normalizePayload(
    payload: ExternalOilMovementDto,
  ): ExternalOilMovementDto {
    return {
      ...payload,
      movement_tank: payload.movement_tank.map((tank) => ({
        ...tank,
        batch: {
          ...tank.batch,
          flow_meter: {
            ...tank.batch.flow_meter,
            flow_meter_code:
              tank.batch.flow_meter.flow_meter_code?.trim().toUpperCase() ?? '',
          },
        },
      })),
    };
  }
}
