import  { useState } from 'react'

export const Test = () => {
	const [v, setV] = useState("");
  return(
    <div>
	<input value={v} onChange={(e) => setV(e.target.value)} />
	{v}
    </div>
  )
}
