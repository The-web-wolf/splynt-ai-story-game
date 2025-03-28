'use client'
import Image from 'next/image'

import shapeOne from '@/public/images/bg/icon-shape/icon-1.svg'
import shapeThree from '@/public/images/bg/icon-shape/icon-2.svg'
import shapeTwo from '@/public/images/bg/icon-shape/icon-3.svg'
import shapeFour from '@/public/images/bg/icon-shape/icon-4.svg'

const Shapes = () => {
  return (
    <div className="inner-shape">
      <Image
        src={shapeOne}
        width={100}
        height={95}
        alt="Icon Shape"
        className="iconshape iconshape-one"
      />
      <Image
        src={shapeTwo}
        width={60}
        height={57}
        alt="Icon Shape"
        className="iconshape iconshape-two"
      />
      <Image
        src={shapeThree}
        width={42}
        height={31}
        alt="Icon Shape"
        className="iconshape iconshape-three"
      />
      <Image
        src={shapeFour}
        width={100}
        height={95}
        alt="Icon Shape"
        className="iconshape iconshape-four"
      />
    </div>
  )
}

export default Shapes
