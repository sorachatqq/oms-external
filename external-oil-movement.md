# External Oil Movement API — Context

## โปรเจกต์

| โปรเจกต์                     | Path                                        | Port |
| ---------------------------- | ------------------------------------------- | ---- |
| web-api (NestJS monorepo)    | `/Users/njbae/Desktop/Project/web-api`      | 3000 |
| oms-external (proxy/gateway) | `/Users/njbae/Desktop/Project/oms-external` | 3201 |

---

## Architecture

```
ASLC System
    ↓ POST/PATCH
oms-external (:3201)
    ↓ HTTP (axios)
web-api api-gateway (:3000)
    ↓ TypeORM
Oracle DB
```

- oms-external รับ request จาก ASLC แล้ว proxy ต่อไป web-api
- web-api ใช้ global prefix `/api` — controller ต้องไม่ใส่ `api/` ซ้ำ
- Swagger oms-external: `http://localhost:3201/docs`

---

## Endpoints

### GET (ดึงข้อมูล)

```
POST /api/oil-movements/get
Body: { "ref_code": ["012604190022", "012604190023"] }
```

> ใช้ POST เพราะ GET ไม่รองรับ body

### UPDATE (บันทึกข้อมูล)

```
PATCH /api/oil-movements/update
Body: ExternalOilMovementDto
```

---

## Files สำคัญ

### web-api

| File                                                                             | หน้าที่                                            |
| -------------------------------------------------------------------------------- | -------------------------------------------------- |
| `apps/api-gateway/src/movement/external-api/external-oil-movement.controller.ts` | Controller — `@Controller('oil-movements')`        |
| `apps/api-gateway/src/movement/external-api/external-oil-movement.service.ts`    | Service — DB logic ทั้งหมด                         |
| `apps/api-gateway/src/movement/external-api/index.ts`                            | Export controller                                  |
| `apps/api-gateway/src/movement/index.ts`                                         | Export `./external-api`                            |
| `apps/api-gateway/src/app/app.module.ts`                                         | Register repositories + ExternalOilMovementService |
| `libs/shared/dto/src/movement/external-api/external-oil-movement.dto.ts`         | DTOs                                               |
| `libs/shared/dto/src/movement/external-api/external-oil-movement.mock.ts`        | Mock data                                          |

### oms-external

| File                                                | หน้าที่                                 |
| --------------------------------------------------- | --------------------------------------- |
| `src/main.ts`                                       | Bootstrap, Swagger setup, port 3201     |
| `src/app.module.ts`                                 | Import OilMovementModule                |
| `src/oil-movement/oil-movement.module.ts`           | HttpModule.register({ timeout: 30000 }) |
| `src/oil-movement/oil-movement.controller.ts`       | Controller                              |
| `src/oil-movement/oil-movement.service.ts`          | Proxy calls + normalizePayload          |
| `src/oil-movement/dto/external-oil-movement.dto.ts` | DTOs ฝั่ง oms-external                  |

---

## DB Tables & Relations

```
trx_nm1_header (ref_document_id = ref_code)
  └── trx_nm1_detail (trx_nm1_detail_id = movement_id)
        └── trx_transaction_nm1 (trx_transaction_nm1_id)
              └── trx_batch (trx_batch_id)
                    └── mst_meter_detail (mst_meter_detail_id = mst_meter_id)
              └── mst_tank_master (mst_tank_master_id)
```

---

## Entities ที่ inject ใน ExternalOilMovementService

```typescript
@InjectRepository(ETrxNm1Header, DatabaseLibsType.Main)
@InjectRepository(ETrxTransactionNm1, DatabaseLibsType.Main)
@InjectRepository(ETrxBatch, DatabaseLibsType.Main)
@InjectRepository(EMstMeterDetail, DatabaseLibsType.Main)
@InjectRepository(EMstTankMaster, DatabaseLibsType.Main)
```

ทั้งหมด register ใน `app.module.ts`:

```typescript
TypeOrmModule.forFeature(
  [
    ETrxNm1Header,
    ETrxTransactionNm1,
    ETrxBatch,
    EMstMeterDetail,
    EMstTankMaster,
  ],
  DatabaseLibsType.Main,
);
```

---

## Entity Key Fields

### ETrxBatch (`trx_batch`)

