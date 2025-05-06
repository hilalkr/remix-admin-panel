"use client"

import { useState } from "react"
import type { ColumnDef } from "@tanstack/react-table"
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react"
import { useNavigate } from "@remix-run/react"

import { Button } from "~/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu"
import { Checkbox } from "~/components/ui/checkbox"
import { DataTableColumnHeader } from "~/components/data-table/data-table-column-header"
import { Badge } from "~/components/ui/badge"
import { Role, Status, User } from "~/services/users.server"
import { DeleteConfirmDialog } from "~/components/users/DeleteConfirmDialog"

// Veri tablosunun yenilenmesi için bir callback (parent bileşenden alınacak)
type UserActionCallbacks = {
  onUserDeleted?: () => void;
}

export const getColumns = ({ onUserDeleted }: UserActionCallbacks = {}): ColumnDef<User>[] => [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "id",
    header: ({ column }) => <DataTableColumnHeader column={column} title="ID" />,
    cell: ({ row }) => <div className="font-mono">{row.getValue("id")}</div>,
  },
  {
    accessorKey: "name",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Name" />,
    cell: ({ row }) => <div className="font-medium">{row.getValue("name")}</div>,
  },
  {
    accessorKey: "email",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Email" />,
    cell: ({ row }) => <div>{row.getValue("email")}</div>,
  },
  {
    accessorKey: "role",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Role" />,
    cell: ({ row }) => {
      const role = row.getValue("role") as Role

      return <div className="capitalize">{role}</div>
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
  },
  {
    accessorKey: "status",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
    cell: ({ row }) => {
      const status = row.getValue("status") as Status

      return (
        <Badge
          variant={status === "active" ? "default" : status === "pending" ? "secondary" : "destructive"}
          className="capitalize"
        >
          {status}
        </Badge>
      )
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
  },
  {
    accessorKey: "dateAdded",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Date Added" />,
    cell: ({ row }) => <div>{new Date(row.getValue("dateAdded")).toLocaleDateString()}</div>,
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const user = row.original
      const navigate = useNavigate()
      const [showDeleteDialog, setShowDeleteDialog] = useState(false)

      const handleEdit = () => {
        navigate(`/dashboard/users/edit/${user.id}`)
      }

      return (
        <>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Menüyü aç</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>İşlemler</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => navigator.clipboard.writeText(user.id)}>Kullanıcı ID kopyala</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleEdit}>
                <Pencil className="mr-2 h-4 w-4" />
                Kullanıcıyı düzenle
              </DropdownMenuItem>
              <DropdownMenuItem 
                className="text-destructive" 
                onClick={() => setShowDeleteDialog(true)}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Kullanıcıyı sil
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Silme onay modalı */}
          <DeleteConfirmDialog 
            userId={user.id}
            userName={user.name}
            isOpen={showDeleteDialog}
            onClose={() => setShowDeleteDialog(false)}
            onSuccess={onUserDeleted}
          />
        </>
      )
    },
  },
]

// Eski columns, backward compatibility için
export const columns = getColumns()
