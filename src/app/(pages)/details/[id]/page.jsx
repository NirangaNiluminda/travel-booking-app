"use client"
import Image from 'next/image'
import { register } from "swiper/element/bundle"
import { CiLocationOn } from "react-icons/ci"
import { FaBed, FaWifi } from "react-icons/fa"
import React, { useRef, useState, useEffect } from 'react'
import { AiFillStar } from 'react-icons/ai'
import { format } from 'currency-formatter'
import BookModal from '@/components/book-modal/BookModal'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { getListingById } from './service'
import { ClipLoader } from 'react-spinners'
import Reviews from './Reviews'
import { useRouter } from 'next/navigation'

register()

const HotelDetails = (ctx) => {
  const id = ctx.params.id
  const [showModal, setShowModal] = useState(false)
  const swiperElRef = useRef(null)
  const router = useRouter()
  const queryClient = useQueryClient()

  // Force cache clearing and refetch on component mount
  useEffect(() => {
    // Clear this specific listing from cache
    queryClient.removeQueries(["listings", { id }])
    
    // Force refetch
    queryClient.refetchQueries(["listings", { id }], { force: true })
  }, [id, queryClient])

  const { data: listing, isPending, isError, error, refetch } = useQuery({
    queryKey: ["listings", { id }],
    queryFn: () => getListingById(id),
    refetchOnMount: "always",
    staleTime: 0,
    cacheTime: 0,
    retry: 1,
    onError: (error) => {
      console.error("Error fetching listing:", error)
      // If the listing doesn't exist (404) or other error,
      // redirect to the listings page after a short delay
      setTimeout(() => {
        router.push('/listings')
      }, 2000)
    }
  })

  const handleShowModal = () => setShowModal(prev => true)
  const handleHideModal = () => setShowModal(prev => false)

  // Handle error state
  if (isError) {
    return (
      <div className="min-h-screen w-full mt-24 flex flex-col items-center justify-center">
        <h2 className="text-2xl text-red-500 mb-4">
          {error.response?.status === 404 
            ? "This listing no longer exists" 
            : "Error loading listing details"}
        </h2>
        <p className="mb-4">You will be redirected to the listings page...</p>
        <button 
          onClick={() => router.push('/listings')}
          className="px-4 py-2 bg-blue-500 text-white rounded-md"
        >
          Go to Listings
        </button>
      </div>
    )
  }

  // Handle loading state
  if (isPending) {
    const style = {
      marginTop: "5rem",
      position: "absolute",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      height: "100vh"
    }

    return (
      <div style={style}>
        <ClipLoader color={"#123abc"} />
      </div>
    )
  }

  // Safety check if the listing is null or undefined
  if (!listing) {
    return (
      <div className="min-h-screen w-full mt-24 flex flex-col items-center justify-center">
        <h2 className="text-2xl text-red-500 mb-4">Listing not found</h2>
        <button 
          onClick={() => router.push('/listings')}
          className="px-4 py-2 bg-blue-500 text-white rounded-md"
        >
          Go to Listings
        </button>
      </div>
    )
  }

  return (
    <div className={`min-h-screen w-full mt-24 ${showModal && "overflow-hidden"}`}>
      {showModal &&
        <BookModal
          listing={listing}
          handleHideModal={handleHideModal}
        />
      }
      <div className="h-full w-3/4 mx-auto">
        <div className="mb-4 flex justify-between items-center">
          <h1 className="font-bold text-2xl">Hotel Details</h1>
          <button 
            onClick={() => {
              queryClient.removeQueries(["listings", { id }])
              refetch()
            }}
            className="px-4 py-2 bg-blue-500 text-white rounded-md"
          >
            Refresh Data
          </button>
        </div>
        <div>
          <div className="w-full h-[750px] overflow-hidden mx-auto">
            <div className="w-full h-full">
              <swiper-container
                ref={swiperElRef}
                slides-per-view="1"
                navigation="true"
              >
                {listing?.imageUrls?.map((imageUrl, index) => (
                  <swiper-slide key={`${imageUrl}-${index}`}>
                    <Image
                      className="h-[750px] w-full object-cover rounded-lg"
                      height="750"
                      width="750"
                      src={imageUrl}
                      blurDataURL={listing.blurredImage || "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII="}
                      placeholder="blur"
                      alt={`${listing.name} image ${index + 1}`}
                    />
                  </swiper-slide>
                ))}
              </swiper-container>
            </div>
          </div>
          <div className="mt-12 px-6 w-full flex items-center justify-between">
            <h2 className="font-bold text-4xl">
              {listing.name}
            </h2>
            <div>
              <span
                className="p-2 px-4 text-[22px] rounded-full bg-blue-600 text-white flex items-center gap-2"
              >
                <AiFillStar color="white" />
                <span className="text-white">
                  {listing.avgRating || "New"}
                </span>
              </span>
              <span>
                {listing.reviews?.length || 0} reviews
              </span>
            </div>
          </div>
          <div className="mt-16 px-6 flex items-center gap-8">
            <span className="flex items-center gap-2">
              <CiLocationOn />
              {listing.location}
            </span>
            <span className="flex items-center gap-2">
              {format(listing.pricePerNight, { locale: "en-US" })}/night
            </span>
            <span className="flex items-center gap-2">
              {listing.beds} <FaBed />
            </span>
            {listing.hasFreeWifi &&
              <span className="flex items-center gap-2">
                Free <FaWifi />
              </span>
            }
          </div>
          <div className="mt-16 px-6 w-full flex items-end justify-between">
            <p className="text-xl max-w-xl text-slate-700">
              {listing.desc}
            </p>
            <button
              onClick={handleShowModal}
              className="cursor-pointer rounded-lg py-2 px-6 text-xl text-white bg-blue-500"
            >
              Book
            </button>
          </div>
        </div>
        <div className="border-t-2 border-white-800 px-6 mt-16 mx-auto" >
          <h1 className="mt-16 text-3xl font-bold">
            Reviews
          </h1>
          <Reviews
            id={id}
          />
        </div>
      </div>
    </div>
  )
}

export default HotelDetails