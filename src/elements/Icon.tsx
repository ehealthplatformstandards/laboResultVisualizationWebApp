import React from 'react'
import PropTypes from 'prop-types'
import spriteSrc from '../assets/images/sprite.svg'

const Icon = (props: { name: string }) => (
  <svg className={`icon icon-${props.name}`}>
    <use xlinkHref={`${spriteSrc}#icon-${props.name}`} />
  </svg>
)

Icon.defaultProps = {
  name: '',
}

Icon.propTypes = {
  name: PropTypes.string,
}
export default Icon
