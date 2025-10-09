import React from 'react'
import type { ButtonProps } from '@interfaces/components/button';
import '@styles/components/button.scss';

export const Button: React.FC<ButtonProps> = (props) => {
  const { label, className, variant, onClick } = props
  return (
    <div className={`text-font-regular ${className} ${variant === 'hover-underline' ? 'linebtn-hover-underline' : 'linebtn-static-underline'}`} onClick={onClick}>{label}</div>
  )
}
