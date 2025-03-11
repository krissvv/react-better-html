export type ComponentStyle = React.CSSProperties;
export type ComponentHoverStyle = {
   [CSSProperty in keyof ComponentStyle as `${CSSProperty & string}Hover`]: ComponentStyle[CSSProperty];
};

export type ComponentMarginProps = {
   margin?: ComponentStyle["margin"];
   marginTop?: ComponentStyle["marginTop"];
   marginBottom?: ComponentStyle["marginBottom"];
   marginLeft?: ComponentStyle["marginLeft"];
   marginRight?: ComponentStyle["marginRight"];
   marginBlock?: ComponentStyle["marginBlock"];
   marginInline?: ComponentStyle["marginInline"];
};
export type ComponentPaddingProps = {
   padding?: ComponentStyle["padding"];
   paddingTop?: ComponentStyle["paddingTop"];
   paddingBottom?: ComponentStyle["paddingBottom"];
   paddingLeft?: ComponentStyle["paddingLeft"];
   paddingRight?: ComponentStyle["paddingRight"];
   paddingBlock?: ComponentStyle["paddingBlock"];
   paddingInline?: ComponentStyle["paddingInline"];
};
