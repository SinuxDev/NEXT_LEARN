export const getReviewAverage = (reviews: number[]): number => {
  if (reviews.length === 0) {
    return 0;
  }

  const total = reviews.reduce((acc, curr) => acc + curr, 0);
  return total / reviews.length;
};
