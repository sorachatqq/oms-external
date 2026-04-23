import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import {
  ExternalBatchATGDetailDto,
  ExternalBatchFlowMeterDetailDto,
  ExternalOilMovementDto,
  ExternalHeaderOilMovementDto,
  GetOilMovementResponseDto,
  GetOilMovementByHeaderResponseDto,
  UpdateOilMovementResponseDto,
  UpdateOilMovementByHeaderResponseDto,
} from './dto/external-oil-movement.dto';

@Injectable()
export class OilMovementService {
  private readonly logger = new Logger(OilMovementService.name);
  private readonly baseUrl: string;

  constructor(private readonly httpService: HttpService) {
    this.baseUrl =
      process.env.WEB_API_BASE_URL ?? 'http://localhost:3000';
  }

  // ─── Header-level (primary) ───────────────────────────────────────────────────

  async getOilMovementsByHeader(
    refDocIds: string[],
  ): Promise<GetOilMovementByHeaderResponseDto> {
    const url = `${this.baseUrl}/api/oil-movements/get`;
    this.logger.log(
      `POST ${url} ref_document_ids=${refDocIds.join(',')}`,
    );

    const { data } = await firstValueFrom(
      this.httpService.post<GetOilMovementByHeaderResponseDto>(url, {
        ref_document_id: refDocIds,
      }),
    );

    return data;
  }

  async updateOilMovementByHeader(
    payloads: ExternalHeaderOilMovementDto[],
  ): Promise<UpdateOilMovementByHeaderResponseDto> {
    const allMovements = payloads.flatMap((p) => p.movements);
    this.validatePayload(allMovements);
    const normalized = payloads.map((p) => ({
      ...p,
      movements: p.movements.map((m) =>
        this.normalizeMovement(m),
      ),
    }));
    const url = `${this.baseUrl}/api/oil-movements/update`;
    this.logger.log(
      `PATCH ${url} ref_document_ids=${normalized.map((p) => p.ref_document_id).join(',')}`,
    );

    const { data } = await firstValueFrom(
      this.httpService.patch<UpdateOilMovementByHeaderResponseDto>(
        url,
        normalized,
      ),
    );

    return data;
  }

  // ─── Detail-level (by operator_ref_no) ───────────────────────────────────────

  async getOilMovements(
    refCodes: string[],
  ): Promise<GetOilMovementResponseDto> {
    const url = `${this.baseUrl}/api/oil-movements/detail/get`;
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
    this.validatePayload(payloads);
    const normalized = payloads.map((p) =>
      this.normalizeMovement(p),
    );
    const url = `${this.baseUrl}/api/oil-movements/detail/update`;
    this.logger.log(
      `PATCH ${url} ref_codes=${normalized.map((p) => p.ref_code).join(',')}`,
    );

    const { data } = await firstValueFrom(
      this.httpService.patch<UpdateOilMovementResponseDto>(
        url,
        normalized,
      ),
    );

    return data;
  }

  // ─── Helpers ─────────────────────────────────────────────────────────────────

