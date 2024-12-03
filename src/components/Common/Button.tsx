import { Button } from 'antd';
import { ReactNode } from 'react';

interface ButtonProps {
  children: ReactNode;
}

const StyledButton = ({ children, ...props }: ButtonProps) => {
  return (
    <Button
      className="rounded bg-primary p-3 font-medium text-gray hover:!bg-[#4052d4] border-none"
      {...props}
    >
      {children}
    </Button>
  );
};

export default StyledButton;
