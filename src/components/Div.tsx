import { memo } from "react";

type DivProps = {
   children?: React.ReactNode;
};

function Div({ children }: DivProps) {
   return <div>{children}</div>;
}

export default memo(Div);
