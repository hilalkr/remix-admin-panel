import { useState } from "react";
import { useFetcher } from "@remix-run/react";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "~/components/ui/dialog";
import { Button } from "~/components/ui/button";

interface DeleteConfirmDialogProps {
  userId: string;
  userName: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function DeleteConfirmDialog({ 
  userId,
  userName,
  isOpen,
  onClose,
  onSuccess
}: DeleteConfirmDialogProps) {
  const fetcher = useFetcher();
  const isSubmitting = fetcher.state !== "idle";
  
  const handleDelete = () => {
    fetcher.submit(
      { userId },
      { 
        method: "post",
        action: "/dashboard/users/delete",
      }
    );
  };
  type ActionData = { success: boolean; message?: string };
  // İşlem başarılı olduğunda dialog'u kapat ve callback'i çağır
  if ((fetcher.data as ActionData)?.success && isOpen) {
    onClose();
    onSuccess?.();
  }
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Kullanıcıyı Sil</DialogTitle>
          <DialogDescription>
            <p className="mt-2 text-sm text-destructive">
              <strong>{userName}</strong> adlı kullanıcıyı silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.
            </p>
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
            İptal
          </Button>
          <Button 
            variant="destructive" 
            onClick={handleDelete} 
            disabled={isSubmitting}
          >
            {isSubmitting ? "Siliniyor..." : "Sil"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 