import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'

function PostPage() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [post, setPost] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    async function fetchPost() {
      try {
        setLoading(true)

        const res = await fetch(`/api/posts/${id}`)
        if (!res.ok) throw new Error('Post not found')

        const data = await res.json()
        setPost(data)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchPost()
  }, [id])

  async function handleDelete() {
    try {
      setDeleting(true)

      const res = await fetch(`/api/posts/${id}`, {
        method: 'DELETE'
      })

      if (!res.ok) throw new Error('Delete failed')

      navigate('/blog')
    } catch (err) {
      setError(err.message)
    } finally {
      setDeleting(false)
    }
  }

  if (loading) return <p>Loading…</p>
  if (!post) return <p>Post not found</p>

  return (
    <article>
      <h1>{post.title}</h1>
      <p>{post.content}</p>
      <p>{post.author}</p>

      <Link to={`/posts/${id}/edit`}>Edit</Link>

      <button onClick={handleDelete} disabled={deleting}>
        {deleting ? 'Deleting…' : 'Delete'}
      </button>
    </article>
  )
}

export default PostPage