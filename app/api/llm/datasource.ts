import { DATASOURCES_CACHE_DIR } from "@/scripts/constants.mjs";
import { VectorStoreIndex, ServiceContext } from "@llamaindex/edge";
import { storageContextFromDefaults } from "@llamaindex/edge/storage/StorageContext";
import { SimpleDocumentStore } from "@llamaindex/edge/storage/docStore/SimpleDocumentStore";

export async function getDataSource(
  serviceContext: ServiceContext,
  datasource: string,
) {
  let storageContext = await storageContextFromDefaults({
    persistDir: `${DATASOURCES_CACHE_DIR}/${datasource}`,
  });

  const numberOfDocs = Object.keys(
    (storageContext.docStore as SimpleDocumentStore).toDict(),
  ).length;
  if (numberOfDocs === 0) {
    throw new Error(
      `StorageContext for datasource '${datasource}' is empty - make sure to generate the datasource first`,
    );
  }
  return await VectorStoreIndex.init({
    storageContext,
    serviceContext,
  });
}
