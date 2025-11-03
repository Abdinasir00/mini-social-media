
// export const BASE_URL = "https://connecthub-three.vercel.app"

// export const BASE_URL =   "/api"



export const BASE_URL = import.meta.env.PROD
  ? "https://connecthub-three.vercel.app/api"
  : "/api";