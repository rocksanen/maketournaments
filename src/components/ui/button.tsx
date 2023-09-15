import { ReactNode, ButtonHTMLAttributes } from 'react'

// Define the types for the props
type ButtonProps = {
  children: ReactNode
  onClick?: () => void
} & ButtonHTMLAttributes<HTMLButtonElement> // Extending HTML button attributes allows for the className prop and other native button attributes.

export const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  ...props
}) => (
  <button onClick={onClick} {...props}>
    {children}
  </button>
)
