import { useState, useEffect } from 'react'
import axios from 'axios'
import './style.css'

function App() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [content, setContent] = useState('')
  const [token, setToken] = useState('')
  const [posts, setPosts] = useState([])

  const register = async () => {
    await axios.post('http://localhost:8000/api/user/register/', {
      username, password
    })
    alert("Registered!")
  }

  const login = async () => {
    const res = await axios.post('http://localhost:8000/api/token/', {
      username, password
    })
    setToken(res.data.access)
  }

  const submitPost = async () => {
    await axios.post('http://localhost:8000/api/posts/', { content }, {
      headers: { Authorization: `Bearer ${token}` }
    })
    setContent('')
    fetchPosts()
  }

  const fetchPosts = async () => {
    const res = await axios.get('http://localhost:8000/api/posts/', {
      headers: { Authorization: `Bearer ${token}` }
    })
    setPosts(res.data)
  }

  useEffect(() => {
    if (token) fetchPosts()
  }, [token])

  return (
    <div className="container">
      <h2>Login or Register</h2>
      <input placeholder="Username" onChange={e => setUsername(e.target.value)} />
      <input type="password" placeholder="Password" onChange={e => setPassword(e.target.value)} />
      <button className="register" onClick={register}>Register</button>
      <button className="login" onClick={login}>Login</button>

      {token && (
        <>
          <h3>Post Something</h3>
          <textarea value={content} onChange={e => setContent(e.target.value)} placeholder="Your post here..." />
          <button className="post" onClick={submitPost}>Submit</button>

          <h3>All Posts</h3>
          {posts.map(post => (
            <div key={post.id} className="post">{post.content}</div>
          ))}
        </>
      )}
    </div>
  )
}

export default App