  private validatePayload(movements: ExternalOilMovementDto[]): void {
    const errors: string[] = [];

    const isPlaceholderATG = (d: ExternalBatchATGDetailDto): boolean =>
      d.before_recorded_at == null &&
      d.after_recorded_at == null &&
      d.api_before == null &&
      d.api_after == null &&
      d.temp_before == null &&
      d.temp_after == null &&
      d.level_before_m == null;

    const isPlaceholderFM = (d: ExternalBatchFlowMeterDetailDto): boolean =>
      d.before_recorded_at == null &&
      d.after_recorded_at == null &&
      d.api_before == null &&
      d.api_after == null &&
      d.avg_temp_f == null &&
      d.meter_before == null &&
      d.meter_after == null;

    const checkLevelDirection = (
      levelBefore: number | null | undefined,
      levelAfter: number | null | undefined,
      transactionType: 'IN' | 'OUT',
      context: string,
    ): void => {
      if (levelBefore == null || levelAfter == null) return;
      if (transactionType === 'IN' && levelAfter <= levelBefore) {
        errors.push(
          `${context}: level_after_m — ระดับน้ำมันหลังรับเข้าต้องมากกว่าก่อนรับเข้า`,
        );
      }
      if (transactionType === 'OUT' && levelAfter >= levelBefore) {
        errors.push(
          `${context}: level_after_m — ระดับน้ำมันหลังจ่ายออกต้องน้อยกว่าก่อนจ่ายออก`,
        );
      }
    };

    const checkDateOrder = (
      before: string | null | undefined,
      after: string | null | undefined,
      fieldLabel: string,
      context: string,
    ): void => {
      if (before == null || after == null) return;
      const bTs = new Date(before).getTime();
      const aTs = new Date(after).getTime();
      if (isNaN(bTs) || isNaN(aTs)) return;
      if (aTs <= bTs) {
        errors.push(
          `${context}: ${fieldLabel} — "after" must be strictly greater than "before"`,
        );
      }
    };

    for (const movement of movements) {
      const ctx = `movement ref_code="${movement.ref_code}"`;
      for (const tank of movement.movement_tank) {
        const tankCtx = `${ctx} tank="${tank.tank_code}"`;

        // ─── ATG primary batches ───────────────────────────────────
        const atgDetails = tank.batch.atg.primary.batch_detail ?? [];
        for (let i = 0; i < atgDetails.length; i++) {
          const d = atgDetails[i];
          if (isPlaceholderATG(d)) continue;
          const batchCtx = `${tankCtx} ATG batch[${i}]`;

          const atgRequired: Array<[keyof ExternalBatchATGDetailDto, string]> = [
            ['before_recorded_at', 'before_recorded_at'],
            ['after_recorded_at', 'after_recorded_at'],
            ['open_tank_date_before', 'open_tank_date_before'],
            ['open_tank_date_after', 'open_tank_date_after'],
            ['open_dispense_date_before', 'open_dispense_date_before'],
            ['open_dispense_date_after', 'open_dispense_date_after'],
            ['api_before', 'api_before'],
            ['api_after', 'api_after'],
            ['temp_before', 'temp_before'],
            ['temp_after', 'temp_after'],
            ['level_before_m', 'level_before_m'],
            ['level_after_m', 'level_after_m'],
          ];
          for (const [field, label] of atgRequired) {
            if (d[field] == null) {
              errors.push(`${batchCtx}: field "${label}" is required`);
            }
          }

          checkDateOrder(d.open_tank_date_before, d.open_tank_date_after, 'open_tank_date', batchCtx);
          checkDateOrder(d.open_dispense_date_before, d.open_dispense_date_after, 'open_dispense_date', batchCtx);
          checkDateOrder(d.before_recorded_at, d.after_recorded_at, 'recorded_at', batchCtx);
          checkLevelDirection(d.level_before_m, d.level_after_m, movement.transaction_type, batchCtx);
        }

        // ─── ATG flush line batches ────────────────────────────────
        const atgFlushDetails = tank.batch.atg.flush_lines?.batch_detail ?? [];
        for (let i = 0; i < atgFlushDetails.length; i++) {
          const d = atgFlushDetails[i];
          if (isPlaceholderATG(d)) continue;
          const batchCtx = `${tankCtx} ATG flush_lines batch[${i}]`;

          const atgRequired: Array<[keyof ExternalBatchATGDetailDto, string]> = [
            ['before_recorded_at', 'before_recorded_at'],
            ['after_recorded_at', 'after_recorded_at'],
            ['open_tank_date_before', 'open_tank_date_before'],
            ['open_tank_date_after', 'open_tank_date_after'],
            ['open_dispense_date_before', 'open_dispense_date_before'],
            ['open_dispense_date_after', 'open_dispense_date_after'],
            ['api_before', 'api_before'],
            ['api_after', 'api_after'],
            ['temp_before', 'temp_before'],
            ['temp_after', 'temp_after'],
            ['level_before_m', 'level_before_m'],
            ['level_after_m', 'level_after_m'],
          ];
          for (const [field, label] of atgRequired) {
            if (d[field] == null) {
              errors.push(`${batchCtx}: field "${label}" is required`);
            }
          }

          checkDateOrder(d.open_tank_date_before, d.open_tank_date_after, 'open_tank_date', batchCtx);
          checkDateOrder(d.open_dispense_date_before, d.open_dispense_date_after, 'open_dispense_date', batchCtx);
          checkDateOrder(d.before_recorded_at, d.after_recorded_at, 'recorded_at', batchCtx);
          checkLevelDirection(d.level_before_m, d.level_after_m, movement.transaction_type, batchCtx);
        }

        // ─── FlowMeter batches ─────────────────────────────────────
        const fmDetails = tank.batch.flow_meter.batch_detail ?? [];
        for (let i = 0; i < fmDetails.length; i++) {
          const d = fmDetails[i];
          if (isPlaceholderFM(d)) continue;
          const batchCtx = `${tankCtx} FlowMeter batch[${i}]`;

          const fmRequired: Array<[keyof ExternalBatchFlowMeterDetailDto, string]> = [
            ['before_recorded_at', 'before_recorded_at'],
            ['after_recorded_at', 'after_recorded_at'],
            ['open_tank_date_before', 'open_tank_date_before'],
            ['open_tank_date_after', 'open_tank_date_after'],
            ['open_dispense_date_before', 'open_dispense_date_before'],
            ['open_dispense_date_after', 'open_dispense_date_after'],
            ['api_before', 'api_before'],
            ['api_after', 'api_after'],
            ['avg_temp_f', 'avg_temp_f'],
            ['meter_before', 'meter_before'],
            ['meter_after', 'meter_after'],
          ];
          for (const [field, label] of fmRequired) {
            if (d[field] == null) {
              errors.push(`${batchCtx}: field "${label}" is required`);
            }
          }

          checkDateOrder(d.open_tank_date_before, d.open_tank_date_after, 'open_tank_date', batchCtx);
          checkDateOrder(d.open_dispense_date_before, d.open_dispense_date_after, 'open_dispense_date', batchCtx);
          checkDateOrder(d.before_recorded_at, d.after_recorded_at, 'recorded_at', batchCtx);

          if (d.meter_before != null && d.meter_after != null && d.meter_after <= d.meter_before) {
            errors.push(`${batchCtx}: meter_after must be strictly greater than meter_before`);
          }
        }

        // ─── FlowMeter flush line batches ──────────────────────────
        const fmFlushDetails = tank.batch.flow_meter.flush_lines?.batch_detail ?? [];
        for (let i = 0; i < fmFlushDetails.length; i++) {
          const d = fmFlushDetails[i];
          if (isPlaceholderATG(d as any)) continue;
          const batchCtx = `${tankCtx} FlowMeter flush_lines batch[${i}]`;

          const atgRequired: Array<[keyof ExternalBatchATGDetailDto, string]> = [
            ['before_recorded_at', 'before_recorded_at'],
            ['after_recorded_at', 'after_recorded_at'],
            ['open_tank_date_before', 'open_tank_date_before'],
            ['open_tank_date_after', 'open_tank_date_after'],
            ['open_dispense_date_before', 'open_dispense_date_before'],
            ['open_dispense_date_after', 'open_dispense_date_after'],
            ['api_before', 'api_before'],
            ['api_after', 'api_after'],
            ['temp_before', 'temp_before'],
            ['temp_after', 'temp_after'],
            ['level_before_m', 'level_before_m'],
            ['level_after_m', 'level_after_m'],
          ];
          for (const [field, label] of atgRequired) {
            if ((d as any)[field] == null) {
              errors.push(`${batchCtx}: field "${label}" is required`);
            }
          }

          checkDateOrder((d as any).open_tank_date_before, (d as any).open_tank_date_after, 'open_tank_date', batchCtx);
          checkDateOrder((d as any).open_dispense_date_before, (d as any).open_dispense_date_after, 'open_dispense_date', batchCtx);
          checkDateOrder((d as any).before_recorded_at, (d as any).after_recorded_at, 'recorded_at', batchCtx);
          checkLevelDirection((d as any).level_before_m, (d as any).level_after_m, movement.transaction_type, batchCtx);
        }
      }
    }

    if (errors.length > 0) {
      throw new BadRequestException(errors.join('; '));
    }
  }

  private normalizeMovement(
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
              tank.batch.flow_meter.flow_meter_code
                ? tank.batch.flow_meter.flow_meter_code
                    .trim()
                    .toUpperCase()
                : null,
          },
        },
      })),
    };
  }
}