- `trx_batch_id` — PK
- `trx_transaction_nm1_id` — FK
- `mst_tank_master_id`
- `mst_meter_type_id` — 1=ATG, 3=FlowMeter
- `mst_meter_id` — FK → mst_meter_detail
- `batch_number`
- `flush_lines` — number (0/1)
- `is_primary_record` — number (0/1)
- `meter_before`, `meter_after` — ไม่มี `meter_diff` (คำนวณจาก after-before เอาเอง)
- `before_recorded_at`, `after_recorded_at`
- ATG fields: `temp_before/after`, `level_before/after_m`, `system_volume_*`, `company_volume_*`
- FM fields: `avg_temp_f`, `observed_temp_factor`, `standard_temp_factor_86f`, `volume_raw_liters`, `volume_at_60f_liters`, `volume_industry_std_liters`

### ETrxTransactionNm1 (`trx_transaction_nm1`)

- `trx_transaction_nm1_id` — PK
- `trx_nm1_detail_id` — FK (= movement_id ใน DTO)
- `mst_tank_master_id`
- `mst_meter_type_id`

### EMstMeterDetail (`mst_meter_detail`)

- `mst_meter_detail_id` — PK
- `code_meter_type` — ใช้ match กับ `flow_meter_code` จาก DTO

### EMstTankMaster (`mst_tank_master`)

- `mst_tank_master_id` — PK
- `code_mst_tank_master` — tank code แบบที่ 1
- `code_mst_tank_meter` — tank code แบบที่ 2
- lookup ทั้ง 2 field เพื่อหา ID

---

## Business Logic

### Constants

```typescript
const ATG_TYPE_ID = 1;
const FLOW_METER_TYPE_ID = 3;
```

### Batch Type Rules

| condition                        | flush_lines | is_primary_record | mst_meter_type_id |
| -------------------------------- | ----------- | ----------------- | ----------------- |
| ATG measurement, primary         | 0           | 1                 | 1                 |
| ATG inside FlowMeter measurement | 0           | 0                 | 1                 |
| FlowMeter                        | 0           | 1                 | 3                 |
| Flush line (ATG)                 | 1           | 1                 | 1                 |

### flow_meter_code

- normalize ด้วย `.trim().toUpperCase()` ก่อนใช้
- ฝั่ง web-api DTO: `@Transform(({ value }) => value?.trim().toUpperCase())`
- ฝั่ง oms-external service: `normalizePayload()` ก่อน PATCH

### batch_no

- normalize ด้วย `.trim()` ก่อนใช้ใน upsert logic
- ถ้า `batch_no` มีค่า + เจอใน DB → UPDATE batch เดิม
- ถ้า `batch_no` ว่าง หรือ ไม่เจอใน DB → INSERT batch ใหม่

### trx_transaction_nm1_id

- ถ้ามีใน payload จะใช้โดยตรงสำหรับ upsert
- ถ้าไม่มี จะ fallback ไปหาจาก `tank_code` mapping กับ `trx_transaction_nm1.mst_tank_master_id`

### movement_id

- DTO field `movement_id` map กับ `trx_nm1_detail_id` (ไม่ใช่ `trx_oil_movement_id`)

### trx_transaction_nm1_id (ใหม่)

- เพิ่มฟิลด์ optional ใน `ExternalMovementTankDto` เพื่อให้ upsert batch ตรงขึ้น
- ถ้ามีค่าใน payload จะใช้โดยตรง ถ้าไม่มีจะ fallback ไปหาจาก `tank_code`
- ช่วยให้ upsert ใช้ `batch_number + trx_transaction_nm1_id` ได้ชัดเจน

### ref_code

- DTO field `ref_code` map กับ `trx_nm1_header.ref_document_id`
- GET รับเป็น array `ref_code: string[]`

---

## DTO Structure (ฝั่ง web-api)

