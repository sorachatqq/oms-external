import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  });

  const config = new DocumentBuilder()
    .setTitle("OMS External API")
    .setDescription("API สำหรับรับ-ส่งข้อมูลปริมาณน้ำมันกับระบบ ASLC")
    .setVersion("1.0")
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("docs", app, document);

  const port = process.env.PORT ?? 3201;
  await app.listen(port);
  console.log(`oms-external running on port ${port}`);
  console.log(`Swagger: http://localhost:${port}/docs`);
}

bootstrap();
