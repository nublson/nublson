export default function Page({ params }: { params: { slug: string } }) {
  return <div>My Article: {params.slug}</div>;
}
