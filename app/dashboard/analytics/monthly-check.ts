import BetweenWeeks from "./between-weeks";

export const monthlyCheck = (chartItems: { date: Date; revenue: number }[]) => {
  return [
    {
      date: "3 weeks ago",
      revenue: chartItems
        .filter((order) => BetweenWeeks(order.date!, 28, 21))
        .reduce((acc, price) => acc + price.revenue, 0),
    },
    {
      date: "2 weeks ago",
      revenue: chartItems
        .filter((order) => BetweenWeeks(order.date!, 21, 14))
        .reduce((acc, price) => acc + price.revenue, 0),
    },
    {
      date: "1 week ago",
      revenue: chartItems
        .filter((order) => BetweenWeeks(order.date!, 14, 7))
        .reduce((acc, price) => acc + price.revenue, 0),
    },
    {
      date: "",
      revenue: chartItems
        .filter((order) => BetweenWeeks(order.date!, 7, 0))
        .reduce((acc, price) => acc + price.revenue, 0),
    },
  ];
};
