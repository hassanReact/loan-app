export interface IUser {
  _id?: string
  id?: number // For mock data
  name: string
  email: string
  role: "user" | "admin"
  createdAt: string
  updatedAt?: string
}

export interface ILoan {
  _id?: string
  user: IUser | string // Can be populated user object or just user ID
  amount: number
  reason: string
  documents: string[] // URLs of uploaded documents
  status: "pending" | "approved" | "rejected" | "repaid"
  createdAt: string
  updatedAt?: string
  repaidAt?: string
  remainingAmount?: number // For loan repayment tracking
}

export interface IReply {
  _id?: string
  sender: IUser | string // Can be populated user object or just user ID
  message: string
  createdAt: string
}

export interface ISupport {
  _id?: string
  user: IUser | string // Can be populated user object or just user ID
  subject: string
  message: string
  status: "open" | "closed"
  replies: IReply[]
  createdAt: string
  updatedAt?: string
}

export interface IDashboardStatItem {
  value: string
  change: string
  icon: string
  color: string
  bgColor: string
}

export interface IDashboardStats {
  totalUsers: IDashboardStatItem
  activeLoans: IDashboardStatItem
  totalDisbursed: IDashboardStatItem
  approvalRate: IDashboardStatItem
}

export interface IRecentActivity {
  type: string
  user: string
  amount: string | null
  time: string
  icon: string
  color: string
}

export interface IJwtPayload {
  userId: string
  role: string
  iat: number
  exp: number
}
