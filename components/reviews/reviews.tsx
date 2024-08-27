import ReviewsForms from "./review-forms";

export default async function Reviews({ productID }: { productID: number }) {
  return (
    <section className="py-8">
      <h2 className="text-2xl font-bold mb-4">Products Reviews</h2>
      <div>
        <ReviewsForms />
      </div>
    </section>
  );
}
