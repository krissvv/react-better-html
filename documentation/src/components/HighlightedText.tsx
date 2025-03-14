type HighlightedTextProps = {
   color: string;
   isLight?: boolean;
   children: React.ReactNode;
};

function HighlightedText({ color, isLight, children }: HighlightedTextProps) {
   return (
      <span
         style={{
            color: isLight ? "#111111" : "#f8f8f8",
            backgroundColor: color,
            border: "solid 1px #f8f8f860",
            borderRadius: "6px",
            paddingBlock: "3px",
            paddingInline: "9px",
         }}
      >
         {children}
      </span>
   );
}

export default HighlightedText;
