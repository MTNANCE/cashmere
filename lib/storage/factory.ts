import {
  DataSourceType,
  type DataSourceConfig,
  type IDataSource,
} from "./types";
import { createLocalProvider } from "./providers/local";

function createDataSource(config: DataSourceConfig): IDataSource {
  switch (config.type) {
    case DataSourceType.LOCAL:
      return createLocalProvider();

    default:
      throw new Error(`Unknown data source type: ${config.type}`);
  }
}

function createLocalDataSource(): IDataSource {
  return createDataSource({ type: DataSourceType.LOCAL });
}

export const DataSourceFactory = {
  create: createDataSource,
  createLocal: createLocalDataSource,
};

let dataSourceInstance: IDataSource | null = null;

export function getDataSource(): IDataSource {
  if (!dataSourceInstance) {
    dataSourceInstance = DataSourceFactory.createLocal();
  }
  return dataSourceInstance;
}

export function setDataSource(dataSource: IDataSource): void {
  dataSourceInstance = dataSource;
}

export function resetDataSource(): void {
  dataSourceInstance = null;
}
