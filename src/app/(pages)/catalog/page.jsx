"use client"
import React, { useEffect } from 'react'
import Select from '@/ui/Select'
import { optionLocations, optionTypes } from '@/data/data'
import Input from '@/ui/Input'
import Button from '@/ui/Button'
import Card from '@/components/best-hotels/Card'
import { useRouter, useSearchParams } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { schema } from "./schema"
import { toast } from 'react-hot-toast'
import { Suspense } from 'react'
import Image from 'next/image'


// Server Component for data fetching
async function fetchListings({ city, min_price, max_price, type }) {
  const cityData = optionLocations.find(location => location.value === city)
  const { city_name, image } = cityData || { city_name: "Unknown City", image: "/default.jpg" }
  // Fetch listings based on filter criteria
  const listings = await getFilteredListings({ city, min_price, max_price, type })
  return { listings, city_name, image }
}

// Client Component wrapped in Suspense
const CatalogContent = ({ initialData }) => {
 
  const { listings, city_name, image } = initialData
  const searchParams = useSearchParams()
  const router = useRouter()

  const city = searchParams.get("city")
  const min_price = searchParams.get("min_price")
  const max_price = searchParams.get("max_price")
  const type = searchParams.get("type")

  const defaultValues = {
    location: city_name,
    min_price,
    max_price,
    type
  }

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    defaultValues,
    resolver: zodResolver(schema)
  })

  useEffect(() => {
    if (errors) {
      Object.keys(errors).forEach((key) => {
        toast.error(errors[key]?.message)
      })
    }
  }, [errors])

  const onSubmit = async (data) => {
    const newUrl = `/catalog?city=${data.location}&min_price=${data.min_price}&max_price=${data.max_price}&type=${data.type}`
    router.push(newUrl, { scroll: false })
  }

  return (
    <div className="min-h-screen w-full">
      <div className="relative h-3/5 w-full">
        <div className="relative h-screen w-full">
          <Image
            src={image}
            alt={`${city_name} view`}
            fill
            priority
            className="brightness-50 object-cover"
          />
        </div>
        <h3 className="absolute text-6xl capitalize font-semibold flex items-center justify-center bottom-0 left-0 right-0 top-0 text-white">
          {city_name}
        </h3>
      </div>
      <div className="relative z-20 -mt-12 h-full w-full flex flex-col items-center">
        <form onSubmit={handleSubmit(onSubmit)} className="border w-2/3 h-28 border-slate-500 px-4 py-12 rounded-xl bg-blue-600 text-white flex justify-between items-center">
          <div className="flex flex-col items-center gap-1">
            <h3 className="ml-1 text-[#efefef] font-semibold">
              City
            </h3>
            <Select
              register={register("location")}
              data={optionLocations}
              className="text-blue-800 p-2 rounded-xl outline-none captalize"
            />
          </div>
          <div className="flex flex-col items-center gap-1">
            <h3 className="ml-1 text-[#efefef] font-semibold">
              Price
            </h3>
            <div className="flex items-center gap-2">
              <Input
                register={register("min_price", { valueAsNumber: true })}
                type="number"
                placeholder="Min. price"
                className="text-blue-800 p-2 rounded-xl outline-none"
              />
              <Input
                register={register("max_price", { valueAsNumber: true })}
                type="number"
                placeholder="Max. price"
                className="text-blue-800 p-2 rounded-xl outline-none"
              />
            </div>
          </div>
          <div className="flex flex-col items-start gap-1">
            <h3 className="ml-1 text-[#efefef] font-semibold">
              Type of hotel
            </h3>
            <Select
              register={register("type")}
              data={optionTypes}
              className="text-blue-800 p-2 rounded-xl outline-none"
            />
          </div>
          <Button
            label="Search"
            className="mt-6 px-6 py-2 text-[20px] bg-white text-blue-600 rounded-xl transition-all hover:bg-[#efefef]"
          />
        </form>
        <div className="w-full mt-36 flex flex-wrap justify-center items-center gap-14">
          {listings?.length > 0 ? listings.map((place, idx) => (
            <Card
              key={idx}
              place={place}
            />
          )) : <h2 className="text-center font-bold text-4xl text-slate-700">No listing with those filters</h2>}
        </div>
      </div>
    </div>
  )
}

// Main Page Component
export default async function CatalogPage({ searchParams }) {
  const { city, min_price, max_price, type } = searchParams
  const data = await fetchListings({ city, min_price, max_price, type })
  
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CatalogContent initialData={data} />
    </Suspense>
  )
}