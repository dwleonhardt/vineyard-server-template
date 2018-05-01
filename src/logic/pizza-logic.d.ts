import { Pizza, PizzaType } from '../model/model-types';
import { StrictCollection } from 'vineyard-data';
import { Omit, UUID } from 'vineyard-data/src/core-types';
export declare class PizzaLogic {
    private readonly pizzaCollection;
    private readonly pizzaPrices;
    constructor(pizzaCollection: StrictCollection<Pizza, 'id'>, pizzaPrices: Map<PizzaType, number>);
    createPizza(createPizzaData: CreatePizzaData): Promise<Pizza>;
    getPizza(pizzaId: UUID): Promise<Pizza>;
    private calculatePrice(type, size);
}
export declare type CreatePizzaData = Omit<Pizza, 'price' | 'id'>;
