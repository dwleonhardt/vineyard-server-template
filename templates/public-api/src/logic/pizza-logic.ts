import { Pizza, PizzaType } from '../model/model-types'
import { StrictCollection } from 'vineyard-data'
import { Omit } from 'vineyard-data/src/core-types'

export class PizzaLogic {
  private readonly pizzaCollection: StrictCollection<Pizza, 'id'>
  private readonly pizzaPrices: Map<PizzaType, number>

  constructor (pizzaCollection: StrictCollection<Pizza, 'id'>, pizzaPrices: Map<PizzaType, number>) {
    this.pizzaCollection = pizzaCollection
    this.pizzaPrices = pizzaPrices
  }

  async createPizza (createUserData: CreatePizzaData): Promise<Pizza> {
    const { type, size } = createUserData
    const pizzaToCreate = {
      type,
      size,
      price: this.calculatePrice(type, size)
    }
    return this.pizzaCollection.create(pizzaToCreate)
  }

  async getPizza (pizzaId: string): Promise<Pizza> {
    return this.pizzaCollection.get(pizzaId)
  }

  private calculatePrice (type: PizzaType, size: number): number {
    const pricePerSlice = this.pizzaPrices.get(type) || 0
    return pricePerSlice * size
  }
}

export type CreatePizzaData = Omit<Pizza, 'price' | 'id'>