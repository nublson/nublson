export default function Page({ params }: { params: { slug: string } }) {
  return <div>My Product: {params.slug}</div>;
}
