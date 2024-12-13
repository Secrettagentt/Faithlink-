export interface User {
  id: string
  name: string
  email: string
  image?: string
  location?: string
  bio?: string
}

export interface Post {
  id: string
  content: string
  mediaUrl?: string
  mediaType?: string
  category: string
  userId: string
  user: User
  comments: Comment[]
  likes: Like[]
  createdAt: string
  updatedAt: string
}

export interface Comment {
  id: string
  content: string
  postId: string
  userId: string
  user: User
  createdAt: string
}

export interface Like {
  id: string
  postId: string
  userId: string
  createdAt: string
}

export interface Message {
  id: string
  content: string
  senderId: string
  receiverId: string
  sender: User
  receiver: User
  createdAt: string
  read: boolean
}