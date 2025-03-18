export type ComponentStyle = React.CSSProperties;
export type ComponentHoverStyle = {
   [CSSProperty in keyof ComponentStyle as `${CSSProperty & string}Hover`]: ComponentStyle[CSSProperty];
};

export type ComponentMarginProps = Pick<
   ComponentStyle,
   "margin" | "marginTop" | "marginBottom" | "marginLeft" | "marginRight" | "marginBlock" | "marginInline"
>;
export type ComponentPaddingProps = Pick<
   ComponentStyle,
   "padding" | "paddingTop" | "paddingBottom" | "paddingLeft" | "paddingRight" | "paddingBlock" | "paddingInline"
>;

export type ComponentPropWithRef<ComponentRef, ComponentProps> = ComponentProps & { ref?: React.Ref<ComponentRef> };
