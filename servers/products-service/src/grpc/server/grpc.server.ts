import { productProto } from '@cngvc/shopi-shared';
import * as grpc from '@grpc/grpc-js';
import { SERVICE_NAME } from '@product/constants';
import { log } from '@product/utils/logger.util';
import { ProductServiceGrpcHandler } from './product.grpc-server.handler';

class GrpcServer {
  private server: grpc.Server;
  private serviceDefinition: grpc.ServiceDefinition<Record<string, any>>;

  constructor(service: string) {
    const serviceConstructor = productProto as grpc.GrpcObject;
    this.server = new grpc.Server();
    this.serviceDefinition = (serviceConstructor[service] as grpc.ServiceClientConstructor).service;
    this.addService({
      GetProductsByProductPublicIds: ProductServiceGrpcHandler.findProductsByProductPublicIds,
      GetProductByProductPublicId: ProductServiceGrpcHandler.findProductByProductPublicId
    });
  }

  private addService(handlers: grpc.UntypedServiceImplementation) {
    this.server.addService(this.serviceDefinition, handlers);
  }

  public tryShutdown() {
    this.server.tryShutdown((err) => {
      if (err) {
        log.error(`Error while shutting down ${SERVICE_NAME} grpc:`, err);
      } else {
        log.info(`✅ ${SERVICE_NAME} grpc stopped cleanly`);
      }
    });
  }

  public start(port: number) {
    this.server.bindAsync(`0.0.0.0:${port}`, grpc.ServerCredentials.createInsecure(), (err, bindPort) => {
      if (err) {
        log.error(`❌ Failed to start ${SERVICE_NAME} grpc: ${err.message}`);
        process.exit(1);
      }
      log.info(`🚀 ${SERVICE_NAME} grpc running on port ${bindPort}`);
    });
  }
}

process.on('SIGINT', () => {
  log.info(`🛑 Shutting down ${SERVICE_NAME}...`);
  grpcProductsServer.tryShutdown();
  process.exit(1);
});

export const grpcProductsServer = new GrpcServer('ProductService');
