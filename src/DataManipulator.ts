import { ServerRespond } from "./DataStreamer";

export interface Row {
  price_abc: number;
  price_def: number;
  ratio: number;
  timestamp: Date;
  lower_bound: number;
  upper_bound: number;
  trigger_alert: number | undefined;
}

export class DataManipulator {
  static generateRow(serverRespond: ServerRespond[]) {
    const priceABC =
      (serverRespond[0].top_ask.price + serverRespond[0].top_bid.price) / 2;
    const priceDEF =
      (serverRespond[1].top_ask.price + serverRespond[1].top_bid.price) / 2;
    const ratio = priceABC / priceDEF;
    const upperBound = 1 + 0.5;
    const lowerBound = 1 - 0.5;

    return {
      price_abc: priceABC,
      price_def: priceDEF,
      ratio,
      timestamp:
        serverRespond[0].timestamp > serverRespond[1].timestamp
          ? serverRespond[0].timestamp
          : serverRespond[1].timestamp,
      upper_bound: upperBound,
      lower_bound: lowerBound,
      trigger_alert:
        ratio > upperBound || ratio < upperBound ? ratio : undefined,
    };
  }
}

/*
Author - Bhavitha M
Thought process behind calculating the lower bound and upper bound 
we try to update the pricewindow variable every time the server responds and 
if the length of the pricewindow is > 12 then we calculate the average and return
it. Thus having the avg of the last 12 months on the graph and then , for lower bound
we multiply with 0.9 i.e., - 10% and for upper bound me multiply with 
1.1 i.e., +10% and then if the ratio of the current price of the stocks goes beyond the
upper bound or below the lower bound then it will end up creating the trigger.
and hurray the traders can now see if ratio is beyond and hurry to buy the stocks 
or sell the stocks respectively :)
*/
