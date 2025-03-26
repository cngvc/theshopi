import { userProto } from '@cngvc/shopi-shared';
import * as grpc from '@grpc/grpc-js';
import { SERVICE_NAME } from '@user/constants';
import { log } from '@user/utils/logger.util';
import path from 'path';
import { UserServiceGrpcHandler } from './user.grpc-server.handler';
const PROTO_PATH = path.join(__dirname, '../proto/user.proto');

class GrpcServer {
  private server: grpc.Server;
  private serviceDefinition: grpc.ServiceDefinition<Record<string, any>>;

  constructor(service: string) {
    this.server = new grpc.Server();
    const serviceConstructor = userProto as grpc.GrpcObject;
    this.server = new grpc.Server();
    this.serviceDefinition = (serviceConstructor[service] as grpc.ServiceClientConstructor).service;
    this.addService({
      GetStoreByStorePublicId: UserServiceGrpcHandler.findStoreByStorePublicId,
      GetBuyerByAuthId: UserServiceGrpcHandler.findBuyerByAuthId
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
  grpcUserServer.tryShutdown();
  process.exit(1);
});

export const grpcUserServer = new GrpcServer('UserService');