```
ExternalOilMovementDto
  ├── ref_code: string
  ├── movement_id: number
  └── movement_tank: ExternalMovementTankDto[]
        ├── tank_code: string
        ├── trx_transaction_nm1_id?: number  // ใหม่: เพื่อ upsert ตรง
        ├── measurement_type: { id, name }
        ├── qty_atg_liter: number
        ├── qty_flowmeter_liter: number
        ├── is_flush_lines: boolean
        └── batch: ExternalBatchDto
              ├── atg: ExternalBatchATGDto
              │     ├── primary: { batch_detail: ExternalBatchATGDetailDto[] }
              │     └── flush_lines: { tank_id, tank_code, qty_atg_liter, qty_flowmeter_liter, batch_detail[] }
              └── flow_meter: ExternalBatchFlowMeterDto
                    ├── flow_meter_code: string  ← @Transform trim+uppercase
                    ├── summary_liters: number
                    └── batch_detail: ExternalBatchFlowMeterDetailDto[]
```

### ExternalBatchFlowMeterDetailDto (สำคัญ)

- ใช้ `meter_before` + `meter_after` (ไม่มี `meter_diff`)
- `meter_diff = abs(meter_after - meter_before)` คำนวณเองถ้าจะใช้

---

## Bugs ที่แก้แล้ว

| Bug                                    | สาเหตุ                                                                    | Fix                                                            |
| -------------------------------------- | ------------------------------------------------------------------------- | -------------------------------------------------------------- |
| 404 POST /api/oil-movements/get        | `@Controller('api/oil-movements')` + global prefix `/api` = double prefix | เปลี่ยนเป็น `@Controller('oil-movements')`                     |
| GET with body error                    | Browser/fetch ไม่รองรับ body ใน GET                                       | เปลี่ยนเป็น POST ทั้ง controller และ service                   |
| `meter_diff` ไม่มีใน entity            | Entity ใช้ `meter_before`/`meter_after`                                   | เปลี่ยน DTO field เป็น `meter_after`, แก้ mock ด้วย            |
| `Or` unused import                     | Import แล้วไม่ใช้                                                         | Remove ออก                                                     |
| `ref_no` path param                    | Dead code ไม่ได้ใช้                                                       | Remove ออก                                                     |
| Double prefix `/api/api/oil-movements` | Global prefix `/api` + `@Controller('api/oil-movements')`                 | เปลี่ยนเป็น `@Controller('oil-movements')`                     |
| GET with body error                    | Browser/fetch ไม่รองรับ body ใน GET                                       | เปลี่ยนเป็น POST `/api/oil-movements/get`                      |
| Bulk PATCH ไม่รองรับ                   | PATCH เดิมรับ single object                                               | เปลี่ยนเป็นรับ array `ExternalOilMovementDto[]`                |
| Upsert logic ไม่มี                     | Insert ใหม่ทุกครั้ง → duplicate                                           | เพิ่ม upsert ด้วย `batch_no` (มีค่า=update, ว่าง=insert)       |
| Upsert ไม่ตรง                          | ใช้ `movement_id` (trx_nm1_detail_id) → indirect mapping                  | เพิ่ม `trx_transaction_nm1_id` optional ใน DTO, ใช้โดยตรงถ้ามี |
| `batch_no` ไม่ normalize               | อาจมี whitespace                                                          | เพิ่ม `.trim()` ก่อนใช้ใน upsert                               |
| Flush lines init ผิด                   | Set tank_id/code ทันที                                                    | Init เป็น empty, set จริงเฉพาะตอนเจอ flush line                |

---

## Pending / TODO

1. **Volume fields `@IsOptional()`** — ถ้า ASLC ไม่ส่งมา ควร recalculate จาก before/after (ตอนนี้ required ทุก field)
2. **Upsert logic** — ✅ **แก้แล้ว**: เพิ่ม upsert ด้วย `batch_no` + `trx_transaction_nm1_id`, normalize `batch_no` ด้วย `.trim()`
3. **`open_dispense_date_before/after`** — ยังไม่ได้ใส่ใน DTO (มีใน entity) — ต้องยืนยันกับ ASLC ว่าจะส่งมาไหม
4. **Web-api restart** — ✅ **แก้แล้ว**: หลัง fix controller prefix ต้อง restart/rebuild เพื่อให้ route ใหม่มีผล
5. **trx_transaction_nm1_id ใน oms-external DTO** — ต้องเพิ่มฟิลด์ optional ใน oms-external DTO เพื่อให้ ASLC ส่งได้โดยตรง

---

## ENV

### oms-external `.env`

```
PORT=3201
WEB_API_BASE_URL=http://localhost:3000
```
