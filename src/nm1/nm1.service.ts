import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import {
  ExternalCreateNm1Dto,
  ExternalCreateNm1ResponseDto,
  ExternalNm1MasterDataQueryDto,
  ExternalNm1ReferenceResponseDto,
  ExternalNm1SubModalQueryDto,
} from './dto/nm1-create.dto';

@Injectable()
export class Nm1Service {
  private readonly logger = new Logger(Nm1Service.name);
  private readonly baseUrl: string;

  constructor(private readonly httpService: HttpService) {
    this.baseUrl =
      process.env.WEB_API_BASE_URL ?? 'http://localhost:3000';
  }

  async getMasterData(
    query?: ExternalNm1MasterDataQueryDto,
  ): Promise<ExternalNm1ReferenceResponseDto> {
    const url = `${this.baseUrl}/api/nm1/master-data`;
    this.logger.log(
      `GET ${url} tax_type=${query?.tax_type ?? 'ALL'}`,
    );

    const { data } = await firstValueFrom(
      this.httpService.get<ExternalNm1ReferenceResponseDto>(
        url,
        {
          params: query,
        },
      ),
    );

    return data;
  }

  async getProducts(
    query?: ExternalNm1SubModalQueryDto,
  ): Promise<ExternalNm1ReferenceResponseDto> {
    const url = `${this.baseUrl}/api/nm1/sub-modal/products`;
    this.logger.log(`GET ${url}`);

    const { data } = await firstValueFrom(
      this.httpService.get<ExternalNm1ReferenceResponseDto>(
        url,
        {
          params: query,
        },
      ),
    );

    return data;
  }

  async getPartners(
    query?: ExternalNm1SubModalQueryDto,
  ): Promise<ExternalNm1ReferenceResponseDto> {
    const url = `${this.baseUrl}/api/nm1/sub-modal/partners`;
    this.logger.log(`GET ${url}`);

    const { data } = await firstValueFrom(
      this.httpService.get<ExternalNm1ReferenceResponseDto>(
        url,
        {
          params: query,
        },
      ),
    );

    return data;
  }

  async getTanks(
    query?: ExternalNm1SubModalQueryDto,
  ): Promise<ExternalNm1ReferenceResponseDto> {
    const url = `${this.baseUrl}/api/nm1/sub-modal/tanks`;
    this.logger.log(`GET ${url}`);

    const { data } = await firstValueFrom(
      this.httpService.get<ExternalNm1ReferenceResponseDto>(
        url,
        {
          params: query,
        },
      ),
    );

    return data;
  }

  async getMeters(
    query?: ExternalNm1SubModalQueryDto,
  ): Promise<ExternalNm1ReferenceResponseDto> {
    const url = `${this.baseUrl}/api/nm1/sub-modal/meters`;
    this.logger.log(`GET ${url}`);

    const { data } = await firstValueFrom(
      this.httpService.get<ExternalNm1ReferenceResponseDto>(
        url,
        {
          params: query,
        },
      ),
    );

    return data;
  }

  async createNm1(
    dto: ExternalCreateNm1Dto,
  ): Promise<ExternalCreateNm1ResponseDto> {
    const url = `${this.baseUrl}/api/nm1/create`;
    this.logger.log(
      `POST ${url} mode=${dto.mode} code_nm1_no=${dto.code_nm1_no}`,
    );

    const { data } = await firstValueFrom(
      this.httpService.post<ExternalCreateNm1ResponseDto>(url, dto),
    );

    return data;
  }
}
