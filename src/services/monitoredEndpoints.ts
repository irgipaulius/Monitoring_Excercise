import { DatabaseProvider } from "../database";
import { MonitoredEndpoints } from "../models/monitoredEndpoints";
import { User } from "../models/user";

export class MonitoredEndpointsService {
  public async getById(
    userId: number,
    endpointId: number
  ): Promise<MonitoredEndpoints> {
    const connection = await DatabaseProvider.getConnection();
    return await connection
      .getRepository(MonitoredEndpoints)
      .createQueryBuilder("monitored_endpoints")
      .where("monitored_endpoints.ownerId = " + userId)
      .andWhereInIds(endpointId)
      .getOne();
  }

  public async list(userId: number): Promise<MonitoredEndpoints[]> {
    const connection = await DatabaseProvider.getConnection();
    return await connection
      .getRepository(MonitoredEndpoints)
      .createQueryBuilder("monitored_endpoints")
      .where("monitored_endpoints.ownerId = :userId", { userId })
      .getMany();
  }

  public async create(
    userId: number,
    endpoint: MonitoredEndpoints
  ): Promise<MonitoredEndpoints> {
    const newEndpoint = new MonitoredEndpoints();
    newEndpoint.name = endpoint.name;
    newEndpoint.url = endpoint.url;
    newEndpoint.created = new Date();
    newEndpoint.monitorInterval = endpoint.monitorInterval;
    newEndpoint.ownerId = userId;

    const connection = await DatabaseProvider.getConnection();
    return await connection.getRepository(MonitoredEndpoints).save(newEndpoint);
  }

  public async update(
    userId: number,
    endpoint: MonitoredEndpoints
  ): Promise<MonitoredEndpoints> {
    const entity = await this.getById(userId, endpoint.id);
    if (entity) {
      entity.name = endpoint.name || entity.name;
      entity.url = endpoint.url || entity.url;
      entity.monitorInterval =
        endpoint.monitorInterval || entity.monitorInterval;
    }

    const connection = await DatabaseProvider.getConnection();
    return await connection.getRepository(MonitoredEndpoints).save(entity);
  }

  public async updateCheckedValue(endpointId: number, checked: Date) {
    const connection = await DatabaseProvider.getConnection();

    const entity = await connection
      .getRepository(MonitoredEndpoints)
      .findOne(endpointId);

    if (entity) {
      entity.checked = checked;
      return await connection.getRepository(MonitoredEndpoints).save(entity);
    } else {
      throw new Error("ENDPOINT " + endpointId + " DOESNT EXIST");
    }
  }

  public async delete(userId: number, endpointId: number): Promise<void> {
    const endpoint = await this.getById(userId, endpointId);
    if (endpoint) {
      const connection = await DatabaseProvider.getConnection();
      await connection.getRepository(MonitoredEndpoints).delete(endpointId);
    } else {
      throw new Error(
        "monitored endpoint with id " + endpointId + " doesn't exist"
      );
    }
  }
}

export const monitoredEndpointsService = new MonitoredEndpointsService();
