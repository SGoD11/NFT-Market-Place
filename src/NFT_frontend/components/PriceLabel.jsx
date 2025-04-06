import React from 'react'

const PriceLabel = (props) => {
  return (
    <div className='disButtonBase-root disChip-root makeStyles-price-23 disChip-outlined'>
        <span className='disChip-label'>{props.sellPrice} Dang</span>
    </div>

  )
}

export default PriceLabel