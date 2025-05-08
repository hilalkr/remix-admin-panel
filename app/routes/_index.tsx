import { redirect } from '@remix-run/node';
import type { LoaderFunction, MetaFunction } from '@remix-run/node';

export const meta: MetaFunction = () => {
  return [
    { title: 'Admin Panel' },
    { name: 'description', content: 'Admin panel built with Remix' },
  ];
};

export const loader: LoaderFunction = async () => {
  return redirect('/login');
};

export default function Index() {
  return <div>Redirecting to login...</div>;
}
