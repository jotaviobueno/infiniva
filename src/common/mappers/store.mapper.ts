import { IStore } from 'src/modules/store/interfaces/istore';
import { Store } from 'src/repositories/implementations/mongodb/schemas/store.schema';

export function toIStore(store: Store): IStore {
  return {
    store_id: store.store_id,
    name: store.name,
    description: store.description,
    image_url: store.image_url,
    store_url: store.store_url,
    createdAt: store.createdAt,
    updatedAt: store.updatedAt,
  };
}
