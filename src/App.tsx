import { useEffect, useState } from 'react'
import { supabase } from './lib/supabase'

function App() {
  const [data, setData] = useState<any>(null)
  const [error, setError] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      try {
        const result = await supabase.from('subjects').select('*')
        setData(result.data)
        setError(result.error)
      } catch (err) {
        setError(err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1>Supabase Connection Test</h1>
      {loading ? (
        <p>Loading data from Supabase...</p>
      ) : (
        <pre style={{ background: '#f4f4f4', padding: '1rem', borderRadius: '5px', overflowX: 'auto' }}>
          {JSON.stringify({ data, error }, null, 2)}
        </pre>
      )}
    </div>
  )
}

export default App