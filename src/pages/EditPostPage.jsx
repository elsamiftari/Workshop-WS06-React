import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import PostForm from '../components/PostForm.jsx'

function EditPostPage() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [post, setPost] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    async function fetchPost() {
      try {
        const res = await fetch(`/api/posts/${id}`)
        const data = await res.json()
        setPost(data)
      } finally {
        setLoading(false)
      }
    }

    fetchPost()
  }, [id])

  async function handleSubmit(e) {
    e.preventDefault()
    setSubmitting(true)

    const formData = new FormData(e.target)

    const updated = {
      title: formData.get('title'),
      content: formData.get('content'),
      author: formData.get('author')
    }

    try {
      const res = await fetch(`/api/posts/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated)
      })

      if (!res.ok) throw new Error('Update failed')

      navigate(`/posts/${id}`)
    } catch (err) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) return <p>Loading…</p>
  if (!post) return <p>No post</p>

  return (
    <div>
      <h1>Edit post</h1>
      {error && <p>{error}</p>}

      <PostForm
        initialData={post}
        onSubmit={handleSubmit}
        submitting={submitting}
      />
    </div>
  )
}

export default EditPostPage