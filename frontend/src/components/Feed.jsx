import React from 'react'
import Post from './Post'
import Tweet from './Tweet'

const Feed = () => {
  return (
    <div className='w-[60%]'>
      <Post/>
      <Tweet/>
    </div>
  )
}

export default Feed
