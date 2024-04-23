import { ServerRespond } from "./DataStreamer";

export interface Row {
  price_abc: number;
  price_def: number;
  ratio: number;
  timestamp: Date;
  lower_bound: number;
  upper_bound: number;
  trigger_alert: number;
}

export class DataManipulator {
  static generateRow(serverResponds: ServerRespond[]) {
    const priceABC =
      (serverResponds[0].top_ask.price + serverResponds[0].top_bid.price) / 2;
    const priceDEF =
      (serverResponds[1].top_ask.price + serverResponds[1].top_bid.price) / 2;
    const ratio = priceABC / priceDEF;
    const upperBound = 1 + 0.5;
    const lowerBound = 1 - 0.5;
    return serverResponds.map((el: any) => {
      return {
        price_abc: priceABC,
        price_def: priceDEF,
        ratio: ratio,
        timeStamp:
          serverResponds[0].timestamp > serverResponds[1].timestamp
            ? serverResponds[0].timestamp
            : serverResponds[1].timestamp,
        upper_bound: upperBound,
        lower_bound: lowerBound,
        trigger_alert:
          ratio > upperBound || ratio < upperBound ? ratio : undefined,
      };
    });
  }
}
