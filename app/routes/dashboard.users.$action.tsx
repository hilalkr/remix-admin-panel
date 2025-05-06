import { json, ActionFunctionArgs, redirect } from "@remix-run/node";
import { handleDeleteUser, redirectToEditUser } from "~/services/userActions.server";

export async function action({ request, params }: ActionFunctionArgs) {
  const formData = await request.formData();
  const userId = formData.get("userId")?.toString();
  
  if (!userId) {
    return json({ success: false, message: "Kullanıcı ID'si gereklidir" }, { status: 400 });
  }
  
  const action = params.action;
  
  try {
    switch (action) {
      case "delete":
        await handleDeleteUser(userId);
        return json({ success: true });
      
      case "edit":
        return redirectToEditUser(userId);
      
      default:
        return json({ success: false, message: "Geçersiz eylem" }, { status: 400 });
    }
  } catch (error) {
    return json(
      { 
        success: false, 
        message: error instanceof Error ? error.message : "Bir hata oluştu" 
      }, 
      { status: 500 }
    );
  }
}

// Loader olmadığı için doğrudan action kullanılacak, bu route render edilmeyecek
export default function UserActionRoute() {
  return null;
} 