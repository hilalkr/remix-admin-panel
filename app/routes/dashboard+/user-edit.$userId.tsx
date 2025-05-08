import { useTranslation } from 'react-i18next';
import {
  json,
  LoaderFunctionArgs,
  ActionFunctionArgs,
  redirect,
} from '@remix-run/node';
import { useLoaderData, useActionData, Form } from '@remix-run/react';
import {
  getUserById,
  updateUser,
  type Role,
  type Status,
} from '~/services/users.server';
import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '~/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card';

export async function loader({ params }: LoaderFunctionArgs) {
  const userId = params.userId;

  if (!userId) {
    throw new Response("Kullanıcı ID'si gereklidir", { status: 400 });
  }

  const user = await getUserById(userId);

  if (!user) {
    throw new Response('Kullanıcı bulunamadı', { status: 404 });
  }

  return json({ user });
}

export async function action({ request, params }: ActionFunctionArgs) {
  const userId = params.userId;
  const formData = await request.formData();

  if (!userId) {
    return json(
      { success: false, message: "Kullanıcı ID'si gereklidir" },
      { status: 400 }
    );
  }

  const userData = {
    name: formData.get('name')?.toString() || '',
    email: formData.get('email')?.toString() || '',
    role: formData.get('role')?.toString() as Role,
    status: formData.get('status')?.toString() as Status,
  };

  try {
    const updatedUser = await updateUser(userId, userData);

    if (!updatedUser) {
      return json(
        { success: false, message: 'Kullanıcı güncellenemedi' },
        { status: 500 }
      );
    }

    return redirect('/dashboard/users');
  } catch (error) {
    return json(
      {
        success: false,
        message: error instanceof Error ? error.message : 'Bir hata oluştu',
      },
      { status: 500 }
    );
  }
}

export default function EditUserPage() {
  const { t } = useTranslation('common');
  const { user } = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();

  return (
    <div>
      <h1 className='mb-6 text-3xl font-bold tracking-tight'>
        {t('users.editUser')}
      </h1>

      <Card>
        <CardHeader>
          <CardTitle>{user.name} Düzenleniyor</CardTitle>
        </CardHeader>
        <CardContent>
          <Form method='post' className='space-y-4'>
            {actionData?.message && (
              <div className='text-destructive'>{actionData.message}</div>
            )}

            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <div className='space-y-2'>
                <label htmlFor='name' className='text-sm font-medium'>
                  İsim
                </label>
                <Input
                  id='name'
                  name='name'
                  defaultValue={user.name}
                  required
                />
              </div>

              <div className='space-y-2'>
                <label htmlFor='email' className='text-sm font-medium'>
                  E-posta
                </label>
                <Input
                  id='email'
                  name='email'
                  type='email'
                  defaultValue={user.email}
                  required
                />
              </div>

              <div className='space-y-2'>
                <label htmlFor='role' className='text-sm font-medium'>
                  Rol
                </label>
                <Select name='role' defaultValue={user.role}>
                  <SelectTrigger>
                    <SelectValue placeholder='Rol seçin' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='admin'>Admin</SelectItem>
                    <SelectItem value='user'>User</SelectItem>
                    <SelectItem value='editor'>Editor</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className='space-y-2'>
                <label htmlFor='status' className='text-sm font-medium'>
                  Durum
                </label>
                <Select name='status' defaultValue={user.status}>
                  <SelectTrigger>
                    <SelectValue placeholder='Durum seçin' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='active'>Aktif</SelectItem>
                    <SelectItem value='inactive'>Pasif</SelectItem>
                    <SelectItem value='pending'>Beklemede</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className='flex justify-end space-x-2'>
              <Button
                variant='outline'
                type='button'
                onClick={() => window.history.back()}
              >
                İptal
              </Button>
              <Button type='submit'>Güncelle</Button>
            </div>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
