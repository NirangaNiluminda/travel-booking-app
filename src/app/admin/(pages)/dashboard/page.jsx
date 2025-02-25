"use client"
import React from 'react'
import { signOut } from "next-auth/react"
import { useRouter } from 'next/navigation'
import AdminLayout from '../../layout/AdminLayout'
import { AiFillBank, AiOutlineHome, AiOutlineUser, AiOutlineLogout } from 'react-icons/ai'
import { MdHotel } from 'react-icons/md'
import { useWidgetHook } from '../../hooks/widget-hook'
import Widget from '../../components/Widget'
import BigWidget from '../../components/BigWidget'
import Chart from '../../components/Chart'
import { toast } from 'react-hot-toast'

const Dashboard = () => {
  const router = useRouter()
  const [
    usersQuery,
    listingsQuery,
    reservationsQuery,
    revenueQuery,
    mostReservedQuery
  ] = useWidgetHook()

  const widgetData = [
    {
      page: "users",
      data: usersQuery.data,
      icon: <AiOutlineUser color="#efefef" />
    },
    {
      page: "listings",
      data: listingsQuery.data,
      icon: <MdHotel color="#efefef" />
    },
    {
      page: "reservations",
      data: reservationsQuery.data,
      icon: <AiOutlineHome color="#efefef" />
    },
    {
      page: "revenue",
      data: revenueQuery.data,
      icon: <AiFillBank color="#efefef" />
    },
  ]

  const handleLogout = async () => {
    try {
      await signOut({ redirect: false })
      toast.success("Logged out successfully")
      router.push("/login")
    } catch (error) {
      console.error("Logout error:", error)
      toast.error("Failed to logout")
    }
  }

  return (
    <AdminLayout>
      <div className="ml-2 w-full h-full flex flex-col col-span-7 overflow-hidden">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-slate-800">Admin Dashboard</h1>
          <button 
            onClick={handleLogout}
            className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md transition-colors"
          >
            <AiOutlineLogout />
            Logout
          </button>
        </div>

        <div className="grid grid-cols-4 gap-8">
          {widgetData?.map(({ page, data, icon }) => (
            <Widget
              key={page}
              page={page}
              data={data}
              icon={icon}
            />
          ))}
        </div>
        <div className="mt-28 grid grid-cols-7 gap-16">
          <BigWidget 
            listing={mostReservedQuery.data}
          />
          <Chart />
        </div>
      </div>
    </AdminLayout>
  )
}

export default Dashboard