// /src/app/admin/(pages)/users/table/Columns.jsx
"use client"
import Image from 'next/image'
import person_image from '../../../../../../public/assets/bianco_2.png'
import { format } from 'timeago.js'
import { FaPen, FaTrash } from "react-icons/fa"
import { AiOutlineArrowDown, AiOutlineArrowUp } from 'react-icons/ai'

export const columns = [
    {
        accessorKey: "profilePhoto",
        header: "Profile Photo",
        cell: ({ row }) => (
            <Image
                className="h-10 w-10 rounded-full object-cover"
                height="40"
                width="50"
                src={person_image}
                alt="Person's image"
            />
        )
    },
    {
        accessorKey: "username",
        header: "Username",
    },
    {
        accessorKey: "email",
        header: ({ column }) => (
            <button
                className="flex items-center gap-1"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
                Email
                <span className="flex items-center">
                    <AiOutlineArrowUp />
                    <AiOutlineArrowDown />
                </span>
            </button>
        ),
    },
    {
        accessorKey: "reservations",
        header: ({ column }) => (
            <button
                className="flex items-center gap-1"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
                Reservations
                <span className="flex items-center">
                    <AiOutlineArrowUp />
                    <AiOutlineArrowDown />
                </span>
            </button>
        ),
        cell: ({ row }) => {
            const value = row.getValue("reservations")?.length || 0
            return <div>{value} reservations</div>
        }
    },
    {
        accessorKey: "createdAt",
        header: "Created At",
        cell: ({ row }) => {
            const value = row.getValue("createdAt")
            return <div>{format(value)}</div>
        }
    },
    {
        accessorKey: "actions",
        header: "Actions",
        cell: ({ row }) => {
            const { id: userId } = row.original
            return (
                <div className="flex gap-2">
                    <button
                        className="cursor-pointer disabled:bg-slate-200 px-2 py-1 rounded-xl"
                        onClick={() => handleDeleteUser(userId)}
                    >
                        <FaTrash color="#f00" />
                    </button>
                    <button
                        className="cursor-pointer disabled:bg-slate-200 px-2 py-1 rounded-xl"
                    >
                        <FaPen color="#31b608" />
                    </button>
                </div>
            )
        }
    },
]