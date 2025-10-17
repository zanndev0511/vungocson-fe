import type { FeaturedCelebrityProps } from '@interfaces/components/featuredCelebrity'
import React from 'react'
import "@styles/components/featuredCeleb.scss";

export const FeaturedCelebs: React.FC<FeaturedCelebrityProps> = (props) => {
    const {data} = props
  return (
    <div className='featuredCeleb-container'>
        {data.map((item) => <div className='featuredCeleb-image-wrap'>
            <img src={item.image} alt='' className='featuredCeleb-image'/>
        </div>)}
    </div>
  )
}
