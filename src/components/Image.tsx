import { forwardRef, memo, useEffect } from "react";
import styled from "styled-components";

import { AnyOtherString, OmitProps } from "../types/app";
import { ComponentHoverStyle, ComponentPropWithRef, ComponentStyle } from "../types/components";
import { AssetName } from "../types/asset";

import { useComponentPropsWithoutStyle, useComponentPropsWithPrefix, useStyledComponentStyles } from "../utils/hooks";

import Div from "./Div";
import Text from "./Text";
import { useBetterHtmlContextInternal, useTheme } from "./BetterHtmlProvider";

const ImageElement = styled.img.withConfig({
   shouldForwardProp: (prop) => !["normalStyle", "hoverStyle"].includes(prop),
})<{ normalStyle: ComponentStyle; hoverStyle: ComponentStyle }>`
   display: block;
   user-select: none;
   -webkit-user-drag: none;

   ${(props) => props.normalStyle as any}

   &:hover {
      ${(props) => props.hoverStyle as any}
   }
`;

export type ImageProps = {
   name?: AssetName | AnyOtherString;
} & OmitProps<React.ComponentProps<"img">, "style"> &
   ComponentStyle &
   ComponentHoverStyle;

type ImageComponent = {
   (props: ComponentPropWithRef<HTMLImageElement, ImageProps>): React.ReactElement;
   profileImage: (
      props: ComponentPropWithRef<
         HTMLImageElement,
         OmitProps<ImageProps, "width" | "height"> & {
            /** @default 40 */
            size?: number;
            letters?: string;
            backgroundColor?: string;
         }
      >,
   ) => React.ReactElement;
};

const Image: ImageComponent = forwardRef(function Image(
   { name, src, ...props }: ImageProps,
   ref: React.ForwardedRef<HTMLImageElement>,
) {
   const theme = useTheme();
   const { assets } = useBetterHtmlContextInternal();

   const styledComponentStyles = useStyledComponentStyles(props, theme);
   const dataProps = useComponentPropsWithPrefix(props, "data");
   const ariaProps = useComponentPropsWithPrefix(props, "aria");
   const restProps = useComponentPropsWithoutStyle(props);

   useEffect(() => {
      if (!name) return;

      if (!assets[name.toString()])
         console.warn(
            `The asset \`${name}\` you are trying to use does not exist. Make sure to add it to the \`assets\` object in \`<BetterHtmlProvider>\` config value prop.`,
         );
   }, [assets, name]);

   return (
      <ImageElement
         {...styledComponentStyles}
         src={name ? assets[name.toString()] : src}
         {...styledComponentStyles}
         {...dataProps}
         {...ariaProps}
         {...restProps}
         ref={ref}
      />
   );
}) as any;

Image.profileImage = forwardRef(function ProfileImage({ size = 40, letters, backgroundColor, ...props }, ref) {
   const theme = useTheme();

   return letters ? (
      <Div.row
         width={size}
         height={size}
         backgroundColor={backgroundColor ?? theme.colors.backgroundSecondary}
         borderRadius={999}
         alignItems="center"
         justifyContent="center"
         ref={ref}
         {...props}
      >
         <Text fontSize={size / 2.5} fontWeight={700}>
            {letters.toUpperCase().slice(0, 2)}
         </Text>
      </Div.row>
   ) : (
      <Image width={size} height={size} borderRadius={999} objectFit="cover" ref={ref} {...props} />
   );
}) as ImageComponent["profileImage"];

const MemoizedImage = memo(Image) as any as typeof Image & {
   profileImage: typeof Image.profileImage;
};

MemoizedImage.profileImage = Image.profileImage;

export default { Image: MemoizedImage }.Image;
