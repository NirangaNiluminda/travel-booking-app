import AXIOS_API from "@/utils/axiosAPI";

export async function getListingById(id) {
    // Add timestamp to prevent caching
    const timestamp = new Date().getTime();
    
    try {
        const { data } = await AXIOS_API.get(`/listing/details/${id}?_t=${timestamp}`, {
            headers: {
                'Cache-Control': 'no-cache, no-store, must-revalidate',
                'Pragma': 'no-cache',
                'Expires': '0'
            }
        });

        if (data && data.imageUrls && data.imageUrls.length > 0) {
            try {
                // Also add cache busting for the image
                const { data: base64 } = await AXIOS_API.get(`/base64?url=${data.imageUrls[0]}&_t=${timestamp}`);
                data.blurredImage = base64;
            } catch (imageError) {
                console.error("Failed to load blurred image:", imageError);
                // Continue without blur if it fails
                data.blurredImage = null;
            }
        }

        return data;
    } catch (error) {
        console.error(`Error fetching listing ${id}:`, error);
        throw error; // Rethrow to be handled by React Query
    }
}

export async function postReview(id, body) {
    try {
        const { data } = await AXIOS_API.post(`/review?id=${id}`, body);
        return data;
    } catch (error) {
        console.error(`Error posting review for listing ${id}:`, error);
        throw error;
    }
}

export async function getReviewsByListing(id) {
    // Add timestamp to prevent caching
    const timestamp = new Date().getTime();
    
    try {
        const { data } = await AXIOS_API.get(`/review/${id}?_t=${timestamp}`, {
            headers: {
                'Cache-Control': 'no-cache, no-store, must-revalidate',
                'Pragma': 'no-cache',
                'Expires': '0'
            }
        });

        return data;
    } catch (error) {
        console.error(`Error fetching reviews for listing ${id}:`, error);
        throw error;
    }
}

// Add a new function to get best hotels with cache busting
export async function getBestHotels() {
    const timestamp = new Date().getTime();
    
    try {
        const { data } = await AXIOS_API.get(`/listing/best?_t=${timestamp}`, {
            headers: {
                'Cache-Control': 'no-cache, no-store, must-revalidate',
                'Pragma': 'no-cache',
                'Expires': '0'
            }
        });

        return data;
    } catch (error) {
        console.error("Error fetching best hotels:", error);
        throw error;
    }
}