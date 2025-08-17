export interface User {
    id: string
    name: string
    email: string
    hasPaidFor?: {
      courseIds: string[]
    }
  }