import { memo } from "react";

type DivProps = {
   children?: React.ReactNode;
};

function Div({ children }: DivProps) {
   return <>{children}</>;
}

export default memo(Div);
