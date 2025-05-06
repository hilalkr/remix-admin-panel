import { redirect } from "@remix-run/node";
import { 
  deleteUser, 
  getUserById, 
  updateUser, 
  type User
} from "~/services/users.server";

// Kullanıcı silme işlemi
export async function handleDeleteUser(userId: string) {
  const isDeleted = await deleteUser(userId);
  
  if (!isDeleted) {
    throw new Error("Kullanıcı silinemedi");
  }
  
  return { success: true };
}

// Kullanıcı düzenleme sayfasına yönlendirme
export async function redirectToEditUser(userId: string) {
  const user = await getUserById(userId);
  
  if (!user) {
    throw new Error("Kullanıcı bulunamadı");
  }
  
  return redirect(`/dashboard/users/edit/${userId}`);
}

// Kullanıcı bilgilerini güncelleme
export async function handleUpdateUser(userId: string, data: Partial<Omit<User, 'id' | 'dateAdded'>>) {
  const updatedUser = await updateUser(userId, data);
  
  if (!updatedUser) {
    throw new Error("Kullanıcı güncellenemedi");
  }
  
  return updatedUser;
}