import React from 'react'

import LocationOnIcon from '@material-ui/icons/LocationOn'

export const Marker = (props) => {
  return (
    <div>
      <LocationOnIcon fontSize='large' style={{ color: '#03a9f4', transform: 'translate(-50%, -40px)' }} />
    </div>
  )
}
