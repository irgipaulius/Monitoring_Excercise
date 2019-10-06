import { MonitoringResult } from "../models/monitoringResult";
import { DatabaseProvider } from "../database";
import { monitoredEndpointsService } from "./monitoredEndpoints";

export class MonitoredResultsService {
  /**
   * lists last 10 monitored results for endpointId or all endpointIds
   * @param userId
   * @param endpointId Optional: if not provided, all endpoints belonging to the user will be used
   */
  public async list(
    userId: number,
    endpointId?: number
  ): Promise<MonitoringResult[]> {
    let endpointIds: number[] = [];
    if (endpointId) {
      endpointIds.push(endpointId);
    } else {
      const endpoints = await monitoredEndpointsService.list(userId);
      if (endpoints.length) {
        endpointIds = endpoints.map(e => e.id);
      } else {
        return [];
      }
    }

    const connection = await DatabaseProvider.getConnection();
    return await connection
      .getRepository(MonitoringResult)
      .createQueryBuilder("monitoring_result")
      .where("monitoring_result.endpointId IN (:...endpointIds)", {
        endpointIds: endpointIds
      })
      .orderBy("monitoring_result.id", "DESC")
      .take(10)
      .getMany();
  }

  public async create(result: MonitoringResult): Promise<MonitoringResult> {
    const newResult = new MonitoringResult();
    newResult.checked = new Date();
    newResult.endpointID = result.endpointID;
    newResult.statusCode = result.statusCode;
    newResult.payload = result.payload;

    monitoredEndpointsService.updateCheckedValue(
      newResult.endpointID,
      newResult.checked
    );

    const connection = await DatabaseProvider.getConnection();
    return await connection.getRepository(MonitoringResult).save(newResult);
  }
}

export const monitoringResultsService = new MonitoredResultsService();
