import type { Types } from "mongoose"

export interface IUser {
  _id: Types.ObjectId
  name: string
  email: string
  password?: string // Password might not always be populated
  role: "user" | "admin"
  createdAt: Date
  updatedAt: Date
}

export interface ILoan {
  _id: Types.ObjectId
  user: Types.ObjectId | IUser // Can be populated or just ID
  amount: number
  reason: string
  documents: string[]
  status: "pending" | "approved" | "repaid" | "withdrawn" | "rejected"
  withdrawn: boolean
  repaidAmount: number
  repaidAt?: Date
  createdAt: Date
  updatedAt: Date
}

export interface IReply {
  _id: Types.ObjectId
  sender: Types.ObjectId | IUser // Can be populated or just ID
  message: string
  createdAt: Date
  updatedAt: Date
}

export interface ISupport {
  _id: Types.ObjectId
  user: Types.ObjectId | IUser // Can be populated or just ID
  subject: string
  message: string
  status: "open" | "closed"
  replies: IReply[]
  createdAt: Date
  updatedAt: Date
}

export interface IDashboardStats {
  totalUsers: {
    value: string
    change: string
    icon: string
    color: string
    bgColor: string
  }
  activeLoans: {
    value: string
    change: string
    icon: string
    color: string
    bgColor: string
  }
  totalDisbursed: {
    value: string
    change: string
    icon: string
    color: string
    bgColor: string
  }
  approvalRate: {
    value: string
    change: string
    icon: string
    color: string
    bgColor: string
  }
}

export interface IRecentActivity {
  type: string
  user: string | null
  amount: string | null
  time: string
  icon: string
  color: string
  description?: string
}
