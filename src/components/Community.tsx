import { useState, useEffect } from 'react'
import useCommunity from '@/hooks/useCommunity'
import useIdentity from '@/hooks/useIdentity'
import PostList from './community/PostList'
import PostDetail from './community/PostDetail'
import CreatePostForm from './community/CreatePostForm'
import { createPost } from '@/shared/communityApi'

type View = 'list' | 'detail' | 'create'

export default function Community() {
  const community = useCommunity()
  const { getUsername, ensureIdentity } = useIdentity()
  const [view, setView] = useState<View>('list')
  const [postType, setPostType] = useState('')

  useEffect(() => {
    community.loadPosts(1, postType || undefined)
  }, [postType])

  const handleSelectPost = (id: number) => {
    community.openPost(id)
    setView('detail')
  }

  const handleBack = () => {
    community.closePost()
    setView('list')
  }

  const handlePostTypeChange = (type: string) => {
    setPostType(type)
  }

  const handlePageChange = (page: number) => {
    community.loadPosts(page, postType || undefined)
  }

  const handleCreatePost = async (title: string, body: string, type: string) => {
    await ensureIdentity()
    await createPost(title, body, type)
    setView('list')
    community.loadPosts(1, postType || undefined)
  }

  const handleDeleted = () => {
    setView('list')
    community.loadPosts(community.page, postType || undefined)
  }

  return (
    <div className="panel">
      {view === 'list' && (
        <PostList
          posts={community.posts}
          total={community.total}
          page={community.page}
          pageSize={community.pageSize}
          loading={community.loading}
          error={community.error}
          postType={postType}
          onPostTypeChange={handlePostTypeChange}
          onPageChange={handlePageChange}
          onSelectPost={handleSelectPost}
          onWrite={() => setView('create')}
        />
      )}

      {view === 'detail' && community.detailLoading && (
        <p className="state-msg">Loading...</p>
      )}
      {view === 'detail' && community.detailError && (
        <p className="state-msg error">{community.detailError}</p>
      )}
      {view === 'detail' && community.selectedPost && (
        <PostDetail
          post={community.selectedPost}
          username={getUsername()}
          onBack={handleBack}
          onRefresh={community.refreshDetail}
          ensureIdentity={ensureIdentity}
          onDeleted={handleDeleted}
        />
      )}

      {view === 'create' && (
        <CreatePostForm
          onSubmit={handleCreatePost}
          onCancel={() => setView('list')}
        />
      )}
    </div>
  )
}
