export default function Products({ params }: { params: { id: string } }) {
  return (
    <div>
      <h1>Product ID: {params.id}</h1>
      <h2>This is the Product Page</h2>
    </div>
  );
}
