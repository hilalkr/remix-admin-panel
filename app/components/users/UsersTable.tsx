"use client"

import { useState, useMemo } from "react"
import { useNavigate } from "@remix-run/react"
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react"

import { getColumns } from "~/components/data-table/columns"
import { DeleteConfirmDialog } from "~/components/users/DeleteConfirmDialog"
import { User } from "~/services/users.server"
import { DataTable } from "~/components/data-table/data-table"
import { Button } from "~/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu"

export default function UsersTable({ users }: { users: User[] }) {
  const navigate = useNavigate()
  const [selectedUser, setSelectedUser] = useState<User | null>(null)

  const columns = useMemo(() => {
    return [
      ...getColumns({
        onEdit: (id) => navigate(`/dashboard/users/edit/${id}`),
        onDeleteConfirm: (id) => {
          const user = users.find((u) => u.id === id)
          if (user) setSelectedUser(user)
        },
      }),
      {
        id: "actions",
        cell: ({ row }) => {
          const user = row.original as User
          return (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>İşlemler</DropdownMenuLabel>
                <DropdownMenuItem onClick={() => navigator.clipboard.writeText(user.id)}>
                  Kullanıcı ID kopyala
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate(`/dashboard/users/edit/${user.id}`)}>
                  <Pencil className="mr-2 h-4 w-4" /> Kullanıcıyı düzenle
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSelectedUser(user)} className="text-destructive">
                  <Trash2 className="mr-2 h-4 w-4" /> Kullanıcıyı sil
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )
        },
      },
    ]
  }, [navigate, users])

  return (
    <>
      <DataTable data={users} columns={columns} />
      {selectedUser && (
        <DeleteConfirmDialog
          userId={selectedUser.id}
          userName={selectedUser.name}
          isOpen={true}
          onClose={() => setSelectedUser(null)}
          onSuccess={() => location.reload()} // ya da state güncelle
        />
      )}
    </>
  )
} 