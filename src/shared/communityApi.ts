import { GET, POST, DELETE } from './api'
import type { PostListResponse, PostDetail } from '@/types'

export const setIdentity = (name: string) =>
  POST('community/identity', { name })

export const fetchPosts = (page: number, pageSize: number, postType?: string): Promise<PostListResponse> => {
  const params: Record<string, string> = { page: String(page), page_size: String(pageSize) }
  if (postType) params.post_type = postType
  return GET('community/posts', params)
}

export const fetchPostDetail = (postId: number): Promise<PostDetail> =>
  GET(`community/posts/${postId}`)

export const createPost = (title: string, body: string, postType: string) =>
  POST('community/posts', { title, body, post_type: postType })

export const deletePost = (postId: number) =>
  DELETE(`community/posts/${postId}`)

export const createComment = (postId: number, body: string, parentId?: number) =>
  POST(`community/posts/${postId}/comments`, { body, ...(parentId != null && { parent_id: parentId }) })

export const thumbPost = (postId: number, direction: 'up' | 'down') =>
  POST(`community/posts/${postId}/thumb`, { direction })
