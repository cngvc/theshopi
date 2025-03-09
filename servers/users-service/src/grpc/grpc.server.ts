import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import { log } from '@users/utils/logger.util';
import path from 'path';
const PROTO_PATH = path.join(__dirname, './proto/store.proto');
class GrpcServer {
  private server: grpc.Server;
  private proto: Record<string, any>;
  private serviceDefinition: grpc.ServiceDefinition<Record<string, any>>;

  constructor(protoPath: string, packageName: string, service: string) {
    this.server = new grpc.Server();
    const packageDefinition = protoLoader.loadSync(protoPath, {
      keepCase: true,
      longs: String,
      enums: String,
      defaults: false,
      oneofs: true
    });
    this.proto = grpc.loadPackageDefinition(packageDefinition)[packageName];
    this.serviceDefinition = this.proto[service].service;
  }

  public addService(handlers: grpc.UntypedServiceImplementation) {
    this.server.addService(this.serviceDefinition, handlers);
  }

  public start(port: number) {
    this.server.bindAsync(`0.0.0.0:${port}`, grpc.ServerCredentials.createInsecure(), (err, bindPort) => {
      if (err) {
        log.error(`❌ Failed to start grpc server: ${err.message}`);
        return;
      }
      log.info(`🚀 grpc server running on port ${bindPort}`);
    });
  }
}
export const grpcUserServer = new GrpcServer(PROTO_PATH, 'users', 'UsersService');
