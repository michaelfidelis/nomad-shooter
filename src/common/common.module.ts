import { Module } from '@nestjs/common';
import { LogParserService } from './services/log-parser/log-parser.service';
import { ConfigModule } from '@nestjs/config';
import { OpenTelemetryModule } from 'nestjs-otel';

@Module({
  providers: [LogParserService],
  exports: [LogParserService],
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env'],
      isGlobal: true,
    }),
    OpenTelemetryModule.forRoot({
      metrics: {
        hostMetrics: true,
        apiMetrics: {
          enable: true,
          defaultAttributes: {
            custom: 'label',
          },
          ignoreRoutes: ['/favicon.ico'],
          ignoreUndefinedRoutes: false,
          prefix: 'nomad-api',
        },
      },
    }),
  ],
})
export class CommonModule {}
