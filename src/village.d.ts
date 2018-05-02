import { Model } from './model/index';
import { FullConfig } from '../config/config-types';
import { Logic } from './logic/index';
import { BackingServices } from './backing-services/index';
import { ApiActions } from './endpoints/generated/api-contract';
export interface Village {
    config: FullConfig;
    backingServices: BackingServices;
    model: Model;
    logic: Logic;
    apiActions: ApiActions;
}
export declare function createVillage(config?: FullConfig, backingServiceOverrides?: Partial<BackingServices>): Village;
